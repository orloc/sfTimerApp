'use strict';
angular.module('sfTimer')
.service('socket', [ 'securityManager', function (securityManager) {
    var socket;
    var self = this;
    self.socket_connected = false;

    this.events = {
        init: 'init',
        create: 'action:create',
        update: 'action:update',
        delete: 'action:delete',
    };
    
    this.connect = function(){
        try {
            if(window.location.host.includes('localhost')) {
                socket = io.connect('http://localhost:3000');
            } else {
                socket = io.connect('http://162.243.58.183:3000');
            }

            this.emit(this.events.init, securityManager.getCurrentUser());
        } catch (e){
            console.error(e.toString());
        }
    };
    
    this.on = function(eventName, callback){
        if (!socket) return;
        socket.on(eventName, callback);
    };

    this.emit = function(eventName, data, callback){
        if (!socket) return;
        socket.emit(eventName, data);
    };
    
}]);