describe('am.date-picker directive unit tests', function() {
  var $compile,
      $rootScope,
      $controller,
      amDatePickerConfigProvider;


  function providerFactory(moduleName, providerName) {
      var provider;
      module(moduleName, [providerName, function(Provider) { provider = Provider; }]);
    return function() { inject(); return provider; }; // inject calls the above
  }

  function serviceFactory(serviceName){
      var service;
      inject([serviceName,function(Service){ service = Service;}]);
      return service;
  }
    beforeEach(function(){
      amDatePickerConfigProvider = providerFactory("am.date-picker", "amDatePickerConfigProvider")();
  });


  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$controller_){
    $compile = _$compile_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    var $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('/dist/images/icons/ic_today_24px.svg').respond('');
    $httpBackend.whenGET('/dist/images/icons/ic_close_24px.svg').respond('');
    $httpBackend.whenGET('/dist/images/icons/ic_chevron_right_18px.svg').respond('');
    $httpBackend.whenGET('/dist/images/icons/ic_chevron_left_18px.svg').respond('');
  }));


  it("check config's default values", function() {
      var amDatePickerConfig = serviceFactory('amDatePickerConfig');
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
    amDatePickerConfigProvider.setIcons({
        calendarIcon: '/dist/images/icons/ic_today.svg',
        clearIcon: '/dist/images/icons/ic_close.svg',
        nextIcon: '/dist/images/icons/ic_chevron_right.svg',
        prevIcon: '/dist/images/icons/ic_chevron_left.svg'
    });

    var amDatePickerConfig = serviceFactory('amDatePickerConfig');
    expect(amDatePickerConfig.calendarIcon).toBe('/dist/images/icons/ic_today.svg');
    expect(amDatePickerConfig.prevIcon).toBe('/dist/images/icons/ic_chevron_left.svg');
    expect(amDatePickerConfig.nextIcon).toBe('/dist/images/icons/ic_chevron_right.svg');
    expect(amDatePickerConfig.clearIcon).toBe('/dist/images/icons/ic_close.svg');
  });


  it('should init calendar without parameters', function() {
    var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);

    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker,
        lastYearIndex = amDatePicker.years.length - 1,
        today = moment();

    expect(amDatePicker.allowClear).toBe(true);
    expect(amDatePicker.backButtonText).toBe('Back');
    expect(amDatePicker.cancelButton).toBe(undefined);
    expect(amDatePicker.inputLabel).toBe(undefined);
    expect(amDatePicker.inputDateFormat).toBe('LL');
    expect(amDatePicker.locale).toBe("en");
    expect(amDatePicker.maxDate).toBe(undefined);
    expect(amDatePicker.maxYear).toBe(2020);
    expect(amDatePicker.minDate).toBe(undefined);
    expect(amDatePicker.minYear).toBe(1920);
    expect(amDatePicker.model).toBe(undefined);
    expect(amDatePicker.modelMoment.format('YYYY-MM-DD')).toEqual(today.format('YYYY-MM-DD'));
    expect(amDatePicker.modelFormatted).toBe(undefined);
    expect(amDatePicker.popupDateFormat).toBe('ddd, MMM D');
    expect(amDatePicker.showInputIcon).toBe(false);
    expect(amDatePicker.todayButton).toBe(undefined);
    expect(amDatePicker.yearSelection).toBe(false);
    expect(amDatePicker.years[0]).toBe(1920);
    expect(amDatePicker.years[lastYearIndex]).toBe(2020);
  });

  it('should init calendar when date set to null', function() {
      var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);
      $rootScope.date = null;

      $rootScope.$digest();

      var amDatePicker = element.isolateScope().amDatePicker;

      expect(amDatePicker.model).toBe(null);
      expect(amDatePicker.modelMoment.format('YYYY-MM-DD')).toEqual(moment().format('YYYY-MM-DD'));
      expect(amDatePicker.modelFormatted).toBe(undefined);
  });


  it('should set global config and init calendar', function() {
    var minDate = new Date('1967-01-01');
        maxDate = new Date('1973-01-01');

    amDatePickerConfigProvider.setOptions({
        allowClear: false,
        backButtonText: 'Назад',
        cancelButton: 'Отмена',
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

    var amDatePickerConfig = serviceFactory('amDatePickerConfig');
    expect(amDatePickerConfig.allowClear).toBe(false);
    expect(amDatePickerConfig.backButtonText).toBe('Назад');
    expect(amDatePickerConfig.cancelButton).toBe('Отмена');
    expect(amDatePickerConfig.inputDateFormat).toBe('L');
    expect(amDatePickerConfig.inputLabel).toBe('Выберите дату');
    expect(amDatePickerConfig.locale).toBe('ru');
    expect(amDatePickerConfig.maxDate).toBe(maxDate);
    expect(amDatePickerConfig.maxYear).toBe(1973);
    expect(amDatePickerConfig.minDate).toBe(minDate);
    expect(amDatePickerConfig.minYear).toBe(1967);
    expect(amDatePickerConfig.popupDateFormat).toBe('D MMMM');
    expect(amDatePickerConfig.todayButton).toBe('Today');
    expect(amDatePickerConfig.showInputIcon).toBe(true);

    var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);

    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker,
        lastYearIndex = amDatePicker.years.length - 1,
        today = moment();


    expect(amDatePicker.allowClear).toBe(false);
    expect(amDatePicker.backButtonText).toBe('Назад');
    expect(amDatePicker.cancelButton).toBe('Отмена');
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.inputLabel).toBe("Выберите дату");
    expect(amDatePicker.locale).toBe("ru");
    expect(amDatePicker.maxDate).toBe(maxDate);
    expect(amDatePicker.maxYear).toBe(1973);
    expect(amDatePicker.minDate).toBe(minDate);
    expect(amDatePicker.minYear).toBe(1967);
    expect(amDatePicker.model).toBe(undefined);
    expect(amDatePicker.modelMoment.format('YYYY-MM-DD')).toEqual(today.format('YYYY-MM-DD'));
    expect(amDatePicker.modelFormatted).toBe(undefined);
    expect(amDatePicker.popupDateFormat).toBe('D MMMM');
    expect(amDatePicker.todayButton).toBe('Today');
    expect(amDatePicker.yearSelection).toBe(false);
    expect(amDatePicker.showInputIcon).toBe(true);
    expect(amDatePicker.years[0]).toBe(1967);
    expect(amDatePicker.years[lastYearIndex]).toBe(1973);
  });


  it('should Init Calendar with parameters', function() {
    var date = new Date('2014-01-15'),
        minDate = new Date('2014-01-10'),
        maxDate = new Date('2014-01-20');

    $rootScope.date = date;
    $rootScope.minDate = minDate;
    $rootScope.maxDate = maxDate;

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-allow-clear="false"' +
                           '                am-back-button-text="Календарь"' +
                           '                am-cancel-button="Отмена"' +
                           '                am-input-date-format="L"' +
                           '                am-input-label="Выберите дату"' +
                           '                am-locale="ru"' +
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

    expect(amDatePicker.model).toEqual(date);
    expect(amDatePicker.modelMoment.format('YYYY-MM-DD')).toEqual(moment(date).locale('ru').format('YYYY-MM-DD'));
    expect(amDatePicker.modelMomentFormatted).toEqual(moment(date).locale('ru')
                                                                  .format(amDatePicker.inputDateFormat));
    expect(amDatePicker.allowClear).toBe(false);
    expect(amDatePicker.backButtonText).toBe('Календарь');
    expect(amDatePicker.cancelButton).toBe('Отмена');
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.inputLabel).toBe('Выберите дату');
    expect(amDatePicker.locale).toBe('ru');
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
         date: new Date('2014-01-01'),
         emptyFirstDays: 2,
         days: 31
      },
      {
         date: new Date('2014-02-01'),
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
        expect(amDatePicker.days[j].disabled).toBe(false);
      }
    }
  });


  it('should generate calendar with min and max year in selection', function() {
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-year="2011"' +
                           '                am-max-year="2015">' +
                           '</am-date-picker')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker,
        lastYearIndex = amDatePicker.years.length - 1;
    expect(amDatePicker.maxYear).toBe(2015);
    expect(amDatePicker.minYear).toBe(2011);
    expect(amDatePicker.years[0]).toBe(2011);
    expect(amDatePicker.years[lastYearIndex]).toBe(2015);
  });


  it('should generate calendar with disabled days', function() {
    $rootScope.date = new Date('2014-01-07');
    $rootScope.minDate = new Date('2014-01-05');
    $rootScope.maxDate = new Date('2014-01-09');

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-date="minDate"' +
                           '                am-max-date="maxDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.maxDate).toEqual($rootScope.maxDate);
    expect(amDatePicker.minDate).toEqual($rootScope.minDate);

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
      expect(amDatePicker.days[j].disabled).toBe(false);
    }

  });


  it('should set custom input date format', function() {
    $rootScope.date = new Date();
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-input-date-format="L">' +
                           '</am-date-picker')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;
    expect(amDatePicker.inputDateFormat).toEqual('L');
    expect(amDatePicker.modelMomentFormatted).toBe(moment($rootScope.date).format('L'));
  });


  it('should show today button', function() {
    $rootScope.date = new Date('2014-01-07');

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-today-button="Today">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.todayButton).toBe("Today");
    expect(amDatePicker.isTodayDisabled).toBe(false);
  })


  it('should show disabled today button when today is less than minDate', function() {
    $rootScope.minDate = moment().add(1, 'days').toDate();

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-date="minDate"' +
                           '                am-today-button="Today">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.todayButton).toBe("Today");
    expect(amDatePicker.isTodayDisabled).toBe(true);
  });


  it('should show disabled today button when today is greater than maxDate', function() {
    $rootScope.maxDate = new Date('2014-01-05');

    var element = $compile('<am-date-picker ng-model="date"'+
                           '                am-max-date="maxDate"' +
                           '                am-today-button="Today">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.todayButton).toBe("Today");
    expect(amDatePicker.isTodayDisabled).toBe(true);
  });


  it('should select date', function() {
    var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        date = moment();

    amDatePicker.select(date);

    expect(amDatePicker.model).toBe(undefined);
    expect(amDatePicker.modelMoment).toEqual(date);
    expect(amDatePicker.modelMomentFormatted).toBe(undefined);
  });


  it('should not select disabled date', function() {
    $rootScope.minDate = moment().add(1, 'days').toDate();

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-date="minDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        date = moment();

    date.disabled = true;
    amDatePicker.select(date);

    expect(amDatePicker.model).toBe(undefined);
  });


  it('should generate calendar for next month', function() {
    $rootScope.date = new Date('2012-01-01');

    var element = $compile('<am-date-picker ng-model="date">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.nextMonth();

    expect(amDatePicker.days.length).toBe(29);
  });


  it('should generate calendar previous month', function() {
    $rootScope.date = new Date('2012-03-01');

    var element = $compile('<am-date-picker ng-model="date">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.previousMonth();

    expect(amDatePicker.days.length).toBe(29);
  });


  it('should change min date and disabled days', function() {
    $rootScope.minDate = new Date('2014-01-05');
    $rootScope.date = new Date('2014-01-15');

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-date="minDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        i;
    for (i = 0; i < 4; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
    for (i = 5; i < amDatePicker.days.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(false);
    }

    $rootScope.minDate = new Date('2014-01-10');
    element.isolateScope().$apply();
    for (i = 0; i < 9; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
    for (i = 10; i < amDatePicker.days.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(false);
    }
  });

  it('should set min date to null, change min date and disabled days accordingly', function() {
    $rootScope.minDate = null;
    $rootScope.date = new Date('2014-01-15');

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-min-date="minDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        i;
    for (i = 0; i < amDatePicker.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(undefined);
    }

    $rootScope.minDate = new Date('2014-01-10');
    element.isolateScope().$apply();
    for (i = 0; i < 9; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
    for (i = 10; i < amDatePicker.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(undefined);
    }
  });

  it('should change max date and disabled days', function() {
    $rootScope.maxDate = new Date('2014-01-15');
    $rootScope.date = new Date('2014-01-10');

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-max-date="maxDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
      i;
    for (i = 0; i < 15; i++) {
      expect(amDatePicker.days[i].disabled).toBe(false);
    }
    for (i = 15; i < amDatePicker.days.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }

    $rootScope.maxDate = new Date('2014-01-10');
    element.isolateScope().$apply();
    for (i = 0; i < 10; i++) {
      expect(amDatePicker.days[i].disabled).toBe(false);
    }
    for (i = 10; i < amDatePicker.days.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
  });

  it('should  set max date to null, change max date and disabled days accordingly', function() {
    $rootScope.maxDate = null;
    $rootScope.date = new Date('2014-01-10');

    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-max-date="maxDate">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
      i;
    for (i = 0; i < amDatePicker.days.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(false);
    }

    $rootScope.maxDate = new Date('2014-01-10');
    element.isolateScope().$apply();
    for (i = 0; i < 10; i++) {
      expect(amDatePicker.days[i].disabled).toBe(false);
    }
    for (i = 10; i < amDatePicker.days.length; i++) {
      expect(amDatePicker.days[i].disabled).toBe(true);
    }
  });


  it('should set new min date and change selected date respectively if it lesser',
    function() {
      $rootScope.minDate = new Date('2014-01-05');
      $rootScope.date = new Date('2014-01-15');

      var element = $compile('<am-date-picker ng-model="date"' +
                             '                am-min-date="minDate">' +
                             '</am-date-picker>')($rootScope);
      $rootScope.$digest();

      $rootScope.minDate = new Date('2014-01-20');
      element.isolateScope().$apply();
      var amDatePicker = element.isolateScope().amDatePicker;
      expect(amDatePicker.model).toEqual($rootScope.minDate);
  });


  it('should set new max date and change selected date respectively if it greater',
    function() {
      $rootScope.maxDate = new Date('2014-01-20');
      $rootScope.date = new Date('2014-01-15');

      var element = $compile('<am-date-picker ng-model="date"' +
                             '                am-max-date="maxDate">' +
                             '</am-date-picker>')($rootScope);
      $rootScope.$digest();

      $rootScope.maxDate = new Date('2014-01-10');
      element.isolateScope().$apply();
      var amDatePicker = element.isolateScope().amDatePicker;
      expect(amDatePicker.model).toEqual($rootScope.maxDate);
  });


  it('should display year selection', function() {
    var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.displayYearSelection();
    expect(amDatePicker.yearSelection).toBe(true);

    amDatePicker.hideYearSelection();
    expect(amDatePicker.yearSelection).toBe(false);
  });


  it('should select year', function() {
    var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    amDatePicker.displayYearSelection();
    expect(amDatePicker.yearSelection).toBe(true);

    amDatePicker.selectYear(1999);
    expect(amDatePicker.yearSelection).toBe(false);
    expect(amDatePicker.days[0].year()).toBe(1999);
  });


  it('should select today date', function() {
    var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker,
        today = moment();

    expect(amDatePicker.model).toBe(undefined);

    amDatePicker.today();
    expect(amDatePicker.modelMoment.format('YYYY-MM-DD')).toEqual(today.format('YYYY-MM-DD'));
    expect(amDatePicker.yearSelection).toBe(false);
  });


  it('should clear date', function() {
    var date = new Date('2014-01-01'),
        momentDate = moment(date);
    $rootScope.date = date;
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-allow-clear="true">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.model).toEqual(date);
    expect(amDatePicker.modelMoment.format('YYYY-MM-DD')).toEqual(momentDate.format('YYYY-MM-DD'));
    expect(amDatePicker.modelMomentFormatted).toBe(momentDate.format('LL'));
    expect(amDatePicker.allowClear).toBe(true);

    amDatePicker.clearDate();
    expect(amDatePicker.model).toBe(undefined);
    expect(amDatePicker.modelMomentFormatted).toBe(undefined);
  });

});
