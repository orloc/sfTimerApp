'use strict';

angular.module('sfTimer').directive('customTimerForm', ['dataProvider', 'eventBroadcaster', '$interval', 
    function(dataProvider, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/customTimerFormTemplate.html',
        scope: {
            inline: '=',
            needsAuth: '='
        }, 
        controller: ['$rootScope','$scope', function($rootScope, $scope){
            $scope.durationPattern = /^(([1-5]?[0-9]){1,2}[h|m|s]){1,3}$/img;
            $scope.formData = {};
            
            $scope.formError = null;
            $scope.formSuccess = null;
            
            $scope.submit= function(){
                $scope.formError = null;
                $scope.formSuccess = null;
                dataProvider.createTimer($scope.formData)
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