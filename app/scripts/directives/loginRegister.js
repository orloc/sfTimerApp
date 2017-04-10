'use strict';

angular.module('sfTimer').directive('loginRegister', ['eventBroadcaster', '$interval', function(eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/login.html',
        scope: {
            inline: '='
        },
        controller: ['$rootScope','$scope', function($rootScope, $scope){
            $scope.loginData = {};
            $scope.registrationData = {};
            
            $scope.pages = {
                login: 'loginPage',
                register: 'registerPage',
                guest: 'guestForm'
            };
            
            $scope.pageType = $scope.pages.login;
            
            $scope.isAuthed = function(){
                return $rootScope.isAuthed;
            };
            
            $scope.changeView = function(view){
                $scope.pageType = view;
            };

            $scope.submitLogin= function(){
            };

            $scope.submitRegister= function(){
            };
        }]
    };
}]);