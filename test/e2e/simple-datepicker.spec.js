'use strict';

var moment = require('../../bower_components/moment/min/moment-with-locales.min.js');

var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
};

describe('am.date-picker directive e2e test (simple datepicker)', function() {
    moment.locale('en');
    var currDate = moment(),
        inputContainer = element(by.tagName('md-input-container')),
        label = inputContainer.element(by.tagName('label')),
        input = inputContainer.element(by.tagName('input'));


    beforeEach(function() {
        browser.get('/test/e2e/simple-datepicker.html');
    });


    it('should have input calendar without a label and icon', function() {
        var icons = inputContainer.all(by.tagName('md-icon')),
            clearIcon = icons.get(0),
            clearIconPath = '/dist/images/icons/ic_close_24px.svg';

        expect(icons.count()).toBe(1);
        expect(clearIcon.evaluate('amDatePicker.allowClear')).toBe(true);
        expect(clearIcon.getAttribute('md-svg-icon')).toEqual(clearIconPath);

        expect(label.getText()).toEqual('');
        expect(input.getAttribute('value')).toEqual('');
    });


    it('should open picker', function() {
        expect(element(by.tagName('md-dialog')).isPresent()).toBe(false);
        input.click();
        expect(element(by.tagName('md-dialog')).isPresent()).toBe(true);
    });


    it('should have current date in picker header', function() {
        input.click();
        var header = element(by.css('.am-date-picker__header-current-date')),
            currYear = header.element(by.tagName('p')),
            currFormatDate = header.element(by.tagName('h2'));
        expect(currYear.getText()).toEqual(currDate.format('YYYY'));
        expect(currFormatDate.getText()).toBe(currDate.format('D MMMM'));
    });


    it('should have month navigation', function() {
        input.click();
        var leftChevronSrc = '/dist/images/icons/ic_chevron_left_18px.svg',
            rightChevronSrc = '/dist/images/icons/ic_chevron_right_18px.svg',

            monthNav = element.all(by.css('.am-date-picker__month-year button')),
            prev = monthNav.get(0).element(by.tagName('md-icon')),
            month = monthNav.get(1),
            next = monthNav.get(2).element(by.tagName('md-icon'));

        expect(prev.getAttribute('md-svg-icon')).toBe(leftChevronSrc);
        expect(month.getText()).toBe(currDate.format('MMMM YYYY').toUpperCase());
        expect(next.getAttribute('md-svg-icon')).toBe(rightChevronSrc);
    });


    it('should have weekdays in calendar title', function() {
        input.click();
        var weekdaysName = $$('.am-date-picker__weekdays span')
                                  .map(function(e, i) { return e.getText();});
        expect(weekdaysName).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    });


    it('should display calendar for current month', function() {
        input.click();

        var days = element.all(by.css('.am-date-picker__days button'));
        expect(days.count()).toEqual(currDate.daysInMonth());

        var todayDay = element.all(by.css('.am-date-picker__day--is-selected'));
        expect(todayDay.count()).toEqual(1);
        expect(todayDay.get(0).getText()).toEqual(currDate.format('D'));

        days.each(function(e, i) {
            expect(hasClass(e, 'am-date-picker__day--is-today')).toBe(false);
            expect(e.getAttribute('disabled')).toBe(null);
        })
    });


    it('should have OK button', function() {
        input.click();
        var buttons = $$('md-dialog-actions button');
        expect(buttons.count()).toEqual(1);
        expect(buttons.get(0).getText()).toEqual('OK');
    });


    it('should click OK button and close calendar', function() {
        input.click();
        var buttons = element.all(by.css('md-dialog-actions button'));
        expect(buttons.count()).toEqual(1);

        buttons.get(0).click();
        expect(element(by.tagName('md-dialog')).isPresent()).toBe(false);
    });


    it('should change month', function() {
        input.click();
        var monthNav = element.all(by.css('.am-date-picker__month-year button'));

        /* change to previous month */
        monthNav.get(0).click();
        var days = element.all(by.css('.am-date-picker__days button'));
        expect(days.count()).toEqual(currDate.subtract(1, 'month').daysInMonth());

        /* change to next to current month */
        monthNav.get(2).click().click();
        var days = element.all(by.css('.am-date-picker__days button'));
        expect(days.count()).toEqual(currDate.add(2, 'month').daysInMonth());
        currDate.subtract(1, 'month'); /* return currDate to currentDate */
    });


    it('should select date', function() {
        var buttons = element.all(by.css('md-dialog-actions button')),
            dialog = element(by.tagName('md-dialog')),
            days = element.all(by.css('.am-date-picker__days button'));

        input.click();
        days.get(16).click();
        expect(hasClass(days.get(16), 'am-date-picker__day--is-selected')).toBe(true);
        buttons.get(0).click();
        expect(input.getAttribute('value')).toEqual(currDate.date(17).format('LL'));
    });


    it('should clear selected date', function() {
        input.click();
        var dialog = element(by.tagName('md-dialog')),
            days = $$('.am-date-picker__days button');
        days.get(16).click();

        var clearIcon = inputContainer.all(by.tagName('md-icon')).get(1);
        browser.executeScript("angular.element(document.querySelectorAll('md-icon')[1])[0].click();");
        expect(input.getAttribute('value')).toEqual('');
    });


    it('should open and select year in year selection', function() {
        input.click();
        var pastDate = moment().year(1920),
            monthNav = $$('.am-date-picker__month-year button').get(1),
            yearSelector = $('.am-date-picker__year-selector');

        expect(yearSelector.isDisplayed()).toBe(false);
        monthNav.click();
        expect(yearSelector.isDisplayed()).toBe(true);

        var years = $$('.am-date-picker__year-selector div'),
            activeYear = yearSelector.$('.am-date-picker__year--is-active');
        expect(years.first().getText()).toEqual('1920');
        expect(years.last().getText()).toEqual('2020');
        expect(activeYear.getText()).toEqual(currDate.format('YYYY'));

        years.get(0).click();
        expect(yearSelector.isDisplayed()).toBe(false);
        expect(monthNav.getText()).toEqual(pastDate.format('MMMM YYYY').toUpperCase());

        /* check if calendar change respectively */
        var days = $$('.am-date-picker__days button');
        expect(days.count()).toEqual(pastDate.daysInMonth());

        /* change active year to 1920 */
        days.get(0).click();
        monthNav.click();
        expect(activeYear.getText()).toEqual('1920');
    });


    it('should open year selection and click BACK button', function() {
        input.click();
        var pastDate = moment().year(1920),
            monthNav = $$('.am-date-picker__month-year button').get(1),
            yearSelector = $('.am-date-picker__year-selector');

        expect(yearSelector.isDisplayed()).toBe(false);
        monthNav.click();
        expect(yearSelector.isDisplayed()).toBe(true);

        var buttons = $$('md-dialog-actions button');
        expect(buttons.count()).toEqual(1);
        expect(buttons.get(0).getText()).toEqual('BACK');
        buttons.get(0).click();
        expect(yearSelector.isDisplayed()).toBe(false);
    });

});
