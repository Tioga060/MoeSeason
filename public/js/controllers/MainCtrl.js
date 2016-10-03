// public/js/controllers/MainCtrl.js


angular.module('MainCtrl', []).controller('MainController', ['$scope','$rootScope', 'Auth','$window','$document','Comment','notifications', function($scope,$rootScope, Auth, $window,$document,Comment,notifications) {

	$scope.showError = function (error) {
        notifications.showError({
            message: error,
            hideDelay: 2000, //ms
            hide: true //bool
        });
    };
	$scope.hidecomments = false;

	$scope.commentInput = '';
	Comment.setTarget(false);
    
	var w = angular.element($window)[0];
	if(w.innerWidth<1660){$scope.hidecomments = true;}
	//consider using rootscope here
	Auth.getUser(function(user){
		$scope.currentUser = user;
	});
	/*setTimeout(function () {
        $scope.$apply(function () {
            Auth.getUser(function(user){$scope.currentUser = user;});
        });
    }, 1000);*/
	$scope.$watch('currentUser',function(){
		//console.log("user changed");
	});
	
	$scope.$watch('currentUser',function(){
		//console.log("user changed");
	});
	
	$rootScope.getComments = function(){
		Comment.getComments(function(data){
			$scope.comments = data;
			//console.log("got new comments");
			//console.log($scope.comments);
		});
	}
	
	$scope.submitComment = function(){
		var inputlength = $scope.commentInput.length;
		if(inputlength >= 5 && inputlength <= 140){
			Comment.submitComment($scope.commentInput,function(err){
				if(err){$scope.showError(err.data);}
				else{
					$rootScope.getComments();
					$scope.commentInput = '';
				}
			});
		}
		else{
			$scope.showError("Comment must be more than 5 characters long and less than 140");
		}
	}
	
	$scope.$watch('comments', function () {
		 //console.log("got new comments");
		 //console.log($scope.comments);
	}, true);
	$scope.$watch('hidecomments', function () {
		if($scope.hidecomments){$scope.hidetext = "Show Comments";}
		else{$scope.hidetext = "Hide Comments";}
	}, true);
	
	$scope.$watch('commentInput', function () {
		 //console.log($scope.comments);
	}, true);
	
	$scope.getWindowDimensions = function () {
		return { 'h': w.innerHeight, 'w': w.innerWidth };
	};

	$scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
		$scope.windowHeight = newValue.h;
		$scope.windowWidth = newValue.w;
		
		$scope.style = function () {
			if($scope.hidecomments){
				return { 
					'height': (newValue.h - 20).toString() + 'px',
					'right': '-240px' 
				};
			}
			else{
				return { 
					'height': (newValue.h - 20).toString() + 'px'//,
					//'width': (newValue.w - 0) + 'px' 
				};
			}
		};
		
		$scope.buttonstyle = function () {
			if($scope.hidecomments){
				return { 
					'right': '-38px' 
				};
			}
		};
		
	}, true);
	
	angular.element($window).bind('resize', function () {
		$scope.$apply();
	});
	
	$scope.showPos=function(passedEventObject){
		console.log(passedEventObject);
	};
	
	
}]);