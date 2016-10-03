// public/js/controllers/HomeCtrl.js


angular.module('HomeCtrl', []).controller('HomeController', ['$scope','$routeParams','$rootScope', 'Tank','Auth','Comment', function($scope, $routeParams,$rootScope, Tank, Auth, Comment) {
	
	$scope.tagline = 'Tioga.moe Rules!';
	//Auth.getUser(function(user){$scope.currentUser = user;});
	Comment.setTarget('home',function(){$rootScope.getComments();});
	
}]);