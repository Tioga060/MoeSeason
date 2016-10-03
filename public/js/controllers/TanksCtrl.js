// public/js/controllers/TanksCtrl.js


angular.module('TanksCtrl', []).controller('TanksController', ['$scope','$routeParams','$rootScope', 'Tank','Auth','Comment','notifications', function($scope, $routeParams,$rootScope, Tank, Auth, Comment,notifications) {
	
	$scope.showWarning = function (error) {
        notifications.showWarning({
            message: error,
            hideDelay: 1400, //ms
            hide: true //bool
        });
    };
	
	$scope.showWarning("This page will take a second to load");
	
	//Auth.getUser(function(user){$scope.currentUser = user;});
	Comment.setTarget('tanks',function(){$rootScope.getComments();});
	$scope.tankSearch = '';
	if($routeParams.tankid){$scope.tankSearch = $routeParams.tankid.replace('*', '/');;}
	$scope.playerSearch = '';
	$scope.hideTank = {};
	$scope.tanks = [];
	$scope.loading = true;
    Tank.getTopTanks().then(function(data){
		data.forEach(function(tank){
			var tname = tank.name;
			tank.sort = "moerank";
			tank.rankList = [];
			tank.rankList.push("moerank");
			tank.rankList.push("epg");
			tank.ranks['moerank'] = [];
			for(var i = 0; i<tank.moerank.length; i++){
				var playerid = tank.moerank[i]['playerid'];
				tank.sessions[playerid]['moerank'] = tank.moerank[i]['total'];
				tank['moerank'][i] = tank.sessions[playerid];
				tank.ranks['moerank'].push(playerid);
			}
			for(rankName in tank.ranks){
				if(rankName!="moerank"&&rankName!="epg"){
					tank.rankList.push(rankName);
				}
			}
			
		});
		$scope.tanks = data;
		console.log(data);
		$scope.loading = false;
    });
	/*Tank.getRules().then(function(data){
		$scope.rules = data;
		for (tankid in data.weights){
			console.log("tankid " +tankid);
			Tank.getTankSession(tankid).then(function(tank){
				if(tank && tank.sessions){
					var tname = tank.name;
					tank.sort = "moerank";
					tank.rankList = [];
					tank.rankList.push("moerank");
					tank.rankList.push("epg");
					tank.ranks['moerank'] = [];
					for(var i = 0; i<tank.moerank.length; i++){
						var playerid = tank.moerank[i]['playerid'];
						tank.sessions[playerid]['moerank'] = tank.moerank[i]['total'];
						tank['moerank'][i] = tank.sessions[playerid];
						tank.ranks['moerank'].push(playerid);
					}
					for(rankName in tank.ranks){
						if(rankName!="moerank"&&rankName!="epg"){
							tank.rankList.push(rankName);
						}
					}
					$scope.tanks.push(tank);
				}
			});
		}
		
    });*/
	
	$scope.setHide = function(tankname, username){
		if((username.toLowerCase()).includes($scope.playerSearch.toLowerCase())){
			$scope.hideTank[tankname] = false;
			return false;
		}
		else{
			
			return true;
		}
	}
	
	$scope.setTankHide = function(tankname){
		if(!(tankname in $scope.hideTank)){
			return true;
		}
		return false;
	}
	
	$scope.$watch('rules',function(){
		//console.log("rules changed");
	});
	
	$scope.$watch('tanks',function(){
		//console.log("rules changed");
	});
	
	$scope.$watch('hideTank',function(){
		//console.log("rules changed");
	});
	
	$scope.$watch('playerSearch',function(){
		console.log('search change');
		$scope.hideTank = {};
	});
}]);