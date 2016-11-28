import { SortDirection } from '../sorting';

export type Grouping<T> = IGroupValues | IGroupingFunc<T>;

export type GroupSort = SortDirection | '';

/**
 * Signature of a function that should return the name of the group
 * that the `item` should be placed within
 */
export interface IGroupingFunc<T> {
    (item: T): string;
    /**
     * leave undefined to let the value of `ISettings.groupOptions.defaultSort` apply
     */
    sortDirection?: GroupSort;
    title?: string;
}

/**
 * Map of the names of fields on a data row and the corrosponding sort direction
 */
export interface IGroupValues { [name: string]: GroupSort }