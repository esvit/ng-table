requirejs.config({
    baseUrl: '/js',
    paths: {
        // jquery
        'jquery': '../bower_components/jquery/jquery',

        // angular
        'angular': '../bower_components/angular/angular',
        'angular-resource': '../bower_components/angular-resource/angular-resource',
        'angular-route': '../bower_components/angular-route/angular-route',
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        
        'ngTable': '../bower_components/ng-table/ng-table',
        'ngSocial': '../bower_components/angular-social/angular-social',

        'prettify': '../bower_components/google-code-prettify/src/prettify',
        'lang-css': '../bower_components/google-code-prettify/src/lang-css',

        // bootstrap
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap'
    },
    shim: {
        'angular': { exports: 'angular', deps: ['jquery'] },
        'angular-resource': { deps: ['angular'] },
        'angular-route': { deps: ['angular'] },
        'angular-animate': { deps: ['angular'] },
        'angular-mocks': { deps: ['angular'] },

        'bootstrap': { deps: ['jquery'] },
        'disqus': { deps: ['jquery','angular'] },
        'ngTable': { deps: ['jquery','angular'] },
        'ngSocial': { deps: ['jquery','angular'] },

        'lang-css': { deps: ['prettify'] }
    },
    priority: [
        'jquery', 'angular'
    ],
    urlArgs: 'v=1.0'
});