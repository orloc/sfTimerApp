'use strict';

angular.module('sfTimer').directive('timerElement', [function(){
    return {
        templateUrl: 'views/directives/timerElementTemplate.html',
        scope: {
            label: '=',
            duration: '='
        },
        controller: ['$scope', function($scope){
            // find h / m / s ( in order ) 
            // if non 0 - add index to object and remove 
            // call again until no more symbols found

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

            function formatDuration(){
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
                
                return recurse($scope.duration, 0, []);
            }
            
            function getDuration(){
                return moment.duration(_.reduce(formatDuration(), function(old, item) {
                    old[item.unit] = item.value;
                    return old;
                }, {}));;
            }
            
            console.log(getDuration());
            
            $scope.formattedDuration = 500;
        }]
    };
}]);