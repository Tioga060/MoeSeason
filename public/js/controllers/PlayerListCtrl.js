// public/js/controllers/PlayerListCtrl.js


angular.module('PlayerListCtrl', []).controller('PlayerListController', ['$scope','$routeParams', 'Player', function($scope, $routeParams, Player, Auth) {
	
    Player.getAllPlayers().then(function(data){
		$scope.players = data;
    });

}]);