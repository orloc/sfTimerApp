'use strict';

angular.module('sfTimer').directive('timerButton', [function(){
    return {
        templateUrl: 'views/directives/timeButtonTemplate.html',
        scope: {
            duration: '@duration',
        },
        controller: ['$scope', function($scope){
            
        }]
    };
}]);