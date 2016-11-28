import { SortDirection } from '../sorting';

/**
 * Configuration that determines the data row grouping behaviour of a table
 */
export interface IGroupSettings {
    /**
     * The default sort direction that will be used whenever a group is supplied that
     * does not define its own sort direction
     */
    defaultSort?: SortDirection;
    /**
     * Determines whether groups should be displayed expanded to show their items. Defaults to true
     */
    isExpanded?: boolean;
}