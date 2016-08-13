angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'DashboardController'
		})

		.when('/students', {
			templateUrl: 'views/students.html',
			controller: 'StudentController'
		})

		.when('/books', {
			templateUrl: 'views/books.html',
			controller: 'BookController'
		});

	$locationProvider.html5Mode(true);

}]);