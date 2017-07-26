
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'dataProvider','eventBroadcaster', 'timeSorter', '$interval',
    function($scope, dataProvider, eventBroadcaster, timerSorter, $interval) {
    
    $scope.activeTimers = [];

    $interval(function(){
        if (!$scope.activeTimers.length) return;
        var activeTimers = timerSorter.getTimes();
        var currentTimers = $scope.activeTimers.map(function(i){
            return  i.id;
        });
        
        var ids = activeTimers.map(function(i) {
            return i.id;
        }).filter(function(id){
            return currentTimers.indexOf(id) >= 0;
        });
        
        $scope.activeTimers = activeTimers.concat($scope.activeTimers.filter(function(i){
            return ids.indexOf(i.id) === -1;  
        }));
    }, 750);
        
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
        if (!val) return;
        val.running = true;
        
        if (!val.start_time){
            val.start_time = moment().format('YYYY-MM-DD HH:mm:ss');
        } 
        
        dataProvider.updateTimer(val)
            .then(function(data){
                // ? 
            }, function(err){
                console.log(err);
            });
    });

    $scope.$on(eventBroadcaster.event.timer.paused, function(event, val){
        if (!val) return;
        val.running = false;
        val.last_tick = moment().format('YYYY-MM-DD HH:mm:ss');
        dataProvider.updateTimer(val)
            .then(function(data){
                // ? 
            }, function(err){
                console.log(err);
            });
    });

    $scope.$on(eventBroadcaster.event.timer.reset,function(event, val){
        if (!val) return;
        val.running = false;
        val.last_tick = null;
        val.start_time = null;
        dataProvider.updateTimer(val)
            .then(function(data){
                var timer = data.data;
                for(var i = 0; i < $scope.activeTimers.length; i++){
                    if ($scope.activeTimers[i].id === timer.id){
                        $scope.activeTimers[i] = timer;
                        break;
                    } 
                }
            }, function(err){
                console.log(err);
            });
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
