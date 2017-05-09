
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'timeManager', 'SFTimerEvents',
    function($scope, timeManager, SFTimerEvents) {
    
    $scope.activeTimers = [];

    if (Notification.permission != 'granted') {
        Notification.requestPermission()
            .then(function(result){
            });
    }
        
    updateTime();

    $scope.$on(SFTimerEvents.REMOVE_TIMER, function(e, data) {
        timeManager.removeTimer(data)
        .then(function(){
            $scope.activeTimers = _.filter($scope.activeTimers, function(i){
                return i.id !== data.id;
            });
            // push action event onto action log
        }, function(err){
            console.log(err);
        });
    });

    function updateTime(){
        timeManager.getTimes().then(function(times){
            if (!$scope.activeTimers.length) {
                $scope.activeTimers = times;
                return;
            }

            var newItems = _.filter(times, function(t){
                var exists = _.find($scope.activeTimers, function(timer){
                    return timer.id ===  t.id;
                });

                return !exists
            });

            _.map(newItems, function(i){
                $scope.activeTimers.push(i);
            });
        });
    }
}]);
