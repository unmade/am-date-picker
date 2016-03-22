(function() {
    'use strict';

    angular
        .module('am.date-picker')
        .directive('amDatePicker', amDatePicker)

    function amDatePicker() {
        return {
            bindToController: true,
            controller: AmDatePickerController,
            controllerAs: 'amDatePicker',
            link: function(scope, element, attr, controllers) {
                var ngModelCtrl = controllers[0],
                    amDatePickerCtrl = controllers[1];
                amDatePickerCtrl.init(ngModelCtrl);
            },
            replace: true,
            require: ['ngModel', 'amDatePicker'],
            restrict: 'AE',
            scope:
            {
                allowClear: '=?amAllowClear',
                backButtonText: '@?amBackButtonText',
                cancelButton: '@?amCancelButton',
                inputDateFormat: '@?amInputDateFormat',
                inputLabel: '@?amInputLabel',
                locale: '@?amLocale',
                maxDate: '=?amMaxDate',
                minDate: '=?amMinDate',
                maxYear: '=?amMaxYear',
                minYear: '=?amMinYear',
                popupDateFormat: '@?amPopupDateFormat',
                showInputIcon: '=?amShowInputIcon',
                todayButton: '@?amTodayButton'
            },
            templateUrl: 'am-date-picker.html'
        };
    }

    AmDatePickerController.$inject = ['$scope', '$timeout', '$mdDialog', 'OPTIONS', 'amDatePickerConfig'];

    function AmDatePickerController($scope, $timeout, $mdDialog, OPTIONS, amDatePickerConfig) {
        var amDatePicker = this;

        amDatePicker.clearDate = clearDate;
        amDatePicker.init = init;
        amDatePicker.openPicker = openPicker;

        amDatePicker.ngModelCtrl = null;

        $scope.$watch("amDatePicker.minDate", function(newValue, oldValue) {
            var date = amDatePicker.ngModelCtrl.$viewValue,
                dateMoment = moment(date);
            if (date && newValue && dateMoment.isBefore(newValue, 'day')) {
                amDatePicker.ngModelCtrl.$setViewValue(newValue);
                render();
            }
            else {
                updateErrorState();
            }
        });

        $scope.$watch("amDatePicker.maxDate", function(newValue, oldValue) {
            var date = amDatePicker.ngModelCtrl.$viewValue,
                dateMoment = moment(date);
            if (date && newValue && dateMoment.isAfter(newValue, 'day')) {
                amDatePicker.ngModelCtrl.$setViewValue(newValue);
                render();
            }
            else {
                updateErrorState();
            }
        });

        function clearDate() {
            amDatePicker.ngModelCtrl.$setViewValue(undefined);
            render();
        }

        function clearErrorState() {
            ['minDate', 'maxDate', 'valid'].forEach(function(field) {
                amDatePicker.ngModelCtrl.$setValidity(field, true);
            }, amDatePicker);
        }

        function init(ngModelCtrl) {
            amDatePicker.ngModelCtrl = ngModelCtrl;

            ngModelCtrl.$render = render;

            for (var i = 0; i < OPTIONS.length; i++) {
                if (amDatePickerConfig.hasOwnProperty(OPTIONS[i]) &&
                        !angular.isDefined(amDatePicker[OPTIONS[i]])) {
                    amDatePicker[OPTIONS[i]] = amDatePickerConfig[OPTIONS[i]];
                }
            }
        }

        function openPicker(ev) {
            $mdDialog.show({
                bindToController: true,
                controller: 'amDatePickerDialogCtrl',
                controllerAs: 'dialog',
                locals: {
                    backButtonText: amDatePicker.backButtonText,
                    cancelButton: amDatePicker.cancelButton,
                    date: amDatePicker.ngModelCtrl.$viewValue,
                    maxDate: amDatePicker.maxDate,
                    maxYear: amDatePicker.maxYear,
                    minDate: amDatePicker.minDate,
                    minYear: amDatePicker.minYear,
                    nextIcon: amDatePicker.nextIcon,
                    locale: amDatePicker.locale,
                    popupDateFormat: amDatePicker.popupDateFormat,
                    prevIcon: amDatePicker.prevIcon,
                    todayButton: amDatePicker.todayButton
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'am-date-picker_content.tmpl.html'
            }).then(function(selectedDate) {
                amDatePicker.ngModelCtrl.$setViewValue(selectedDate);
                render();
            });
        }

        function render() {
            var date = amDatePicker.ngModelCtrl.$viewValue;;
            amDatePicker.modelMomentFormatted = (angular.isDate(date)) ?
                moment(date).locale(amDatePicker.locale).format(amDatePicker.inputDateFormat) :
                    undefined;
            updateErrorState();
        }

        function updateErrorState() {
            var date = amDatePicker.ngModelCtrl.$viewValue,
                dateMoment,
                isAfter, isBefore;
            clearErrorState();
            if (angular.isDate(date)) {
                dateMoment = moment(date);
                isAfter = dateMoment.isAfter(amDatePicker.minDate, 'day') ||
                          dateMoment.isSame(amDatePicker.minDate, 'day');
                isBefore = dateMoment.isBefore(amDatePicker.maxDate, 'day') ||
                           dateMoment.isSame(amDatePicker.maxDate, 'day');
                amDatePicker.ngModelCtrl.$setValidity('minDate', !moment.isDate(amDatePicker.minDate) || isAfter);
                amDatePicker.ngModelCtrl.$setValidity('maxDate', !moment.isDate(amDatePicker.maxDate) || isBefore);
            }
            else {
                amDatePicker.ngModelCtrl.$setValidity('valid', date == null);
            }
        }
    }

})();
