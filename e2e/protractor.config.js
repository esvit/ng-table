var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
    cleanDestination: true,
    dest: './out/test/end2end/reports',
    filename: 'e2e.html',
    ignoreSkippedSpecs: true,
    showSummary: true,

    // reportOnlyFailedSpecs: true,   
    // captureOnlyFailedSpecs: true
});

exports.config = {

    allScriptsTimeout: 11000,

    specs: [
        '*.spec.ts'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8080/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        showColors: true,
        includeStackTrace: true
    },

    beforeLaunch: function () {
        require('ts-node').register({
            project: 'e2e'
        });
        // Setup the report before any tests start
        return new Promise(function (resolve) {
            reporter.beforeLaunch(resolve);
        });
    },

    onPrepare: function () {
        jasmine.getEnv().addReporter(reporter);

        return browser.getProcessedConfig().then(function (config) {
            global.capabilities = config.capabilities;
        });
    },

    afterLaunch: function (exitCode) {
        // Close the report after all tests finish
        return new Promise(function (resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        });
    }
};