// public/js/controllers/MainCtrl.js


angular.module('MainCtrl', []).controller('MainController', ['$scope', 'Auth', function($scope, Auth) {

    $scope.tagline = 'To the moon and back!';
	//consider using rootscope here
	Auth.getUser(function(user){$scope.currentUser = user;});
	/*setTimeout(function () {
        $scope.$apply(function () {
            Auth.getUser(function(user){$scope.currentUser = user;});
        });
    }, 1000);*/
	$scope.$watch('currentUser',function(){
		//console.log("user changed");
	});
}]);