'use strict';

angular.module('sfTimer').directive('timerElement', ['eventBroadcaster', function(eventBroadcaster){
    return {
        templateUrl: 'views/directives/timerElementTemplate.html',
        scope: {
            timerConfig: '='
        },
        controller: ['$scope', function($scope){
            var localConfig = $scope.timerConfig;
            var momentDuration = getDuration(localConfig.duration);
            var desiredTime = moment(localConfig.start_time).add(momentDuration);
            
            function trimTime(time, lastUnit){
                var split = time.split(lastUnit);
                return split.length > 1 ? parseInt(split[1]) : parseInt(split[0]);
            }

            function mapToMomentUnits(symbol) {
                switch(symbol){
                    case 'h': return 'hours';
                    case 'm': return 'minutes';
                    case 's': return 'seconds';
                }
            }

            // find h / m / s ( in order )
            // if non 0 - add index to object and remove
            // call again until no more symbols found
            function formatDuration(durationString){
                var sections = [ 'h', 'm', 's'];
                function recurse(string, acc, res){
                    if (!sections[acc]) return res;
                    var subject = string.split(sections[acc]);

                    res.push({
                        unit: mapToMomentUnits(sections[acc]),
                        value: subject.length > 1 ? trimTime(subject[0], sections[acc-1]) : 0
                    });
                    return recurse(string, acc+1, res);
                }

                return recurse(durationString, 0, []);
            }

            function getDuration(durationString){
                return moment.duration(_.reduce(formatDuration(durationString), function(old, item) {
                    old[item.unit] = item.value;
                    return old;
                }, {}));
            }
            
            $scope.durationSeconds = desiredTime.diff(localConfig.start_time, 'seconds');

            $scope.statuses = {
                BEGUN: 1,
                HALF: 2,
                ENDING: 3
            };

        }],
        link : function(scope, elem, attr){
            var timerEvents = {
                START: 'timer-start',
                STOP: 'timer-stop',
                RESET: 'timer-reset',
                RESUME: 'timer-resume',
                TIMER_STOPPED: 'timer-stopped',
                TICK: 'timer-tick'
            };
            
            var classArr = [
                'progress-bar-info',
                'progress-bar-warning',
                'progress-bar-danger'
            ];
            scope.timerRunning = false;
            scope.hasStopped = false;
            scope.status = 0;
            scope.progressStatus = '';

            var localConfig = scope.timerConfig;
            
            scope.$on(timerEvents.TIMER_STOPPED, function(){
                scope.timerRunning = false;
            });
            
            scope.$on(timerEvents.TICK, function (event, data) {
                var statuses = scope.statuses;
                var percentDone = Math.ceil((data.millis / (scope.durationSeconds * 1000)) * 100);

                eventBroadcaster.broadcast(eventBroadcaster.event.timer.tick, {
                    timer: localConfig, milliseconds: data.millis
                });
                
                if (percentDone === 100) return statuses.BEGUN;

                scope.status = (function(){
                    if (percentDone >= 50) return statuses.BEGUN;
                    if (percentDone < 50 && percentDone > 15) return statuses.HALF;
                    return statuses.ENDING;
                })();
                
                scope.progressStatus = classArr[scope.status-1];
                
                
                if (data.millis === 0){
                    scope.$apply(function(){
                        scope.hasStopped = true;
                        scope.timmerRunning = false;
                    });
                }
            });

            scope.pause = function(){
                scope.timerRunning = false;
                eventBroadcaster.broadcast(eventBroadcaster.event.timer.paused, localConfig);
                scope.$broadcast(timerEvents.STOP);
            };

            scope.start = function(){
                scope.timerRunning = true;
                eventBroadcaster.broadcast(eventBroadcaster.event.timer.started, localConfig);
                scope.$broadcast(timerEvents.START);
            };

            scope.resetTimer = function(){
                scope.$broadcast(timerEvents.RESET);
                scope.timerRunning = false;
                scope.hasStopped = false;
            };


            scope.removeTimer = function(){
                scope.$emit(eventBroadcaster.event.timer.delete, localConfig);
            };

            scope.getRemainingTime = function(time){
                if (time > 60) {
                    return Math.floor(time/60)+'m'+(time%60)+'s';
                }
                return time%60+'s';
            };
            
        }
    };
}]);