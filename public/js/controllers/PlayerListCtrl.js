// public/js/controllers/PlayerListCtrl.js


angular.module('PlayerListCtrl', []).controller('PlayerListController', ['$scope','$routeParams', 'Player', function($scope, $routeParams, Player, Auth) {
	$scope.playerSearch = '';
    Player.getAllPlayers().then(function(data){
		var defaultMoeScore = {'totalScore': 0.0};
		function compare(a,b) {
			if (a.moescores.totalScore < b.moescores.totalScore)
				return 1;
			if (a.moescores.totalScore > b.moescores.totalScore)
				return -1;
			return 0;
		}
		data.forEach(function(player){
			if(!player.moescores){
				player.moescores = defaultMoeScore;
			}
		});
		data.sort(compare);
		$scope.players = data;
		
    });

}]);