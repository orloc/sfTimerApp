
angular.module('sfTimer')
.controller('userSettingsCtrl', ['$scope', 'dataProvider',
    function($scope, dataProvider) {
        $scope.loaded = false;
        $scope.settingData = {};
        $scope.resetData = {}; 
        
        dataProvider.getMe()
            .then(function(user){
                updateUser(user);
                $scope.loaded = true;
            });
        
        $scope.confirmPassword = function(){
            
        };
        
        $scope.submitSettings = function(){
            $scope.loaded = false;
            dataProvider.updateMe($scope.settingData)
                .then(function(resp){
                    updateUser(resp);
                    $scope.loaded = true;
                });
            
        };
        
        function updateUser(data){
            $scope.settingData = Object.assign({}, $scope.settingData, {
                id : data.id,
                email: data.email,
                profile_name: data.profile_name
            });
        }
}]);
