// public/js/controllers/PlayerCtrl.js


angular.module('PlayerCtrl', []).controller('PlayerController', ['$scope','$rootScope','$routeParams','Upload','$q', 'Player','Auth','Tank','Comment','notifications', function($scope,$rootScope, $routeParams, Upload, $q, Player, Auth, Tank, Comment, notifications) {
	
	Comment.setTarget($routeParams.playerid,function(){$rootScope.getComments();});
	//Auth.getUser(function(user){$scope.currentUser = user;});
	$scope.customize = false;
	$scope.rand = Math.random();
	$scope.playercolor = '#ffffff';
	if($scope.currentUser){if($scope.currentUser["playerid"] == $routeParams.playerid) {$scope.sessionbutton = true;} else {$scope.sessionbutton = false;}}
	
	$scope.showError = function (error) {
        notifications.showError({
            message: error,
            hideDelay: 2000, //ms
            hide: true //bool
        });
    };
	
    Player.get($routeParams.playerid).then(function(data){
		for(tank in data.latest_stats){
			data.latest_stats[tank]["dpg"] = (parseInt(data.latest_stats[tank]["damage_dealt"]/data.latest_stats[tank]["battles"])||0);
			if(data.latest_stats[tank]["battles"] == 0){delete data.latest_stats[tank];}
		}

		////console.log(sessionData);
		Tank.getRules().then(function(rules){
			$scope.rules = rules;
			console.log(rules.moecalcstring);
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
	
	$scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
		$scope.upload($scope.file);
      }
	  else {
		  $scope.showError("Error: Must upload .jpg or .png file less than 4 MB");
	  }
    };

	// upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/upload',
            data: {file: file, 'playerid': $scope.player.playerid, 'playercolor':$scope.playercolor}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			$scope.rand = Math.random();
        }, function (resp) {
            console.log('Error status: ' + resp.status +": "+ resp.data);
			$scope.showError(resp.data);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        }
		
		);
    };
	
	$scope.$watch('rand',function(){
		//console.log("rules changed");
	});
	$scope.$watch('file',function(){
		//console.log("rules changed");
	});
	$scope.$watch('playercolor',function(){
		//console.log($scope.playercolor);
	});
	
	
}]);