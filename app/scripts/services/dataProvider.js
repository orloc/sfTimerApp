'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', 'apiConfig', '$q', function($http, apiConfig, $q){
    
    this.login = function(data){
        return $http.post([apiConfig.baseUrl, 'login'].join('/'), data)
            .then(function(response) {
                return $q.resolve(response.data);
            }).catch(function(err){
                return $q.reject(err);
            });
    };

    this.getTimerGroups = function(){
        return $http.get(getResourceUrl('timer-group'))
            .then(function (response) {
                return $q.resolve(response.data); 
            }).catch(function(err){
                console.log(err, 'errr')
            });
    };
    
    // Users
    this.getMe = function(){
        return $http.get(getResourceUrl('user/me'))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.updateMe = function(data){
        return $http.patch(getResourceUrl('user'), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    // Groups
    this.updateTimerGroup = function(group, data){
        var path = ['timer-group', group.id].join('/');
        return $http.patch(getResourceUrl(path), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.createTimerGroup = function(data){
        return $http.post(getResourceUrl('timer-group'), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    this.deleteTimerGroup = function(group){
        var path = ['timer-group', group.id].join('/');
        return $http.delete(getResourceUrl(path))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.getTimersByGroup = function(group){
        var path = ['timer-group', group.id, 'timer'].join('/');
        return $http.get(getResourceUrl(path))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    // Timers
    this.createTimer = function(data) {
        var path = ['timer-group', data.timer_group_id, 'timer'].join('/');
        return $http.post(getResourceUrl(path), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    this.updateTimer = function(data){
        var path = ['timer-group', data.timer_group_id, 'timer', data.id].join('/');
        return $http.patch(getResourceUrl(path), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.removeTimer = function(timer) {
        var path = ['timer-group', timer.timer_group_id, 'timer', timer.id].join('/');
        return $http.delete(getResourceUrl(path))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    function getResourceUrl(resource){
        return [apiConfig.baseUrl, apiConfig.apiVersion, resource].join('/');
    }
}]);
