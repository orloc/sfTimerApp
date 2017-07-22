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
            scope.formData = scope.existingGroup;

            scope.submit= function(){
                eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
            };
            scope.cancel = function(){
                eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
            }
        }
    };
}]);