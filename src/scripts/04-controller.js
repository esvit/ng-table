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
var ngTableController = ['$scope', 'ngTableParams', '$q', function($scope, ngTableParams, $q) {
    $scope.$loading = false;

    if (!$scope.params) {
        $scope.params = new ngTableParams();
    }
    $scope.params.settings().$scope = $scope;

    $scope.$watch('params.$params', function(params) {
        $scope.params.settings().$scope = $scope;
        $scope.params.reload();
    }, true);

    $scope.sortBy = function (column) {
        var sorting, sortingParams;
        if (!column.sortable) {
            return;
        }
        sorting = $scope.params.sorting() && $scope.params.sorting()[column.sortable] && ($scope.params.sorting()[column.sortable] === "desc");
        sortingParams = {};
        sortingParams[column.sortable] = (sorting ? 'asc' : 'desc');
        $scope.params.parameters({
            sorting: sortingParams
        });
    };
}];