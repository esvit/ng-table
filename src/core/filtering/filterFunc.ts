import { FilterComparator } from './filterComparator';

/**
 * Map of the names of fields declared on a data row and the corrosponding filter value
 */
export interface IFilterValues { [name: string]: any }


/**
 * Signature of a function used as a custom filter implementation
 */
export interface IFilterFunc<T> {
    (data: T[], filter: IFilterValues, filterComparator: FilterComparator<T>): T[]
}