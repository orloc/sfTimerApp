'use strict';

angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'timeManager', function($scope, timeManager) {
    
    var commonTimes = [
        { duration: '6m20s'},
        { duration: '15m'},
        { duration: '22m'},
        { duration: '30m'},
        { duration: '1h'}
    ];
    
    $scope.activeTimers = timeManager.getTimes();

    $scope.getCommonTimers = function(){
        return commonTimes;
    }
}]);
