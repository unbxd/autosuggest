
module.exports = function (config) {
  
  process.env.CHROME_BIN = require('puppeteer').executablePath()

  config.set({

    basePath: '',

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-jquery',
      'karma-html2js-preprocessor',
      'karma-sinon',
      'karma-fixture',
      'karma-json-fixtures-preprocessor',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-sinon-chai'
    ],

    frameworks: ['mocha', 'chai', 'jquery-1.8.3', 'sinon', 'fixture', 'sinon-chai'],

    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },

    preprocessors: {
      '**/*.html': ['html2js'],
      '**/*.json': ['json_fixtures']
    },

    files: [
        './node_modules/handlebars/dist/handlebars.min.js',
        './index.html',
        './unbxdAutosuggest.js',
        'mocks/*.json',
        'tests/test.js'
    ],

    reporters: ['spec'],
    port: 9876,
    colors: true,
    singleRun: true,

    // level of logging
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless']
    // customLaunchers:{
    //   HeadlessChrome:{
    //     base: 'ChromeHeadless',
    //     flags: ['--no-sandbox','--remote-debugging-port=9222']
    //   }
    // }
  });
};
