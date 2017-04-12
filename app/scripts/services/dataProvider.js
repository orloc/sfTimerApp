'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', 'apiConfig', '$q', function($http, apiConfig, $q){
    
    this.login = function(data){
        return $http.post([apiConfig.baseUrl, 'login'].join('/'), data)
            .then(function(response) {
                return $q.resolve(response.data);
            }, function(err){
                return $q.reject(err);
            });
    };

    this.getAllTimers = function(){
        return $http.get(getResourceUrl('timer/'))
            .then(function (response) {
                return $q.resolve(response.data); 
            });
    };
    
    this.createTimer = function(data) {
        return $http.post(getResourceUrl('timer/'), data);
    };

    this.removeTimer = function(label) {
        return $http.delete(getResourceUrl('timer/' + label.replace(' ','_')));
    };
    
    function getResourceUrl(resource){
        return [apiConfig.baseUrl, apiConfig.apiVersion, resource].join('/');
    }
    
    
}]);
