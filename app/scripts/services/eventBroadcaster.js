'use strict';

angular.module('sfTimer')
    .service('eventBroadcaster', ['$rootScope', function($rootScope){
        
        this.broadcast = function(event, data){
            $rootScope.$broadcast(event, data);
        };

    }]);
