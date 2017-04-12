'use strict';

angular.module('sfTimer')
    .service('securityManager', ['store', '$state', '$q', 'apiConfig',
        function(store, $state, $q, apiConfig){

            this.setLoginTokenAndRedirect = function(token){
                store.set(apiConfig.tokenStorageName, token.token);
                $state.go('dashboard');
            }

    }]);
