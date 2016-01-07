describe('am.date-picker directive unit tests', function() {
  var $compile,
      $rootScope,
      $controller;


  beforeEach(module('am.date-picker'));


  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$controller_, _amDatePickerConfig_){
    $compile = _$compile_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('/dist/images/icons/ic_today_24px.svg').respond('');
    $httpBackend.whenGET('/dist/images/icons/ic_close_24px.svg').respond('');
    $httpBackend.whenGET('/dist/images/icons/ic_chevron_right_18px.svg').respond('');
    $httpBackend.whenGET('/dist/images/icons/ic_chevron_left_18px.svg').respond('');
    amDatePickerConfig = _amDatePickerConfig_;
  }));


  it("check config's default values", function() {
      expect(amDatePickerConfig.allowClear).toBe(true);
      expect(amDatePickerConfig.inputDateFormat).toBe('LL');
      expect(amDatePickerConfig.maxYear).toBe(2020);
      expect(amDatePickerConfig.minYear).toBe(1920);
      expect(amDatePickerConfig.locale).toBe('en');
      expect(amDatePickerConfig.popupDateFormat).toBe('ddd, MMM D');
      expect(amDatePickerConfig.showInputIcon).toBe(false);

      expect(amDatePickerConfig.calendarIcon).toBe('/dist/images/icons/ic_today_24px.svg');
      expect(amDatePickerConfig.prevIcon).toBe('/dist/images/icons/ic_chevron_left_18px.svg');
      expect(amDatePickerConfig.nextIcon).toBe('/dist/images/icons/ic_chevron_right_18px.svg');
      expect(amDatePickerConfig.clearIcon).toBe('/dist/images/icons/ic_close_24px.svg');
  })


  it("should set calendar icon", function() {
    amDatePickerConfig.setIcons({
        calendarIcon: '/dist/images/icons/ic_today.svg',
        clearIcon: '/dist/images/icons/ic_close.svg',
        nextIcon: '/dist/images/icons/ic_chevron_right.svg',
        prevIcon: '/dist/images/icons/ic_chevron_left.svg'
    });

    expect(amDatePickerConfig.calendarIcon).toBe('/dist/images/icons/ic_today.svg');
    expect(amDatePickerConfig.prevIcon).toBe('/dist/images/icons/ic_chevron_left.svg');
    expect(amDatePickerConfig.nextIcon).toBe('/dist/images/icons/ic_chevron_right.svg');
    expect(amDatePickerConfig.clearIcon).toBe('/dist/images/icons/ic_close.svg');
  });


  it('should init calendar without parameters', function() {
    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);

    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker,
        lastYearIndex = amDatePicker.years.length - 1;

    expect(amDatePicker.ngModel).toBe(undefined);
    expect(amDatePicker.allowClear).toBe(true);
    expect(amDatePicker.cancelButtonText).toBe('Cancel');
    expect(amDatePicker.inputLabel).toBe(undefined);
    expect(amDatePicker.inputDateFormat).toBe('LL');
    expect(amDatePicker.locale).toBe("en");
    expect(amDatePicker.maxDate).toBe(undefined);
    expect(amDatePicker.minDate).toBe(undefined);
    expect(amDatePicker.popupDateFormat).toBe('ddd, MMM D');
    expect(amDatePicker.showInputIcon).toBe(false);
    expect(amDatePicker.todayButton).toBe(undefined);
    expect(amDatePicker.yearSelection).toBe(false);
    expect(amDatePicker.years[0]).toBe(1920);
    expect(amDatePicker.years[lastYearIndex]).toBe(2020);
  });


  it('should set global config and init calendar', function() {
    var minDate = moment({year: 1967, month: 1, date: 1}),
        maxDate = moment({year: 1973, month: 1, date: 1});

    amDatePickerConfig.setOptions({
        allowClear: false,
        cancelButtonText: 'Отмена',
        inputDateFormat: 'L',
        inputLabel: 'Выберите дату',
        locale: 'ru',
        minDate: minDate,
        maxDate: maxDate,
        minYear: 1967,
        maxYear: 1973,
        popupDateFormat: 'D MMMM',
        showInputIcon: true,
        todayButton: 'Today'
    });

    expect(amDatePickerConfig.allowClear).toBe(false);
    expect(amDatePickerConfig.cancelButtonText).toBe('Отмена');
    expect(amDatePickerConfig.inputDateFormat).toBe('L');
    expect(amDatePickerConfig.inputLabel).toBe('Выберите дату');
    expect(amDatePickerConfig.locale).toBe('ru');
    expect(amDatePickerConfig.maxDate).toBe(maxDate);
    expect(amDatePickerConfig.minDate).toBe(minDate);
    expect(amDatePickerConfig.maxYear).toBe(1973);
    expect(amDatePickerConfig.minYear).toBe(1967);
    expect(amDatePickerConfig.popupDateFormat).toBe('D MMMM');
    expect(amDatePickerConfig.todayButton).toBe('Today');
    expect(amDatePickerConfig.showInputIcon).toBe(true);

    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);

    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker,
        lastYearIndex = amDatePicker.years.length - 1;

    expect(amDatePicker.showInputIcon).toBe(true);
    expect(amDatePicker.allowClear).toBe(false);
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.inputLabel).toBe("Выберите дату");
    expect(amDatePicker.locale).toBe("ru");
    expect(amDatePicker.maxDate).toBe(maxDate);
    expect(amDatePicker.minDate).toBe(minDate);
    expect(amDatePicker.popupDateFormat).toBe('D MMMM');
    expect(amDatePicker.todayButton).toBe('Today');
    expect(amDatePicker.yearSelection).toBe(false);
    expect(amDatePicker.showInputIcon).toBe(true);
    expect(amDatePicker.years[0]).toBe(1967);
    expect(amDatePicker.years[lastYearIndex]).toBe(1973);
  });


  it('should Init Calendar with parameters', function() {
    var date = moment({year: 2014, month: 0, date: 15}),
        minDate = moment({year: 2014, month: 0, date: 10}),
        maxDate = moment({year: 2014, month: 0, date: 20});
    $rootScope.date = date;
    $rootScope.minDate = minDate;
    $rootScope.maxDate = maxDate;

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-allow-clear="false"' +
                           '                am-input-date-format="L"' +
                           '                am-input-label="Pick a Date"' +
                           '                am-max-date="maxDate"' +
                           '                am-max-year="2015"' +
                           '                am-min-date="minDate"' +
                           '                am-min-year="2000"' +
                           '                am-popup-date-format="D MMMM"' +
                           '                am-today-button="Today"' +
                           '                am-show-input-icon="true">' +
                           '</am-date-picker>')($rootScope);

    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.ngModel).toBe(date);
    expect(amDatePicker.allowClear).toBe(false);
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.inputLabel).toBe('Pick a Date');
    expect(amDatePicker.locale).toBe('en');
    expect(amDatePicker.maxDate).toBe(maxDate);
    expect(amDatePicker.maxYear).toBe(2015);
    expect(amDatePicker.minDate).toBe(minDate);
    expect(amDatePicker.minYear).toBe(2000);
    expect(amDatePicker.popupDateFormat).toBe('D MMMM');
    expect(amDatePicker.todayButton).toBe('Today');
    expect(amDatePicker.showInputIcon).toBe(true);
  });


  it('should generate calendar', function() {
    var dates = [
      {
         date: moment({year: 2014, month: 0, date: 1}),
         emptyFirstDays: 2,
         days: 31
      },
      {
         date: moment({year: 2014, month: 1, date: 1}),
         emptyFirstDays: 5,
         days: 28
      }
    ];
    for (var i = 0; i < dates.length; i++) {
      $rootScope.date = dates[i].date;
      var element = $compile('<am-date-picker ng-model="date">' +
                             '</am-date-picker>')($rootScope);

      $rootScope.$digest();

      var amDatePicker = element.isolateScope().amDatePicker;

      expect(amDatePicker.emptyFirstDays.length).toBe(dates[i].emptyFirstDays);
      expect(amDatePicker.days.length).toBe(dates[i].days);
      expect(amDatePicker.days[0].selected).toBe(true);
      for (var j = 0; j < amDatePicker.days.length; j++) {
        expect(amDatePicker.days[j].disabled).toBe(undefined);
      }
    }
  });


  it('should generate calendar with min and max year in selection', function() {
    var element = $compile('<am-date-picker am-min-year="2011"' +
                           '                am-max-year="2015">' +
                           '</am-date-picker')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker,
        lastYearIndex = amDatePicker.years.length - 1;
    expect(amDatePicker.years[0]).toBe(2011);
    expect(amDatePicker.years[lastYearIndex]).toBe(2015);
});


  it('should generate calendar with disabled days', function() {
    $rootScope.date = moment({year: 2014, month: 0, date: 7});
    $rootScope.minDate = moment({year: 2014, month: 0, date: 5});
    $rootScope.maxDate = moment({year: 2014, month: 0, date: 9});

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-date="minDate"' +
                           '                am-max-date="maxDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    var j;
    /* dates disabled due-to min-date */
    for (j = 0; j < 4; j++) {
      expect(amDatePicker.days[j].disabled).toBe(true);
    }

    /* dates disabled due-to max-date */
    for (j = 9; j < amDatePicker.days.length; j++) {
      expect(amDatePicker.days[j].disabled).toBe(true);
    }

    /* dates shouldn't be disabled */
    for (j = 5; j < 9; j++) {
      expect(amDatePicker.days[j].disabled).toBe(undefined);
    }

  });


  it('should set custom input date format', function() {
    $rootScope.date = moment();
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-input-date-format="L">' +
                           '</am-date-picker')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.ngModelMomentFormatted).toBe($rootScope.date.format('L'));
  });


  it('should show today button', function() {
    $rootScope.date = moment({year: 2014, month: 0, date: 7});

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-today-button="Today">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.todayButton).toBe("Today");
    expect(amDatePicker.isTodayDisabled).toBe(false);
  })


  it('should show disabled today button when today is less than minDate', function() {
    $rootScope.minDate = moment().add(1, 'days');

    var element = $compile('<am-date-picker am-min-date="minDate"' +
                           '                am-today-button="Today">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.todayButton).toBe("Today");
    expect(amDatePicker.isTodayDisabled).toBe(true);
  });


  it('should show disabled today button when today is greater than maxDate', function() {
    $rootScope.maxDate = moment({year: 2014, month: 0, date: 5});

    var element = $compile('<am-date-picker am-max-date="maxDate"' +
                           '                am-today-button="Today">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.todayButton).toBe("Today");
    expect(amDatePicker.isTodayDisabled).toBe(true);
  });


  it('should select date', function() {
    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        date = moment();

    amDatePicker.select(date);

    expect(amDatePicker.ngModel).toBe(date.toDate());
    expect(amDatePicker.ngModelMoment.toDate()).toEqual(date.toDate());
    expect(amDatePicker.ngModelMomentFormatted).toBe(date.format('LL'));
  });


  it('should not select disabled date', function() {
    $rootScope.minDate = moment().add(1, 'days');

    var element = $compile('<am-date-picker am-min-date="minDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        date = moment();

    date.disabled = true;
    amDatePicker.select(date);

    expect(amDatePicker.ngModel).toBe(undefined);
  });


  it('should generate calendar for next month', function() {
    $rootScope.date = moment({year: 2012, month: 0, date: 1});

    var element = $compile('<am-date-picker ng-model="date">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.nextMonth();

    expect(amDatePicker.days.length).toBe(29);
  });


  it('should generate calendar previous month', function() {
    $rootScope.date = moment({year: 2012, month: 2, date: 1});

    var element = $compile('<am-date-picker ng-model="date">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.previousMonth();

    expect(amDatePicker.days.length).toBe(29);
  });


  it('should change min date and disabled days', function() {
    $rootScope.minDate = moment({year: 2014, month: 0, date: 5});
    $rootScope.date = moment({year: 2014, month: 0, date: 15});

    var element = $compile('<am-date-picker ng-model="date"' +
                         '                am-min-date="minDate">' +
                         '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        i;
    for (i = 0; i < 4; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
    for (i = 5; i < amDatePicker.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(undefined);
    }

    $rootScope.minDate = moment({year: 2014, month: 0, date: 10});;
    element.isolateScope().$apply();
    for (i = 0; i < 9; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
    for (i = 10; i < amDatePicker.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(undefined);
    }
  });


  it('should change max date and disabled days', function() {
    $rootScope.maxDate = moment({year: 2014, month: 0, date: 15});
    $rootScope.date = moment({year: 2014, month: 0, date: 10});

    var element = $compile('<am-date-picker ng-model="date"' +
                         '                am-max-date="maxDate">' +
                         '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
      i;
    for (i = 0; i < 15; i++) {
      expect(amDatePicker.days[i].disabled).toBe(undefined);
    }
    for (i = 15; i < amDatePicker.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }

    $rootScope.maxDate = moment({year: 2014, month: 0, date: 10});;
    element.isolateScope().$apply();
    for (i = 0; i < 10; i++) {
      expect(amDatePicker.days[i].disabled).toBe(undefined);
    }
    for (i = 10; i < amDatePicker.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
  });


  it('should set new min date and change selected date respectively if it lesser',
    function() {
      $rootScope.minDate = moment({year: 2014, month: 0, date: 5});
      $rootScope.date = moment({year: 2014, month: 0, date: 15});

      var element = $compile('<am-date-picker ng-model="date"' +
                             '                am-min-date="minDate">' +
                             '</am-date-picker>')($rootScope);
      $rootScope.$digest();

      $rootScope.minDate = moment({year: 2014, month: 0, date: 20}).toDate();
      element.isolateScope().$apply();
      var amDatePicker = element.isolateScope().amDatePicker;
      expect(String(amDatePicker.ngModel)).toBe(String($rootScope.minDate));
  });


  it('should set new max date and change selected date respectively if it greater',
    function() {
      $rootScope.maxDate = moment({year: 2014, month: 0, date: 20});
      $rootScope.date = moment({year: 2014, month: 0, date: 15});

      var element = $compile('<am-date-picker ng-model="date"' +
                             '                am-max-date="maxDate">' +
                             '</am-date-picker>')($rootScope);
      $rootScope.$digest();

      $rootScope.maxDate = moment({year: 2014, month: 0, date: 10}).toDate();
      element.isolateScope().$apply();
      var amDatePicker = element.isolateScope().amDatePicker;
      expect(String(amDatePicker.ngModel)).toBe(String($rootScope.maxDate));
  });


  it('should display year selection', function() {
    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.displayYearSelection();
    expect(amDatePicker.yearSelection).toBe(true);

    amDatePicker.hideYearSelection();
    expect(amDatePicker.yearSelection).toBe(false);
  });


  it('should select year', function() {
    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.displayYearSelection();
    expect(amDatePicker.yearSelection).toBe(true);

    amDatePicker.selectYear(1999);
    expect(amDatePicker.yearSelection).toBe(false);
    expect(amDatePicker.days[0].year()).toBe(1999);
  });


  it('should select today date', function() {
    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.ngModel).toBe(undefined);

    amDatePicker.today();
    expect(String(amDatePicker.ngModel)).toBe(String(moment().toDate()));
    expect(amDatePicker.yearSelection).toBe(false);
  });


  it('should clear date', function() {
    var date = moment({year: 2014});
    $rootScope.date = date;
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-allow-clear="true">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.ngModel).toEqual(date);
    expect(amDatePicker.ngModelMoment).toEqual(date);
    expect(amDatePicker.ngModelMomentFormatted).toBe(date.format('LL'));
    expect(amDatePicker.allowClear).toBe(true);

    amDatePicker.clearDate();
    expect(amDatePicker.ngModel).toBe(undefined);
    expect(amDatePicker.ngModelMomentFormatted).toBe(undefined);
  });

});
