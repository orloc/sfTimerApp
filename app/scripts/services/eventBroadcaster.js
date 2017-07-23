'use strict';

angular.module('sfTimer')
    .service('eventBroadcaster', ['$rootScope', function($rootScope){
        this.event = {
            form: {
                close: 'event:form:close'
            },
            timer: {
                created: 'event:timer:created',
                delete: 'event:timer:deleted',
                started: 'event:timer:started',
                paused: 'event:timer:paused',
                tick: 'event:timer:tick'
            },
            timerGroup: {
                selected: 'event:timerGroup:selected',
                update: 'event:timerGroup:update',
                create: 'event:timerGroup:create',
                delete: 'event:timerGroup:delete'
            }
        };
        
        this.broadcast = function(event, data){
            $rootScope.$broadcast(event, data);
        };

    }]);
