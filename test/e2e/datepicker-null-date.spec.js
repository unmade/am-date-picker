'use strict';

var moment = require('../../bower_components/moment/min/moment-with-locales.min.js');


describe('am.date-picker directive. Init picker with date set to null', function() {
    moment.locale('en');
    var currDate = moment(),
        inputContainer = element(by.tagName('md-input-container')),
        label = inputContainer.element(by.tagName('label')),
        input = inputContainer.element(by.tagName('input'));

    beforeEach(function() {
        browser.get('/test/e2e/datepicker-null-date.html');
    });


    it('should init picker with date set to null', function() {
        expect(label.getText()).toEqual('');
        expect(input.getAttribute('value')).toEqual('');
    });


    it('should not have disabled days, when it opens', function() {
        input.click();

        var days = element.all(by.css('.am-date-picker__days button'));
        expect(days.count()).toEqual(currDate.daysInMonth());

        var todayDay = element.all(by.css('.am-date-picker__day--is-selected'));
        expect(todayDay.count()).toEqual(1);
        expect(todayDay.get(0).getText()).toEqual(currDate.format('D'));

        days.each(function(e, i) {
            expect(hasClass(e, 'am-date-picker__day--is-disabled')).toBe(false);
        })
    });

});
