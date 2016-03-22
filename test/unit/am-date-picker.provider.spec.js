'use strict';

describe('am.date-picker provider unit tests', function() {
    var amDatePickerConfigProvider;

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
    });


    it('should set global config and init calendar', function () {
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
    });


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

});
