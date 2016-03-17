(function()
{
    'use strict';

    angular
        .module('am.date-picker', ['ngMaterial', 'ngAnimate'])
        .directive('amDatePicker', amDatePicker)
        .provider('amDatePickerConfig', amDatePickerConfig);


    function amDatePickerConfig() {
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
            return new amDatePickerService(config);
        };

    }

    function amDatePickerService(config){
        var properties = ['allowClear', 'backButtonText', 'cancelButton', 'inputLabel',
                          'maxDate', 'minDate', 'maxYear', 'minYear', 'locale',
                          'inputDateFormat', 'popupDateFormat', 'showInputIcon', 'todayButton',
                          'calendarIcon', 'prevIcon', 'nextIcon', 'clearIcon'];
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

    function amDatePicker() {
        return {
            restrict: 'AE',
            templateUrl: 'am-date-picker.html',
            require: ['ngModel', 'amDatePicker'],
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
            link: function(scope, element, attr, controllers) {
                var ngModelCtrl = controllers[0],
                    amDatePickerCtrl = controllers[1];

                amDatePickerCtrl.configureNgModel(ngModelCtrl);
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
        amDatePicker.configureNgModel = configureNgModel;
        amDatePicker.displayYearSelection = displayYearSelection;
        amDatePicker.hideYearSelection = hideYearSelection;
        amDatePicker.previousMonth = previousMonth;
        amDatePicker.nextMonth = nextMonth;
        amDatePicker.select = select;
        amDatePicker.selectYear = selectYear;
        amDatePicker.openPicker = openPicker;
        amDatePicker.today = today;

        amDatePicker.model = null;
        amDatePicker.ngModelCtrl = null;
        amDatePicker.monthChanged = true;
        amDatePicker.isTodayDisabled = false;
        amDatePicker.yearSelection = false;

        var delay = 110;

        $scope.$watch(
            "amDatePicker.minDate",
            function(newValue, oldValue) {
                if (amDatePicker.model
                    && amDatePicker.modelMoment.isBefore(newValue) && newValue) {
                    amDatePicker.select(moment(newValue).locale(amDatePicker.locale));
                    updateModel();
                }
                generateCalendar();
            }
        );

        $scope.$watch(
            "amDatePicker.maxDate",
            function(newValue, oldValue) {
                if (amDatePicker.model
                    && amDatePicker.modelMoment.isAfter(newValue)  && newValue) {
                    amDatePicker.select(moment(newValue).locale(amDatePicker.locale));
                    updateModel();
                }
                generateCalendar();
            }
        );

        function init() {
            var options = ['allowClear', 'backButtonText', 'cancelButton', 'inputLabel',
                           'maxDate', 'minDate', 'maxYear', 'minYear', 'locale',
                           'inputDateFormat', 'popupDateFormat', 'showInputIcon', 'todayButton',
                           'calendarIcon', 'prevIcon', 'nextIcon', 'clearIcon'];

            for (var i = 0; i < options.length; i++) {
                if (amDatePickerConfig.hasOwnProperty(options[i])) {
                    if (!angular.isDefined(amDatePicker[options[i]]))
                        amDatePicker[options[i]] = amDatePickerConfig[options[i]];
               }
            }

            var isDate = angular.isDate(amDatePicker.model);
            amDatePicker.modelMoment = (isDate) ? moment(angular.copy(amDatePicker.model)) : moment();
            amDatePicker.modelMoment.locale(amDatePicker.locale);
            amDatePicker.modelMomentFormatted = (isDate) ? amDatePicker.modelMoment
                .format(amDatePicker.inputDateFormat) : undefined;
            amDatePicker.days = [];

            var localeData = moment.localeData(amDatePicker.locale);
            amDatePicker.daysOfWeek = [
                localeData._weekdaysMin[1],
                localeData._weekdaysMin[2],
                localeData._weekdaysMin[3],
                localeData._weekdaysMin[4],
                localeData._weekdaysMin[5],
                localeData._weekdaysMin[6],
                localeData._weekdaysMin[0]
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
            amDatePicker.ngModelCtrl.$setViewValue(undefined);
            amDatePicker.model = undefined;
            amDatePicker.modelMomentFormatted = undefined;
            generateCalendar();
        }

        function configureNgModel(ngModelCtrl) {
            amDatePicker.ngModelCtrl = ngModelCtrl;

            ngModelCtrl.$render = function() {
                var date = amDatePicker.ngModelCtrl.$viewValue;

                amDatePicker.model = date;
                init();
            }
        }

        function DialogController() {
            var dialog = this,
                modelMoment = angular.copy(amDatePicker.modelMoment);

            dialog.cancel = cancel;
            dialog.hide = hide;

            function cancel() {
                select(modelMoment);
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
            var previousDay = angular.copy(amDatePicker.modelMoment).date(0),
                firstDayOfMonth = angular.copy(amDatePicker.modelMoment).date(1),
                lastDayOfMonth = angular.copy(firstDayOfMonth).endOf('month'),
                maxDays = angular.copy(lastDayOfMonth).date();

            for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--) {
                amDatePicker.emptyFirstDays.push({});
            }
            for (var j = 0; j < maxDays; j++) {
                var date = angular.copy(previousDay.add(1, 'days'));
                date.disabled = (angular.isDate(amDatePicker.minDate) && date.isBefore(amDatePicker.minDate) ||
                                 angular.isDate(amDatePicker.maxDate) && date.isAfter(amDatePicker.maxDate));
                date.selected = angular.isDefined(amDatePicker.modelMoment) &&
                    date.isSame(amDatePicker.modelMoment, 'day') && !date.disabled;
                date.today = date.isSame(moment(), 'day');

                amDatePicker.days.push(date);
            }
            amDatePicker.isTodayDisabled = (angular.isDate(amDatePicker.minDate) &&
                                            moment().toDate() < amDatePicker.minDate ||
                                            angular.isDate(amDatePicker.maxDate) &&
                                            moment().toDate() > amDatePicker.maxDate);
        }

        function hideYearSelection() {
            amDatePicker.yearSelection = false;
        }

        function nextMonth() {
            amDatePicker.modelMoment.add(1, 'month');
            generateCalendar();
            onNextMonth();
        }

        function onNextMonth() {
            amDatePicker.monthChanged = false;
            amDatePicker.next = true;
            $timeout(function() {
                amDatePicker.monthChanged = true;
            }, delay);
        }

        function openPicker(ev) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialog',
                onRemoving: hideYearSelection,
                parent: angular.element(document.body),
                scope: $scope.$new(),
                targetEvent: ev,
                templateUrl: 'am-date-picker_content.tmpl.html'
            }).then(function() {
                updateModel();
            });
        }

        function onPrevMonth() {
            amDatePicker.next = false;
            amDatePicker.monthChanged = false;
            $timeout(function() {
                amDatePicker.monthChanged = true;
            }, delay);
        }

        function previousMonth() {
            amDatePicker.modelMoment.subtract(1, 'month');
            generateCalendar();
            onPrevMonth();
        }

        function today() {
            if (amDatePicker.yearSelection) { amDatePicker.hideYearSelection(); }
            amDatePicker.select(moment().locale(amDatePicker.locale));
        }

        function select(_day) {
            if (_day.disabled) return;
            amDatePicker.modelMoment = angular.copy(_day);
            generateCalendar();
        }

        function selectYear(_year) {
            amDatePicker.hideYearSelection();
            select(amDatePicker.modelMoment.year(_year));
            generateCalendar();
        }

        function updateModel() {
            amDatePicker.model = amDatePicker.modelMoment.toDate()
            amDatePicker.ngModelCtrl.$setViewValue(amDatePicker.model);
            amDatePicker.modelMomentFormatted = amDatePicker.modelMoment.locale(amDatePicker.locale)
                                                                        .format(amDatePicker.inputDateFormat);
        }
    }
})();
