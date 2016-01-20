DialogController.$inject = ["$mdDialog", "$timeout", "amDatePickerConfig"];
function DialogController($mdDialog, $timeout, amDatePickerConfig) {
    var dialog = this;
    
    dialog.cancel = cancel;
    dialog.hide = hide;
    dialog.displayYearSelection = displayYearSelection;
    dialog.hideYearSelection = hideYearSelection;
    dialog.previousMonth = previousMonth;
    dialog.nextMonth = nextMonth;
    dialog.select = select;
    dialog.selectYear = selectYear;
    dialog.today = today;

    dialog.isTodayDisabled = false;
    dialog.yearSelection = false;
    dialog.change = true;

    var delay = 110;
    var selectedMoment;

    init();


    function init() {
        var options = ['backButtonText', 'cancelButton', 'inputLabel', 'maxYear', 'minYear', 'locale',
            'popupDateFormat', 'todayButton', 'prevIcon', 'nextIcon'];

        for (var i = 0; i < options.length; i++) {
            if (amDatePickerConfig.hasOwnProperty(options[i])) {
                if (!angular.isDefined(dialog[options[i]]))
                    dialog[options[i]] = amDatePickerConfig[options[i]];
            }
        }

        selectedMoment = !!dialog.Date;
        dialog.moment = moment(dialog.Date || new Date());
        dialog.moment.locale(dialog.locale);
        dialog.monthYear = dialog.moment.clone();
        
        //ensure the dialog time frame is within a valid date range
        if(dialog.maxDate && dialog.monthYear.isAfter(dialog.maxDate, 'month')){
            dialog.monthYear = moment(dialog.maxDate);
        }

        if(dialog.minDate && dialog.monthYear.isBefore(dialog.minDate, 'month')){
            dialog.monthYear = moment(dialog.minDate);
        }
        
        dialog.monthYear.locale(dialog.locale);
    
        dialog.days = [];
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

        var minYear = (dialog.minYear || 1920),
            maxYear = dialog.maxYear || 2020;


        if (dialog.minDate) {
            minYear = Math.max(minYear, moment(dialog.minDate).year());
        }
        if (dialog.maxDate) {
            maxYear = Math.min(maxYear, moment(dialog.maxDate).year());
        }

        for (var y = minYear; y <= maxYear; y++) {
            dialog.years.push(y);
        }

        generateCalendar();
    }

    function cancel() {
        $mdDialog.cancel();
    }

    function hide() {
        $mdDialog.hide(selectedMoment ? dialog.moment.toDate() : undefined);
    }

    function displayYearSelection() {
        dialog.yearSelection = true;
        $timeout(function () {
            var yearSelector = angular.element(document.querySelector('.am-date-picker__year-selector')),
                activeYear = angular.element(document.querySelector('.am-date-picker__year--is-active')),
                activeYearHeight = activeYear[0].getElementsByTagName('p')[0].offsetHeight;

            yearSelector[0].scrollTop = activeYear[0].offsetTop - yearSelector[0].offsetTop -
            yearSelector[0].clientHeight / 2 + activeYearHeight / 2;
        });
    }

    function hideYearSelection() {
        dialog.yearSelection = false;
    }

    function nextMonth() {
        if (!dialog.maxDate || dialog.monthYear.isBefore(dialog.maxDate, "month")) {
            dialog.monthYear.add(1, 'month');
            generateCalendar();
            onNextMonth();
        }
    }


    function onNextMonth() {
        dialog.change = false;
        dialog.next = true;
        $timeout(function () {
            dialog.change = true;
        }, delay);
    }

    function onPrevMonth() {
        dialog.next = false;
        dialog.change = false;
        $timeout(function () {
            dialog.change = true;
        }, delay);
    }

    function previousMonth() {
        if (!dialog.minDate || dialog.monthYear.isAfter(dialog.minDate, "month")) {
            dialog.monthYear.subtract(1, 'month');
            generateCalendar();
            onPrevMonth();
        }
    }

    function today() {
        var today = new Date();
        dialog.moment = moment(today);
        dialog.monthYear = moment(today);
        selectedMoment = true;
        dialog.hideYearSelection();

        generateCalendar();
    }

    function select(_day) {
        if (!_day.disabled) {
            dialog.moment = _day;
            dialog.monthYear = angular.copy(_day);
            selectedMoment = true;

            generateCalendar();
        }
    }

    function selectYear(_year) {
        dialog.hideYearSelection();
        dialog.monthYear.year(_year);

        generateCalendar();
    }

    function generateCalendar() {
        dialog.days = [];
        dialog.emptyFirstDays = [];
        var previousDay = dialog.monthYear.clone().date(0),
            firstDayOfMonth = angular.copy(dialog.monthYear).date(1),
            lastDayOfMonth = angular.copy(firstDayOfMonth).endOf('month'),
            maxDays = angular.copy(lastDayOfMonth).date();

        for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--) {
            dialog.emptyFirstDays.push({});
        }
        for (var j = 0; j < maxDays; j++) {
            var date = previousDay.add(1, 'days').clone();
            date.selected = selectedMoment && date.isSame(dialog.moment, 'day');
            date.today = date.isSame(moment(), 'day');
            if (angular.isDefined(dialog.minDate) && date.isBefore(dialog.minDate, 'day')) {
                date.disabled = true;
            }
            if (angular.isDefined(dialog.maxDate) && date.isAfter(dialog.maxDate, 'day')) {
                date.disabled = true;
            }
            dialog.days.push(date);
        }
        dialog.isTodayDisabled = (angular.isDefined(dialog.minDate) &&
            moment().toDate() < dialog.minDate ||
            angular.isDefined(dialog.maxDate) &&
            moment().toDate() > dialog.maxDate);
    }
}    
