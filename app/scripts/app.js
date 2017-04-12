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

    $stateProvider.state({
        name: 'login',
        url: '/login',
        templateUrl: 'views/pages/landing.html',
        data: { requireLogin: false }
    });
        
    $stateProvider.state({
        name: 'dashboard', 
        url: '/dashboard',
        templateUrl: 'views/pages/dashboard.html',
        data: { requireLogin: true }
    });
        
    $stateProvider.state({
        name: 'users',  
        url: '/users',
        templateUrl: 'views/pages/users.html',
        data: { requireLogin: true }
    });
        
        
    $urlRouteProvider.otherwise('/login');
        
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
.run(['$rootScope', '$state', 'authManager', 'jwtHelper', 'store', 'apiConfig',
    function($rootScope, $state, authManager, jwtHelper, store, apiConfig){
    authManager.checkAuthOnRefresh();
        
    $rootScope.$on('$stateChangeStart', function(e, to){
        var validToken = (function() {
            var token = store.get(apiConfig.tokenStorageName);
            if (!token) return;

            if (jwtHelper.isTokenExpired(token)) return;
            
            return token;
        })();
        
        if (!validToken){
            $rootScope.isAuthed = false;
            store.remove(apiConfig.tokenStorageName);
            $state.go('login');
        } else {
            $rootScope.isAuthed = validToken;

            if (to.name === 'login'){
                $state.go('dashboard');
            }
        }

    });
}]);

