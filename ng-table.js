'use strict';

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @copyright 2013 Vitalii Savchuk <esvit666@gmail.com>
 * @version 0.2.0
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
angular.module('ngTable', [])
    // name of table header template
    .constant('ngTableHeaderTemplate', "ng-table/header")

    // name of pager template
    .constant('ngTablePaginationTemplate', "ng-table/pager")

    // save predefined templates to cache
    .run(      ['$templateCache', 'ngTableHeaderTemplate', 'ngTablePaginationTemplate', 
        function($templateCache,   ngTableHeaderTemplate,   ngTablePaginationTemplate) {
        $templateCache.put(ngTableHeaderTemplate,
            '<tr> \
                <th class="header" \
                    ng-class="{\'sortable\': column.sortable,\'sort-down\': column.sort==\'down\', \'sort-up\': column.sort==\'up\'}" \
                    ng-click="sortBy(column)" \
                    ng-repeat="column in columns"><div>{[column.title]}</div></th> \
            </tr> \
            <tr ng-show="filter.active"> \
                <th class="filter" ng-repeat="column in columns"> \
                    <div ng-repeat="(name, filter) in column.filter">\
                        <input type="text" ng-model="params.filter[name]" class="input-filter" ng-show="filter == \'text\'" /> \
                        <select class="filter filter-select" ng-options="data.id as data.title for data in column.data" ng-model="params.filter[name]" ng-show="filter == \'select\'"></select> \
                        <input type="text" date-range ng-model="params.filter[name]" ng-show="filter == \'date\'" /> \
                        <button class="btn btn-primary btn-block" ng-click="doFilter()" ng-show="filter == \'button\'">Filter</button> \
                    </div>\
                </th> \
            </tr>');

        $templateCache.put(ngTablePaginationTemplate,
            '<div class="pagination">\
                <ul class="pagination ng-cloak"> \
                  <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> \
                    <a ng-switch-when="prev" ng-click="goToPage(page.number)" href="">&laquo;</a> \
                    <a ng-switch-when="first" ng-click="goToPage(page.number)" href="">{[page.number]}</a> \
                    <a ng-switch-when="page" ng-click="goToPage(page.number)" href="">{[page.number]}</a> \
                    <a ng-switch-when="more" ng-click="goToPage(page.number)" href="">&hellip;</a> \
                    <a ng-switch-when="last" ng-click="goToPage(page.number)" href="">{[page.number]}</a> \
                    <a ng-switch-when="next" ng-click="goToPage(page.number)" href="">&raquo;</a> \
                  </li> \
                </ul> \
                <div class="btn-group pull-right"> \
                    <button type="button" ng-class="{\'active\':params.count == 10}" ng-click="changeCount(10)" class="btn btn-mini">10</button> \
                    <button type="button" ng-class="{\'active\':params.count == 25}" ng-click="changeCount(25)" class="btn btn-mini">25</button> \
                    <button type="button" ng-class="{\'active\':params.count == 50}" ng-click="changeCount(50)" class="btn btn-mini">50</button> \
                    <button type="button" ng-class="{\'active\':params.count == 100}" ng-click="changeCount(100)" class="btn btn-mini">100</button> \
                </div>\
            </div>');
    }])
    .directive('ngTable', ['$compile', '$parse', '$http', 'ngTableHeaderTemplate', 'ngTablePaginationTemplate', 
                   function($compile,   $parse,   $http,   ngTableHeaderTemplate,   ngTablePaginationTemplate) {
        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: function($scope, $timeout) {
                if (!$scope.params.filter) {
                    $scope.params.filter = {};
                }
                var updateParams = function(newParams) {
                    newParams = angular.extend($scope.params, newParams);

                    // assign params in both scopes
                    $scope.paramsModel.assign($scope.$parent, angular.copy(newParams));
                    $scope.paramsModel.assign($scope, angular.copy(newParams));
                };

                // goto page
                $scope.goToPage = function(page) {
                    if (page > 0 && $scope.params.page != page && $scope.pages.length + 1 >= page) {
                        updateParams({ 'page': page });
                    }
                }
                // change items per page
                $scope.changeCount = function(count) {
                    updateParams({ 'count': count });
                }
                $scope.doFilter = function() {
                    updateParams({ 'page': 1 });
                }
                $scope.sortBy = function(column) {
                    if (!column.sortable) {
                        return;
                    }
                    var sorting = $scope.params.sorting && ($scope.params.sorting[0] == column.sortable) && $scope.params.sortingDirection[0];
                    var sortingParams = {
                        sorting: [column.sortable],
                        sortingDirection: [!sorting]
                    };

                    angular.forEach($scope.columns, function(column) {
                        column.sort = false;
                    });
                    column.sort = sorting ? 'up' : 'down';

                    updateParams(sortingParams);
                }
            },
            compile: function(element, attrs) {
                var i = 0, columns = [];
                // get columns from table
                angular.forEach(element.find('td'), function(item) {
                    var el = $(item);
                    columns.push({
                        id: i++,
                        title: el.attr('title') || el.text(),
                        sortable: el.attr('sortable') ? el.attr('sortable') : false,
                        filter: el.attr('filter') ? $parse(el.attr('filter'))() : false,
                        filterData: el.attr('filter-data') ? el.attr('filter-data') : null
                    });
                });
                return function(scope, element, attrs) {
                    scope.columns = columns;

                    // generate array of pages
                    var generatePages = function(currentPage, totalItems, pageSize) {
                        var maxBlocks = 11;  // specify the max <li> elements you want rendered
                        var pages = [],
                            numPages = Math.ceil(totalItems / pageSize);

                        if (numPages > 1) {
                            pages.push({ type: 'prev', number: Math.max(1, currentPage - 1), active: currentPage > 1 });
                            pages.push({ type: 'first', number: 1, active: currentPage > 1 });

                            var maxPivotPages = Math.round((maxBlocks - 5) / 2),
                                minPage = Math.max(2, currentPage - maxPivotPages),
                                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));

                            minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));

                            for (var i = minPage; i <= maxPage; i++) {
                                if ((i == minPage && i != 2) || (i == maxPage && i != numPages - 1)) {
                                    pages.push({ type: 'more' });
                                } else {
                                    pages.push({ type: 'page', number: i, active: currentPage != i });
                                }
                            }
                            pages.push({ type: 'last', number: numPages, active: currentPage != numPages });
                            pages.push({ type: 'next', number: Math.min(numPages, currentPage + 1), active: currentPage < numPages });
                        }
                        return pages;
                    };

                    // update pagination where parameters changes
                    scope.$watch(attrs.ngTable, function(params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.ngTable);
                        scope.pages = generatePages(params.page, params.total, params.count);
                        scope.params = params;
                    });

                    // get data from columns
                    angular.forEach(columns, function(column) {
                        if (!column.filterData) {
                            return;
                        }
                        var promise = scope[column.filterData];
                        if (!promise) {
                            throw new Error('Function ' + column.filterData + ' not found in scope');
                        }
                        delete column['filterData'];
                        promise(column).then(function(data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({ title: '-' });
                            column.data = data;
                        });
                    });

                    // create table
                    if (!element.hasClass('ng-table')) {
                        scope.templates = {
                            'header': ngTableHeaderTemplate,
                            'pagination': ngTablePaginationTemplate
                        };

                        var headerTemplate = $compile('<thead ng-include="templates.header"></thead>')(scope),
                            paginationTemplate = $compile('<div ng-include="templates.pagination"></div>')(scope);

                        element.filter('thead').remove();
                        element.prepend(headerTemplate).addClass('ng-table');
                        element.after(paginationTemplate);
                    }
                };
            }
        };
    }]);