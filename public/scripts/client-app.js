var app = angular.module('app', ['ngMaterial', 'ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$animateProvider', '$locationProvider', function($routeProvider, $animateProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when('/companies', {
      templateUrl: '/views/templates/companies.html',
      controller: 'CompaniesController',
      controllerAs: 'company'
    })
    .when('/guests', {
      templateUrl: '/views/templates/guests.html',
      controller: 'GuestsController',
      controllerAs: 'guest'
    })
    .otherwise({
      redirectTo: '/companies'
    })
}]);//End config
