
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'dataProvider','eventBroadcaster', 'timeSorter', '$interval',
    function($scope, dataProvider, eventBroadcaster, timerSorter, $interval) {
    
    $scope.activeTimers = [];

    $interval(function(){
        if (!$scope.activeTimers.length) return;
         
    }, 1000 * 3);
        
    $scope.$on(eventBroadcaster.event.timer.delete, function(e, data) {
        if ($scope.activeGroup === null) return; 
        dataProvider.removeTimer(data)
        .then(function(){
            $scope.activeTimers = _.filter($scope.activeTimers, function(i){
                return i.id !== data.id;
            });
        }, function(err){
            console.log(err);
        });
    });

    $scope.$on(eventBroadcaster.event.timer.created, function(event, val){
        $scope.activeTimers.push(val); 
    });

    $scope.$on(eventBroadcaster.event.timer.started, function(event, val){
        // post to the timer to start it
    });

    $scope.$on(eventBroadcaster.event.timer.paused, function(event, val){
        // post to the timer to pause it
    });

    $scope.$on(eventBroadcaster.event.timerGroup.delete, function(){
        $scope.activeTimers = [];
    });
        
    $scope.$on(eventBroadcaster.event.timerGroup.selected, function(event, val){
        dataProvider.getTimersByGroup(val)
            .then(function(response){
                $scope.activeTimers = response.data;
        });
        
    });
}]);
