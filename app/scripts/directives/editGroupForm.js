'use strict';

angular.module('sfTimer')
    .directive('addEditGroupForm', ['dataProvider', 'eventBroadcaster', '$interval',
    function(dataProvider, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/editGroupFormTemplate.html',
        scope: {
            existingGroup: '='
        }, 
        link: function(scope, element, attr){
            var exists = scope.existingGroup || false;
            scope.title = exists ? 'Edit' : 'New';
            scope.buttonText = exists ? 'Update' : 'Create';
            scope.formData =  exists ? {
                name: scope.existingGroup.name,
                description: scope.existingGroup.description
            } : {};
            
            scope.formError = null;
            scope.formSuccess = null;

            scope.submit= function(){
                if (!exists){
                    dataProvider.createTimerGroup(scope.formData)
                        .then(function(resp){
                            eventBroadcaster.broadcast(eventBroadcaster.event.timerGroup.create, resp.data);
                            eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
                        }, function(err){
                            scope.formError = err.message;
                        });
                } else {
                    if (scope.formData.name === scope.existingGroup.name
                        && scope.formData.description === scope.existingGroup.description){
                        scope.formError = null;
                        scope.formSuccess = null;
                        eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
                        return;
                    }

                    dataProvider.updateTimerGroup(scope.existingGroup, scope.formData)
                        .then(function(resp){
                            eventBroadcaster.broadcast(eventBroadcaster.event.timerGroup.update, resp.data);
                            eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
                        }, function(err){
                            scope.formError = err.message;
                    });
                }
            };
        }
    };
}]);