// Karma configuration file
// See http://karma-runner.github.io/0.10/config/configuration-file.html
const testGlob = 'test/index.js';
var debug = process.env.npm_lifecycle_event === 'test:debug'
const webpackConfig = require('./webpack.config')({ test: true, noCoverage: debug });

module.exports = function (config) {
    let reporters = ['jasmine-diff', 'dots', 'spec'];
    if (!debug) {
        reporters.push('coverage');
    }
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // libraries
            'node_modules/lodash/lodash.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            testGlob
        ],

        // generate js files from html templates
        preprocessors: {
            [testGlob]: ['webpack']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: {
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false
            }
        },
        reporters: reporters,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        browsers: [debug ? 'Chrome' : 'PhantomJS'],
        coverageReporter: {
            reporters: [
                { type: 'lcov', dir: 'out/coverage' },
                { type: 'cobertura', dir: 'out/coverage' },
                { type: 'json', dir: 'out/coverage' },
                { type: 'text-summary' }
            ]
        }
    });
};
