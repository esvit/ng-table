export type Grouping<T> = IGroupValues | IGroupingFunc<T>;

/**
 * Signature of a function that should return the name of the group
 * that the `item` should be placed within
 */
export interface IGroupingFunc<T> {
    (item: T): string;
    /**
     * 'asc' or 'desc'; leave undefined to let the value of `ISettings.groupOptions.defaultSort` apply
     */
    sortDirection?: string;
    title?: string;
}

/**
 * Map of the names of fields on a data row and the corrosponding sort direction
 */
export interface IGroupValues { [name: string]: string }