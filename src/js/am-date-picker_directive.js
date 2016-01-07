(function()
{
    'use strict';

    angular
        .module('am.date-picker', ['ngMaterial'])
        .directive('amDatePicker', amDatePicker)
        .provider('amDatePickerConfig', amDatePickerConfig);


    function amDatePickerConfig() {
        var config = this;
        config.allowClear = true;
        config.cancelButtonText = "Cancel";
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
            return config;
        };
    }

    function amDatePicker() {
        return {
            restrict: 'AE',
            templateUrl: 'am-date-picker.html',
            scope:
            {
                ngModel: '=',
                allowClear: '=?amAllowClear',
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

    AmDatePickerController.$inject = ['$scope', '$timeout','$mdDialog', 'amDatePickerConfig'];

    function AmDatePickerController($scope, $timeout, $mdDialog, amDatePickerConfig) {
        var amDatePicker = this;

        amDatePicker.clearDate = clearDate;
        amDatePicker.displayYearSelection = displayYearSelection;
        amDatePicker.hideYearSelection = hideYearSelection;
        amDatePicker.previousMonth = previousMonth;
        amDatePicker.nextMonth = nextMonth;
        amDatePicker.select = select;
        amDatePicker.selectYear = selectYear;
        amDatePicker.openPicker = openPicker;
        amDatePicker.today = today;

        amDatePicker.moment = moment;
        amDatePicker.isTodayDisabled = false;
        amDatePicker.yearSelection = false;

        init();

        $scope.$watch(
            "amDatePicker.minDate",
            function(newValue, oldValue) {
                if (newValue > amDatePicker.ngModel) {
                    amDatePicker.select(moment(newValue));
                }
                generateCalendar();
            }
        );

        $scope.$watch(
            "amDatePicker.maxDate",
            function(newValue, oldValue) {
                if (newValue < amDatePicker.ngModel) {
                    amDatePicker.select(moment(newValue));
                }
                generateCalendar();
            }
        );

        function init() {
            var options = ['ngModel', 'allowClear', 'cancelButtonText', 'showInputIcon',
                           'inputLabel', 'maxDate', 'minDate', 'maxYear', 'minYear', 'locale',
                           'inputDateFormat', 'popupDateFormat', 'todayButton',
                           'calendarIcon', 'prevIcon', 'nextIcon', 'clearIcon'];

            for (var i = 0; i < options.length; i++) {
                if (amDatePickerConfig.hasOwnProperty(options[i])) {
                    if (!angular.isDefined(amDatePicker[options[i]]))
                        amDatePicker[options[i]] = amDatePickerConfig[options[i]];
               }
            }

            amDatePicker.moment.locale(amDatePicker.locale);

            amDatePicker.ngModelMoment = angular.isDefined(amDatePicker.ngModel) ?
                moment(angular.copy(amDatePicker.ngModel)) : moment();
            amDatePicker.ngModelMomentFormatted = angular.isDefined(amDatePicker.ngModel) ?
                moment(amDatePicker.ngModel).format(amDatePicker.inputDateFormat) : undefined;
            amDatePicker.days = [];
            amDatePicker.daysOfWeek = [
                moment.weekdaysMin(1),
                moment.weekdaysMin(2),
                moment.weekdaysMin(3),
                moment.weekdaysMin(4),
                moment.weekdaysMin(5),
                moment.weekdaysMin(6),
                moment.weekdaysMin(0)
            ];
            amDatePicker.years = [];

            var minYear = amDatePicker.minYear || 1920,
                maxYear = amDatePicker.maxYear || 2020;

            for (var y = minYear; y <= maxYear; y++) {
                amDatePicker.years.push(y);
            }

            generateCalendar();
        }

        function clearDate() {
            amDatePicker.ngModel = undefined;
            amDatePicker.ngModelMomentFormatted = undefined;
            generateCalendar();
        }

        function DialogController() {
            var dialog = this;
            dialog.model = angular.copy(amDatePicker.ngModel);
            dialog.modelMoment = angular.copy(amDatePicker.ngModelMoment);

            dialog.cancel = cancel;
            dialog.hide = hide;

            function cancel() {
                (dialog.model) ? amDatePicker.select(dialog.modelMoment) : amDatePicker.clearDate();
                $mdDialog.cancel();
            }

            function hide() {
                $mdDialog.hide();
            }
        }

        function displayYearSelection() {
            amDatePicker.yearSelection = true;
            $timeout(function() {
                var yearSelector = angular.element(document.querySelector('.am-date-picker__year-selector')),
                    activeYear = angular.element(document.querySelector('.am-date-picker__year--is-active')),
                    activeYearHeight = activeYear[0].getElementsByTagName('p')[0].offsetHeight;

                yearSelector[0].scrollTop = activeYear[0].offsetTop - yearSelector[0].offsetTop -
                                            yearSelector[0].clientHeight/2 + activeYearHeight/2;
            });
        }

        function generateCalendar() {
            amDatePicker.days = [];
            amDatePicker.emptyFirstDays = [];
            var previousDay = angular.copy(amDatePicker.ngModelMoment).date(0),
                firstDayOfMonth = angular.copy(amDatePicker.ngModelMoment).date(1),
                lastDayOfMonth = angular.copy(firstDayOfMonth).endOf('month'),
                maxDays = angular.copy(lastDayOfMonth).date();

            for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--) {
                amDatePicker.emptyFirstDays.push({});
            }
            for (var j = 0; j < maxDays; j++) {
                var date = angular.copy(previousDay.add(1, 'days'));
                date.selected = angular.isDefined(amDatePicker.ngModel) && date.isSame(amDatePicker.ngModel, 'day');
                date.today = date.isSame(moment(), 'day');
                if (angular.isDefined(amDatePicker.minDate) && date.toDate() < amDatePicker.minDate) {
                    date.disabled = true;
                }
                if (angular.isDefined(amDatePicker.maxDate) && date.toDate() > amDatePicker.maxDate) {
                    date.disabled = true;
                }
                amDatePicker.days.push(date);
            }
            amDatePicker.isTodayDisabled = (angular.isDefined(amDatePicker.minDate) &&
                                            moment().toDate() < amDatePicker.minDate ||
                                            angular.isDefined(amDatePicker.maxDate) &&
                                            moment().toDate() > amDatePicker.maxDate)
        }

        function hideYearSelection() {
            amDatePicker.yearSelection = false;
        }

        function nextMonth() {
            amDatePicker.ngModelMoment = amDatePicker.ngModelMoment.add(1, 'month');
            generateCalendar();
        }

        function openPicker(ev) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: DialogController,
                controllerAs: 'dialog',
                onRemoving: hideYearSelection,
                parent: angular.element(document.body),
                scope: $scope.$new(),
                targetEvent: ev,
                templateUrl: 'am-date-picker_content.tmpl.html'
            });
        }

        function previousMonth() {
            amDatePicker.ngModelMoment = amDatePicker.ngModelMoment.subtract(1, 'month');
            generateCalendar();
        }

        function today() {
            var today = moment();
            amDatePicker.ngModel = today.toDate();
            amDatePicker.ngModelMoment = angular.copy(today);
            amDatePicker.ngModelMomentFormatted = today.format(amDatePicker.inputDateFormat);
            if (amDatePicker.yearSelection) { amDatePicker.hideYearSelection(); }

            generateCalendar();
        }

        function select(_day) {
            if (!_day.disabled) {
                amDatePicker.ngModel = _day.toDate();
                amDatePicker.ngModelMoment = angular.copy(_day);
                amDatePicker.ngModelMomentFormatted = _day.format(amDatePicker.inputDateFormat);

                generateCalendar();
            }
        }

        function selectYear(_year) {
            amDatePicker.yearSelection = false;
            amDatePicker.ngModelMoment = amDatePicker.ngModelMoment.year(_year);

            generateCalendar();
        }

    }
})();
