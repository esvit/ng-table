export type FilterComparator<T> = boolean | IFilterComparatorFunc<T>;

/**
 * Signature of a function to compare two data values for equality
 */
export interface IFilterComparatorFunc<T> {
    (actual: T, expected: T): boolean;
}
