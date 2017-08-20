
angular.module('sfTimer')
.controller('invitationCtrl', ['$scope', 'dataProvider',
    function($scope, dataProvider) {
        $scope.loaded = false;
        $scope.settingData = {};

        $scope.invitations = [];
        $scope.completed = [];

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

        dataProvider.getMyInvitations()
            .then(function(invitations){
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
            });
        
        $scope.approve = function(invitation){
            invitation.status = $scope.statuses.APPROVED;
            doUpdate(invitation);
        };

        $scope.reject = function(invitation){
            invitation.status = $scope.statuses.REJECTED;
            doUpdate(invitation);
        };
        
        function doUpdate(invitation){
            dataProvider.updateInvitation(invitation)
                .then(function(data) {
                    $scope.completed.push(data);
                    $scope.invitations = $scope.invitations.filter(function(item){
                        return item.id !== data.id;
                    });
                });
        }
}]);
