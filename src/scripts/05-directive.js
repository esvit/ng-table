/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTable.directive:ngTable.ngTableController ngTableController}.
 */
app.directive('ngTable', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        var ngTable = {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: ngTableController,
            compile: function (element) {
            
                var tableElement = element.clone();
                
                var columns, i;
                i = 0;
                columns = [];
                angular.forEach(element.find('tr:not(.ng-table-group)').eq(0).find('td'), function (item) {
                    var el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }
                    var parsedTitle = function (scope) {
                        return $parse(el.attr('x-data-title') || el.attr('data-title') || el.attr('title'))(scope, {
                            $columns: columns
                        }) || ' ';
                    };
                    el.attr('data-title-text', parsedTitle());
                    var headerTemplateURL = function (scope) {
                        return $parse(el.attr("x-data-header") || el.attr("data-header") || el.attr("header"))(scope, {
                            $columns: columns
                        }) || false;
                    };
                    var filter = el.attr("filter") ? $parse(el.attr("filter"))() : false;
                    var filterTemplateURL = false;
                    if (filter && filter.templateURL) {
                        filterTemplateURL = filter.templateURL;
                        delete filter.templateURL;
                    }
                    columns.push({
                        id: i++,
                        title: parsedTitle,
                        sortable: (el.attr("sortable") ? el.attr("sortable") : false),
                        filter: filter,
                        filterTemplateURL: filterTemplateURL,
                        headerTemplateURL: headerTemplateURL,
                        filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
                        show: (el.attr("ng-show") ? function (scope) {
                            return $parse(el.attr("ng-show"))(scope);
                        } : function () {
                            return true;
                        })
                    });
                });
                return function (scope, element, attrs) {
                    scope.columns = columns;

                    scope.$parent.$watch(attrs.ngTable, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.ngTable);
                        scope.pages = params.generatePagesArray(params.page(), params.settings().total, params.parameters().count);
                        scope.params = angular.copy(params);
                    }), true);
                    scope.parse = function (text) {
                        return text(scope);
                    };
                    if (attrs.showFilter) {
                        scope.$parent.$watch(attrs.showFilter, function (value) {
                            scope.show_filter = value;
                        });
                    }
                    angular.forEach(columns, function (column) {
                        var def;
                        if (!column.filterData) {
                            return;
                        }
                        def = $parse(column.filterData)(scope, {
                            $column: column
                        });
                        if (!(angular.isObject(def) && angular.isObject(def.promise))) {
                            throw new Error('Function ' + column.filterData + ' must be instance of $q.defer()');
                        }
                        delete column['filterData'];
                        return def.promise.then(function (data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({
                                title: '-',
                                id: ''
                            });
                            column.data = data;
                        });
                    });
                    if (!element.hasClass('ng-table')) {
                        scope.templates = {
                            header: (attrs.templateHeader ? attrs.templateHeader : 'ng-table/header.html'),
                            pagination: (attrs.templatePagination ? attrs.templatePagination : 'ng-table/pager.html')
                        };
                        var headerTemplate = $compile('<thead ng-include="templates.header"></thead>')(scope);
                        var paginationTemplate = $compile('<div ng-include="templates.pagination"></div>')(scope);
                        element.find('thead').remove();
                        var tbody = element.find('tbody');
                        if (tbody[0]) {
                            angular.element(tbody[0]).before(headerTemplate);
                        } else {
                            element.prepend(headerTemplate);
                        }
                        element.addClass('ng-table');
                        return element.after(paginationTemplate);
                    }
                };
            },
            link: function() {
                console.info(tableElement);
            }
        };
        return ngTable;
    }
]);