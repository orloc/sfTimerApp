'use strict';

angular.module('sfTimer')
    .service('SFTimerEvents', [ function(dataProvider, $q){
        this.TIMER_CREATED = 'eqt-created-timer';
        this.START_TIMER = 'eqt-start-timer';
        this.RESET_TIMER = 'eqt-reset-timer';
        this.PAUSE_TIMER = 'eqt-pause-timer';
        this.REMOVE_TIMER = 'eqt-remove-timer';
        this.START_SPECIFIC_TIMER = 'eqt-start-specific-timer';
        this.PAUSE_SPECIFIC_TIMER = 'eqt-pause-specific-timer';
        this.RESET_SPECIFIC_TIMER = 'eqt-reset-specific-timer';
    }]);
