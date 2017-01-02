'use strict';

angular.module('sfTimer')
.controller('timeSelectionCtrl', ['$scope', 'timeManager', function($scope, timeManager) {
    
    var commonTimes = [
        { duration: '6m20s'},
        { duration: '15m'},
        { duration: '22m'},
        { duration: '30m'},
        { duration: '1h'}
    ];
    
    $scope.getCommonTimers = function(){
        return commonTimes;
    }
}]);
