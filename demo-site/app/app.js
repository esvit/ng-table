(function(){
    'use strict';

    angular.module('main', ['ngRoute', 'ngTable', 'ngSocial', 'embedCodepen'])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.
                    when('/', {
                        templateUrl: 'views/intro/overview.html',
                        controller: 'introController',
                        controllerAs: 'vm'
                    }).
                    when('/demo/todo', {
                        templateUrl: 'views/todo.html',
                        controller: function () {

                        }
                    }).
                    when('/:section/:article', {
                        templateUrl: function ($routeParams) {
                            return 'views/' + $routeParams.section + '/' + $routeParams.article + '.html';
                        },
                        controller: function () {

                        }
                    });
            }])
        .controller('introController', function(NgTableParams){
            var self = this;
            var data = [{name: "Moroni", age: 50},
                {name: "Simon", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Christian", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27}
            ];
            self.tableParams = new NgTableParams({ count: 5}, { counts: [5, 10, 25], data: data, filterDelay: 0});
        })
        .directive('prettycode', function() {
            return {
                restrict: 'A',
                scope: {
                    'code': '=prettycode',
                    'prettyLang': '@prettyLang'
                },
                link: function postLink(scope, element, attrs) {
                    scope.$watch('code', function(code) {
                        if (angular.isUndefined(code)) {
                            return;
                        }
                        element.html(hljs.highlight(scope.prettyLang || 'html', code).value);
                    });
                    element.html(hljs.highlight(scope.prettyLang || 'html', element.text()).value);
                }
            };
        });

})();
