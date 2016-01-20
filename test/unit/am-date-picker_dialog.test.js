describe('am.date-picker dialog unit tests', function () {
    var $compile,
        $rootScope,
        $controller,
        amDatePickerConfigProvider;


    function providerFactory(moduleName, providerName) {
        var provider;
        module(moduleName, [providerName, function (Provider) { provider = Provider; }]);
        return function () { inject(); return provider; }; // inject calls the above
    }

    function serviceFactory(serviceName) {
        var service;
        inject([serviceName, function (Service) { service = Service; }]);
        return service;
    }

    function controllerFactory(controllerName, args, bound) {
        var _args = angular.extend({}, args);
        if (!bound) {
            return $controller(controllerName, args);
        }

        var controllerFn = $controller(controllerName, _args, true);
        angular.extend(controllerFn.instance, bound);
        return controllerFn();
    }

    beforeEach(function () {
        amDatePickerConfigProvider = providerFactory("am.date-picker", "amDatePickerConfigProvider")();
        inject(function (_$controller_) {
            $controller = _$controller_;
        });
    });

    var dates = [
        {
            date: moment({ year: 2014, month: 0, date: 1 }),
            emptyFirstDays: 2,
            days: 31
        },
        {
            date: moment({ year: 2014, month: 1, date: 1 }),
            emptyFirstDays: 5,
            days: 28
        }
    ];
    dates.forEach(function (date) {
        it('should generate calendar for ' + date.date.format("MM/DD/YYYY"), function () {
            var dialog = controllerFactory("amDatePickerDialog", null, { Date: date.date });

            expect(dialog.emptyFirstDays.length).toBe(date.emptyFirstDays);
            expect(dialog.days.length).toBe(date.days);
            expect(dialog.days[0].selected).toBe(true);
            for (var j = 0; j < dialog.days.length; j++) {
                expect(dialog.days[j].disabled).toBe(undefined);
            }
        });
    });

    it('should generate calendar with disabled days', function () {
        var dialog = controllerFactory("amDatePickerDialog", null, {
            Date: moment({ year: 2014, month: 0, date: 7 }),
            minDate: moment({ year: 2014, month: 0, date: 5 }),
            maxDate: moment({ year: 2014, month: 0, date: 9 })
        });

        var j;
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
            expect(dialog.days[j].disabled).toBe(undefined);
        }

    });

    it('should show today button', function () {
        var dialog = controllerFactory("amDatePickerDialog", null, {
            Date: moment({ year: 2014, month: 0, date: 7 }),
            todayButton: "Today"
        });

        expect(dialog.todayButton).toBe("Today");
        expect(dialog.isTodayDisabled).toBe(false);
    });

    it('should generate calendar with min and max year in selection', function () {
        var dialog = controllerFactory("amDatePickerDialog", null, {
            minYear: 2011,
            maxYear: 2015
        });

        var lastYearIndex = dialog.years.length - 1;
        expect(dialog.years[0]).toBe(2011);
        expect(dialog.years[lastYearIndex]).toBe(2015);
    });

    it('should show disabled today button when today is less than minDate', function () {
        var dialog = controllerFactory("amDatePickerDialog", null, {
            minDate: moment().add(1, 'days'),
            todayButton: "Today"
        });

        expect(dialog.todayButton).toBe("Today");
        expect(dialog.isTodayDisabled).toBe(true);
    });

    it('should show disabled today button when today is greater than maxDate', function () {
        var dialog = controllerFactory("amDatePickerDialog", null, {
            maxDate: moment({ year: 2014, month: 0, date: 5 }),
            todayButton: "Today"
        });

        expect(dialog.todayButton).toBe("Today");
        expect(dialog.isTodayDisabled).toBe(true);
    });

    it('should select date', function () {
        var dialog = controllerFactory("amDatePickerDialog");
        var date = moment().add(-10, 'day');

        dialog.select(date);

        //expect(dialog.Date).toBe(date.toDate());
        expect(dialog.moment.toDate()).toEqual(date.toDate());
    });

    it('should not select disabled date', function () {
        var dialog = controllerFactory("amDatePickerDialog", null, {
            minDate: moment().add(1, 'days')
        });
        var date = moment();

        date.disabled = true;
        dialog.select(date);

        expect(dialog.moment).not.toBe(date);
    });

    it('should generate calendar previous month', function () {
        var date = moment();
        var dialog = controllerFactory("amDatePickerDialog", null, {
            Date: date
        });

        dialog.previousMonth();

        expect(dialog.monthYear.isBefore(date, 'month'));
    });

    it('should generate calendar for next month', function () {
        var date = moment();
        var dialog = controllerFactory("amDatePickerDialog", null, {
            Date: date
        })

        dialog.nextMonth();

        expect(dialog.monthYear.isAfter(date, 'month'));
    });

    it('should display year selection', function () {
        var dialog = controllerFactory("amDatePickerDialog");

        dialog.displayYearSelection();
        expect(dialog.yearSelection).toBe(true);

        dialog.hideYearSelection();
        expect(dialog.yearSelection).toBe(false);
    });

    it('should select year', function () {
        var dialog = controllerFactory("amDatePickerDialog");

        dialog.displayYearSelection();
        expect(dialog.yearSelection).toBe(true);

        dialog.selectYear(1999);
        expect(dialog.yearSelection).toBe(false);
        expect(dialog.days[0].year()).toBe(1999);
    });

    it('should select today date', function () {
        var past = moment({year: 2000, month: 6, day: 15});''
        var dialog = controllerFactory("amDatePickerDialog", null, {
            Date: past
        });

        expect(dialog.moment.isSame(past, 'day'));

        dialog.today();
        expect(dialog.moment.isSame(moment(), "day"));
        expect(dialog.yearSelection).toBe(false);
    });
});