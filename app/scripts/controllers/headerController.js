
angular.module('sfTimer')
.controller('headerCtrl', ['$scope', 'securityManager', 'dataProvider', 'socket', 'eventBroadcaster',
    function($scope, securityManager, dataProvider, socket, eventBroadcaster) {
        $scope.currentUser = securityManager.getCurrentUser;
        
        $scope.logout = securityManager.logout;
        $scope.hasInvitations = false;
        
        dataProvider.checkInvitations()
        .then(function(data) {
            $scope.hasInvitations = data.has_invitations;
        });
        
        $scope.$on(eventBroadcaster.event.invitation.completed, function(){
            $scope.hasInvitations = false;
        });

        var events = socket.events;

        socket.on(events.create, function(data){
            if (!shouldRecognizeEvent(data)) return;
            $scope.hasInvitations = true;
        });

        function shouldRecognizeEvent(data) {
            return data.entity === 'invitation'
              && parseInt(data.payload.invitee_id) === parseInt($scope.currentUser().id);
        }
}]);
