"use strict";
ngTableSorterRowController.$inject = ['$scope'];
function ngTableSorterRowController($scope) {
    $scope.sortBy = sortBy;
    ///////////
    function sortBy($column, event) {
        var parsedSortable = $column.sortable && $column.sortable();
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        }
        else {
            var defaultSort = $scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            $scope.params.parameters({
                sorting: sortingParams
            });
        }
    }
}
exports.ngTableSorterRowController = ngTableSorterRowController;
