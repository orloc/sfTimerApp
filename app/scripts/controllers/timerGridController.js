angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'dataProvider','eventBroadcaster', 'timeSorter', '$interval','socket',
    function($scope, dataProvider, eventBroadcaster, timerSorter, $interval, socket) {
    
    $scope.activeTimers = [];
    $scope.activeGroup = null;
      
    function handleDelete(e, data) {
      if ($scope.activeGroup === null) return;
      dataProvider.removeTimer(data)
      .then(function(){
        $scope.activeTimers = _.filter($scope.activeTimers, function(i){
          return i.id !== data.id;
        });
      }).catch(function(err){
        console.log(err);
      });
    }
    
    function handleCreate(e, data) {
      $scope.activeTimers.push(data); 
    }
    
    function handleStart(e, data){
      if (!data) return;
      data.running = true;

      if (!data.start_time){
        data.start_time = moment().format('YYYY-MM-DD HH:mm:ss');
      }

      dataProvider.updateTimer(data)
      .catch(function(err){
        console.log(err);
      });
      
    }
    
    function handlePause(e, data) {
      if (!data) return;
      data.running = false;
      data.last_tick = moment().format('YYYY-MM-DD HH:mm:ss');
      dataProvider.updateTimer(data)
      .catch(function(err){
        console.log(err);
      });
    }
    
    function handleReset(e, data){
      if (!data) return;
      dataProvider.updateTimer(data)
      .then(function(timer){
        console.log(timer);
        for(var i = 0; i < $scope.activeTimers.length; i++){
          if ($scope.activeTimers[i].id === timer.id){
            $scope.activeTimers[i] = timer;
            break;
          }
        }
      })
      .catch(function(err) {
        console.log(err);
      });
    }

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
        
    /** 
     * Event Timers to manage timers in set
     */
    $scope.$on(eventBroadcaster.event.timer.delete, handleDelete);
    $scope.$on(eventBroadcaster.event.timer.created, handleCreate);
    $scope.$on(eventBroadcaster.event.timer.started, handleStart);
    $scope.$on(eventBroadcaster.event.timer.paused, handlePause);
    $scope.$on(eventBroadcaster.event.timer.reset, handleReset);
      
    $scope.$on(eventBroadcaster.event.timerGroup.delete, function(){
        $scope.activeTimers = [];
    });
        
    $scope.$on(eventBroadcaster.event.timerGroup.selected, function(event, val){
        $scope.activeGroup =  val;
        dataProvider.getTimersByGroup(val)
            .then(function(timers){
                $scope.activeTimers = timers;
        });
    });

    /**
     * Socket event bindings
     */
    var events = socket.events;
    socket.on(events.update, function(data){
      if (!shouldRecognizeEvent(data)) return;
      var object = data.payload;
      $scope.$broadcast(eventBroadcaster.event.timer.updateSelf, object);
    });

    socket.on(events.create, function(data){
      if (!shouldRecognizeEvent(data)) return;
      $scope.activeTimers.push(data.payload);
    });

    socket.on(events.delete, function(data){
      if (!shouldRecognizeEvent(data, true)) return;
      var object = data.payload;
      eventBroadcaster.broadcast(eventBroadcaster.event.timer.deleteWS, object);
      $scope.activeTimers = $scope.activeTimers.filter(function(t){
        return parseInt(t.id) !== parseInt(object.id);
      });
    });

   function shouldRecognizeEvent(data, withoutGroup) {
     if (data.entity !== 'timer') return false;
     if ($scope.activeGroup !== null ){
       if (withoutGroup) return true;
       return data.payload.timer_group_id === $scope.activeGroup.id;
     }
  }
}]);
