// public/js/controllers/PlayerCtrl.js


angular.module('PlayerCtrl', []).controller('PlayerController', ['$scope','$routeParams', 'Player','Auth', function($scope, $routeParams, Player, Auth) {
	
	Auth.getUser(function(user){$scope.currentUser = user;});
	if($scope.currentUser){if($scope.currentUser["playerid"] == $routeParams.playerid) {$scope.sessionbutton = true;} else {$scope.sessionbutton = false;}}
	
    Player.get($routeParams.playerid).then(function(data){
		for(tank in data.latest_stats){
			data.latest_stats[tank]["dpg"] = (parseInt(data.latest_stats[tank]["damage_dealt"]/data.latest_stats[tank]["battles"])||0);
			if(data.latest_stats[tank]["battles"] == 0){delete data.latest_stats[tank];}
		}
		/*sessionData = {};
		data.sessions.forEach(function(session){
			for (tank in session){
				if(!sessionData[tank]) {sessionData[tank] = [];}
				session[tank]['tankid'] = tank;
				session[tank]['dpg'] = parseInt(session[tank]['damage_dealt']/session[tank]['battles']);
				session[tank]['epg'] = parseInt(session[tank]['xp']/session[tank]['battles']);
				sessionData[tank].push(session[tank]);
			}
		});
		data['session_data'] = sessionData;*/
		//console.log(sessionData);
		$scope.player = data;
		
    });
	$scope.pull = function(){
		if($scope.currentUser["playerid"] == $routeParams.playerid){//consider using token instead of id so users cant spoof
			Player.update($scope.currentUser["playerid"]);
		}
	};
}]);