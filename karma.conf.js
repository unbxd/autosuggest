module.exports = function (config) {
  'use strict';

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
      '**/*.json'   : ['json_fixtures']
    },

    // customLaunchers: {
    //   Chrome_with_debugging: {
    //     base: 'Chrome',
    //     chromeDataDir: path.resolve(__dirname, '.chrome')
    //   }
    // },

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
    autoWatch: false,
    singleRun: true,

    // level of logging
    logLevel: config.LOG_INFO,
  });
};
