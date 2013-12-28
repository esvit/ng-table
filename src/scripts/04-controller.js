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
        var i;
        var parsedSortables = $scope.parse(column.sortable);
        if (!parsedSortables) {
            return;
        }
        parsedSortables = Array.prototype.concat.apply(parsedSortables);

        for (i = 0; i < $scope.$columns.length; i++) {
          $scope.$columns[i].sorting = null;
        }

        var oldSortables = $scope.params.sorting();
        var indexedSortables = {};
        for (i in oldSortables) {
            indexedSortables[oldSortables[i].substr(1)] = oldSortables[i][0];
        }
        
        var sortable, direction;
        for (i = 0; i < parsedSortables.length; i++) {
            sortable = parsedSortables[i];
            if (sortable[0] == '-' || sortable[0] == '+') {
              direction = sortable[0];
              sortable = sortable.substr(1);
            }
            if (indexedSortables[sortable]) {
              direction = indexedSortables[sortable] == '+' ? '-' : '+';
            }
            if (!direction) {
              direction = "+";
            }
            parsedSortables[i] = direction + sortable;
        }

        column.sorting = parsedSortables[0][0];

        $scope.params.sorting(parsedSortables);
    };

}];
