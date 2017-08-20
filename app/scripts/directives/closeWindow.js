'use strict';

angular.module('sfTimer')
    .directive('closeWindow', ['eventBroadcaster', function(eventBroadcaster){
    return {
        templateUrl: 'views/directives/closeWindowTemplate.html',
        controller: ['$scope', function($scope){
            $scope.close = function(){
                eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
            };
        }]
    };
}]);