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

  it('should init calendar without parameters', function() {
    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);

    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.ngModel).toBe(undefined);
    expect(amDatePicker.allowClear).toBe(true);
    expect(amDatePicker.cancelButtonText).toBe(undefined);
    expect(amDatePicker.inputLabel).toBe(undefined);
    expect(amDatePicker.inputDateFormat).toBe('LL');
    expect(amDatePicker.locale).toBe("en");
    expect(amDatePicker.maxDate).toBe(undefined);
    expect(amDatePicker.minDate).toBe(undefined);
    expect(amDatePicker.popupDateFormat).toBe('ddd, MMM D');
    expect(amDatePicker.showInputIcon).toBe(false);
    expect(amDatePicker.todayButton).toBe(undefined);
  });


  it('should set global config and init calendar', function() {
    var minDate = moment({year: 1967, month: 1, date: 1}),
        maxDate = moment({year: 1973, month: 1, date: 1});
    
    amDatePickerConfigProvider
        .setAllowClear(false)
        .setCancelButton('Отмена')
        .setInputDateFormat('L')
        .setInputLabel('Выберите дату')
        .setLocale('ru')
        .setMinDate(minDate)
        .setMaxDate(maxDate)
        .setMinYear(1967)
        .setMaxYear(1973)
        .setPopupDateFormat('D MMMM')
        .setShowInputIcon(true)
        .setTodayButton('Today');

    var element = $compile('<am-date-picker></am-date-picker>')($rootScope);

    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.showInputIcon).toBe(true);
    expect(amDatePicker.allowClear).toBe(false);
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.inputLabel).toBe("Выберите дату");
    expect(amDatePicker.locale).toBe("ru");
    expect(amDatePicker.maxDate).toBe(maxDate);
    expect(amDatePicker.minDate).toBe(minDate);
    expect(amDatePicker.popupDateFormat).toBe('D MMMM');
    expect(amDatePicker.todayButton).toBe('Today');
    expect(amDatePicker.showInputIcon).toBe(true);
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
                           '                am-cancel-button="Cancel"' +
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

    expect(amDatePicker.Date).toBe(date);
    expect(amDatePicker.allowClear).toBe(false);
    expect(amDatePicker.cancelButton).toBe('Cancel');
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

  it('should set custom input date format', function() {
    $rootScope.date = moment();
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-input-date-format="L">' +
                           '</am-date-picker')($rootScope);
    $rootScope.$digest();

    var amDatePicker = element.isolateScope().amDatePicker;
    expect(amDatePicker.inputDateFormat).toBe('L');
    expect(amDatePicker.value).toBe($rootScope.date.format('L'));
  });

  it('should clear date', function() {
    var date = moment({year: 2014});
    $rootScope.date = date;
    var element = $compile('<am-date-picker ng-model="date"' +
                           '                am-allow-clear="true">' +
                           '</am-date-picker>')($rootScope);
    $rootScope.$digest();
    var amDatePicker = element.isolateScope().amDatePicker;

    expect(amDatePicker.Date).toEqual(date);
    expect(amDatePicker.value).toBe(date.format('LL'));
    expect(amDatePicker.allowClear).toBe(true);

    amDatePicker.clearDate();
    expect(amDatePicker.Date).toBe(undefined);
    expect(amDatePicker.value).toBe(undefined);
  }); 

});
