'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', 'apiConfig', '$q', function($http, apiConfig, $q){
    
    
    this.getAllTimers = function(){
        return $http.get(getResourceUrl('timer'))
            .then(function (response) {
                return $q.resolve(response.data); 
            });
    };
    
    this.createTimer = function(data) {
        return $http.post(getResourceUrl('timer'), data);
    };
    
    function getResourceUrl(resource){
        return [apiConfig.baseUrl, apiConfig.apiVersion, resource].join('/');
    }
    
    
}]);
