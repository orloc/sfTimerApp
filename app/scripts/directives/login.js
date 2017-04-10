'use strict';

angular.module('sfTimer').directive('login', ['eventBroadcaster', '$interval', function(eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/login.html',
        scope: {
            inline: '='
        },
        controller: ['$rootScope','$scope', function($rootScope, $scope){
            $scope.formData = {};
            $scope.isAuthed = function(){
                return $rootScope.isAuthed;
            };

            $scope.submit= function(){
            };
        }]
    };
}]);