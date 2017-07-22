'use strict';

angular.module('sfTimer').directive('customTimerForm', ['dataProvider', 'eventBroadcaster', '$interval', 
    function(dataProvider, eventBroadcaster){
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

            $scope.submit= function(){
                $scope.formError = null;
                $scope.formSuccess = null;
                dataProvider.createTimer($scope.formData)
                    .then(function(data){
                        $scope.formData = {};
                        eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
                    }, function(err){
                        $scope.formError = err.data.message;
                    });
            };
        }]
    };
}]);