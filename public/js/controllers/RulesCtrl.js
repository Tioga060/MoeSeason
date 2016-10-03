// public/js/controllers/PlayerListCtrl.js


angular.module('RulesCtrl', []).controller('RulesController', ['$scope','$routeParams', 'Tank', function($scope, $routeParams, Tank) {
	Tank.getRules().then(function(data){
		$scope.rules = data;
		//console.log("got these rules");
		//console.log(data);
    });

}]);