// public/js/controllers/PlayerListCtrl.js


angular.module('RulesCtrl', []).controller('RulesController', ['$scope','$rootScope','$routeParams', 'Tank','Comment', function($scope,$rootScope, $routeParams, Tank,Comment) {
	Comment.setTarget('rules',function(){$rootScope.getComments();});
	Tank.getRules().then(function(data){
		$scope.rules = data;
		//console.log("got these rules");
		//console.log(data);
    });

}]);