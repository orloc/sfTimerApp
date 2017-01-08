'use strict';
angular.module('sfTimer')
.service('socket', function ($rootScope) {
    var socket = io.connect('http://localhost:3000');
    
    this.on = function(eventName, callback){
        socket.on(eventName, callback);
    };

    this.emit = function(eventName, data, callback){
        socket.emit(eventName, data);
    };
});