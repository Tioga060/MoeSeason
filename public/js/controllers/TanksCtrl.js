// public/js/controllers/TanksCtrl.js


angular.module('TanksCtrl', []).controller('TanksController', ['$scope','$routeParams', 'Tank','Auth', function($scope, $routeParams, Tank, Auth) {
	
	Auth.getUser(function(user){$scope.currentUser = user;});

    Tank.getTopTanks().then(function(data){
		data.forEach(function(tank){
			for(var i = 0; i<tank.moerank.length; i++){
				var playerid = tank.moerank[i]['playerid'];
				tank.sessions[playerid]['moescore'] = tank.moerank[i]['total'];
				
				tank.moerank[i] = tank.sessions[playerid];
			}
		});
		$scope.tanks = data;
		console.log(data);
    });
	Tank.getRules().then(function(data){
		$scope.rules = data;
		//console.log("got these rules");
		//console.log(data);
    });
	
	$scope.$watch('rules',function(){
		//console.log("rules changed");
	});

}]);