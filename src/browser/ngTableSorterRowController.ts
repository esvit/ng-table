/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import * as ng1 from 'angular';
import { ISortingValues } from '../core';
import { IColumnDef } from './public-interfaces';
import { ITableScope } from './ngTableController';

interface IScopeExtensions {
    sortBy($column: IColumnDef, event: IAugmentedMouseEvent): void;
}

interface IAugmentedMouseEvent extends ng1.IAngularEvent {
    ctrlKey: boolean;
    metaKey: boolean;
}

ngTableSorterRowController.$inject = ['$scope'];

function ngTableSorterRowController<T>($scope: ITableScope<T> & IScopeExtensions) {

    $scope.sortBy = sortBy;

    ///////////

    function sortBy($column: IColumnDef, event: IAugmentedMouseEvent) {
        var parsedSortable = $column.sortable && $column.sortable();
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        } else {
            var defaultSort = $scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams: ISortingValues = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            $scope.params.parameters({
                sorting: sortingParams
            });
        }

    }
}

export { ngTableSorterRowController };