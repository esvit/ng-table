export type FilterComparator<T> = boolean | FilterComparatorFunc<T>;

/**
 * Signature of a function to compare two data values for equality
 */
export interface FilterComparatorFunc<T> {
    (actual: T, expected: T): boolean;
}
