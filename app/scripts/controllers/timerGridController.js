
angular.module('sfTimer')
.controller('timerGridCtrl', ['$scope', 'dataProvider', 'SFTimerEvents','eventBroadcaster',
    function($scope, dataProvider, SFTimerEvents, eventBroadcaster) {
    
    $scope.activeTimers = [];
        
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
        
    $scope.$on(eventBroadcaster.event.timerGroup.selected, function(event, val){
        dataProvider.getTimersByGroup(val)
            .then(function(response){
                $scope.activeTimers = response.data;
        });
        
    });
}]);
