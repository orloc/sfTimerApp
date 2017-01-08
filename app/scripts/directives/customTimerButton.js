'use strict';

angular.module('sfTimer').directive('customTimerButton', ['dataProvider', function(dataProvider){
    return {
        templateUrl: 'views/directives/customTimerButtonTemplate.html',
        controller: ['$scope', function($scope){
            
            $scope.durationPattern = /^(([1-5]?[0-9]){1,2}[h|m|s]){1,3}$/img;
            $scope.formData = {};

            $scope.formError = null;
            $scope.formSuccess = null;
            
            $scope.submit= function(){
                $scope.formError = null;
                $scope.formSuccess = null;
                dataProvider.createTimer($scope.formData)
                    .then(function(data){
                        $scope.formSuccess = true;
                    }, function(err){
                        $scope.formError = err.data.message;
                    });
            };
        }]
    };
}]);