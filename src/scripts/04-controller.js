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
var ngTableController = ['$scope', 'ngTableParams', function($scope, ngTableParams) {

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
}];