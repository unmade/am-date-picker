'use strict';

describe('am.date-picker directive unit tests', function() {
    var $compile,
        $rootScope,
        amDatePickerConfigProvider;

    beforeEach(function(){
        amDatePickerConfigProvider = providerFactory("am.date-picker", "amDatePickerConfigProvider")();
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        var $httpBackend = _$httpBackend_;
        $httpBackend.whenGET('/dist/images/icons/ic_today_24px.svg').respond('');
        $httpBackend.whenGET('/dist/images/icons/ic_close_24px.svg').respond('');
        $httpBackend.whenGET('/dist/images/icons/ic_chevron_right_18px.svg').respond('');
        $httpBackend.whenGET('/dist/images/icons/ic_chevron_left_18px.svg').respond('');
    }));


    it('should init calendar without parameters', function() {
        var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);

        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

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
        expect(amDatePicker.ngModelCtrl.$viewValue).toBe(undefined);
        expect(amDatePicker.modelFormatted).toBe(undefined);
        expect(amDatePicker.popupDateFormat).toBe('ddd, MMM D');
        expect(amDatePicker.showInputIcon).toBe(false);
        expect(amDatePicker.todayButton).toBe(undefined);
    });


    it('should init calendar when date set to null', function() {
        var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);
        $rootScope.date = null;
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        expect(amDatePicker.ngModelCtrl.$viewValue).toBe(null);
        expect(amDatePicker.modelFormatted).toBe(undefined);
    });


    it('should init calendar with parameters', function() {
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
        var amDatePicker = element.isolateScope().amDatePicker,
            momentFormatted = moment(date).locale('ru').format(amDatePicker.inputDateFormat);

        expect(amDatePicker.ngModelCtrl.$viewValue).toEqual(date);
        expect(amDatePicker.modelMomentFormatted).toBe(momentFormatted);
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


    it('should set global config and init calendar', function() {
        var minDate = new Date('1967-01-01'),
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

        var element = $compile('<am-date-picker ng-model="date"></am-date-picker>')($rootScope);

        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

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
        expect(amDatePicker.ngModelCtrl.$viewValue).toBe(undefined);
        expect(amDatePicker.modelFormatted).toBe(undefined);
        expect(amDatePicker.popupDateFormat).toBe('D MMMM');
        expect(amDatePicker.todayButton).toBe('Today');
        expect(amDatePicker.showInputIcon).toBe(true);
    });


    it('should set custom input date format', function() {
        $rootScope.date = new Date();
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-input-date-format="L">' +
                               '</am-date-picker')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;
        expect(amDatePicker.inputDateFormat).toBe('L');
        expect(amDatePicker.modelMomentFormatted).toBe(moment($rootScope.date).format('L'));
    });


    it('should clear date', function() {
        var date = new Date('2014-01-01'),
            dateMoment = moment(date);
        $rootScope.date = date;
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-allow-clear="true">' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();
        var amDatePicker = element.isolateScope().amDatePicker;

        expect(amDatePicker.ngModelCtrl.$viewValue).toEqual(date);
        expect(amDatePicker.modelMomentFormatted).toBe(dateMoment.format('LL'));
        expect(amDatePicker.allowClear).toBe(true);

        amDatePicker.clearDate();
        expect(amDatePicker.ngModelCtrl.$viewValue).toBe(undefined);
        expect(amDatePicker.modelMomentFormatted).toBe(undefined);
    });


    it('should set new min date and change selected date respectively if it lesser', function() {
        $rootScope.minDate = new Date('2014-01-05');
        $rootScope.date = new Date('2014-01-15');

        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-min-date="minDate">' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        $rootScope.minDate = new Date('2014-01-20');
        element.isolateScope().$apply();
        var amDatePicker = element.isolateScope().amDatePicker;
        expect(amDatePicker.ngModelCtrl.$viewValue).toEqual($rootScope.minDate);
    });


    it('should set new max date and change selected date respectively if it greater', function() {
        $rootScope.maxDate = new Date('2014-01-20');
        $rootScope.date = new Date('2014-01-15');

        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-max-date="maxDate">' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        $rootScope.maxDate = new Date('2014-01-10');
        element.isolateScope().$apply();
        var amDatePicker = element.isolateScope().amDatePicker;
        expect(amDatePicker.ngModelCtrl.$viewValue).toEqual($rootScope.maxDate);
    });


    it('should require date', function() {
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        expect(amDatePicker.ngModelCtrl.$error.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });


    it('should set error if date is not valid', function() {
        $rootScope.date = "1970-01-01";
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        expect(amDatePicker.ngModelCtrl.$error.valid).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
    });


    it('should set error if date lesser than min date', function() {
        $rootScope.minDate = new Date('1970-01-02');
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-min-date="minDate"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        $rootScope.date = new Date("1970-01-01");
        element.isolateScope().$apply();

        expect(amDatePicker.ngModelCtrl.$error.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);

        /* should update error state if max date is reset */
        $rootScope.minDate = undefined;
        element.isolateScope().$apply();
        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });


    it('should set error if date greater than max date', function() {
        $rootScope.maxDate = new Date('1970-01-01');
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-max-date="maxDate"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        $rootScope.date = new Date("1970-01-02");
        element.isolateScope().$apply();

        expect(amDatePicker.ngModelCtrl.$error.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);

        /* should update error state if max date is reset */
        $rootScope.maxDate = undefined;
        element.isolateScope().$apply();
        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });


    it('should not set error if max date is null', function() {
        $rootScope.maxDate = null;
        $rootScope.date = new Date("1970-01-02");
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-max-date="maxDate"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        element.isolateScope().$apply();

        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });


    it('should not set error if min date is null', function() {
        $rootScope.minDate = null;
        $rootScope.date = new Date("1970-01-02");
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-min-date="minDate"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        element.isolateScope().$apply();

        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });


    it('should not set error if min date is same as date', function() {
        $rootScope.minDate = new Date("1970-01-02");
        $rootScope.date = new Date("1970-01-02");
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-min-date="minDate"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        element.isolateScope().$apply();

        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });


    it('should not set error if max date is same as date', function() {
        $rootScope.maxDate = new Date("1970-01-02");
        $rootScope.date = new Date("1970-01-02");
        var element = $compile('<am-date-picker ng-model="date"' +
                               '                am-max-date="maxDate"' +
                               '                required>' +
                               '</am-date-picker>')($rootScope);
        $rootScope.$digest();

        var amDatePicker = element.isolateScope().amDatePicker;

        element.isolateScope().$apply();

        expect(amDatePicker.ngModelCtrl.$$success.maxDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.minDate).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.required).toBe(true);
        expect(amDatePicker.ngModelCtrl.$$success.valid).toBe(true);
    });

});
