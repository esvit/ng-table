define('app', [
    'angular',
    'angular-route',
    'angular-mocks',
    'angular-resource',
    
    'ngSocial',
    'ngTable',

    'bootstrap',
    'disqus'
], function (angular) {
    return angular.module('app', ['ngTable', 'ngRoute', 'ngResource', 'ngMockE2E', 'disqus', 'ngSocial']);
});