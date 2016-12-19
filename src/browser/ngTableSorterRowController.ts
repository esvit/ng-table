/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAngularEvent } from 'angular';
import { SortDirection, SortingValues } from '../core';
import { ColumnDef } from './public-interfaces';
import { TableScope } from './ngTableController';

/**
 * @private
 */
export interface IAugmentedMouseEvent extends IAngularEvent {
    ctrlKey: boolean;
    metaKey: boolean;
}
/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
export class NgTableSorterRowController<T> {
    static $inject = ['$scope'];
    constructor(private $scope: TableScope<T>) {}

    sortBy($column: ColumnDef, event: IAugmentedMouseEvent) {
        const parsedSortable = $column.sortable && $column.sortable();
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        } else {
            const defaultSort = this.$scope.params.settings().defaultSort;
            const inverseSort: SortDirection = (defaultSort === 'asc' ? 'desc' : 'asc');
            const sorting = this.$scope.params.sorting() && this.$scope.params.sorting()[parsedSortable] && (this.$scope.params.sorting()[parsedSortable] === defaultSort);
            const sortingParams: SortingValues = (event.ctrlKey || event.metaKey) ? this.$scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            this.$scope.params.parameters({
                sorting: sortingParams
            });
        }

    }
}