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
        'ngSocial': '../bower_components/angular-social/angular-social.src',
        'Editr': '../editr/editr',

        'prettify': '../bower_components/google-code-prettify/src/prettify',
        'lang-css': '../bower_components/google-code-prettify/src/lang-css',

        // bootstrap
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        
        'ace': '//cdn.jsdelivr.net/ace/1.1.01/min/ace',
        'ace/ext/emmet': '//cdn.jsdelivr.net/ace/1.1.01/min/ext-emmet'
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

        'lang-css': { deps: ['prettify'] },
        
        'ace/ext/emmet': { deps: ['ace'] },
        'Editr/libs/parser.coffeescript': { deps: ['ace'] },
        'Editr/libs/parser.less': { deps: ['ace'] },
        'Editr/libs/ext.emmet': { deps: [
            'ace/ext/emmet',
        ] },
        
        'Editr/editr': { deps: [
            'jquery',
            'Editr/libs/ext.emmet',
            'Editr/libs/parser.coffeescript',
            'Editr/libs/parser.less'
        ] }
    },
    priority: [
        'jquery', 'angular'
    ],
    urlArgs: 'v=1.0'
});