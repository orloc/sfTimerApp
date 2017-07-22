'use strict';

angular.module('sfTimer')
    .directive('addEditGroupForm', ['dataProvider', 'eventBroadcaster', '$interval',
    function(dataProvider, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/editGroupFormTemplate.html',
        scope: {
            existingGroup: '=',
            createForm: '='
        }, 
        link: function(scope, element, attr){
            var isCreate = scope.createForm || false;
            scope.title = isCreate ? 'New' : 'Edit';
            scope.formData = scope.existingGroup;
            scope.formError = null;
            scope.formSuccess = null;

            scope.submit= function(){
                if (scope.formData.name === scope.existingGroup.name 
                && scope.formData.description === scope.existingGroup.description){
                    scope.formError = null;
                    scope.formSuccess = null;
                    eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
                    return;
                }
                
                // data provider update
                console.log(scope.formData);
                eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
            };
        }
    };
}]);