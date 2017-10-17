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
        config.calendarIcon = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTkgM2gtMVYxaC0ydjJIOFYxSDZ2Mkg1Yy0xLjExIDAtMS45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINVY4aDE0djExek03IDEwaDV2NUg3eiIvPjwvc3ZnPg==";
        config.clearIcon = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMnoiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==";
        config.nextIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNNy41IDQuNUw2LjQ0IDUuNTYgOS44OCA5bC0zLjQ0IDMuNDRMNy41IDEzLjUgMTIgOXoiLz48L3N2Zz4=";
        config.prevIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij48cGF0aCBkPSJNMTEuNTYgNS41NkwxMC41IDQuNSA2IDlsNC41IDQuNSAxLjA2LTEuMDZMOC4xMiA5eiIvPjwvc3ZnPg==";

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
