// public/js/controllers/TanksCtrl.js


angular.module('TanksCtrl', []).controller('TanksController', ['$scope','$routeParams', 'Tank','Auth', function($scope, $routeParams, Tank, Auth) {
	
	Auth.getUser(function(user){$scope.currentUser = user;});

    Tank.getTopTanks().then(function(data){

		$scope.tanks = data;
		console.log("got this tank data");
		console.log(data);
    });
	Tank.getRules().then(function(data){
		$scope.rules = data;
		console.log("got these rules");
		console.log(data);
    });
	
	$scope.$watch('rules',function(){
		console.log("rules changed");
	});

}]);