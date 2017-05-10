'use strict';

angular.module('sfTimer').directive('customTimerForm', ['timeManager', 'eventBroadcaster', '$interval', function(timeManager, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/customTimerFormTemplate.html',
        scope: {
            inline: '=',
            needsAuth: '='
        }, 
        controller: ['$rootScope','$scope', function($rootScope, $scope){
            $scope.durationPattern = /^(([1-5]?[0-9]){1,2}[h|m|s]){1,3}$/img;
            $scope.formData = {};
            
            $scope.showPanel = false;
            $scope.formError = null;
            $scope.formSuccess = null;
            
            $scope.$on('newTimerToggle', function(e, v){
                $scope.showPanel = v;
            });

            $scope.submit= function(){
                $scope.formError = null;
                $scope.formSuccess = null;
                timeManager.createTimer($scope.formData)
                    .then(function(data){
                        $scope.formSuccess = true;
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