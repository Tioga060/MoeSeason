require('dotenv').config()
var request = require('request');
var async = require('async');

var fetch = function(file,cb){
     request.get(file, function(err,response,body){
           if ( err){
                 cb(err);
           } else {
                 cb(null, body); // First param indicates error, null=> no error
           }
     });
}

var getJSON = function (body,cb){
	var data = JSON.parse(body);
	console.log("Got this player");
	console.log(data);
	cb(null,data);
};

exports.useTankStats = function (playerid, server, tank_ids, funcs){
	funcs = funcs || [];
	var tanks = tank_ids.join();
	var url = 'https://api.worldoftanks.'+server+'/wot/tanks/stats/?application_id='+process.env.WGAPI_NA+'&tank_id='+tanks+'&account_id='+playerid+'&fields=all,tank_id';

	var extractTanks = function(data, cb){
		var extracted = data["data"];
		extracted = extracted[playerid];
		cb(null,extracted);
	}
	waterfallGeneric(url,[extractTanks].concat(funcs));
};

exports.getTankInfo = function (tankid, callback){
	var url =  'https://api.worldoftanks.com/wot/encyclopedia/vehicles/?application_id='+process.env.WGAPI_NA+'&tank_id='+tankid+'&fields=name,images.small_icon';
	var extractName = function(data, cb){
		var extracted = data["data"];
		extracted = extracted[tankid];
		cb(null,extracted);
	}
	waterfallGenericCB(url,[extractName],callback);
}

exports.getClanId = function (tag, server, callback){
	var url =  'https://api.worldoftanks.'+server+'/wgn/clans/list/?application_id='+process.env.WGAPI_NA+'&search='+tag+'&limit=1&game=wot&fields=clan_id';
	var extractId = function(data, cb){
		var extracted = data["data"][0]["clan_id"];

		cb(null,extracted);
	}
	waterfallGenericCB(url,[extractId],callback);
}

exports.getClanPlayers = function(clanid, server, callback){
	var url = 'https://api.worldoftanks.'+server+'/wgn/clans/info/?application_id='+process.env.WGAPI_NA+'&clan_id='+clanid+'&fields=members.account_id%2Cmembers.account_name';
	var extractPlayers = function(data, cb){
		var extracted = data["data"][clanid]["members"];
		cb(null,extracted);
	}
	waterfallGenericCB(url,[extractPlayers],callback);
}

function waterfallGeneric(url, funcs){
	funcs = funcs || [];
	async.waterfall(([
			function dummy(callback) {
				console.log("Calling URL");
				console.log(url);
				callback(null, url);
			},
			fetch,
			getJSON
			].concat(funcs)),
		function (err, result) {
		// result now equals 'done'
		}
	);
}

function waterfallGenericCB(url, funcs, cb){
	funcs = funcs || [];
	async.waterfall(([
			function dummy(callback) {
				console.log("Calling URL");
				console.log(url);
				callback(null, url);
			},
			fetch,
			getJSON
			].concat(funcs)),
		function (err, result) {
			cb(null, result);
		}
	);
}
