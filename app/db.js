var Player = require('./models/player');
var Tank = require('./models/tank');
var cron = require('node-schedule');
var variables = require('./variables.js');
var wgapi = require('./wgapi.js');
var stats = require('./stats.js');

function addUpdatePlayer(info, cookies, cb){
	if(info.server=="na") {info.server = "com";}
	var query = {'playerid' : info.playerid},
		update = { '$set':{'playerid': info.playerid, 'username': info.username, 'server': info.server, 'cookie': {'key': cookies.key, 'sig': cookies["key.sig"]} }},
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	// Find the document
	Player.findOneAndUpdate(query, update, options, function(error, res) {
		if (error) {console.log(error); return};
			if(!(res["starting_stats"])){res.setStartingStats();}
		// do something with the document
		return cb(null,res);
	});
}

exports.insertAndGet = addUpdatePlayer;

exports.getPlayerInfo = function(url){
	var server = url.substring(8,url.indexOf("."));
	var playerid = url.substring(url.indexOf("id")+3,url.indexOf("-"));
	var username = url.substring(url.indexOf("-")+1,url.lastIndexOf("/"));
	return {'playerid':playerid,'username':username,'server':server};
}

function updateSessionData(data, callback){
	//console.log("Final player data");
	Player.update({'playerid': data.playerid},{ $set: { 'latest_stats': data.latest_stats, 'session_data':data.session_data, 'top_sessions': data.top_sessions}},function (err, newdata) {
		if (err) return handleError(err);
		//console.log(newdata);
		callback(null, data);
	});
}

exports.updateSession= function(playerid, cb){
	Player.findOne({ 'playerid': playerid },'-cookie', function (err, person) {
		if (err)
			res.send(err);
		//Return Player
		//console.log("Player gotten "+person.playerid);
		person.getSession(function(err, data){
			if(err){
				console.log(err);
			}
			else{
				updateSessionData(data,cb);
			}
		});
	});
}



function updateAll(){
	Player.find({},'-cookie',function(err, players) {
		var i = 0;                     //  set your counter to 1
		function throughPlayers () {           //  create a loop function
			setTimeout(function () {    //  call a 3s setTimeout when the loop is called
				person = players[i];
				//console.log("Player gotten "+person.playerid);
				person.getSession(function(err, data){
					if(err){
						console.log(err);
					}
					else{
						updateSessionData(data,function(err, res){});
					}
				});

				i++;                     //  increment the counter
				if (i < players.length) {            //  if the counter < 10, call the loop function
					throughPlayers();             //  ..  again which will trigger another 
				}                        //  ..  setTimeout()
		   }, 125)
		}
		throughPlayers();
		
	});
}

function compareByStat(stat){
	return function compare(a,b) {
		if (a[stat] < b[stat])
			return 1;
		if (a[stat] > b[stat])
			return -1;
		return 0;
	}
}



function rankSessions(cb){

	Player.find({},'-cookie',function(err, players) {
		var allTopSessions = {};
		players.forEach(function(player){
			if(player.top_sessions){
				for (tank in player.top_sessions){
					if(!allTopSessions[tank]){allTopSessions[tank] = [];}
					player.top_sessions[tank]["wr"] = parseInt(player.top_sessions[tank]["wins"]/player.top_sessions[tank]["battles"]*100);
					player.top_sessions[tank]["kpg"] = player.top_sessions[tank]["frags"]/player.top_sessions[tank]["battles"];
					player.top_sessions[tank]["spg"] = player.top_sessions[tank]["spotted"]/player.top_sessions[tank]["battles"];
					allTopSessions[tank].push(player.top_sessions[tank]);
				}
			}
		});
		for (tank in allTopSessions){
			var realtank = tank.toString();
			var individual_tank = {};
			//for variables in tank weights, sort by each variable
			for (stat in variables.tankWeights[realtank]){
				if(stat != "overall_weight" && variables.tankWeights[realtank][stat] > 0){
					allTopSessions[realtank].sort(compareByStat(stat));
					//Store each rank list as an array of playerids
					allTopSessions[realtank].forEach(function(stats){
						if(!individual_tank['ranks']){individual_tank['ranks'] = {};}
						if(!individual_tank['ranks'][stat]){individual_tank['ranks'][stat] = [];}
						var playerid = stats.playerid;
						individual_tank['ranks'][stat].push(playerid);
						if(!individual_tank['sessions']){individual_tank['sessions'] = {};}
						if(!individual_tank['sessions'][playerid]){individual_tank['sessions'][playerid] = stats;}
					});
				}
				
			}
			//Store the player's sessions in the tank entry as an array
			var query = {'tankid' : realtank},
				update = { '$set':{'ranks': individual_tank.ranks, 'sessions': individual_tank.sessions}},
				options = { upsert: true, new: true, setDefaultsOnInsert: true };
			Tank.findOneAndUpdate(query, update, options, function(error, res) {
				if (error) {console.log(error); return}
				res.save(function(){});
			});
		}
		if(cb){cb();}
	});
}

function addClan(tag, server, cb){
	wgapi.getClanId(tag, server, function(err, clanid){
		//console.log("got clan id "+clanid);
		wgapi.getClanPlayers(clanid, server, function(err, players){
			var i = 0; 
			function throughPlayers () {           //  create a loop function
				setTimeout(function () {    //  call a 3s setTimeout when the loop is called
					person = players[i];
					var info = {'playerid':person.account_id, 'username':person.account_name, 'server':server};
					var cookie = {key:'',sig:''};
					//console.log("Player gotten "+person.playerid);
					addUpdatePlayer(info, cookie, function(err, res){
						//console.log("player added "+person.account_name);
					});

					i++;                     //  increment the counter
					if (i < players.length) {            //  if the counter < 10, call the loop function
						throughPlayers();             //  ..  again which will trigger another 
					}                        //  ..  setTimeout()
			   }, 500)
			}
			throughPlayers();
			});
			cb(null, {'message':"Clan added"});
	});
}

exports.insertClan = addClan;

function updateMoeScores(players){
	for (playerid in players){
		var query = {'playerid' : playerid},
				update = { $set: { 'moescores': players[playerid] }},
				options = { upsert: true, new: true, setDefaultsOnInsert: true };
		Player.findOneAndUpdate(query, update, options, function(error, res) {
			if (error) {console.log(error); return}
			res.save(function(){});
		});
	}
}

cron.scheduleJob('0 0,15,30,45 * * * *', function(){
    //console.log('Running session pull');
	updateAll();
});

cron.scheduleJob('0 10,25,40,55 * * * *', function(){
	rankSessions(stats.calculateMoeScores(updateMoeScores));
});
