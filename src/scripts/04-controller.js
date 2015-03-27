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
var ngTableController = ['$scope', 'ngTableParams', '$q', '$timeout', function($scope, ngTableParams, $q, $timeout) {
    // Some helper functions:
    var __indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };
    var sortablePrefixMatch = function(template, test) {
        for (var i = 0, l = template.length; i < l; i++) {
            if (!(i in test) || template[i].substr(1) != test[i].substr(1)) return false;
        }
        return true;
    };
    var normalizeSortables = function(sortables) {
        sortables = Array.prototype.concat.call([], sortables);
        for (var i = 0; i < sortables.length; i++) {
            if (sortables[i][0] != '+' && sortables[i][0] != '-') {
                sortables[i] = '+' + sortables[i];
            }
        }
        return sortables;
    };

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
        $scope.params.reload();

        // Set initial sort column, if there is one
        var initialSortables = $scope.params.sorting();
        if (!initialSortables) return;
        for(var i = 0; i < $scope.$columns.length; i++) {
            var columnSortables = $scope.parse($scope.$columns[i].sortable);
            if (!columnSortables) continue;
            columnSortables = normalizeSortables(columnSortables);
            if (sortablePrefixMatch(columnSortables, initialSortables)) {
                $scope.$columns[i].sorting = initialSortables[0][0];
            }
        }
    }, true);

    $scope.sortBy = function (column, event) {
        var parsedSortables = $scope.parse(column.sortable);
        if (!parsedSortables) {
            return;
        }
        parsedSortables = normalizeSortables(parsedSortables);

        for (var i = 0; i < $scope.$columns.length; i++) {
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
            parsedSortables[i] = direction + sortable;
        }

        column.sorting = parsedSortables[0][0];

        $scope.params.sorting(parsedSortables);
    };
}];
