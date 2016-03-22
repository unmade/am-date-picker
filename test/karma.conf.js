module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
        'bower_components/moment/min/moment-with-locales.min.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-aria/angular-aria.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-material/angular-material.js',
        'bower_components/angular-mocks/angular-mocks.js',
        {pattern: 'dist/images/icons/*.svg', watched: false, included: false, served: true},
        'dist/am-date-picker.min.js',
        'test/unit/helpers.js',
        'test/unit/**/*.spec.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
