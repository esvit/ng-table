angular.module('ngTable', [])
    .directive('ngTable', function($compile, $parse) {
    var template = '<thead> \
                        <tr> \
                            <th class="header" \
                                ng-class="{\'sortable\': column.sortable,\'sort-down\': column.sort==\'down\', \'sort-up\': column.sort==\'up\'}" \
                                ng-click="sortBy(column)" \
                                ng-repeat="column in columns"><div>{[column.title]}</div></th> \
                        </tr> \
                        <tr ng-show="filter.active"> \
                            <th class="filter" ng-repeat="column in columns"> \
                                <div ng-repeat="(name, filter) in column.filter">\
                                    <input type="text" ng-model="grid.filter[name]" class="input-filter" ng-show="filter == \'text\'" /> \
                                    <select class="filter filter-select" ng-options="data.id as data.title for data in column.data" ng-model="grid.filter[name]" ng-show="filter == \'select\'"></select> \
                                    <input type="text" date-range ng-model="grid.filter[name]" ng-show="filter == \'date\'" /> \
                                    <button class="btn btn-primary btn-block" ng-click="doFilter()" ng-show="filter == \'button\'">Filter</button> \
                                </div>\
                            </th> \
                        </tr> \
                        </thead>';
    var pager = '<div class="pagination">\
                    <ul class="pagination ng-cloak" ng-show="pager && pager.count > 1"> \
                      <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pager.pages" ng-switch="page.type"> \
                        <a ng-switch-when="prev" ng-click="goToPage(page.number)" href="">&laquo;</a> \
                        <a ng-switch-when="first" ng-click="goToPage(page.number)" href="">{[page.number]}</a> \
                        <a ng-switch-when="page" ng-click="goToPage(page.number)" href="">{[page.number]}</a> \
                        <a ng-switch-when="more" ng-click="goToPage(page.number)" href="">&hellip;</a> \
                        <a ng-switch-when="last" ng-click="goToPage(page.number)" href="">{[page.number]}</a> \
                        <a ng-switch-when="next" ng-click="goToPage(page.number)" href="">&raquo;</a> \
                      </li> \
                    </ul> \
                    <div class="btn-group pull-right"> \
                        <button type="button" ng-class="{\'active\':grid.count == 10}" ng-click="goToPage(pager.page, 10)" class="btn btn-mini">10</button> \
                        <button type="button" ng-class="{\'active\':grid.count == 25}" ng-click="goToPage(pager.page, 25)" class="btn btn-mini">25</button> \
                        <button type="button" ng-class="{\'active\':grid.count == 50}" ng-click="goToPage(pager.page, 50)" class="btn btn-mini">50</button> \
                        <button type="button" ng-class="{\'active\':grid.count == 100}" ng-click="goToPage(pager.page, 100)" class="btn btn-mini">100</button> \
                    </div>\
                </div>';
    return {
        restrict: 'A',
        priority: 1001,
        scope: {
            'onUpdate': '&ngTable'
        },
        controller: function($scope, $timeout) {
            $scope.onUpdate({'$params': [ '1']});
                
            $scope.goToPage = function(page, count) {
                var data = $scope.grid;
                if (((page > 0 && data.page != page && $scope.pager.count >= page) || angular.isDefined(count)) && $scope.callback) {
                    data.page = page;
                    data.count = count || data.count;
                    $scope.callback(data);
                }
            }
            $scope.doFilter = function() {
                $scope.grid.page = 1;
                var data = $scope.grid;
                if ($scope.callback) {
                    $scope.callback(data);
                }
            }
            $scope.grid = {
                page: 1,
                count: 10,
                total: 0,
                filter: {},
                sorting: [],
                sortingDirection: []
            };
            $scope.sortBy = function(column) {
                if (!column.sortable) {
                    return;
                }
                var sorting = $scope.grid.sorting.length && ($scope.grid.sorting[0] == column.sortable) && $scope.grid.sortingDirection[0];
                $scope.grid.sorting = [column.sortable];
                $scope.grid.sortingDirection = [!sorting];

                angular.forEach($scope.columns, function(column) {
                    column.sort = false;
                });
                column.sort = sorting ? 'up' : 'down';

                if ($scope.callback) {
                    $scope.callback($scope.grid);
                }
            }
        },
        compile: function(element, attrs) {
            element.addClass('table');
            var i = 0;
            var columns = [];
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
                scope.callback = scope[attrs.ngTable];
                scope.columns = columns;

                // generate array of pages
                var generatePages = function(currentPage, totalItems, pageSize) {
                    var maxBlocks = 11;  // specify the max <li> elements you want rendered
                    var pages = [],
                        numPages = Math.ceil(totalItems / pageSize);

                    if (numPages > 1) {
                        pages.push({ type: 'prev', number: Math.max(1, currentPage - 1), active: currentPage > 1 });
                        pages.push({ type: 'first', number: 1 });

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

                        pages.push({ type: 'last', number: numPages });
                        pages.push({ type: 'next', number: Math.min(numPages, currentPage + 1), active: currentPage < numPages });
                    }
                    return pages;
                };

                scope.$watch(attrs.pager, function(value) {
                    if (angular.isUndefined(value)) {
                        return;
                    }
                    value.pages = generatePages(value.page, value.total, value.count);
                    scope.pager = value;
                    console.info(value);
                    scope.grid.count = value.count;
                });

                angular.forEach(columns, function(column) {
                    if (!column.filterData) {
                        return;
                    }
                    var promise = scope.$parent[column.filterData];
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
                if (!element.hasClass('ng-table')) {
                    var html = $compile(template)(scope);
                    var pagination = $compile(pager)(scope);
                    element.filter('thead').remove();
                    element.prepend(html).addClass('ng-table');
                    element.after(pagination);
                }
            };
        }
    };
});