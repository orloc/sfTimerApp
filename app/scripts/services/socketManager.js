'use strict';
angular.module('sfTimer')
.service('socket', [ '$rootScope', '$interval', function ($rootScope, $interval) {
    var socket;
    var self = this;
    $rootScope.socket_connected = false;
    self.socket_connected = false;
        
    try {
        socket = io.connect('http://162.243.58.183:3000');
        syncState(true);
    } catch (e){
        $interval(function(){
            socket = io.connect('http://162.243.58.183:3000');
        }, 3000).then(function(){
            console.log(socket, 'here');
        });
    }

    this.on = function(eventName, callback){
        if (!socket) return;
        socket.on(eventName, callback);
    };

    this.emit = function(eventName, data, callback){
        if (!socket) return;
        socket.emit(eventName, data);
    };
    
    function syncState(state){
        $rootScope.socket_connected = state;
        self.socket_connected = state;
    }
}]);