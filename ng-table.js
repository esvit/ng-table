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
    var pager = '<ul class="pagination ng-cloak" ng-show="pager && pager.count > 1"> \
                      <li ng-class="{\'disabled\':pager.current == 1}"><a ng-click="goToPage(pager.current-1)" href="javascript:;">&laquo;</a></li> \
                      <li ng-show="pager.current > 4"><a ng-click="goToPage(1)" href="javascript:;">1</a></li> \
                      <li class="disabled" ng-show="pager.current > 4 && pager.count > 6"><span>...</span></li> \
                      <li ng-repeat="page in pager.pages" ng-class="{\'disabled\':pager.current == page}"><a href="javascript:;" ng-click="goToPage(page)">{[page]}</a></li> \
                      <li class="disabled" ng-show="pager.current + 3 < pager.count && pager.count > 6"><span>...</span></li> \
                      <li ng-show="pager.current + 2 < pager.count && pager.count > 5"><span><a ng-click="goToPage(pager.count)" href="javascript:;">{[pager.count]}</a></span></li> \
                      <li ng-class="{\'disabled\':pager.current == pager.count}"><a ng-click="goToPage(pager.current+1)" href="javascript:;">&raquo;</a></li> \
                    </ul> \
                    <div class="btn-group pull-right"> \
                        <button type="button" ng-class="{\'active\':grid.count == 10}" ng-click="goToPage(pager.current, 10)" class="btn btn-mini">10</button> \
                        <button type="button" ng-class="{\'active\':grid.count == 25}" ng-click="goToPage(pager.current, 25)" class="btn btn-mini">25</button> \
                        <button type="button" ng-class="{\'active\':grid.count == 50}" ng-click="goToPage(pager.current, 50)" class="btn btn-mini">50</button> \
                        <button type="button" ng-class="{\'active\':grid.count == 100}" ng-click="goToPage(pager.current, 100)" class="btn btn-mini">100</button> \
                    </div>';
    return {
        restrict: 'A',
        priority: 1001,
        controller: function($scope, $timeout) {
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

                var getInterval = function(page, numPages) {
                    var midRange = 5;
                    var neHalf, upperLimit, start, end;
                    neHalf = Math.ceil(midRange / 2);
                    upperLimit = numPages - midRange;
                    start = page > neHalf ? Math.max(Math.min(page - neHalf, upperLimit), 0) : 0;
                    end = page > neHalf ?
                        Math.min(page + neHalf - (midRange % 2 > 0 ? 1 : 0), numPages) :
                        Math.min(midRange, numPages);
                    return {start: start,end: end};
                };

                scope.$watch(attrs.pager, function(value) {
                    if (angular.isUndefined(value)) {
                        return;
                    }
                    var interval = getInterval(value.current, value.count);
                    value.pages = [];
                    for (var i = interval.start + 1; i < interval.end + 1; i++) {
                        value.pages.push(i);
                    }
                    scope.pager = value;
                    scope.grid.count = value.countPerPage;
                });

                angular.forEach(columns, function(column) {
                    if (!column.filterData) {
                        return;
                    }
                    var promise = scope[column.filterData](column);
                    delete column['filterData'];
                    promise.then(function(data) {
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