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
        name: 'spawns', 
        url: '/spawns',
        templateUrl: 'views/pages/spawns.html',
        data: { requireLogin: true }
    });

    $stateProvider.state({
        name: 'settings',
        url: '/settings',
        templateUrl: 'views/pages/userSettings.html',
        data: { requireLogin: true }
    });

    $stateProvider.state({
        name: 'users',  
        url: '/users',
        templateUrl: 'views/pages/users.html',
        data: { 
            requireLogin: true ,
            admin: true
        }
    });

    $stateProvider.state({
        name: 'timers',
        url: '/timers',
        templateUrl: 'views/pages/timers.html',
        data: { requireLogin: true }
    });
        
    $urlRouteProvider.otherwise('/login');
        
    jwtOptionsProvider.config({
        tokenGetter: [ 'store', 'apiConfig', function(store, apiConfig){
            return store.get(apiConfig.tokenStorageName);
        }],
        whiteListedDomains: [
            'eqt.dev'
        ],
        authHeader: 'X-EQTAccess-Token'
    });
        
    $httpProvider.interceptors.push('jwtInterceptor');
}])
.run(['$rootScope', '$state', 'authManager', '$location','securityManager',
    function($rootScope, $state, authManager, $location, securityManager){
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();

    if (!securityManager.getValidToken()) {
        $location.path('/login');
    }
        
    $rootScope.safeApply =  function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.$on('tokenHasExpired', function() {
        alert('Your session has expired!');
        $rootScope.isAuthed = false;
        $state.go('login');
    });

    $rootScope.$on('$stateChangeStart', function(e, to){
        if (to.data && to.data.requireLogin){
            var validToken = securityManager.getValidToken();

            if (!validToken){
                securityManager.logout();
            } else {
                $rootScope.isAuthed = validToken;
            }
        }
    });
}]);

