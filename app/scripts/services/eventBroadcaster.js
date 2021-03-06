'use strict';

angular.module('sfTimer')
    .service('eventBroadcaster', ['$rootScope', function($rootScope){
        this.event = {
            form: {
                close: 'event:form:close'
            },
            invitation: {
                completed: 'event:invitations:empty'
            },
            timer: {
                created: 'event:timer:created',
                delete: 'event:timer:deleted',
                deleteWS: 'event:timer:deleted:ws',
                started: 'event:timer:started',
                reset: 'event:timer:reset',
                paused: 'event:timer:paused',
                tick: 'event:timer:tick',
                updateSelf: 'event:timer:updateSelf',
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
