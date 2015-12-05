exports.config = {
  framework: 'jasmine',
  baseUrl: 'http://localhost:8000',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/*.js'],
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
  },
}
