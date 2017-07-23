'use strict';

angular.module('sfTimer')
    .service('eventBroadcaster', ['$rootScope', function($rootScope){
        this.event = {
            form: {
                close: 'event:form:close'
            },
            timer: {
                created: 'event:timer:created'
            },
            timerGroup: {
                selected: 'event:timerGroup:selected',
                update: 'event:timerGroup:update',
                create: 'event:timerGroup:create'
            }
        };
        
        this.broadcast = function(event, data){
            $rootScope.$broadcast(event, data);
        };

    }]);
