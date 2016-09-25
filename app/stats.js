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



exports.getSessionStats = function(latest_stats,stats,cb){
	//latest_stats = latest_stats;//////////////////////////////////////
	var session = {};
	if(stats){
		stats.forEach(function(tank){
			var tankid = tank["tank_id"];
			
			var deltaBattles = parseInt(tank["all"]["battles"]);
			console.log("total battles for $s is $s", tankid, tank["all"]["battles"]);
			deltaBattles -= latest_stats[tankid]["battles"]+(variables.sessionMin-latest_stats[tankid]["neededBattles"]);
			console.log("delta battles for %s is %s", tankid ,deltaBattles);
			if((latest_stats[tankid]["neededBattles"] - deltaBattles) <=0){
				console.log("we have enough battles for a session pull on "+tankid);
				for (var key in tank["all"]) {
					tank["all"][key] = parseInt(tank["all"][key]);
					tank["all"][key] -= latest_stats[tankid][key];
					latest_stats[tankid][key] += tank["all"][key];
				}
				session[tankid] = tank["all"];
				latest_stats[tankid]["seasonBattles"] += (variables.sessionMin-(latest_stats[tankid]["neededBattles"] - deltaBattles));
				latest_stats[tankid]["neededBattles"] = variables.sessionMin;
				
			}
			else{
				console.log("not enough battles for a session pull on "+tankid);
				latest_stats[tankid]["neededBattles"] -= deltaBattles;
			}
		});
	}
	cb(null,session,latest_stats);
}