// public/js/services/WGService.js
angular.module('TankService', []).factory('Tank', ['$http', '$q', function($http, $q) {

    return {
        // call to get all nerds
        getTank : function(tankid) {
            return $http.get('/api/wg/tank/'+tankid).then(function(data){
				//console.log("got tank");
				//console.log(data);
				return data.data;
			});
        },
		
		getTankSession : function(tankid) {
            return $http.get('/api/sessions/'+tankid).then(function(data){
				//console.log("got tank");
				//console.log(data);
				return data.data;
			});
        },
		
		getTopTanks : function() {
            return $http.get('/api/sessions').then(function(data){
				//console.log("got tanks");
				//console.log(data);
				return data.data;
			});
        },
		
		getRules : function() {
            return $http.get('/api/rules').then(function(data){
				//console.log("got tanks");
				//console.log(data);
				return data.data;
			});
        }
    }       

}]);