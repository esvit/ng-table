import { FilterComparator } from './filterComparator';

/**
 * Map of the names of fields declared on a data row and the corrosponding filter value
 */
export interface FilterValues { [name: string]: any }


/**
 * Signature of a function used as a custom filter implementation
 */
export interface FilterFunc<T> {
    (data: T[], filter: FilterValues, filterComparator: FilterComparator<T>): T[]
}