'use strict';

angular.module('sfTimer').directive('timerElement', [function(){
    return {
        templateUrl: 'views/directives/timerElementTemplate.html',
        scope: {
            timerConfig: '='
        },
        controller: ['$scope', '$rootScope', 'SFTimerEvents', 'webNotification', function($scope, $rootScope, SFTimerEvents, webNotification){
            var localConfig = $scope.timerConfig;
            var momentDuration = getDuration(localConfig.duration);
            var desiredTime = moment(localConfig.start_time).add(momentDuration);

            var timerEvents = {
                START: 'timer-start',
                STOP: 'timer-stop',
                RESET: 'timer-reset',
                RESUME: 'timer-resume',
                TIMER_STOPPED: 'timer-stopped',
                TICK: 'timer-tick'
            };
            
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
            $scope.timerRunning = false;
            $scope.hasStopped = false;
            $scope.isPaused = false;
            $scope.noShake = false;
            $scope.status = null;

            $scope.statuses = {
                BEGUN: 1,
                HALF: 2,
                ENDING: 3
            };

            $scope.$on(timerEvents.TIMER_STOPPED, function (e, val) {
                $scope.timerRunning = false;
                $scope.isPaused = false;
                $scope.hasStopped = true;
                $scope.noShake = false;
                
                /*
                webNotification.showNotification('Timer Expired!', {
                    body: localConfig.label +'\'s timer has stopped!',
                    icon: 'my-icon.ico',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 15000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');
                    }
                });
                */
            });

            $scope.$on(timerEvents.TICK, function (event, data) {
                var statuses = $scope.statuses;
                var percentDone = Math.floor((data.millis / ($scope.durationSeconds * 1000)) * 100);

                if (percentDone === 100) return statuses.BEGUN;
                
                $scope.status = (function(){
                    if (percentDone >= 50) return statuses.BEGUN;
                    if (percentDone < 50 && percentDone > 15) return statuses.HALF;
                    return statuses.ENDING;
                })();
                
                console.log($scope.status);
            });

            $scope.pause = function(){
                $scope.$broadcast(timerEvents.STOP);
                $scope.isPaused = true;
                $scope.timerRunning = false;
            };

            $scope.start = function(){
                $scope.timerRunning = true;
                $scope.isPaused = false;
                $scope.$broadcast(timerEvents.START);
            };

            $scope.resetTimer = function(){
                $scope.$broadcast(timerEvents.RESET);
                $scope.timerRunning = false;
                $scope.isPaused = false;
            };

            
            $scope.removeTimer = function(){
                $scope.$emit(SFTimerEvents.REMOVE_TIMER, localConfig);
            };

            $scope.getRemainingTime = function(time){
                if (time > 60) {
                    return Math.floor(time/60)+'m'+(time%60)+'s';
                }
                return time%60+'s';
            };

            $scope.acknowledge = function(){
                if (!$scope.hasStopped) return;
                $scope.noShake = true;
            };
        }]
    };
}]);