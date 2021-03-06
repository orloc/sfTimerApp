'use strict';

angular.module('sfTimer').directive('loginRegister', [ function(){
    return {
        templateUrl: 'views/directives/loginRegister.html',
        scope: {
            inline: '='
        },
        controller: ['$rootScope','$scope', '$timeout', 'dataProvider', 'securityManager',
            function($rootScope, $scope, $timeout, dataProvider, securityManager){
                $scope.data = {};

                $scope.pages = {
                    login:      'loginPage',
                    register:   'registerPage',
                    guest:      'guestForm'
                };
                
                $scope.formError = null;

                $scope.pageType = $scope.pages.login;

                $scope.isAuthed = function(){
                    return $rootScope.isAuthed;
                };

                $scope.changeView = function(view){
                    $scope.data = {};
                    $scope.pageType = view;
                };

                $scope.submitLogin = function(){
                    var dataCopy = $scope.data;
                    $scope.data = {};
                    dataProvider.login(dataCopy)
                        .then(function(res) {
                            securityManager.setLoginTokenAndRedirect(res); 
                        }, function(err){
                            $scope.formError = err.message;
                            $timeout(function(){
                                $scope.formError = null;
                            }, 3500);
                        });
                };

                $scope.passwordsMatch = function(){
                    return $scope.data.password === $scope.data.password_confirmation;
                };

                $scope.usernameNotLogin = function(){
                    return $scope.data.username !== $scope.data.profile_name;
                };

                $scope.submitRegister= function(){
                    var dataCopy = $scope.data;
                    $scope.data = {};
                    dataProvider.register(dataCopy)
                        .then(function(res) {
                            securityManager.setLoginTokenAndRedirect(res);
                        }, function(err){
                            $scope.formError = err.message;
                            $timeout(function(){
                                $scope.formError = null;
                            }, 3500);
                        });
                };
        }]
    };
}]);