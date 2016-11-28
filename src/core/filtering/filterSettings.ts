import { FilterComparator } from './filterComparator';
import { IFilterFunc } from './filterFunc';

export type FilterLayout = 'stack' | 'horizontal';

export interface IFilterSettings<T> {
    /**
     * Use this to determine how items are matched against the filter values.
     * This setting is identical to the `comparator` parameter supported by the angular
     * `$filter` filter service
     *
     * Defaults to `undefined` which will result in a case insensitive susbstring match when
     * `IDefaultGetData` service is supplying the implementation for the
     * `ISettings.getData` function
     */
    filterComparator?: FilterComparator<T>;
    /**
     * A duration to wait for the user to stop typing before applying the filter.
     * - Defaults to 0 for small managed inmemory arrays ie where a `ISettings.dataset` argument is
     *   supplied to `NgTableParams.settings`.
     * - Defaults to 500 milliseconds otherwise.
     */
    filterDelay?: number;
    /**
     * The number of elements up to which a managed inmemory array is considered small. Defaults to 10000.
     */
    filterDelayThreshold?: number;
    /**
     * Overrides `IDefaultGetDataProvider.filterFilterName`.
     * The value supplied should be the name of the angular `$filter` service that will be selected to perform
     * the actual filter logic.
     * Defaults to 'filter'.
     */
    filterFilterName?: string;
    /**
     * Tells `IDefaultGetData` to use this function supplied to perform the filtering instead of selecting an angular $filter.
     */
    filterFn?: IFilterFunc<T>;
    /**
     * The layout to use when multiple html templates are to rendered in a single table header column.
     */
    filterLayout?: FilterLayout
}