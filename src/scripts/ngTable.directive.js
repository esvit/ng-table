/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    /**
     * @ngdoc directive
     * @name ngTable
     * @module ngTable
     * @restrict A
     *
     * @description
     * Directive that instantiates {@link ngTableController ngTableController}.
     */
    angular.module('ngTable').directive('ngTable', ['$q', '$parse',
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
})();
