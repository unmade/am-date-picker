'use strict';


describe("am-date-picker constant", function() {

    var DEBUG;

    beforeEach(function() {
        module("am.date-picker");
    });

    describe("OPTIONS", function() {
        it("should be an array of options", inject(function(OPTIONS) {
            expect(OPTIONS).toEqual([
                'allowClear', 'backButtonText', 'cancelButton', 'inputLabel',
                'maxDate', 'minDate', 'maxYear', 'minYear', 'locale',
                'inputDateFormat', 'popupDateFormat', 'showInputIcon', 'todayButton',
                'calendarIcon', 'prevIcon', 'nextIcon', 'clearIcon'
            ]);
        }));
    });
    
});
