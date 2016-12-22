import { GroupSort } from './groupSettings';

export type Grouping<T> = GroupValues | GroupingFunc<T>;
export type GroupingPartial<T> = GroupValuesPartial | GroupingFunc<T>;

/**
 * Signature of a function that should return the name of the group
 * that the `item` should be placed within
 */
export interface GroupingFunc<T> {
    (item: T): string;
    /**
     * leave undefined to let the value of `Settings.groupOptions.defaultSort` apply
     */
    sortDirection?: GroupSort;
    title?: string;
}

/**
 * Map of the names of fields on a data row and the corrosponding sort direction
 */
export interface GroupValues { [name: string]: GroupSort }

export type GroupValuesPartial = Partial<GroupValues>;