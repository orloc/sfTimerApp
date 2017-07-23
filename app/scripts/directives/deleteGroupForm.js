'use strict';

angular.module('sfTimer')
    .directive('deleteGroupForm', ['dataProvider', 'eventBroadcaster', '$interval',
    function(dataProvider, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/deleteGroupFormTemplate.html',
        scope: {
            existingGroup: '='
        }, 
        link: function(scope, element, attr){
            scope.submit= function(){
                dataProvider.deleteTimerGroup(scope.existingGroup)
                    .then(function(resp){
                        eventBroadcaster.broadcast(eventBroadcaster.event.timerGroup.delete, resp.data);
                        eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
                    }, function(err){
                        scope.formError = err.message;   
                    });
            };
            scope.cancel = function(){
                eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
            }
        }
    };
}]);