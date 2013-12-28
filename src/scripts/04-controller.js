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

    $scope.sortBy = function (column, event) {
        var parsedSortable = $scope.parse(column.sortable);
        if (!parsedSortable) {
            return;
        }
        var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === "desc");
        var sortingParams = event.ctrlKey ? $scope.params.sorting() : {};
        sortingParams[parsedSortable] = (sorting ? 'asc' : 'desc');
        $scope.params.parameters({
            sorting: sortingParams
        });
    };
}];