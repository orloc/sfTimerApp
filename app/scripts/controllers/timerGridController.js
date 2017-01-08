
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'timeManager', 'socket', 'apiConfig',
    function($scope, timeManager, socket, apiConfig) {
    
    var commonTimes = [
        { duration: '6m20s'},
        { duration: '15m'},
        { duration: '22m'},
        { duration: '30m'},
        { duration: '1h'}
    ];
        
    $scope.activeTimers = [];

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
        
    updateTime();

    $scope.getCommonTimers = function(){
        return commonTimes;
    };
        
    socket.on(apiConfig.socketEvents.TIMER_ADDED, function(data){
        updateTime();
    });

    socket.on(apiConfig.socketEvents.TIMER_REMOVED, function(data){
        $scope.$apply(function(){
            $scope.activeTimers = doRemoveTimer(data);
        });
    });

    socket.on(apiConfig.socketEvents.TIMER_STARTED, function(data){
        $scope.$broadcast('eqt-start-specific-timer', data);
    });

    socket.on(apiConfig.socketEvents.TIMER_PAUSED, function(data){
        $scope.$broadcast('eqt-pause-specific-timer', data);
    });

    $scope.$on('eqt-created-timer', function(e, data){
        $scope.activeTimers.push(data);
        socket.emit(apiConfig.socketEvents.TIMER_ADDED, data);
    });
        
    $scope.$on('eqt-start-timer', function(e, data){
        socket.emit(apiConfig.socketEvents.TIMER_STARTED, data);
    });

    $scope.$on('eqt-pause-timer', function(e, data){
        socket.emit(apiConfig.socketEvents.TIMER_PAUSED, data);
    });
    
    $scope.$on('eqt-remove-timer', function(e, data) {
        timeManager.removeTimer(data.label)
            .then(function(response){
                socket.emit(apiConfig.socketEvents.TIMER_REMOVED, data);
                $scope.activeTimers = doRemoveTimer(data);
            });
    });
}]);
