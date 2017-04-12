'use strict';

angular.module('sfTimer')
.factory('timeManager', ['dataProvider', '$q', function(dataProvider, $q){
    return {
        createTimer: createTimer,
        getTimes: getTimes,
        removeTimer: removeTimer
    };
    
    function getTimes(){
        return dataProvider.getAllTimers();
    }
    
    function removeTimer(timer){
        return dataProvider.removeTimer(timer);
    }
    
    function createTimer(data){
        return dataProvider.createTimer(data)
            .then(function(d) {
                return $q.resolve(d);
            });
    }
}]);