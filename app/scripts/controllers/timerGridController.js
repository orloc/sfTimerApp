
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'dataProvider', 'SFTimerEvents',
    function($scope, dataProvider, SFTimerEvents) {
    
    $scope.activeTimers = [];
    $scope.groups = [];
        
    $scope.activeGroup = null;
        
    updateTime();

    $scope.$on(SFTimerEvents.REMOVE_TIMER, function(e, data) {
        dataProvider.removeTimer(data)
        .then(function(){
            $scope.activeTimers = _.filter($scope.activeTimers, function(i){
                return i.id !== data.id;
            });
        }, function(err){
            console.log(err);
        });
    });

    $scope.selectGroup = function(group){
        if($scope.activeGroup === null || group.id !== $scope.activeGroup.id){
            $scope.activeGroup = group;
        }    
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
