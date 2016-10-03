var variables = require('./variables.js');
var Tank = require('./models/tank');

exports.initializeTankStats = function (stats,cb){
	var start_values = createTankArray(stats)
	cb(null,start_values);
};

function calcMaxScore(weights){
	var base = variables.calcMoeScore(1);
	var total = 0;
	for (weight in weights){
		if(weight != "overall_weight"){
			total += weights[weight]*base;
		}
	}
	return total;
}

function rankPlayersForTank(playertotals, tankid){
	var totalArray = [];

	function compare(a,b) {
		if (a.total < b.total)
			return 1;
		if (a.total > b.total)
			return -1;
		return 0;
	}

	for (playerid in playertotals){
		totalArray.push({'playerid':playerid,'total':playertotals[playerid]});
	}
	
	totalArray.sort(compare);

	var query = {'tankid' : tankid},
			update = { $set: { 'moerank': totalArray }},
			options = { upsert: true, new: true, setDefaultsOnInsert: true };
	Tank.findOneAndUpdate(query, update, options, function(error, res) {
		if (error) {console.log(error); return}
		res.save(function(){});
	});
	var returnObj = {};
	for (var i = 0; i<totalArray.length; i++){
		var pid = totalArray[i].playerid;
		returnObj[pid] = i+1;
	}
	return returnObj;

}

function rankPlayers(players){
	var totalArray = [];

	function compare(a,b) {
		if (a.totalScore < b.totalScore)
			return 1;
		if (a.totalScore > b.totalScore)
			return -1;
		return 0;
	}

	for (playerid in players){
		totalArray.push({'playerid':playerid,'totalScore':players[playerid]['totalScore']});
	}
	
	totalArray.sort(compare);

	for (var i = 0; i<totalArray.length; i++){
		var pid = totalArray[i].playerid;
		players[pid]['rank'] = i+1;
	}
	return players;

}


exports.calculateMoeScores = calculateMoeScores;

function calculateMoeScores(callback){
	var players = {};
	Tank.find({'sessions': {$exists: true}},'ranks tankid',function(err, tanks) {//playerid username session_data
	
		tanks.forEach(function(tank){
			var tankid = tank.tankid;
			var weights = variables.tankWeights[tankid];
			var playertotals = {};
			for (stat in tank.ranks){
				for(var i = 0; i<tank.ranks[stat].length;i++){
					var playerid = tank.ranks[stat][i];
					if(!players[playerid]){players[playerid]={};}
					if(!players[playerid]['tanks']){players[playerid]['tanks']={};}
					if(!players[playerid]['tanks'][tankid]){players[playerid]['tanks'][tankid]={};}
					if(!players[playerid]['tanks'][tankid]['stats']){players[playerid]['tanks'][tankid]['stats']={};}
					if(!players[playerid]['tanks'][tankid]['stats'][stat]){players[playerid]['tanks'][tankid]['stats'][stat]={};}
					players[playerid]['tanks'][tankid]['stats'][stat]["rank"] = i+1;
					var resultMoeScore = variables.calcMoeScore(i+1)*weights[stat];
					players[playerid]['tanks'][tankid]['stats'][stat]["moeScore"] = resultMoeScore;
					players[playerid]['tanks'][tankid]['tankid'] = tankid;
					if(!playertotals[playerid]){playertotals[playerid]=0;}
					playertotals[playerid]+= resultMoeScore;
				}
			}
			var maxForTank = calcMaxScore(weights);
			for (playerid in playertotals){
				playertotals[playerid] = playertotals[playerid]/maxForTank*100
				players[playerid]['tanks'][tankid]['total'] = playertotals[playerid];
				if(!players[playerid]["totalScore"]){players[playerid]["totalScore"] = 0;}
				players[playerid]["totalScore"] += players[playerid]['tanks'][tankid]['total']*weights['overall_weight'];
			}
			var tankranks = rankPlayersForTank(playertotals, tankid);
			for (playerid in playertotals){
				players[playerid]['tanks'][tankid]['rank'] = tankranks[playerid];
			}
		});
		players = rankPlayers(players);
		
		callback(players);
	});
}

function createTankArray(stats){
	var tanklist = {};
	variables.tankIDs.forEach(function(tankid){
		var newtank = JSON.parse(variables.emptyTankFields);
		if(stats){
			stats.forEach(function(tank){
				if(tank["tank_id"]==tankid){
					for (var key in tank["all"]) {
						newtank[key] += parseInt(tank["all"][key]);
					}
				}
			});
		}
		newtank["seasonBattles"] = 0;
		newtank["neededBattles"] = variables.sessionMin; 
		tanklist[tankid] = newtank;
	});
	return tanklist;
}

function averageBestSessions(player){
	
	player.bests = {};
	for(var tank in player.session_data){
		//(player.session_data[tank]).sort(compareByStat(variables.sessionPriority));
		var beststats = {};
		for (var i = 0; i < variables.sessionsRequired; i++) {
			
			if(player.session_data[tank][i]){
				for (key in player.session_data[tank][i]){
					if(!beststats[key]){beststats[key] = 0;}
					var dataInt = parseInt(player.session_data[tank][i][key]);
					if(dataInt){
						beststats[key] += parseInt(player.session_data[tank][i][key]);
					}
				}
			}
			else {beststats = false;i = variables.sessionsRequired;}
		}
		if(beststats){
			beststats['dpg'] = parseInt(beststats['damage_dealt']/beststats['battles']);
			beststats['epg'] = parseInt(beststats['xp']/beststats['battles']);
			beststats['playerid'] = player.playerid;
			beststats['username'] = player.username;
			beststats['tankid'] = tank;
			player.bests[tank] = beststats;
		}
		
	}
	//console.log("player's best stats");
	//console.log(player.bests);
	return player.bests;
}



function averageBestSessionsForTank(player, tank){
	
	//(player.session_data[tank]).sort(compareByStat(variables.sessionPriority));
	var beststats = {};
	for (var i = 0; i < variables.sessionsRequired; i++) {
		
		if(player.session_data[tank][i]){
			for (key in player.session_data[tank][i]){
				if(!beststats[key]){beststats[key] = 0;}
				var dataInt = parseInt(player.session_data[tank][i][key]);
				if(dataInt){
					beststats[key] += parseInt(player.session_data[tank][i][key]);
				}
			}
		}
		else {beststats = false;i = variables.sessionsRequired;}
	}
	beststats['dpg'] = parseInt(beststats['damage_dealt']/beststats['battles']);
	beststats['epg'] = parseInt(beststats['xp']/beststats['battles']);
	beststats['playerid'] = player.playerid;
	beststats['username'] = player.username;
	beststats['tankid'] = tank;

	

	return beststats;
}

exports.averageBestSessionsForTank = averageBestSessionsForTank;

exports.getSessionStats = function(player,stats,cb){
	//latest_stats = latest_stats;//////////////////////////////////////

	if(stats){
		stats.forEach(function(tank){
			var tankid = tank["tank_id"];
			
			var deltaBattles = parseInt(tank["all"]["battles"]);
			//console.log("total battles for $s is $s", tankid, tank["all"]["battles"]);
			deltaBattles -= player.latest_stats[tankid]["battles"]+(variables.sessionMin-player.latest_stats[tankid]["neededBattles"]);
			//console.log("delta battles for %s is %s", tankid ,deltaBattles);
			if((player.latest_stats[tankid]["neededBattles"] - deltaBattles) <=0){
				//console.log("we have enough battles for a session pull on "+tankid);
				for (var key in tank["all"]) {
					tank["all"][key] = parseInt(tank["all"][key]);
					tank["all"][key] -= player.latest_stats[tankid][key];
					player.latest_stats[tankid][key] += tank["all"][key];
				}
				
				tank["all"]['tankid'] = tankid;
				tank["all"]['dpg'] = parseInt(tank["all"]['damage_dealt']/tank["all"]['battles']);
				tank["all"]['epg'] = parseInt(tank["all"]['xp']/tank["all"]['battles']);
				tank["all"]['date'] = new Date();
				
				if(!player.session_data){player.session_data = {}};
				
				//Put the data back in sorted by session priority for this season
				var prio = variables.sessionPriority;
				var poppos = -1;
				if(!player.session_data[tankid]){
					player.session_data[tankid] = [tank["all"]];
					poppos = 0;
				}
				else{
					var poppeddata = false;
					for(var i = 0; i < player.session_data[tankid].length; i++){
						if(tank["all"][prio] > player.session_data[tankid][i][prio] && !poppeddata){
							poppeddata = player.session_data[tankid][i];
							player.session_data[tankid][i] = tank["all"];
							poppos = i;
						}
						else if (poppeddata){
							var temppop = player.session_data[tankid][i];
							player.session_data[tankid][i] = poppeddata;
							poppeddata = temppop;
						}
					}
					if(poppeddata){player.session_data[tankid].push(poppeddata);}
					else{player.session_data[tankid].push(tank["all"]);}
				}
				
				//If we have enough sessions for the tank and we've got a new valid top session
				if((poppos != -1) && (player.session_data[tankid].length>=variables.sessionsRequired) && (poppos<variables.sessionsRequired)){
					if(!player.top_sessions){player.top_sessions = {};}
					player.top_sessions[tankid] = averageBestSessionsForTank(player, tankid);
				}

				player.latest_stats[tankid]["seasonBattles"] += (variables.sessionMin-(player.latest_stats[tankid]["neededBattles"] - deltaBattles));
				player.latest_stats[tankid]["neededBattles"] = variables.sessionMin;
				
			}
			else{
				//console.log("not enough battles for a session pull on "+tankid);
				player.latest_stats[tankid]["neededBattles"] -= deltaBattles;
			}
		});
	}
	cb(null,player);
}