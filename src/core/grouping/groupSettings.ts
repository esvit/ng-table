import { SortDirection } from '../sorting';

export type GroupSort = SortDirection | '';

export type GroupSettingsPartial = Partial<GroupSettings>

/**
 * Configuration that determines the data row grouping behaviour of a table
 */
export class GroupSettings {
    /**
     * The default sort direction that will be used whenever a group is supplied that
     * does not define its own sort direction
     */
    defaultSort: SortDirection = 'asc';
    /**
     * Determines whether groups should be displayed expanded to show their items. Defaults to true
     */
    isExpanded = true;
}