/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name ngTable.directive:ngTable.ngTableController
 *
 * @description
 * Each {@link ngTable.directive:ngTable ngTable} directive creates an instance of `ngTableController`
 */
var ngTableController = ['$scope', 'ngTableParams', '$timeout', function ($scope, ngTableParams, $timeout) {
    $scope.$loading = false;

    if (!$scope.params) {
        $scope.params = new ngTableParams();
    }
    $scope.params.settings().$scope = $scope;

    var delayFilter = (function () {
        var timer = 0;
        return function (callback, ms) {
            $timeout.cancel(timer);
            timer = $timeout(callback, ms);
        };
    })();

    $scope.$watch('params.$params', function (newParams, oldParams) {
        $scope.params.settings().$scope = $scope;

        if (!angular.equals(newParams.filter, oldParams.filter)) {
            delayFilter(function () {
                $scope.params.$params.page = 1;
                $scope.params.reload();
            }, $scope.params.settings().filterDelay);
        } else {
            $scope.params.reload();
        }
    }, true);

    $scope.sortBy = function (column, event) {
        var parsedSortable = $scope.parse(column.sortable);
        if (!parsedSortable) {
            return;
        }

        var settings = $scope.params.settings();
        var defaultSort = settings.defaultSort;
        var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');

        var multipleSort = (event.ctrlKey || event.metaKey);

        var sorting = $scope.params.sorting(), newSort = defaultSort;
        if (sorting && sorting[parsedSortable]) {

            if (settings.allowUnsort) {
                if (sorting[parsedSortable] === defaultSort) {
                    newSort = inverseSort;
                } else if (sorting[parsedSortable] === inverseSort) {
                    newSort = false;
                } else {
                    newSort = defaultSort;
                }
            } else {
                newSort = sorting[parsedSortable] === defaultSort ? inverseSort : defaultSort;
            }
        }

        var sortingParams = multipleSort ? $scope.params.sorting() : {};
        if (newSort) {
            sortingParams[parsedSortable] = newSort;
        } else {
            delete sortingParams[parsedSortable];
        }

        $scope.params.parameters({
            sorting: sortingParams
        });
    };
}];