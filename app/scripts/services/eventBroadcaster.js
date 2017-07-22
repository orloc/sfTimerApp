'use strict';

angular.module('sfTimer')
    .service('eventBroadcaster', ['$rootScope', function($rootScope){
        this.event = {
            form: {
                close: 'event:form:close'
            },
            timerGroup: {
                selected: 'event:timerGroup:selected'
            }
        };
        
        this.broadcast = function(event, data){
            $rootScope.$broadcast(event, data);
        };

    }]);
