/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTablePagination
 * @restrict A
 */
app.directive('ngTablePagination', ['$compile',
    function ($compile) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                'params': '=ngTablePagination',
                'templateUrl': '='
            },
            replace: false,
            link: function (scope, element, attrs) {

                scope.params.settings().$scope.$on('ngTableAfterReloadData', function () {
                    scope.pages = scope.params.generatePagesArray(scope.params.page(), scope.params.total(), scope.params.count());
                }, true);

                scope.$watch('templateUrl', function(templateUrl) {
                    if (angular.isUndefined(templateUrl)) {
                        return;
                    }
                    var line = angular.element(document.createElement('tr'));

                    var template = angular.element(document.createElement('td'));
                    
                    template.attr({
                        'ng-include': 'templateUrl',
                        'colspan': scope.$parent.$columns.length
                    });

                    line.append(template);
                    element.append(line);
                    $compile(line)(scope);
                });
            }
        };
    }
]);
