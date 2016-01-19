function amDatePickerDirective() {
    return {
        restrict: 'AE',
        templateUrl: 'am-date-picker.html',
        bindToController:
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
        scope: {},
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

        $scope.$watch(function () { return amDatePicker.minDate; }, function (newValue, oldValue) {
            if(newValue && amDatePicker.Date){
                var minDate = moment(newValue),
                    currentDate = moment(amDatePicker.Date);
                if(currentDate.isBefore(minDate, 'day')){
                    amDatePicker.Date = minDate.toDate();
                    amDatePicker.value = minDate.format(amDatePicker.inputDateFormat);
                }
            }
        });

        $scope.$watch(function () { return amDatePicker.maxDate; }, function (newValue, oldValue) {
            if(newValue && amDatePicker.Date){
                var maxDate = moment(newValue),
                    currentDate = moment(amDatePicker.Date);
                if(currentDate.isAfter(maxDate, 'day')){
                    amDatePicker.Date = maxDate.toDate();
                    amDatePicker.value = maxDate.format(amDatePicker.inputDateFormat);
                }
            }
        });
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
