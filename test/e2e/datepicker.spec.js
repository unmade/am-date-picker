'use strict';

var moment = require('../../bower_components/moment/min/moment-with-locales.min.js');


describe('am.date-picker directive e2e test (datepicker with opt)', function() {
    var selectedDate = moment({year: 2014, month: 0, date: 10}).locale('ru'),
        inputContainer = element(by.tagName('md-input-container')),
        label = inputContainer.element(by.tagName('label')),
        input = inputContainer.element(by.tagName('input'));


    beforeEach(function() {
        browser.get('/test/e2e/datepicker.html');
    });


    it('should have input calendar without a label and icon', function() {
        var icons = inputContainer.all(by.tagName('md-icon')),
            calendarIcon = icons.get(0),
            calendarIconPath = '/dist/images/icons/ic_today_24px.svg';
        expect(icons.count()).toBe(1);
        expect(calendarIcon.evaluate('amDatePicker.showInputIcon')).toBe(true);
        expect(calendarIcon.getAttribute('md-svg-icon')).toEqual(calendarIconPath);

        expect(label.getText()).toEqual('Pick a Date');
        expect(input.getAttribute('value')).toEqual('10.01.2014');
    });


    it('should open the picker', function() {
        expect(element(by.tagName('md-dialog')).isPresent()).toBe(false);
        input.click();
        expect(element(by.tagName('md-dialog')).isPresent()).toBe(true);
    });

    it('should open the picker by clicking calendar icon', function() {
        var icons = inputContainer.all(by.tagName('md-icon')),
            calendarIcon = icons.get(0);

        expect(element(by.tagName('md-dialog')).isPresent()).toBe(false);
        calendarIcon.click();

        expect(element(by.tagName('md-dialog')).isPresent()).toBe(true);
    });


    it('should have current date in picker header', function() {
        input.click();
        var header = $('.am-date-picker__header-current-date'),
            selectedYear = header.element(by.tagName('p')),
            selectedFormatDate = header.element(by.tagName('h2'));
        expect(selectedYear.getText()).toEqual(selectedDate.format('YYYY'));
        expect(selectedFormatDate.getText()).toBe(selectedDate.format('D/M'));
    });


    it('should have month navigation', function() {
        input.click();
        var leftChevronSrc = '/dist/images/icons/ic_chevron_left_18px.svg',
            rightChevronSrc = '/dist/images/icons/ic_chevron_right_18px.svg',

            monthNav = $$('.am-date-picker__month-year button'),
            prev = monthNav.get(0).element(by.tagName('md-icon')),
            month = monthNav.get(1),
            next = monthNav.get(2).element(by.tagName('md-icon'));

        expect(prev.getAttribute('md-svg-icon')).toBe(leftChevronSrc);
        expect(month.getText()).toBe(selectedDate.format('MMMM YYYY').toUpperCase());
        expect(next.getAttribute('md-svg-icon')).toBe(rightChevronSrc);
    });


    it('should have weekdays in calendar title', function() {
        input.click();
        var weekdaysName = $$('.am-date-picker__weekdays span')
                              .map(function(e, i) { return e.getText();});
        expect(weekdaysName).toEqual(['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);
    });


    it('should display calendar for current month', function() {
        input.click();

        var days = $$('.am-date-picker__days button');
        expect(days.count()).toEqual(selectedDate.daysInMonth());

        var selectedDay = $$('.am-date-picker__day--is-selected');
        expect(selectedDay.count()).toEqual(1);
        expect(selectedDay.get(0).getText()).toEqual(selectedDate.format('D'));

        var disabledDays = [0, 1, 2, 3, 15, 16, 17, 18, 19, 20,
                            21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            bool;
        days.each(function(e, i) {
            bool = (disabledDays.indexOf(i) != -1);
            expect(e.getAttribute('disabled')).toBe((bool) ? 'true' : null);
            expect(hasClass(e, 'am-date-picker__day--is-today')).toBe(false);
        })
    });


    it('should have "Today", "Cancel" and "OK" button', function() {
        input.click();
        var buttons = $$('md-dialog-actions button');
        expect(buttons.count()).toEqual(3);
        expect(buttons.get(0).getText()).toEqual('СЕГОДНЯ');
        expect(buttons.get(0).isEnabled()).toBe(false);
        expect(buttons.get(1).getText()).toEqual('ОТМЕНА');
        expect(buttons.get(2).getText()).toEqual('OK');
    });


    it('should click "OK" button and close calendar', function() {
        input.click();

        var buttons = $$('md-dialog-actions button');
        buttons.get(1).click();
        expect(element(by.tagName('md-dialog')).isPresent()).toBe(false);
    });


    it('should select new date when initial date is set,\
        click "Cancel" button and new selected date should be cancelled',
      function() {
        input.click();
        var buttons = element.all(by.css('md-dialog-actions button')),
            days = element.all(by.css('.am-date-picker__days button'));
        days.get(12).click();
        buttons.get(1).click();
        expect(input.getAttribute('value')).toEqual('10.01.2014');
    });


    it('should change month', function() {
        input.click();
        var monthNav = $$('.am-date-picker__month-year button');

        /* change to previous month */
        monthNav.get(0).click();
        var days = $$('.am-date-picker__days button');
        expect(days.count()).toEqual(selectedDate.subtract(1, 'month').daysInMonth());

        /* change to next to current month */
        monthNav.get(2).click().click();
        days = $$('.am-date-picker__days button');
        expect(days.count()).toEqual(selectedDate.add(2, 'month').daysInMonth());
        selectedDate.subtract(1, 'month'); /* return selectedDate to selected date */
    });


    it('should not select disabled date on month changes', function() {
        input.click();
        var monthNav = $$('.am-date-picker__month-year button');

        /* change to previous month */
        monthNav.get(0).click();
        var days = $$('.am-date-picker__days button'),
            day = days.get(13),
            buttons = element.all(by.css('md-dialog-actions button'));

        expect(day.getAttribute('disabled')).toBe('true');
        expect(buttons.get(2).isEnabled()).toBe(false);
        days.get(13).click();
    });


    it('should select another date', function() {
        input.click();

        var dialog = element(by.tagName('md-dialog')),
            days = $$('.am-date-picker__days button'),
            buttons = element.all(by.css('md-dialog-actions button'));
        days.get(13).click();

        expect(hasClass(days.get(13), 'am-date-picker__day--is-selected')).toBe(true);
        buttons.get(2).click();
        expect(input.getAttribute('value')).toEqual(selectedDate.date(14).format('L'));
    });


    it('should open and select year in year selection', function() {
        input.click();
        var pastDate = moment({year: 2000, month: 0, date: 1}).locale('ru'),
            monthNav = $$('.am-date-picker__month-year button').get(1),
            yearSelector = $('.am-date-picker__year-selector');

        expect(yearSelector.isDisplayed()).toBe(false);
        monthNav.click();
        expect(yearSelector.isDisplayed()).toBe(true);

        var years = $$('.am-date-picker__year-selector div'),
            activeYear = yearSelector.$('.am-date-picker__year--is-active');
        expect(years.first().getText()).toEqual('2000');
        expect(years.last().getText()).toEqual('2015');
        expect(activeYear.getText()).toEqual(selectedDate.format('YYYY'));

        years.first().click();
        expect(yearSelector.isDisplayed()).toBe(false);
        expect(monthNav.getText()).toEqual(pastDate.format('MMMM YYYY').toUpperCase());

        /* check if calendar change respectively */
        var days = $$('.am-date-picker__days button');
        expect(days.count()).toEqual(pastDate.daysInMonth());

        /* active year shouldn't change, because date is disabled */
        days.get(0).click();
        monthNav.click();
        expect(activeYear.getText()).toEqual('2000');
    });


    it('should open year selection and click BACK button. Back button text should be "Назад"', function() {
        input.click();
        var pastDate = moment().year(1920),
            monthNav = $$('.am-date-picker__month-year button').get(1),
            yearSelector = $('.am-date-picker__year-selector');

        expect(yearSelector.isDisplayed()).toBe(false);
        monthNav.click();
        expect(yearSelector.isDisplayed()).toBe(true);

        var buttons = $$('md-dialog-actions button');
        expect(buttons.count()).toEqual(2);
        expect(buttons.get(1).getText()).toEqual('НАЗАД');
        buttons.get(1).click();
        expect(yearSelector.isDisplayed()).toBe(false);
    });

});
