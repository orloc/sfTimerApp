
angular.module('sfTimer')
.controller('invitationCtrl', ['$scope', 'dataProvider', 'socket','securityManager','eventBroadcaster',
    function($scope, dataProvider, socket, securityManager, eventBroadcaster) {
        $scope.loaded = false;
        $scope.settingData = {};

        $scope.invitations = [];
        $scope.completed = [];
        $scope.delete = [];

        $scope.statuses = {
            NEW: 0,
            APPROVED: 1,
            REJECTED: 2
        };
        
        $scope.getStatus = function(status){
            switch(parseInt(status)){
                case $scope.statuses.NEW: return 'New';
                case $scope.statuses.APPROVED: return 'Approved';
                case $scope.statuses.REJECTED: return 'Rejected';
                default: return 'N/A';
            }
        };

        dataProvider.getMyInvitations().then(mapInvitations);
        
        $scope.approve = function(invitation){
            invitation.status = $scope.statuses.APPROVED;
            doUpdate(invitation);
        };

        $scope.reject = function(invitation){
            invitation.status = $scope.statuses.REJECTED;
            doUpdate(invitation);
        };

        var events = socket.events;

        socket.on(events.create, function(data){
            if (!shouldRecognizeEvent(data)) return;
            var invites = _.clone($scope.invitations);
            invites.push(data.payload);

            $scope.$apply(function(){
                $scope.invitations = invites;
            });
        });
        
        function mapInvitations(invitations){
            var invites = [];
            var old = [];
            var deleted = [];
            invitations.map(function(inv){
                if (inv.group.deleted_at === null){
                    if (parseInt(inv.status) === $scope.statuses.NEW){
                        invites.push(inv);
                    } else {
                        old.push(inv);
                    }
                } else {
                    deleted.push(inv);
                }
            });

            $scope.invitations = invites;
            $scope.completed = old;
            $scope.deleted = deleted;

            $scope.loaded = true;
        }

        function shouldRecognizeEvent(data) {
            return data.entity === 'invitation'
              && parseInt(data.payload.invitee_id) === parseInt(securityManager.getCurrentUser().id);
        }
        
        function doUpdate(invitation){
            dataProvider.updateInvitation(invitation)
                .then(function(data) {
                    $scope.completed.push(data);
                    $scope.invitations = $scope.invitations.filter(function(item){
                        return item.id !== data.id;
                    });
                    
                    if ($scope.invitations.length === 0){
                        var event = eventBroadcaster.event;
                        eventBroadcaster.broadcast(event.invitation.completed); 
                    }
                });
        }
}]);
