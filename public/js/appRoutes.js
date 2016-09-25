// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // nerds page that will use the NerdController
        .when('/nerds', {
            templateUrl: 'views/nerd.html',
            controller: 'NerdController'
        })
		
		// nerds page that will use the NerdController
        .when('/player/:playerid', {
            templateUrl: 'views/player.html',
            controller: 'PlayerController'
        })
		
		// nerds page that will use the NerdController
        .when('/players', {
            templateUrl: 'views/playerlist.html',
            controller: 'PlayerListController'
        });
		
		// nerds page that will use the NerdController
        /*.when('/:key', {
            templateUrl: 'views/nerd.html',
            controller: 'AuthController'
        });*/

    $locationProvider.html5Mode(true);

}]);