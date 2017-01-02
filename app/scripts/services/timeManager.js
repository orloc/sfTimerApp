'use strict';

angular.module('sfTimer').factory('timeManager', ['dataProvider', function(dataProvider){
    return {
        createTimer: createTimer,
        getTimes: getTimes
    };
    
    function getTimes(){
        return dataProvider.getAllTimers();
    }
    
    function createTimer(duration){
        
    }
}]);