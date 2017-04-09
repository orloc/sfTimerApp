'use strict';

angular.module('sfTimer', [
    'ngRoute',
    'ngSanitize',
    'timer',
    'angular-web-notification',
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
.constant('apiConfig', {
    baseUrl: window.location.hostname === 'localhost' ? 'http://eqt.dev/index_dev.php' : 'http://eqt.orloc.me',
    apiVersion: 'api/v1',
    tokenStorageName: 'eqtToken',
    socketEvents: {
        TIMER_REMOVED: 'eqt:timer:removed',
        TIMER_ADDED: 'eqt:timer:added',
        TIMER_STARTED: 'eqt:timer:started',
        TIMER_RESET: 'eqt:timer:reset',
        TIMER_PAUSED: 'eqt:timer:paused'
    }
})
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtOptionsProvider',
    function ($stateProvider, $urlRouteProvider, $httpProvider, jwtOptionsProvider) {
    $stateProvider.state('app', {
        url: '',
        templateUrl: 'views/pages/dashboard.html',
        data: { requireLogin: false }
    });
        
    $stateProvider.state('app.authed', {
        abstract: true,
        data: { requireLogin: true }
    });

    $stateProvider.state('app.authed.user', {
        url: '/users',
        templateUrl: 'views/pages/users.html'
    });
        
        
    $urlRouteProvider.otherwise('/dashboard');
        
        
    jwtOptionsProvider.config({
        tokenGetter: [ 'store', 'apiConfig', function(store, apiConfig){
            var token = store.get(apiConfig.tokenStorageName);
            return token ? token.token : token;
        }],
        whiteListedDomains: [
            'eqt.dev'
        ],
        authHeader: 'X-EQTAccess-Token'
    });
        
    $httpProvider.interceptors.push('jwtInterceptor');

}])
.run(['$rootScope', '$state', 'authManager', 'store', 'apiConfig',
    function($rootScope, $state, authManager, store, apiConfig){
    authManager.checkAuthOnRefresh();

    $rootScope.$on('$stateChangeStart', function(e, to){
        var validToken = (function() {
            var token = store.get(apiConfig.tokenStorageName);
            if (!token) return;
        })();
        
        if (to.data && to.data.requireLogin ) {
            $rootScope.isAuthed = validToken
        } else {
            $rootScope.isAuthed = false;
        }

    });
}]);

