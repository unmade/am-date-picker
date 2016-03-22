'use strict'

var moment = require('../../bower_components/moment/min/moment-with-locales.min.js');

describe('am.date-picker e2e test. (Linked Datepickers)', function() {
    var firstDate = moment({year: 2014, month: 0, date: 10}),
        secondDate = moment({year: 2014, month: 0, date: 20});
    var firstContainer = element.all(by.tagName("md-input-container")).first(),
        firstInput = firstContainer.element(by.tagName('input')),
        secondContainer = element.all(by.tagName("md-input-container")).last(),
        secondInput = secondContainer.element(by.tagName('input'));


    beforeEach(function() {
        browser.get('/test/e2e/linked-datepickers.html');
    });


    it('first picker should have disabled date starting with the date selected in the second one',
        function() {
            firstInput.click();
            var days = $$('.am-date-picker__days button'),
                disabledDays = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ,31],
                bool;
            days.each(function(e, i) {
                bool = (disabledDays.indexOf(i) != -1);
                expect(e.getAttribute('disabled')).toBe((bool) ? 'true' : null);
            })
        });


    it('second picker should have disabled date ending with the date selected in the first one',
        function() {
            secondInput.click();
            var days = $$('.am-date-picker__days button'),
                disabledDays = [0, 1, 2, 3, 4, 5, 6, 7, 8],
                bool;
            days.each(function(e, i) {
                bool = (disabledDays.indexOf(i) != -1);
                expect(e.getAttribute('disabled')).toBe((bool) ? 'true' : null);
            })
        });


    it('changes date in first picker and disabled days in second one should change respectively',
        function() {
            firstInput.click();
            var days = $$('.am-date-picker__days button'),
                buttons = $$('md-dialog-actions button');
            days.get(14).click();
            buttons.get(0).click();

            secondInput.click();
            days = $$('.am-date-picker__days button');
            var disabledDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                bool;
            days.each(function(e, i) {
                bool = (disabledDays.indexOf(i) != -1);
                expect(e.getAttribute('disabled')).toBe((bool) ? 'true' : null);
            });

        });


    it('changes date in second picker and disabled days in first one should change respectively',
        function() {
            secondInput.click();
            var days = $$('.am-date-picker__days button'),
                buttons = $$('md-dialog-actions button');
            days.get(14).click();
            buttons.get(0).click();

            firstInput.click();
            days = $$('.am-date-picker__days button');
            var disabledDays = [15, 16, 17, 18, 19, 20, 21, 22,
                                23, 24, 25, 26, 27, 28, 29, 30 ,31],
                bool;
            days.each(function(e, i) {
                bool = (disabledDays.indexOf(i) != -1);
                expect(e.getAttribute('disabled')).toBe((bool) ? 'true' : null);
            });

        });

})
