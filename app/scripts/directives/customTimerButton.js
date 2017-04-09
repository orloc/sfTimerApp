'use strict';

angular.module('sfTimer').directive('customTimerButton', ['timeManager', 'eventBroadcaster', '$interval', function(timeManager, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/customTimerButtonTemplate.html',
        scope: {
            inline: '=',
            needsAuth: '='
        }, 
        controller: ['$rootScope','$scope', function($rootScope, $scope){
            $scope.durationPattern = /^(([1-5]?[0-9]){1,2}[h|m|s]){1,3}$/img;
            $scope.formData = {};
            
            $scope.formError = null;
            $scope.formSuccess = null;

            $scope.isAuthed = function(){
                return !$scope.needsAuth
                    ? true
                    : $rootScope.isAuthed;
            };
            
            $scope.submit= function(){
                $scope.formError = null;
                $scope.formSuccess = null;
                timeManager.createTimer($scope.formData)
                    .then(function(data){
                        $scope.formSuccess = true;
                        eventBroadcaster.broadcast('eqt-created-timer', data.data);
                        $scope.formData = {};
                        $interval(function(){
                            $scope.formSuccess = false;
                        },2000,1);
                    }, function(err){
                        $scope.formError = err.data.message;
                    });
            };
        }]
    };
}]);