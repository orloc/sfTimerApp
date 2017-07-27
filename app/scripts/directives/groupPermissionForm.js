'use strict';

angular.module('sfTimer')
    .directive('groupPermissionForm', ['dataProvider', 'eventBroadcaster', '$interval',
    function(dataProvider, eventBroadcaster, $interval){
    return {
        templateUrl: 'views/directives/groupPermissionForm.html',
        scope: {
            existingGroup: '='
        }, 
        controller: ['$scope', function($scope){
            
            $scope.user_access = [];
            $scope.submit = function(){
                console.log('hi');
            };
        }]
    };
}]);