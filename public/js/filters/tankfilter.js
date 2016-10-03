angular.module('TankFilter', [])

.filter('tankname', ['Tank', '$q', function(Tank, $q) {
	var data = {}; // DATA RECEIVED ASYNCHRONOUSLY AND CACHED HERE
    var serviceInvoked = {};
	
    function realFilter(tankname) { // REAL FILTER LOGIC
        return tankname;
    }
	  function getTankName(tankid) {
			if( !(tankid in data) ) {
				if( !(tankid in serviceInvoked) ) {
					serviceInvoked[tankid] = true;
					// CALL THE SERVICE THAT FETCHES THE DATA HERE
					Tank.getTank(tankid).then(function(result) {
						var name = result['name'];
						data[tankid] = name;//${name}
					});
				}
				return "Loading"; // PLACEHOLDER WHILE LOADING, COULD BE EMPTY
			}
			else return realFilter(data[tankid]);
	  }
	  getTankName.$stateful = true;
	  return getTankName;
}])

.filter('tanknameURI', ['Tank', '$q', function(Tank, $q) {
	var data = {}; // DATA RECEIVED ASYNCHRONOUSLY AND CACHED HERE
    var serviceInvoked = {};
	
    function realFilter(tankname) { // REAL FILTER LOGIC
        return encodeURIComponent(tankname.replace('/', '*'));
    }
	  function getTankName(tankid) {
			if( !(tankid in data) ) {
				if( !(tankid in serviceInvoked) ) {
					serviceInvoked[tankid] = true;
					// CALL THE SERVICE THAT FETCHES THE DATA HERE
					Tank.getTank(tankid).then(function(result) {
						var name = result['name'];
						data[tankid] = name;//${name}
					});
				}
				return "Loading"; // PLACEHOLDER WHILE LOADING, COULD BE EMPTY
			}
			else return realFilter(data[tankid]);
	  }
	  getTankName.$stateful = true;
	  return getTankName;
}])

.filter('sessionnumber', function() {
	
	  return function addOne(sessionNumber) {
			return (parseInt(sessionNumber)+1);
	  }

})

.filter('metric', function() {
	
	  return function convert(metric) {
		  var conversions = {
			  'wr': "Winrate",
			  'epg': "Exp/Game",
			  'dpg': "Dmg/Game",
			  'spg': "Spots/Game",
			  'kpg': "Kills/Game",
			  'moerank': "MoeScore "
		  };
		return (conversions[metric] || metric);
	  }

})

.filter('metric_value', function($filter) {
		var numberFilter = $filter('number');
		
	  return function convert(val,metric) {
		  var conversions = {
			  'wr': function(input){return numberFilter(input, 0).toString()+"%";},
			  'epg': function(input){return numberFilter(input, 0).toString();},
			  'dpg': function(input){return numberFilter(input, 0).toString();},
			  'spg': function(input){return numberFilter(input, 3).toString();},
			  'kpg': function(input){return numberFilter(input, 3).toString();},
			  'moerank': function(input){
						if(numberFilter(input, 2)){return numberFilter(input, 2).toString();}
						else {return "Still Calculating"};
					}
		  };
		  
		return (conversions[metric](val) || val);
	  }

})

.filter('normalizeVal', function($filter) {
		var numberFilter = $filter('number');
	  return function convert(val,weights,max,metric) {
		  
		  /*console.log("value");
		  console.log(val);
		  console.log("max");
		  console.log(max);*/
		  console.log();
		  var totalMax = 0;
		  for (weight in weights){
			  if(weight !="overall_weight"){
			  totalMax += max*weights[weight];}
		  }
		  var norm = (val/totalMax);
		return numberFilter(norm/weights[metric]*100,2);
	  }

})

.filter('playerName', ['Player', '$q', function(Player, $q) {
	var data = {}; // DATA RECEIVED ASYNCHRONOUSLY AND CACHED HERE
    var serviceInvoked = {};
	
    function realFilter(playername) { // REAL FILTER LOGIC
        return playername;
    }
	  function getPlayerName(playerid) {
			if( !(playerid in data) ) {
				if( !(playerid in serviceInvoked) ) {
					serviceInvoked[playerid] = true;
					//console.log("attempting to get "+tankid);
					// CALL THE SERVICE THAT FETCHES THE DATA HERE
					Player.getPlayerName(playerid).then(function(result) {
						var name = result['username'];
						//console.log("got image" + img);
						data[playerid] = name;//${name}
					});
				}
				return "Loading..."; // PLACEHOLDER WHILE LOADING, COULD BE EMPTY
			}
			else return realFilter(data[playerid]);
	  }
	  getPlayerName.$stateful = true;
	  return getPlayerName;
}])

.filter('tankimage', ['Tank', '$q', function(Tank, $q) {
	var data = {}; // DATA RECEIVED ASYNCHRONOUSLY AND CACHED HERE
    var serviceInvoked = {};
	
    function realFilter(tankname) { // REAL FILTER LOGIC
        return tankname;
    }
	  function getTankName(tankid) {
			if( !(tankid in data) ) {
				if( !(tankid in serviceInvoked) ) {
					serviceInvoked[tankid] = true;
					//console.log("attempting to get "+tankid);
					// CALL THE SERVICE THAT FETCHES THE DATA HERE
					Tank.getTank(tankid).then(function(result) {
						var img = result['images']['small_icon'];
						//console.log("got image" + img);
						data[tankid] = img;//${name}
					});
				}
				return "./img/loading.gif"; // PLACEHOLDER WHILE LOADING, COULD BE EMPTY
			}
			else return realFilter(data[tankid]);
	  }
	  getTankName.$stateful = true;
	  return getTankName;
}]);