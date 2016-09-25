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

.filter('sessionnumber', function() {
	
	  return function addOne(sessionNumber) {
			return (parseInt(sessionNumber)+1);
	  }

})

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
					console.log("attempting to get "+tankid);
					// CALL THE SERVICE THAT FETCHES THE DATA HERE
					Tank.getTank(tankid).then(function(result) {
						var img = result['images']['small_icon'];
						console.log("got image" + img);
						data[tankid] = img;//${name}
					});
				}
				return "./public/img/loading.gif"; // PLACEHOLDER WHILE LOADING, COULD BE EMPTY
			}
			else return realFilter(data[tankid]);
	  }
	  getTankName.$stateful = true;
	  return getTankName;
}]);