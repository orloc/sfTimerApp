'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', function($http){
    
    this.getAllTimers = function(){
        return [
            {
                duration: '20s',
                label: 'Test',
                start_time: moment(),
                reset_count: 0
            },
            {
                duration: '12m',
                label: 'Dune',
                start_time: moment(),
                reset_count: 0
            },
            {
                duration: '2m',
                label: 'Left Tree',
                start_time: moment(),
                reset_count: 0
            },
            {
                duration: '1h2m',
                label: 'Lefts Tree',
                start_time: moment(),
                reset_count: 0
            },
            {
                duration: '22m',
                label: 'Path',
                start_time: moment(),
                reset_count: 0
            },
            {
                start_time: moment(),
                reset_count: 0,
                duration: '6m20s',
                label: '6 spawn'
            }
        ];
    };
    
    
    this.prepareTimerData = function(duration, label){
        
    };
    
    this.setTimer = function(timer){
        
    };
}]);
