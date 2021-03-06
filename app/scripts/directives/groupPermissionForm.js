'use strict';

angular.module('sfTimer')
    .directive('groupPermissionForm', ['dataProvider', 'eventBroadcaster', '$interval',
        function (dataProvider, eventBroadcaster, $interval) {
            return {
                templateUrl: 'views/directives/groupPermissionForm.html',
                scope: {
                    existingGroup: '='
                },
                controller: ['$scope', function ($scope) {
                    $scope.permissions = [
                        {name: 'OWNER'},
                       // {name: 'READ'},
                        //{name: 'WRITE'}
                    ];

                    $scope.user_access = [];
                    $scope.formData = {};
                    $scope.error = false;

                    updateAccess();

                    $scope.submit = function () {
                        $scope.error = false;
                        $scope.formData.group_id = $scope.existingGroup.id;
                        dataProvider.createInvitation($scope.formData)
                            .then(function (data) {
                                // needs API to implement message mapping prior to puehes.
                                updateAccess();
                            }).catch(function (err) {
                            $scope.error = err.message;
                        });
                    };
                    
                    function updateAccess(){
                        dataProvider.getGroupMembers($scope.existingGroup)
                        .then(function (members) {
                            $scope.user_access = members;
                        });
                    }
                }]
            };
        }]);