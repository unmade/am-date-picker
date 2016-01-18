function amDatePickerDirective() {
    return {
        restrict: 'AE',
        templateUrl: 'am-date-picker.html',
        scope:
        {
            Date: "=ngModel",
            allowClear: '=?amAllowClear',
            cancelButton: '@?amCancelButton',
            inputDateFormat: '@?amInputDateFormat',
            inputLabel: '@?amInputLabel',
            maxDate: '=?amMaxDate',
            minDate: '=?amMinDate',
            maxYear: '=?amMaxYear',
            minYear: '=?amMinYear',
            popupDateFormat: '@?amPopupDateFormat',
            showInputIcon: '=?amShowInputIcon',
            todayButton: '@?amTodayButton'
        },
        controller: AmDatePickerController,
        controllerAs: 'amDatePicker',
        bindToController: true,
        replace: true
    };
}

AmDatePickerController.$inject = ['$scope', '$timeout', '$mdDialog', 'amDatePickerConfig'];

function AmDatePickerController($scope, $timeout, $mdDialog, amDatePickerConfig) {
    var amDatePicker = this;

    amDatePicker.clearDate = clearDate;
    amDatePicker.openPicker = openPicker;

    amDatePicker.isTodayDisabled = false;
    amDatePicker.yearSelection = false;
    amDatePicker.change = true;

    init();

    function init() {
        var options = ['backButtonText', 'cancelButton', 'inputLabel', 'maxYear', 'minYear',
            'popupDateFormat', 'todayButton', 'prevIcon', 'nextIcon', 'calendarIcon', 'allowClear',
            'clearIcon', 'showInputIcon', 'inputDateFormat', 'inputLabel', 'locale', 'minDate', 'maxDate'];

        for (var i = 0; i < options.length; i++) {
            if (amDatePickerConfig.hasOwnProperty(options[i])) {
                if (!angular.isDefined(amDatePicker[options[i]]))
                    amDatePicker[options[i]] = amDatePickerConfig[options[i]];
            }
        }
        formatViewValue();
    }

    function formatViewValue() {
        amDatePicker.value = amDatePicker.Date ? moment(amDatePicker.Date).format(amDatePicker.inputDateFormat) : undefined;
    }

    function clearDate() {
        amDatePicker.Date = undefined;
        formatViewValue();
    }

    function openPicker(ev) {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: DialogController,
            controllerAs: 'dialog',
            bindToController: true,
            parent: angular.element(document.body),
            targetEvent: ev,
            templateUrl: 'am-date-picker_content.tmpl.html',
            locals: {
                Date: amDatePicker.Date,
                minDate: amDatePicker.minDate,
                maxDate: amDatePicker.maxDate,
                todayButton: amDatePicker.todayButton,
                cancelButton: amDatePicker.cancelButton,
                backButtonText: amDatePicker.backButtonText
            }
        }).then(function (selectedDate) {
            amDatePicker.Date = selectedDate;
            formatViewValue();
        });
    }
}
