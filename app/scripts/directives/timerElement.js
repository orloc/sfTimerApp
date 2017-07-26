'use strict';

angular.module('sfTimer').directive('timerElement', ['eventBroadcaster', function(eventBroadcaster){
    return {
        templateUrl: 'views/directives/timerElementTemplate.html',
        scope: {
            timerConfig: '='
        },
        controller: ['$scope', function($scope){
            $scope.hasStopped = false;
            $scope.status = 0;
            $scope.progressStatus = '';
            $scope.timer = _.clone($scope.timerConfig);
            $scope.classArr = [
                'progress-bar-info',
                'progress-bar-warning',
                'progress-bar-danger'
            ];

            var timerEvents = {
                START: 'timer-start',
                STOP: 'timer-stop',
                RESET: 'timer-reset',
                RESUME: 'timer-resume',
                TIMER_STOPPED: 'timer-stopped',
                TICK: 'timer-tick'
            };


            $scope.statuses = {
                BEGUN: 1,
                HALF: 2,
                ENDING: 3
            };

            $scope.getDuration = function (durationString){
                return moment.duration(_.reduce(formatDuration(durationString), function(old, item) {
                    old[item.unit] = item.value;
                    return old;
                }, {}));
            };

            $scope.getDesiredTime = function(timer){
                var momentDuration = $scope.getDuration(timer.duration);
                var initialTime = timer.start_time ? moment(timer.start_time): moment();
                if (timer.last_tick  && !timer.running){
                    var diff = moment(timer.last_tick).diff(initialTime);
                    momentDuration = momentDuration.subtract(diff, 'ms');
                    return momentDuration.asSeconds();
                }
                return  initialTime.add(momentDuration).diff(moment(), 'seconds');
            };

            $scope.getRemainingTime = function(time){
                if (typeof time === 'undefined' || time < 0) return 0+'s';
                if (time >= 60) {
                    return Math.floor(time/60)+'m'+(time%60)+'s';
                }
                return time%60+'s';
            };
            
            $scope.getProgress = function(progress, countdown){
                if ($scope.hasStopped && typeof progress === 'undefined'){
                    return 100;
                }
                return progress;
            };
            
            $scope.setTimerStopped = function(){
                $scope.hasStopped = true;
                $scope.timer.running = false;
            };
            
            $scope.updateStatus = function(data){
                $scope.status = getStatus($scope.statuses, data, $scope.durationSeconds);
                $scope.progressStatus = $scope.classArr[$scope.status-1];
            };


            $scope.$on(timerEvents.TIMER_STOPPED, function(){
                $scope.timer.running = false;
            });

            $scope.$on(timerEvents.TICK, function(e, data){
                eventBroadcaster.broadcast(eventBroadcaster.event.timer.tick, {
                    timer: $scope.timer, milliseconds: data.millis
                });

                $scope.updateStatus(data);

                if (data.millis === 0){
                    $scope.setTimerStopped();
                }
            });

            $scope.pause = function(){
                $scope.timer.running = false;
                eventBroadcaster.broadcast(eventBroadcaster.event.timer.paused, $scope.timer);
                $scope.$broadcast(timerEvents.STOP);
            };

            $scope.start = function(){
                $scope.timer.running = true;
                eventBroadcaster.broadcast(eventBroadcaster.event.timer.started, $scope.timer);
                $scope.$broadcast(timerEvents.START);
            };

            $scope.removeTimer = function(){
                $scope.$emit(eventBroadcaster.event.timer.delete, $scope.timer);
            };

            $scope.resetTimer = function(){
                eventBroadcaster.broadcast(eventBroadcaster.event.timer.reset, $scope.timer);
                $scope.$broadcast('timer-reset');
            };
            // Body

            $scope.durationSeconds = $scope.getDesiredTime($scope.timer);

            if ($scope.durationSeconds <= 0 && $scope.timer.running){
                $scope.setTimerStopped();
                $scope.updateStatus(false);
            }

            function getStatus(statuses, data, duration){
                var percentDone;
                switch (data){
                    case true:
                        percentDone = 100;
                        break;
                    case false:
                        percentDone = 0;
                        break;
                    default:
                        percentDone = Math.ceil((data.millis / (duration * 1000)) * 100);
                }

                if (percentDone === 100) return statuses.BEGUN;

                return (function(){
                    if (percentDone >= 50) return statuses.BEGUN;
                    if (percentDone < 50 && percentDone > 15) return statuses.HALF;
                    return statuses.ENDING;
                })();
            }

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

        }],
        link : function(scope, elem, attr){
            if (!scope.hasStopped && scope.timer.running === 1){
                scope.start();
            }

        }
    };
}]);