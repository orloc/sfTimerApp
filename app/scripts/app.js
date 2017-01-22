'use strict';

angular.module('sfTimer', [
    'ngRoute',
    'ngSanitize',
    'timer',
    'angular-web-notification',
    'ui.router'
])
.constant('apiConfig', {
    baseUrl: 'http://eqt.orloc.me',
    apiVersion: 'api/v1',
    socketEvents: {
        TIMER_REMOVED: 'eqt:timer:removed',
        TIMER_ADDED: 'eqt:timer:added',
        TIMER_STARTED: 'eqt:timer:started',
        TIMER_RESET: 'eqt:timer:reset',
        TIMER_PAUSED: 'eqt:timer:paused'
    }
})
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouteProvider) {
    $stateProvider.state('app', {
        url: '/dashboard',
        templateUrl: 'views/pages/dashboard.html'
    });

    $urlRouteProvider.otherwise('/dashboard');

}]);
