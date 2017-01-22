
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'timeManager', 'SFTimerEvents', 'socket', 'apiConfig',
    function($scope, timeManager, SFTimerEvents, socket, apiConfig) {
    
    var commonTimes = [
        { duration: '6m20s'},
        { duration: '15m'},
        { duration: '22m'},
        { duration: '30m'},
        { duration: '1h'}
    ];

    $scope.activeTimers = [];

    if (Notification.permission != 'granted') {
        Notification.requestPermission()
            .then(function(result){
            });
    }
        
    updateTime();

    // SOCKET EVENTS
    socket.on(apiConfig.socketEvents.TIMER_ADDED, function(data){
        updateTime();
    });

    socket.on(apiConfig.socketEvents.TIMER_REMOVED, function(data){
        $scope.$apply(function(){
            $scope.activeTimers = doRemoveTimer(data);
        });
    });

    socket.on(apiConfig.socketEvents.TIMER_STARTED, function(data){
        $scope.$broadcast(SFTimerEvents.START_SPECIFIC_TIMER, data);
    });

    socket.on(apiConfig.socketEvents.TIMER_PAUSED, function(data){
        $scope.$broadcast(SFTimerEvents.PAUSE_SPECIFIC_TIMER, data);
    });

    socket.on(apiConfig.socketEvents.TIMER_RESET, function(data){
        $scope.$broadcast(SFTimerEvents.RESET_SPECIFIC_TIMER, data);
    });

    // SCOPE GRID EVENTS
    $scope.$on(SFTimerEvents.TIMER_CREATED, function(e, data){
        $scope.activeTimers.push(data);
        socket.emit(apiConfig.socketEvents.TIMER_ADDED, data);
    });
        
    $scope.$on(SFTimerEvents.START_TIMER, function(e, data){
        socket.emit(apiConfig.socketEvents.TIMER_STARTED, data);
    });

    $scope.$on(SFTimerEvents.RESET_TIMER, function(e, data){
        socket.emit(apiConfig.socketEvents.TIMER_RESET, data);
    });

    $scope.$on(SFTimerEvents.PAUSE_TIMER, function(e, data){
        socket.emit(apiConfig.socketEvents.TIMER_PAUSED, data);
    });
    
    $scope.$on(SFTimerEvents.REMOVE_TIMER, function(e, data) {
        timeManager.removeTimer(data.label)
            .then(function(){
                socket.emit(apiConfig.socketEvents.TIMER_REMOVED, data);
                $scope.activeTimers = doRemoveTimer(data);
            });
    });

    $scope.getCommonTimers = function(){
        return commonTimes;
    };

    function updateTime(){
        timeManager.getTimes().then(function(times){
            if (!$scope.activeTimers.length) {
                $scope.activeTimers = times;
                return;
            }

            var newItems = _.filter(times, function(t){
                var exists = _.find($scope.activeTimers, function(timer){
                    return timer.label ===  t.label;
                });

                return !exists
            });

            _.map(newItems, function(i){
                $scope.activeTimers.push(i);
            });
        });
    }

    function doRemoveTimer(data){
        return _.filter($scope.activeTimers, function(i){
            return i.label !== data.label;
        });
    }
}]);
