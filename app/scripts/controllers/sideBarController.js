
angular.module('sfTimer')
.controller('sideBarCtrl', ['$scope', 'dataProvider', 'SFTimerEvents','eventBroadcaster',
    function($scope, dataProvider, SFTimerEvents, eventBroadcaster) {
    
    $scope.groups = [];
    $scope.activeGroup = null;
    $scope.activeForm = false;
    $scope.forms = {
        editGroup: 'editGroup',
        addTimer: 'addTimer',
        deleteGroup: 'deleteGroup'
    };

    dataProvider.getTimerGroups()
        .then(function(times) {
            $scope.groups = times;
        });
        
    $scope.$on(eventBroadcaster.event.form.close, function(e, data){
        $scope.activeForm = null;
    });
        
    $scope.$watch('activeGroup', function(val){
        if (!val) return;
        eventBroadcaster.broadcast(eventBroadcaster.event.timerGroup.selected, val);
        eventBroadcaster.broadcast(eventBroadcaster.event.form.close);
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
        
}]);
