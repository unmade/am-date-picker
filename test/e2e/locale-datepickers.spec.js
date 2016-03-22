'use strict';

var moment = require('../../bower_components/moment/min/moment-with-locales.min.js');

describe('am.date-picker e2e test. (Two datepickers with different locale)', function() {
    var firstContainer = element.all(by.tagName("md-input-container")).first(),
        firstInput = firstContainer.element(by.tagName('input')),
        secondContainer = element.all(by.tagName("md-input-container")).last(),
        secondInput = secondContainer.element(by.tagName('input'));


    beforeEach(function() {
        browser.get('/test/e2e/locale-datepickers.html');
    });


    it('first picker should have english locale', function() {
        function checkLocale() {
            var today = moment();
            expect(firstInput.getAttribute('value')).toEqual(today.format('LL'));

            var header = element(by.css('.am-date-picker__header-current-date')),
                currYear = header.element(by.tagName('p')),
                currFormatDate = header.element(by.tagName('h2')),
                monthNameNav = element.all(by.css('.am-date-picker__month-year button')).get(1),
                weekdaysName = element.all(by.css('.am-date-picker__weekdays span'))
                                          .map(function(e, i) { return e.getText();});
            expect(currYear.getText()).toEqual(today.format('YYYY'));
            expect(currFormatDate.getText()).toBe(today.format('ddd, MMM D'));
            expect(monthNameNav.getText()).toEqual(today.format('MMMM YYYY').toUpperCase());
            expect(weekdaysName).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
        }

        firstInput.click();
        checkLocale();

        $$('md-dialog-actions button').get(0).click();  // Today button
        checkLocale();  // nothing should change
    });


    it('second picker should have russian locale', function() {
        function checkLocale() {
            var today = moment().locale('ru');
            expect(secondInput.getAttribute('value')).toEqual(today.format('LL'));

            var header = element(by.css('.am-date-picker__header-current-date')),
                currYear = header.element(by.tagName('p')),
                currFormatDate = header.element(by.tagName('h2')),
                monthNameNav = element.all(by.css('.am-date-picker__month-year button')).get(1),
                weekdaysName = element.all(by.css('.am-date-picker__weekdays span'))
                                          .map(function(e, i) { return e.getText();});
            expect(currYear.getText()).toEqual(today.format('YYYY'));
            expect(currFormatDate.getText()).toBe(today.format('ddd, MMM D'));
            expect(monthNameNav.getText()).toEqual(today.format('MMMM YYYY').toUpperCase());
            expect(weekdaysName).toEqual(['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);
        }

        secondInput.click();
        checkLocale();

        $$('md-dialog-actions button').get(0).click();  // Today button
        checkLocale();  // nothing should change
    });

})
