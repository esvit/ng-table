export type DataResult<T> = T | DataRowGroup<T>;

export interface DataRowGroup<T> {
    data: T[];
    $hideRows: boolean;
    value: string;
}

/**
 * The augmented data row array displayed by the table.
 * Note: this array is made available to the table templete as the `$data` field
 */
export type DataResults<T> = T[] & { visibleColumnCount: number };

/**
 * The augmented grouped data row array displayed by the table
 * Note: this array is made available to the table templete as the `$groups` field
 */
export type GroupedDataResults<T> = DataRowGroup<T>[] & { visibleColumnCount: number };