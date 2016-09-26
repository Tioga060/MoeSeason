// public/js/services/PlayerService.js
angular.module('PlayerService', []).factory('Player', ['$http', '$q', function($http, $q) {

    return {
        // call to get all nerds
        get : function(playerid) {
            return $http.get('/api/player/'+playerid).then(function(data){
				//console.log("done");
				//console.log(data.data);
				return data.data;
			});
        },
		
		getByCookie : function(key, sig) {
            return $http.get('/api/cookie/'+key+'/'+sig).then(function(data){
				//console.log("done");
				//console.log(data.data);
				return data.data;
			});
        },
		
		update : function(playerid) {
            return $http.get('/api/player/update/'+playerid).then(function(data){
				//console.log("done");
				//console.log(data.data);
				return data.data;
			});
        },
		
		getAllPlayers : function() {
            return $http.get('/api/player/').then(function(data){
				//console.log("done");
				//console.log(data.data);
				return data.data;
			});
        }
    }       

}]);