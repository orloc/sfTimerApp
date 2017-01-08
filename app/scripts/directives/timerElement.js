'use strict';

angular.module('sfTimer').directive('timerElement', [function(){
    return {
        templateUrl: 'views/directives/timerElementTemplate.html',
        scope: {
            timerConfig: '='
        },
        controller: ['$scope', function($scope){
            var localConfig = $scope.timerConfig;
            var momentDuration = getDuration(localConfig.duration);
            var desiredTime = moment(localConfig.start_time).add(momentDuration);
            
            $scope.durationMilliseconds = desiredTime.diff(localConfig.start_time, 'seconds');
            $scope.timerRunning = false;
            
            $scope.togglePause = function(){
                if ($scope.timerRunning){
                    $scope.$broadcast('timer-stop');
                    $scope.timerRunning = false;
                    return;
                }
                
                $scope.$broadcast('timer-start');
                $scope.$emit('eqt-start-timer', localConfig);
                $scope.timerRunning = true;
            };

            $scope.resetTimer = function(){
                $scope.$broadcast('timer-reset');
                $scope.$broadcast('timer-start');
                $scope.timerRunning = true;
            };
            
            $scope.removeTimer = function(){
                $scope.$emit('eqt-remove-timer', localConfig);
            };

            $scope.getRemainingTime = function(time){
                if (time > 60) {
                    return Math.floor(time/60)+'m'+(time%60)+'s';
                }
                return time%60+'s';
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
        }]
    };
}]);