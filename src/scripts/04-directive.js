/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
app.directive('ngTable', ['$compile', '$q', '$parse', '$http', 'ngTableParams',
    function ($compile, $q, $parse, $http, ngTableParams) {
        'use strict';

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: ['$scope', function ($scope) {
                var updateParams = function (newParams) {
                    newParams = angular.extend($scope.params, newParams);
                    $scope.$groups = $scope.params.getGroups($scope.params.settings().groupBy);
                    if ($scope.paramsModel) {
                        $scope.paramsModel.assign($scope.$parent, new ngTableParams(newParams));
                    }
                    $scope.params = angular.copy(newParams);
                };

                $scope.params = $scope.params || {
                    page: 1,
                    count: 10
                };
                // update result every time filter changes
                $scope.$watch('params.filter', function (value) {
                    if ($scope.params.$liveFiltering) {
                        updateParams({
                            filter: value
                        });
                        $scope.goToPage(1);
                    }
                }, true);
                $scope.$watch('params.sorting', (function (value) {
                    updateParams({
                        sorting: value
                    });
                }), true);

                // goto page
                $scope.goToPage = function (page) {
                    if (page > 0 && $scope.params.page !== page && $scope.params.count * (page - 1) <= $scope.params.total) {
                        updateParams({
                            page: page
                        });
                    }
                };
                // change items per page
                $scope.changeCount = function (count) {
                    updateParams({
                        page: 1,
                        count: count
                    });
                };
                $scope.doFilter = function () {
                    updateParams({
                        page: 1
                    });
                };
                $scope.sortBy = function (column) {
                    var sorting, sortingParams;
                    if (!column.sortable) {
                        return;
                    }
                    sorting = $scope.params.sorting && $scope.params.sorting[column.sortable] && ($scope.params.sorting[column.sortable] === "desc");
                    sortingParams = {};
                    sortingParams[column.sortable] = (sorting ? 'asc' : 'desc');
                    updateParams({
                        sorting: sortingParams
                    });
                };
            }
            ],
            compile: function (element) {
                var columns, i;
                i = 0;
                columns = [];
                angular.forEach(element.find('tr').eq(0).find('td'), function (item) {
                    var el, filter, filterTemplateURL, headerTemplateURL, parsedTitle;
                    el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }
                    parsedTitle = function (scope) {
                        return $parse(el.attr('x-data-title') || el.attr('data-title') || el.attr('title'))(scope, {
                            $columns: columns
                        }) || ' ';
                    };
                    el.attr('data-title-text', parsedTitle());
                    headerTemplateURL = function (scope) {
                        return $parse(el.attr("x-data-header") || el.attr("data-header") || el.attr("header"))(scope, {
                            $columns: columns
                        }) || false;
                    };
                    filter = el.attr("filter") ? $parse(el.attr("filter"))() : false;
                    filterTemplateURL = false;
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
                    var headerTemplate, paginationTemplate, tbody;
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
                        headerTemplate = $compile('<thead ng-include="templates.header"></thead>')(scope);
                        paginationTemplate = $compile('<div ng-include="templates.pagination"></div>')(scope);
                        element.find('thead').remove();
                        tbody = element.find('tbody');
                        if (tbody[0]) {
                            angular.element(tbody[0]).before(headerTemplate);
                        } else {
                            element.prepend(headerTemplate);
                        }
                        element.addClass('ng-table');
                        return element.after(paginationTemplate);
                    }
                };
            }
        };
    }
]);