// public/js/controllers/PlayerCtrl.js


angular.module('AuthCtrl', []).controller('AuthController', ['$scope','$routeParams', '$cookies','Auth', function($scope, $routeParams, $cookies, Auth) {
	
	//$cookies.put('key', "test1111");
	//$cookies.put('key.sig', $routeParams.sig);
	//console.log("got this key");
	//console.log($routeParams.key);
	Auth.getUser(function(user){$scope.currentUser = user;});
	console.log($scope.currentUser);
}]);