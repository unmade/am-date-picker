(function()
{
    'use strict';

    angular
        .module('am.date-picker', ['ngMaterial'])
        .directive('amDatePicker', amDatePicker)
        .provider('amDatePickerConfig', amDatePickerConfig);


    function amDatePickerConfig() {
        this.allowClear = true;
        this.inputDateFormat = 'LL';
        this.maxYear = 2020;
        this.minYear = 1920;
        this.locale = 'en';
        this.popupDateFormat = 'ddd, MMM D';
        this.showInputIcon = false;

        /* Icons */
        this.calendarIcon = '/dist/images/icons/ic_today_24px.svg';
        this.clearIcon = '/dist/images/icons/ic_close_24px.svg';
        this.nextIcon = '/dist/images/icons/ic_chevron_right_18px.svg';
        this.prevIcon = '/dist/images/icons/ic_chevron_left_18px.svg';

        this.setIcons = function(icons) {
            for (var key in icons) {
                this[key] = icons[key];
            }
        }

        this.setOptions = function(options) {
            for (var key in options) {
                this[key] = options[key];
            }
         }

        this.$get = function () {
            return this;
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
            controller: ['$scope', '$timeout','$mdDialog', 'amDatePickerConfig', AmDatePickerController],
            controllerAs: 'amDatePicker',
            bindToController: true,
            replace: true
        };
    }


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
        amDatePicker.isTodayDisabled = false;

        amDatePicker.moment = moment;
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
            var options = ['ngModel', 'allowClear', 'showInputIcon', 'inputLabel',
                           'maxDate', 'minDate', 'maxYear', 'minYear', 'locale',
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

        function clearDate()
        {
            amDatePicker.ngModel = undefined;
            amDatePicker.ngModelMomentFormatted = undefined;
        }

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
        }

        function displayYearSelection() {
            amDatePicker.yearSelection = true;
            $timeout(function()
            {
                var yearSelector = angular.element(document.querySelector('.am-date-picker__year-selector')),
                    activeYear = angular.element(document.querySelector('.am-date-picker__year--is-active'));

                activeYear[0].scrollIntoView();
                yearSelector[0].scrollByLines(-3);
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
                controller: ['$scope', '$mdDialog', DialogController],
                templateUrl: 'am-date-picker_content.tmpl.html',
                parent: angular.element(document.body),
                scope: $scope.$new(),
                targetEvent: ev,
                clickOutsideToClose: true,
                onRemoving: hideYearSelection
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
