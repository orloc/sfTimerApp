
angular.module('sfTimer')
.controller('sideBarCtrl', ['$scope', 'dataProvider', 'eventBroadcaster',
    function($scope, dataProvider, eventBroadcaster) {
    
    $scope.groups = [];
    $scope.activeGroup = null;
    $scope.activeForm = false;
    $scope.forms = {
        addGroup: 'addGroup',
        editGroup: 'editGroup',
        addTimer: 'addTimer',
        deleteGroup: 'deleteGroup'
    };

    dataProvider.getTimerGroups()
        .then(function(times) {
            $scope.groups = times;
        }).catch(function(err){
        console.log(err);
    });
        
    $scope.$on(eventBroadcaster.event.form.close, function(){
        $scope.activeForm = null;
    });

    $scope.$on(eventBroadcaster.event.timerGroup.create, function(e, data){
        console.log(data);
        $scope.groups.push(data);
    });

    $scope.$on(eventBroadcaster.event.timerGroup.delete, function(e, data){
        var i = 0;
        for (i ; i < $scope.groups.length; i++){
            if ($scope.groups[i].id === data.id){
                break;
            }
        }
        
        $scope.groups = $scope.groups.slice(0, i)
            .concat($scope.groups.slice(i+1));

        $scope.activeGroup = null;
    });

    $scope.$on(eventBroadcaster.event.timerGroup.update, function(e, data){
        for(var i = 0; i < $scope.groups.length; i++){
           if ($scope.groups[i].id === data.id){
                $scope.groups[i] = data; 
                $scope.activeGroup = data;
               break;
           }
        }
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
