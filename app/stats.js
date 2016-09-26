var variables = require('./variables.js');

exports.initializeTankStats = function (stats,cb){
	var start_values = createTankArray(stats)
	cb(null,start_values);
};

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
	console.log("player's best stats");
	console.log(player.bests);
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

exports.getSessionStats = function(player,stats,cb){
	//latest_stats = latest_stats;//////////////////////////////////////

	if(stats){
		stats.forEach(function(tank){
			var tankid = tank["tank_id"];
			
			var deltaBattles = parseInt(tank["all"]["battles"]);
			console.log("total battles for $s is $s", tankid, tank["all"]["battles"]);
			deltaBattles -= player.latest_stats[tankid]["battles"]+(variables.sessionMin-player.latest_stats[tankid]["neededBattles"]);
			console.log("delta battles for %s is %s", tankid ,deltaBattles);
			if((player.latest_stats[tankid]["neededBattles"] - deltaBattles) <=0){
				console.log("we have enough battles for a session pull on "+tankid);
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
				if((poppos != -1) && (player.session_data[tankid].length>variables.sessionsRequired) && (poppos<variables.sessionsRequired)){
					if(!player.top_sessions){player.top_sessions = {};}
					player.top_sessions[tankid] = averageBestSessionsForTank(player, tankid);
				}

				player.latest_stats[tankid]["seasonBattles"] += (variables.sessionMin-(player.latest_stats[tankid]["neededBattles"] - deltaBattles));
				player.latest_stats[tankid]["neededBattles"] = variables.sessionMin;
				
			}
			else{
				console.log("not enough battles for a session pull on "+tankid);
				player.latest_stats[tankid]["neededBattles"] -= deltaBattles;
			}
		});
	}
	cb(null,player);
}