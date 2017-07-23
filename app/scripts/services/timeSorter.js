'use strict';

angular.module('sfTimer')
.service('timeSorter', ['$rootScope', 'eventBroadcaster', function($rootScope, eventBroadcaster){
    var activeTimes = [];
    var seen = {};

    $rootScope.$on(eventBroadcaster.event.timer.delete, function(e, val) {
        remove( { timer: val }, activeTimes);
    });

    $rootScope.$on(eventBroadcaster.event.timerGroup.selected, function() {
        activeTimes = [];
        seen = {};
    });
    
    $rootScope.$on(eventBroadcaster.event.timer.tick, function(e, val){
        if (typeof seen[val.timer.id] === 'undefined'){
            insert(val, activeTimes);
            return;
        } 
        update(val, activeTimes);
    });
    
    this.getTimes = function(){
        return activeTimes.map(function(i) {
            return i.timer;
        });   
    };
    
    function update(val, arr){
        remove(val, arr);
        insert(val, arr);
    }
    
    function remove(val, arr){
        var timeIndex = _.findIndex(arr, function(i){
            return i.timer.id === val.timer.id;
        });
        arr.splice(timeIndex, 1);
    }
    
    function insert(val, arr, startVal, endVal){
        var length = arr.length;
        var end = typeof(endVal) !== 'undefined' ? endVal : length -1;
        var start = typeof(startVal) !== 'undefined' ? startVal : 0;
        var m = start + Math.floor((end-start)/2);

        if (length === 0){
            seen[val.timer.id] = 0;
            arr.push(val);
            return;
        }

        if (val.milliseconds >= arr[end].milliseconds){
            seen[val.timer.id] = end + 1;
            arr.splice(end + 1, 0, val);
            return;
        }

        if (val.milliseconds <= arr[start].milliseconds){
            seen[val.timer.id] = start;
            arr.splice(start, 0, val);
            return;
        }

        if (start >= end){
            return;
        }

        if (val.milliseconds < arr[m].milliseconds){
            insert(val, arr, start, m-1);
            return;
        }

        if (val.milliseconds > arr[m].milliseconds){
            insert(val, arr, m+1,end);
            return;
        }
    }
}]);

// get a new item
// list is empy - put the thing on the list
// item is smaller than first index - push to front
// item is larger than last index - pop on back
// item is in the middle - pick middle index - check if greater or less than or equal to
// move to that side and continue - return the index at the end
