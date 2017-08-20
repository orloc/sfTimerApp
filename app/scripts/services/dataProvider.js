'use strict';

angular.module('sfTimer')
.service('dataProvider', ['$http', 'apiConfig', '$q', function($http, apiConfig, $q){
    
    this.login = function(data){
        return $http.post([apiConfig.baseUrl, 'login'].join('/'), data)
            .then(function(response) {
                return $q.resolve(response.data);
            }).catch(function(err){
                return $q.reject(err.data);
            });
    };

    this.register = function(data){
        return $http.post([apiConfig.baseUrl, 'register'].join('/'), data)
            .then(function(response) {
                return $q.resolve(response.data);
            }).catch(function(err){
                return $q.reject(err.data);
            });
    };

    // invitations
    this.createInvitation = function(invitation){
        return $http.post(getResourceUrl('invitation'), invitation)
            .then(function (response) {
                return $q.resolve(response.data);
            }, function(err){
                return $q.reject(err.data);
            });
    };
    
    this.getMyInvitations = function(){
        return $http.get(getResourceUrl('invitation'))
            .then(function (response) {
                return $q.resolve(response.data);
            }, function(err){
                return $q.reject(err.data);
            });
    };

    this.checkInvitations = function(){
        return $http.get(getResourceUrl('invitation/check'))
            .then(function (response) {
                return $q.resolve(response.data);
            }, function(err){
                return $q.reject(err.data);
            });
    };

    this.updateInvitation = function(invitation){
        var payload  = {
            status: invitation.status === 1 ? 'APPROVED' : (invitation.status === 2 ? 'REJECTED': null)
        };
        
        return $http.patch(getResourceUrl(['invitation', invitation.id].join('/')), payload)
            .then(function (response) {
                return $q.resolve(response.data);
            }, function(err){
                return $q.reject(err.data);
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
    this.getTimerGroups = function(){
        return $http.get(getResourceUrl('timergroup'))
            .then(function (response) {
                return $q.resolve(response.data);
            });
    };
    
    this.updateTimerGroup = function(group, data){
        var path = ['timergroup', group.id].join('/');
        return $http.patch(getResourceUrl(path), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    this.getGroupMembers = function(group){
        return $http.get(getResourceUrl("timergroup/member?group_id="+group.id))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.createTimerGroup = function(data){
        return $http.post(getResourceUrl('timergroup'), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    this.deleteTimerGroup = function(group){
        var path = ['timergroup', group.id].join('/');
        return $http.delete(getResourceUrl(path))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.getTimersByGroup = function(group){
        var path = ['timergroup', group.id, 'timer'].join('/');
        return $http.get(getResourceUrl(path))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    // Timers
    this.createTimer = function(data) {
        var path = ['timergroup', data.timer_group_id, 'timer'].join('/');
        return $http.post(getResourceUrl(path), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    this.updateTimer = function(data){
        var path = ['timergroup', data.timer_group_id, 'timer', data.id].join('/');
        return $http.patch(getResourceUrl(path), data)
            .then(function(data){
                return $q.resolve(data.data);
            });
    };

    this.removeTimer = function(timer) {
        var path = ['timergroup', timer.timer_group_id, 'timer', timer.id].join('/');
        return $http.delete(getResourceUrl(path))
            .then(function(data){
                return $q.resolve(data.data);
            });
    };
    
    function getResourceUrl(resource){
        return [apiConfig.baseUrl, apiConfig.apiVersion, resource].join('/');
    }
}]);
