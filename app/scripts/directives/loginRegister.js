'use strict';

angular.module('sfTimer').directive('loginRegister', [ function(){
    return {
        templateUrl: 'views/directives/loginRegister.html',
        scope: {
            inline: '='
        },
        controller: ['$rootScope','$scope', 'dataProvider',
            function($rootScope, $scope, dataProvider){
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
                            console.log(res);
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                };

                $scope.submitGuest= function(){
                };

                $scope.submitRegister= function(){
                };
        }]
    };
}]);