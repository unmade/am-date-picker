angular
    .module('am.date-picker', ['ngMaterial', 'ngAnimate'])
    .directive('amDatePicker', amDatePickerDirective)
    .provider('amDatePickerConfig', amDatePickerConfigProvider)
    .controller('amDatePickerDialog', DialogController);
