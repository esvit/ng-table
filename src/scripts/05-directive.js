/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable
 * @module ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTableController ngTableController}.
 */
app.directive('ngTable', ['$q', '$parse',
    function($q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: 'ngTableController',
            compile: function(element) {
                var columns = [],
                    i = 0,
                    row = null;

                // IE 8 fix :not(.ng-table-group) selector
                angular.forEach(angular.element(element.find('tr')), function(tr) {
                    tr = angular.element(tr);
                    if (!tr.hasClass('ng-table-group') && !row) {
                        row = tr;
                    }
                });
                if (!row) {
                    return;
                }
                angular.forEach(row.find('td'), function(item) {
                    var el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }

                    var getAttrValue = function(attr){
                        return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                    };

                    var parsedAttribute = function(attr) {
                        var expr = getAttrValue(attr);
                        if (!expr){
                            return undefined;
                        }
                        return function(scope, locals) {
                            return $parse(expr)(scope, angular.extend(locals || {}, {
                                $columns: columns
                            }));
                        };
                    };

                    var titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                    if (titleExpr){
                        el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                    }
                    // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend ngTableColumn with
                    // a corresponding "safe" default
                    columns.push({
                        id: i++,
                        title: parsedAttribute('title'),
                        titleAlt: parsedAttribute('title-alt'),
                        headerTitle: parsedAttribute('header-title'),
                        sortable: parsedAttribute('sortable'),
                        'class': parsedAttribute('header-class'),
                        filter: parsedAttribute('filter'),
                        headerTemplateURL: parsedAttribute('header'),
                        filterData: parsedAttribute('filter-data'),
                        show: (el.attr("ng-if") ? function (scope) {
                            return $parse(el.attr("ng-if"))(scope);
                        } : undefined)
                    });
                });
                return function(scope, element, attrs, controller) {
                    scope.$columns = columns = controller.buildColumns(columns);

                    controller.setupBindingsToInternalScope(attrs.ngTable);
                    controller.loadFilterData(columns);
                    controller.compileDirectiveTemplates();
                };
            }
        }
    }
]);

/**
 * @ngdoc directive
 * @name ngTableDynamic
 * @module ngTable
 * @restrict A
 *
 * @description
 * A dynamic version of the {@link ngTable ngTable} directive that accepts a dynamic list of columns
 * definitions to render
 */
app.directive('ngTableDynamic', ['$parse', function ($parse){

    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function(tElement) {
            var row;

            // IE 8 fix :not(.ng-table-group) selector
            angular.forEach(angular.element(tElement.find('tr')), function(tr) {
                tr = angular.element(tr);
                if (!tr.hasClass('ng-table-group') && !row) {
                    row = tr;
                }
            });
            if (!row) {
                return;
            }

            angular.forEach(row.find('td'), function(item) {
                var el = angular.element(item);
                var getAttrValue = function(attr){
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };

                // this used in responsive table
                var titleExpr = getAttrValue('title');
                if (!titleExpr){
                    el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                }
                var showExpr = el.attr('ng-if');
                if (!showExpr){
                    el.attr('ng-if', '$columns[$index].show(this)');
                }
            });
            return function (scope, element, attrs, controller) {
                var expr = controller.parseNgTableDynamicExpr(attrs.ngTableDynamic);

                controller.setupBindingsToInternalScope(expr.tableParams);
                controller.compileDirectiveTemplates();

                scope.$watchCollection(expr.columns, function (newCols/*, oldCols*/) {
                    scope.$columns = controller.buildColumns(newCols);
                    controller.loadFilterData(scope.$columns);
                });
            };
        }
    };
}]);

(function(){
    'use strict';

    angular.module('ngTable')
        .directive('ngTableFilterRow', ngTableFilterRow);

    ngTableFilterRow.$inject = [];

    function ngTableFilterRow(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng-table/filterRow.html',
            scope: true,
            controller: 'ngTableFilterRowController'
        };
        return directive;
    }
})();

(function(){
    'use strict';

    angular.module('ngTable')
        .directive('ngTableSorterRow', ngTableSorterRow);

    ngTableSorterRow.$inject = [];

    function ngTableSorterRow(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng-table/sorterRow.html',
            scope: true,
            controller: 'ngTableSorterRowController'
        };
        return directive;
    }
})();
