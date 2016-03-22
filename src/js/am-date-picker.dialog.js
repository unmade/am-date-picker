(function() {
    'use strict';

    angular
        .module('am.date-picker')
        .controller('amDatePickerDialogCtrl', DialogController);

    DialogController.$inject = ['$timeout', '$mdDialog'];

    function DialogController($timeout, $mdDialog) {
        var dialog = this,
            delay = 110;

        dialog.cancel = cancel;
        dialog.displayYearSelection = displayYearSelection;
        dialog.hide = hide;
        dialog.hideYearSelection = hideYearSelection;
        dialog.previousMonth = previousMonth;
        dialog.nextMonth = nextMonth;
        dialog.select = select;
        dialog.selectYear = selectYear;
        dialog.today = today;

        dialog.monthChanged = true;
        dialog.isTodayDisabled = false;
        dialog.yearSelection = false;

        init();

        function init() {
            var dateMoment = moment(dialog.date || undefined);

            dialog.dateMoment = (isOutOfRange(dateMoment)) ? moment(dialog.minDate || dialog.maxDate) : dateMoment;
            dialog.dateMoment.locale(dialog.locale);
            dialog.isTodayDisabled = isOutOfRange(moment());

            var localeData = moment.localeData(dialog.locale);
            dialog.daysOfWeek = [
                localeData._weekdaysMin[1],
                localeData._weekdaysMin[2],
                localeData._weekdaysMin[3],
                localeData._weekdaysMin[4],
                localeData._weekdaysMin[5],
                localeData._weekdaysMin[6],
                localeData._weekdaysMin[0]
            ];

            dialog.years = [];
            var minYear = dialog.minYear || 1920,
                maxYear = dialog.maxYear || 2020;

            for (var y = minYear; y <= maxYear; y++) {
                dialog.years.push(y);
            }

            generateCalendar();
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function displayYearSelection() {
            dialog.yearSelection = true;
            $timeout(function() {
                var yearSelector = angular.element(document.querySelector('.am-date-picker__year-selector')),
                    activeYear = angular.element(document.querySelector('.am-date-picker__year--is-active')),
                    activeYearHeight = activeYear[0].offsetHeight;

                yearSelector[0].scrollTop = activeYear[0].offsetTop - yearSelector[0].offsetTop -
                                            yearSelector[0].clientHeight/2 + activeYearHeight/2;
            });
        }

        function generateCalendar() {
            var previousDay = dialog.dateMoment.clone().date(0),
                cloneMoment = dialog.dateMoment.clone(),
                firstDayOfMonth = cloneMoment.date(1).day(),
                maxDays = cloneMoment.endOf('month').date(),
                today = new Date(),
                date;

            dialog.dateMoment.disabled = isOutOfRange(dialog.dateMoment);
            dialog.days = [];
            dialog.emptyFirstDays = [];

            for (var i = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; i > 0; i--) {
                dialog.emptyFirstDays.push({});
            }
            for (var j = 0; j < maxDays; j++) {
                date = previousDay.add(1, 'days').clone();
                date.disabled = isOutOfRange(date);
                date.selected = moment.isMoment(dialog.dateMoment) &&
                    date.isSame(dialog.dateMoment, 'day') && !date.disabled;
                date.today = date.isSame(moment(), 'day');

                dialog.days.push(date);
            }
        }

        function hide() {
            $mdDialog.hide(dialog.dateMoment.toDate());
        }

        function hideYearSelection() {
            dialog.yearSelection = false;
        }

        function isOutOfRange(dateMoment) {
            return angular.isDate(dialog.minDate) && dateMoment.isBefore(dialog.minDate, 'day') ||
                   angular.isDate(dialog.maxDate) && dateMoment.isAfter(dialog.maxDate, 'day');
        }

        function nextMonth() {
            dialog.dateMoment.add(1, 'month');
            generateCalendar();
            onNextMonth();
        }

        function onNextMonth() {
            dialog.monthChanged = false;
            dialog.next = true;
            $timeout(function() {
                dialog.monthChanged = true;
            }, delay);
        }

        function onPrevMonth() {
            dialog.next = false;
            dialog.monthChanged = false;
            $timeout(function() {
                dialog.monthChanged = true;
            }, delay);
        }

        function previousMonth() {
            dialog.dateMoment.subtract(1, 'month');
            generateCalendar();
            onPrevMonth();
        }

        function today() {
            if (dialog.yearSelection) { dialog.hideYearSelection(); }
            dialog.select((dialog.locale) ? moment().locale(dialog.locale) : moment());
        }

        function select(_day) {
            if (_day.disabled) return;
            dialog.dateMoment = _day;
            generateCalendar();
        }

        function selectYear(_year) {
            dialog.hideYearSelection();
            select(dialog.dateMoment.year(_year));
            generateCalendar();
        }
    }

})();
