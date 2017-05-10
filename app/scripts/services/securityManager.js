'use strict';

angular.module('sfTimer')
    .service('securityManager', ['store', '$state', '$rootScope', 'jwtHelper','$q', 'apiConfig',
        function(store, $state, $rootScope, jwtHelper, $q, apiConfig){

            this.setLoginTokenAndRedirect = function(token){
                store.set(apiConfig.tokenStorageName, token.token);
                $state.go('dashboard');
            };
            
            this.getCurrentUser = function(){
                var token = store.get(apiConfig.tokenStorageName);
                
                if (token){
                    return jwtHelper.decodeToken(token);
                }
                
                return false;
            };
            
            this.logout = function(){
                store.remove(apiConfig.tokenStorageName);
                $state.go('login');
                $rootScope.isAuthed = false;
            }

    }]);
