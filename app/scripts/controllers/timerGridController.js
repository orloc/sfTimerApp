
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'dataProvider', 'SFTimerEvents','eventBroadcaster',
    function($scope, dataProvider, SFTimerEvents, eventBroadcaster) {
    
    $scope.activeTimers = [];
    $scope.groups = [];
        
    $scope.activeGroup = null;
    $scope.activeForm = false;
    $scope.forms = {
        editGroup: 'editGroup',
        addTimer: 'addTimer',
        deleteGroup: 'deleteGroup'
    };
        
    updateTime();

        /// should this still be here??
    $scope.$on(SFTimerEvents.REMOVE_TIMER, function(e, data) {
        if ($scope.activeGroup === null) return; 
        dataProvider.removeTimer($scope.activeGroup, data)
        .then(function(){
            $scope.activeTimers = _.filter($scope.activeTimers, function(i){
                return i.id !== data.id;
            });
        }, function(err){
            console.log(err);
        });
    });
        
    $scope.$on(eventBroadcaster.event.form.close, function(e, data){
        $scope.activeForm = null;
    });
        
    $scope.$watch('activeGroup', function(val){
        if (!val) return;
        dataProvider.getTimersByGroup(val)
            .then(function(response){
                $scope.activeTimers = response.data;
        });
        
    });
        
    $scope.toggleShowAdd = function(){
        $scope.showAddTimer = !$scope.showAddTimer;   
    };
    $scope.selectGroup = function(group){
        if($scope.activeGroup === null || group.id !== $scope.activeGroup.id){
            $scope.activeGroup = group;
        }    
    };

    $scope.toggleForm = function(group){
        $scope.activeForm = group;
    };
        
    function updateTime(){
        dataProvider.getTimerGroups()
            .then(function(times) {
                $scope.groups = times;
            });
            /*
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
            */
    }
}]);
