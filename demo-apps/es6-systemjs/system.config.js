(function (/*globals*/) {

    var maps = {
        'angular': 'node_modules/angular',
        'ng-table': 'node_modules/ng-table',
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
    };

    var packages = {
        'ng-table': { main: '/bundles/ng-table.js', defaultExtension: 'js', format: 'amd' },
        'src': { defaultExtension: 'js' },
        'angular': { main: 'index.js', defaultExtension: 'js' }
    };

    System.config({
        map: maps,
        packages: packages,
        transpiler: 'plugin-babel',
        meta: {
            '*.js': {
                babelOptions: {
                    // although chrome supports es2015 we're running this sample app in Safari so we
                    // need to transpile code to ecmascript5
                    es2015: true
                }
            }
        }
    });
})(this);