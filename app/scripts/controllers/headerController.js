
angular.module('sfTimer')
.controller('headerCtrl', ['$scope', 'securityManager',
    function($scope, securityManager) {
        $scope.currentUser = securityManager.getCurrentUser;
        
        $scope.logout = securityManager.logout;
        
}]);
