exports.config = {
    framework: 'jasmine',
    baseUrl: 'http://localhost:8000',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/*.spec.js'],
    suites: {
        datepicker: 'e2e/datepicker.spec.js',
        simple: 'e2e/simple-datepicker.spec.js',
        linked: 'e2e/linked-datepickers.spec.js',
        locale: 'e2e/locale-datepickers.spec.js',
        nullDate: 'e2e/datepicker-null-date.spec.js',
        messages: 'e2e/datepicker-ng-messages.spec.js'
    },
    capabilities: {
        browserName: 'chrome'
    },
    onPrepare: function() {
        var disableNgAnimate = function() {
            angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
                $animate.enabled(false);
            }]);
        };

        browser.addMockModule('disableNgAnimate', disableNgAnimate);

        browser.getCapabilities().then(function(caps) {
            browser.params.browser = caps.get('browserName');
        });

        global.hasClass = function(element, cls) {
            return element.getAttribute('class').then(function (classes) {
                return classes.split(' ').indexOf(cls) !== -1;
            });
        };

    },
}
