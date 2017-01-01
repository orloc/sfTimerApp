'use strict';

angular.module('sfTimer', [
    'ngRoute',
    'ngSanitize',
    'timer',
    'ui.router'
])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouteProvider) {
    $stateProvider.state('app', {
        url: '/dashboard',
        templateUrl: 'views/pages/dashboard.html'
    });

    $urlRouteProvider.otherwise('/dashboard');

}]);
