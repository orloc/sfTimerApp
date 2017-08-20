
angular.module('sfTimer')
.controller('headerCtrl', ['$scope', 'securityManager', 'dataProvider',
    function($scope, securityManager, dataProvider) {
        $scope.currentUser = securityManager.getCurrentUser;
        
        $scope.logout = securityManager.logout;
        $scope.hasInvitations = false;
        
        dataProvider.checkInvitations()
        .then(function(data) {
            $scope.hasInvitations = data.has_invitations;
        });
        
}]);
