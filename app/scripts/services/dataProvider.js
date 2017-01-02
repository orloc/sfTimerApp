'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', function($http){
    
    this.getAllTimers = function(){
        return [
            /*
            {
                duration: '22m',
                label: 'Dune'
            },
            {
                duration: '22m',
                label: 'Left Tree'
            },
            {
                duration: '22m',
                label: 'Path'
            },
            */
            {
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
