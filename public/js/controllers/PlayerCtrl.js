// public/js/controllers/PlayerCtrl.js


angular.module('PlayerCtrl', []).controller('PlayerController', ['$scope','$routeParams', 'Player','Auth','Tank', function($scope, $routeParams, Player, Auth, Tank) {
	
	Auth.getUser(function(user){$scope.currentUser = user;});
	if($scope.currentUser){if($scope.currentUser["playerid"] == $routeParams.playerid) {$scope.sessionbutton = true;} else {$scope.sessionbutton = false;}}
	
    Player.get($routeParams.playerid).then(function(data){
		for(tank in data.latest_stats){
			data.latest_stats[tank]["dpg"] = (parseInt(data.latest_stats[tank]["damage_dealt"]/data.latest_stats[tank]["battles"])||0);
			if(data.latest_stats[tank]["battles"] == 0){delete data.latest_stats[tank];}
		}

		////console.log(sessionData);
		Tank.getRules().then(function(rules){
			$scope.rules = rules;
			
			for(tank in data.session_data){
				for (var i = 0; i < data.session_data[tank].length; i++)
				{
					if(i < rules.sessionsRequired){
						data.session_data[tank][i].isTop = true;
					}
					else{
						data.session_data[tank][i].isTop = false;
					}
					data.session_data[tank][i].wr = parseInt(data.session_data[tank][i].wins/data.session_data[tank][i].battles*100);
				}
				data.session_data[tank].sort(function(a,b){
				  // Turn your strings into dates, and then subtract them
				  // to get a value that is either negative, positive, or zero.
				  return new Date(a.date) - new Date(b.date);
				});
			}
			console.log("got data");
			console.log(data);
			$scope.player = data;
		});
		
		
    });
	$scope.pull = function(){
		if($scope.currentUser["playerid"] == $routeParams.playerid){//consider using token instead of id so users cant spoof
			Player.update($scope.currentUser["playerid"]);
		}
	};
}]);