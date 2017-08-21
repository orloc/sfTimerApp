
angular.module('sfTimer')
.controller('sideBarCtrl', ['$scope', 'dataProvider', 'eventBroadcaster','socket',
    function($scope, dataProvider, eventBroadcaster, socket) {
    
    $scope.groups = [];
    $scope.activeGroup = null;
    $scope.activeForm = false;
    $scope.forms = {
        addGroup: 'addGroup',
        editGroup: 'editGroup',
        managePermissions: 'groupPerms',
        addTimer: 'addTimer',
        deleteGroup: 'deleteGroup'
    };

    dataProvider.getTimerGroups()
        .then(function(groups) {
            $scope.groups = groups;
        }).catch(function(err){
        console.log(err);
    });
        
    $scope.$on(eventBroadcaster.event.form.close, function(){
        $scope.activeForm = null;
    });

    $scope.$on(eventBroadcaster.event.timerGroup.create, function(e, data){
        $scope.groups.push(data);
    });

    $scope.$on(eventBroadcaster.event.timerGroup.delete, deleteGroup);
    $scope.$on(eventBroadcaster.event.timerGroup.update, updateGroup);
        
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
        
    function deleteGroup(e, data){
        var i = 0;
        for (i ; i < $scope.groups.length; i++){
            if (parseInt($scope.groups[i].id) === parseInt(data.id)){
                break;
            }
        }

        $scope.groups = $scope.groups.slice(0, i)
        .concat($scope.groups.slice(i+1));

        if ($scope.activeGroup.id === data.id){
            $scope.activeGroup = null;
        }
    }
    
    function updateGroup(e, data){
        for(var i = 0; i < $scope.groups.length; i++){
            if ($scope.groups[i].id === data.id){
                $scope.groups[i] = data;
                $scope.activeGroup = data;
                break;
            }
        }
    }

    var events = socket.events;
        
    socket.on(events.update, function(data){
        if (!shouldRecognizeEvent(data)) return;
        var object = data.payload;
        updateGroup(null, object);
    });

    socket.on(events.delete, function(data){
        if (!shouldRecognizeEvent(data, true)) return;
        var object = data.payload;
        deleteGroup(null,object);
    });

    function shouldRecognizeEvent(data) {
        return data.entity === 'timergroup';
    }
}]);
