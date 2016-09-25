var Player = require('./models/player');
var cron = require('node-schedule');

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


exports.updateSession= function(playerid, cb){
	Player.findOne({ 'playerid': playerid },'-cookie', function (err, person) {
		if (err)
			res.send(err);
		//Return Player
		console.log("Player gotten "+person.playerid);
		person.getSession(function(err, data){
			sessionData = {};//Optimize this to only add new session instead of recreating every time
			data.sessions.forEach(function(session){
				for (tank in session){
					if(!sessionData[tank]) {sessionData[tank] = [];}
					session[tank]['tankid'] = tank;
					session[tank]['dpg'] = parseInt(session[tank]['damage_dealt']/session[tank]['battles']);
					session[tank]['epg'] = parseInt(session[tank]['xp']/session[tank]['battles']);
					sessionData[tank].push(session[tank]);
				}
			});
			Player.update({'playerid': data.playerid},{ $set: { 'latest_stats': data.latest_stats, 'sessions': data.sessions, 'session_data':sessionData}},function (err, newdata) {
			  if (err) return handleError(err);
			  console.log(newdata);
			  cb(null, data);
			});
		});
	});
}

function updateAll(){
	Player.find({},'-cookie',function(err, players) {
		var i = 0;                     //  set your counter to 1
		function throughPlayers () {           //  create a loop function
			setTimeout(function () {    //  call a 3s setTimeout when the loop is called
				person = players[i];
				console.log("Player gotten "+person.playerid);
				person.getSession(function(err, data){
					sessionData = {};//Optimize this to only add new session instead of recreating every time
					data.sessions.forEach(function(session){
						for (tank in session){
							if(!sessionData[tank]) {sessionData[tank] = [];}
							session[tank]['tankid'] = tank;
							session[tank]['dpg'] = parseInt(session[tank]['damage_dealt']/session[tank]['battles']);
							session[tank]['epg'] = parseInt(session[tank]['xp']/session[tank]['battles']);
							sessionData[tank].push(session[tank]);
						}
					});
					Player.update({'playerid': data.playerid},{ $set: { 'latest_stats': data.latest_stats, 'sessions': data.sessions, 'session_data':sessionData }},function (err, newdata) {
					  if (err) return handleError(err);
					  console.log(newdata);
					});
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

cron.scheduleJob('0 0,15,30,45 * * * *', function(){
    console.log('Running session pull');
	updateAll();
});


