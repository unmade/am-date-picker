describe('am.date-picker service unit tests', function() {
  var amDatePickerConfigProvider;

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
        .setTodayButton('Today')
        .setCalendarIcon('/dist/images/icons/ic_today.svg')
        .setClearIcon('/dist/images/icons/ic_close.svg')
        .setNextIcon('/dist/images/icons/ic_chevron_right.svg')
        .setPrevIcon('/dist/images/icons/ic_chevron_left.svg');

    var amDatePickerConfig = serviceFactory('amDatePickerConfig');
    expect(amDatePickerConfig.allowClear).toBe(false);
    expect(amDatePickerConfig.cancelButton).toBe('Отмена');
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
    expect(amDatePickerConfig.calendarIcon).toBe('/dist/images/icons/ic_today.svg');
    expect(amDatePickerConfig.prevIcon).toBe('/dist/images/icons/ic_chevron_left.svg');
    expect(amDatePickerConfig.nextIcon).toBe('/dist/images/icons/ic_chevron_right.svg');
    expect(amDatePickerConfig.clearIcon).toBe('/dist/images/icons/ic_close.svg');

  });
});