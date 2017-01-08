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

    timeManager.getTimes().then(function(times){
        $scope.activeTimers = times;
    });

    $scope.getCommonTimers = function(){
        return commonTimes;
    };
    
    $scope.$on('eqt-created-timer', function(e, data){
        $scope.activeTimers.push(data);
    });
    
    $scope.$on('eqt-remove-timer', function(e, data) {
        timeManager.removeTimer(data.label)
            .then(function(response){
                $scope.activeTimers = _.filter($scope.activeTimers, function(i){
                    return i.label !== data.label;
                });
            });
    });
}]);
