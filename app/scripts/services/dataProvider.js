'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', function($http){
    
    this.getAllTimers = function(){
console.log({
    id: 1,
    start_time: moment(),
    reset_count: 0,
    duration: '6m20s',
    label: '6 spawn'
});
        return [
            {
                id: 1,
                start_time: moment(),
                reset_count: 0,
                duration: '6m20s',
                label: '6 spawn'
            },
            {
                id: 2,
                duration: '20s',
                label: 'Test',
                start_time: moment(),
                reset_count: 0
            },
            {
                id: 3,
                duration: '22m',
                label: 'Lefts Tree',
                start_time: moment(),
                reset_count: 0
            },
            {
                id: 4,
                duration: '22m',
                label: 'Path',
                start_time: moment(),
                reset_count: 0
            }
        ];
    };
    
    
    this.prepareTimerData = function(duration, label){
        
    };
    
    this.setTimer = function(timer){
        
    };
}]);
