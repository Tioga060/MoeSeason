// public/js/controllers/TanksCtrl.js


angular.module('TanksCtrl', []).controller('TanksController', ['$scope','$routeParams', 'Tank','Auth', function($scope, $routeParams, Tank, Auth) {
	
	Auth.getUser(function(user){$scope.currentUser = user;});
	$scope.tankSearch = '';
	$scope.playerSearch = '';
	$scope.hideTank = {};
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
	Tank.getRules().then(function(data){
		$scope.rules = data;
		//console.log("got these rules");
		//console.log(data);
    });
	
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