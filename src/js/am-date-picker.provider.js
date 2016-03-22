(function () {
    'use strict';

    angular
        .module('am.date-picker')
        .provider('amDatePickerConfig', amDatePickerConfig);

    amDatePickerConfig.$inject = ['OPTIONS'];

    function amDatePickerConfig(OPTIONS) {
        var config = this;
        config.allowClear = true;
        config.backButtonText = "Back";
        config.inputDateFormat = 'LL';
        config.maxYear = 2020;
        config.minYear = 1920;
        config.locale = 'en';
        config.popupDateFormat = 'ddd, MMM D';
        config.showInputIcon = false;

        /* Icons */
        config.calendarIcon = '/dist/images/icons/ic_today_24px.svg';
        config.clearIcon = '/dist/images/icons/ic_close_24px.svg';
        config.nextIcon = '/dist/images/icons/ic_chevron_right_18px.svg';
        config.prevIcon = '/dist/images/icons/ic_chevron_left_18px.svg';

        config.setIcons = function(icons) {
            for (var key in icons) {
                config[key] = icons[key];
            }
        }

        config.setOptions = function(options) {
            for (var key in options) {
                config[key] = options[key];
            }
         }

        this.$get = function () {
            return new amDatePickerService(OPTIONS, config);
        };

    }


    function amDatePickerService(properties, config){
        for(var property in properties){
            createProperty(this, properties[property], config[properties[property]]);
        }

        function createProperty(obj, name, value){
            Object.defineProperty(obj, name, {
                __proto__: null,
                get: function(){
                    return value;
                }
            });
        }
    }

})();
