'use strict';

describe('am.date-picker directive unit tests', function() {
    var $controller,
        amDatePickerConfigProvider;

    function controllerFactory(controllerName, args, bound) {
        var _args = angular.extend({}, args);
        if (!bound) {
            return $controller(controllerName, args);
        }

        var controllerFn = $controller(controllerName, _args, true);
        angular.extend(controllerFn.instance, bound);
        return controllerFn();
    }

    beforeEach(function(){
        amDatePickerConfigProvider = providerFactory("am.date-picker", "amDatePickerConfigProvider")();
    });

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));


    it('should init dialog controller without date', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                locale: 'ru',
            });

        expect(dialog.dateMoment.isSame(moment(), 'day')).toBe(true);
        expect(dialog.dateMoment.locale()).toEqual('ru');
        expect(dialog.daysOfWeek).toEqual(['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);
        expect(dialog.isTodayDisabled).toBe(false);
        expect(dialog.years[0]).toBe(1920);
        expect(dialog.years[dialog.years.length-1]).toBe(2020);
    });


    it('should init dialog controller with date', function() {
        var date = new Date('1984-01-01'),
            dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                date: date,
                locale: 'en',
                minYear: 1970,
                maxYear: 2000
            });

        expect(dialog.dateMoment.isSame(moment(date), 'day')).toBe(true);
        expect(dialog.dateMoment.locale()).toEqual('en');
        expect(dialog.daysOfWeek).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
        expect(dialog.isTodayDisabled).toBe(false);
        expect(dialog.years[0]).toBe(1970);
        expect(dialog.years[dialog.years.length-1]).toBe(2000);
    });


    it('should init dialog controller with date in range min/max date', function() {
        var date = new Date('1984-01-01'),
            minDate = new Date('1983-01-01'),
            maxDate = new Date('1985-01-01'),
            dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                date: date,
                minDate: minDate,
                maxDate: maxDate,
                locale: 'en',
            });

        expect(dialog.dateMoment.isSame(moment(date), 'day')).toBe(true);
        expect(moment(dialog.minDate).isSame(moment(minDate), 'day')).toBe(true);
        expect(moment(dialog.maxDate).isSame(moment(maxDate), 'day')).toBe(true);
        expect(dialog.isTodayDisabled).toBe(true);
    });


    it('should init dialog controller with date out of range min/max date', function() {
        var date = new Date('1986-01-01'),
            minDate = null,
            maxDate = new Date('1985-01-01'),
            dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                date: date,
                minDate: minDate,
                maxDate: maxDate,
                locale: 'en',
            });

        expect(dialog.dateMoment.isSame(moment(minDate || maxDate), 'day')).toBe(true);
        expect(dialog.minDate).toBe(null);
        expect(moment(dialog.maxDate).isSame(moment(maxDate), 'day')).toBe(true);
    });


    it('should init dialog controller without date, with min/max date out of today date', function() {
        var date = null,
            minDate = moment().add(1, 'day').toDate(),
            maxDate = null,
            dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                date: date,
                minDate: minDate,
                maxDate: maxDate,
                locale: 'en',
            });

        expect(dialog.dateMoment.isSame(moment(minDate || maxDate), 'day')).toBe(true);
        expect(moment(dialog.minDate).isSame(moment(minDate), 'day')).toBe(true);
        expect(dialog.maxDate).toBe(null);
    });


    it('should init dialog controller without date, with min/max date', function() {
        var date = null,
            minDate = new Date('2016-01-01'),
            maxDate = moment().add(1, 'day').toDate(),
            dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                date: date,
                minDate: minDate,
                maxDate: maxDate,
                locale: 'en',
            });

        expect(dialog.dateMoment.isSame(moment(), 'day')).toBe(true);
        expect(moment(dialog.minDate).isSame(moment(minDate), 'day')).toBe(true);
        expect(moment(dialog.maxDate).isSame(moment(maxDate), 'day')).toBe(true);
    });


    it('should generate calendar', function() {
        var dates = [{
               date: new Date('2014-01-01'),
               emptyFirstDays: 2,
               days: 31
            },
            {
               date: new Date('2014-02-01'),
               emptyFirstDays: 5,
               days: 28
            }];
        for (var i = 0; i < dates.length; i++) {
            var dialog = controllerFactory("amDatePickerDialogCtrl", null, {date: dates[i].date});
            expect(dialog.dateMoment.disabled).toBe(false);
            expect(dialog.emptyFirstDays.length).toBe(dates[i].emptyFirstDays);
            expect(dialog.days.length).toBe(dates[i].days);
            expect(dialog.days[0].selected).toBe(true);
            for (var j = 0; j < dialog.days.length; j++) {
                expect(dialog.days[j].disabled).toBe(false);
            }
        }
    });


    it('should generate calendar with min and max year in selection', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
                minYear: 2011,
                maxYear: 2015
            }),
            lastYearIndex = dialog.years.length - 1;
        expect(dialog.maxYear).toBe(2015);
        expect(dialog.minYear).toBe(2011);
        expect(dialog.years[0]).toBe(2011);
        expect(dialog.years[lastYearIndex]).toBe(2015);
    });


    it('should generate calendar with disabled days', function() {
        var date = new Date('2014-01-07'),
            minDate = new Date('2014-01-05'),
            maxDate = new Date('2014-01-09'),
            j;

        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
            date: date,
            minDate: minDate,
            maxDate: maxDate
        });

        expect(dialog.dateMoment.disabled).toBe(false);
        expect(dialog.maxDate).toEqual(maxDate);
        expect(dialog.minDate).toEqual(minDate);

        /* dates disabled due-to min-date */
        for (j = 0; j < 4; j++) {
            expect(dialog.days[j].disabled).toBe(true);
        }

        /* dates disabled due-to max-date */
        for (j = 9; j < dialog.days.length; j++) {
            expect(dialog.days[j].disabled).toBe(true);
        }

        /* dates shouldn't be disabled */
        for (j = 5; j < 9; j++) {
            expect(dialog.days[j].disabled).toBe(false);
        }
    });

    it('should generate calendar when min/max date set to null', function() {
        var date = new Date('2014-01-07'),
            minDate = null,
            maxDate = null,
            j;

        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
            date: date,
            minDate: minDate,
            maxDate: maxDate
        });

        expect(dialog.dateMoment.disabled).toBe(false);
        expect(dialog.maxDate).toEqual(maxDate);
        expect(dialog.minDate).toEqual(minDate);

        for (j = 0; j < dialog.days.length; j++) {
            expect(dialog.days[j].disabled).toBe(false);
        }
    });


    it('should show today button', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
              date: new Date('2014-01-07'),
              todayButton: "Today"
        });

        expect(dialog.todayButton).toBe("Today");
        expect(dialog.isTodayDisabled).toBe(false);
    });


    it('should show disabled today button when today is less than minDate', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
            minDate: moment().add(1, 'days').toDate(),
            todayButton: "Today"
        });

        expect(dialog.todayButton).toBe("Today");
        expect(dialog.isTodayDisabled).toBe(true);
    });


    it('should show disabled today button when today is greater than maxDate', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
            maxDate: new Date('2014-01-05'),
            todayButton: "Today"
        });

        expect(dialog.todayButton).toBe("Today");
        expect(dialog.isTodayDisabled).toBe(true);
    });


    it('should select date', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {}),
            date = moment('2014-01-05');

        expect(dialog.dateMoment.isSame(date, 'day')).toBe(false);

        dialog.select(date);

        expect(dialog.date).toBe(undefined);
        expect(dialog.dateMoment.isSame(date, 'day')).toBe(true);
    });


    it('should not select disabled date', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {}),
            date = moment().add(1, 'days');

        date.disabled = true;
        dialog.select(date);

        expect(dialog.dateMoment.isSame(date, 'day')).toBe(false);
    });


    it('should generate calendar for next month', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
            date: new Date('2012-01-01'),
            maxDate: new Date('2012-01-10')
        });

        dialog.nextMonth();
        expect(dialog.dateMoment.disabled).toBe(true);
        expect(dialog.days.length).toBe(29);
    });


    it('should generate calendar previous month', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {
            date: new Date('2012-03-03'),
            minDate: new Date('2012-03-01')
        });

        dialog.previousMonth();
        expect(dialog.dateMoment.disabled).toBe(true);
        expect(dialog.days.length).toBe(29);
    });


    it('should display year selection', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {});

        dialog.displayYearSelection();
        expect(dialog.yearSelection).toBe(true);

        dialog.hideYearSelection();
        expect(dialog.yearSelection).toBe(false);
    });


    it('should select year', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {});

        dialog.displayYearSelection();
        expect(dialog.yearSelection).toBe(true);

        dialog.selectYear(1999);
        expect(dialog.yearSelection).toBe(false);
        expect(dialog.days[0].year()).toBe(1999);
    });


    it('should select today date', function() {
        var dialog = controllerFactory("amDatePickerDialogCtrl", null, {date: new Date('2012-01-01')}),
          today = moment();

        dialog.today();
        expect(dialog.dateMoment.isSame(today, "day")).toBe(true);
        expect(dialog.yearSelection).toBe(false);
    });

});
