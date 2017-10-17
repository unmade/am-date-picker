'use strict'

var moment = require('../../bower_components/moment/min/moment-with-locales.min.js');


describe('am.date-picker directive with ng-messages', function() {
    moment.locale('en');
    var currDate = moment(),
        inputContainer = element(by.tagName('md-input-container')),
        label = inputContainer.element(by.tagName('label')),
        input = inputContainer.element(by.tagName('input'));

    beforeEach(function() {
        browser.get('/test/e2e/datepicker-ng-messages.html');
    });


    it('should show required message', function() {
        var el = element(by.id('required'));
        expect(el.isPresent()).toBe(true);
        expect(el.getText()).toEqual('The date is required');

        element(by.id('setDate')).click();
        expect(el.isPresent()).toBe(false);
    });


    it('shoud show date invalid message', function() {
        var el = element(by.id('valid'));
        expect(el.isPresent()).toBe(false);

        element(by.id('setInvalidDate')).click();
        expect(el.getText()).toEqual('The entered value is not a date!');
        expect(el.isPresent()).toBe(true);

        element(by.id('setDate')).click();
        expect(el.isPresent()).toBe(false);
    });


    it('should show date is too early message', function() {
        var el = element(by.id('minDate'));
        expect(el.isPresent()).toBe(false);

        element(by.id('setLessThanMinDate')).click();
        expect(el.getText()).toEqual('Date is too early!');
        expect(el.isPresent()).toBe(true);

        element(by.id('setDate')).click();
        expect(el.isPresent()).toBe(false);
    });


    it('should show date is too late message', function() {
        var el = element(by.id('maxDate'));
        expect(el.isPresent()).toBe(false);

        element(by.id('setGreaterThanMaxDate')).click();
        expect(el.getText()).toEqual('Date is too late!');
        expect(el.isPresent()).toBe(true);

        element(by.id('setLessThanMinDate')).click();
        expect(el.isPresent()).toBe(false);
    });

});
