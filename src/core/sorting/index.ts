export type SortDirection = 'asc' | 'desc';

/**
 * Map of the names of fields on a data row and the corrosponding sort direction;
 * Set the value of a key to undefined to let value of {@link Settings} `defaultSort` apply
 */
export interface SortingValues { [name: string]: SortDirection }
