import { IFilterOrderBy, IPromise, IScope, IServiceProvider } from 'angular';

export interface IDataSettings {
    applyPaging?: boolean;
}


export type DataResult<T> = T | IDataRowGroup<T>;

export interface IDataRowGroup<T> {
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
export type GroupedDataResults<T> = IDataRowGroup<T>[] & { visibleColumnCount: number };


/**
 * A default implementation of the getData function that will apply the `filter`, `orderBy` and
 * paging values from the {@link INgTableParams} instance supplied to the data array supplied.
 *
 * A call to this function will:
 * - return the resulting array
 * - assign the total item count after filtering to the `total` of the `NgTableParams` instance supplied
 */
export interface IDefaultGetData<T> {
    (data: T[], params: INgTableParams<T>): T[];
    /**
     * Convenience function that this service will use to apply paging to the data rows.
     *
     * Returns a slice of rows from the `data` array supplied and sets the `NgTableParams.total()`
     * on the `params` instance supplied to `data.length`
     */
    applyPaging(data: T[], params: INgTableParams<T>): T[],
    /**
     * Returns a reference to the function that this service will use to filter data rows
     */
    getFilterFn(params: INgTableParams<T>): IFilterFunc<T>,
    /**
     * Returns a reference to the function that this service will use to sort data rows
     */
    getOrderByFn(params?: INgTableParams<T>): IFilterOrderBy
}

/**
 * Allows for the configuration of the {@link IDefaultGetData} service.
 */
export interface IDefaultGetDataProvider extends IServiceProvider {
    /**
     * The name of a angular filter that knows how to apply the values returned by
     * `NgTableParams.filter()` to restrict an array of data.
     * (defaults to the angular `filter` filter service)
     */
    filterFilterName: string,
    /**
     * The name of a angular filter that knows how to apply the values returned by
    * `NgTableParams.orderBy()` to sort an array of data.
    * (defaults to the angular `orderBy` filter service)
    */
    sortingFilterName: string
}

/**
 * An angular value object that allow for overriding of the initial default values used when constructing
 * an instance of `NgTableParams`
 */
export interface IDefaults {
    params?: IParamValues<any>;
    settings?: ISettings<any>
}

/**
 * Map of the names of fields declared on a data row and the corrosponding filter value
 */
export interface IFilterValues { [name: string]: any }

export type Grouping<T> = IGroupValues | IGroupingFunc<T>;

/**
 * Map of the names of fields on a data row and the corrosponding sort direction
 */
export interface IGroupValues { [name: string]: string }

/**
 * Signature of a function that should return the name of the group
 * that the `item` should be placed within
 */
export interface IGroupingFunc<T> {
    (item: T): string;
    /**
     * 'asc' or 'desc'; leave undefined to let the value of `ISettings.groupOptions.defaultSort` apply
     */
    sortDirection?: string;
    title?: string;
}

/**
 * @private
 */
export interface InternalTableParams<T> extends INgTableParams<T> {
    isNullInstance: boolean
}

/**
 * Parameters manager for an ngTable directive
 */
export interface INgTableParams<T> {
    /**
     * The page of data rows currently being displayed in the table
     */
    data: T[];

    /**
     * Returns the number of data rows per page
     */
    count(): number
    /**
     * Sets the number of data rows per page.
     * Changes to count will cause `isDataReloadRequired` to return true
     */
    count(count: number): INgTableParams<T>

    /**
     * Returns the current filter values used to restrict the set of data rows.
     * @param trim supply true to return the current filter minus any insignificant values
     * (null,  undefined and empty string)
     */
    filter(trim?: boolean): IFilterValues
    /**
     * Sets filter values to the `filter` supplied; any existing filter will be removed
     * Changes to filter will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    filter(filter: IFilterValues): INgTableParams<T>
    /**
     * Generate array of pages.
     * When no arguments supplied, the current parameter state of this `NgTableParams` instance will be used
     */
    generatePagesArray(currentPage?: number, totalItems?: number, pageSize?: number, maxBlocks?: number): IPageButton[]
    /**
     * Returns the current grouping used to group the data rows
     */
    group(): Grouping<T>
    /**
     * Sets grouping to the `group` supplied; any existing grouping will be removed.
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(group: IGroupValues): INgTableParams<T>
    /**
     * Sets grouping to the `field` and `sortDirection` supplied; any existing grouping will be removed
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(field: string, sortDirection?: string): INgTableParams<T>
    /**
     * Sets grouping to the `group` supplied; any existing grouping will be removed.
     * If `sortDirection` is supplied, this will be assigned to the sortDirection property of `group`
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(group: IGroupingFunc<T> | string, sortDirection?: string): INgTableParams<T>
    /**
     * Returns true when an attempt to `reload` the current `parameter` values have resulted in a failure.
     * This method will continue to return true until the `reload` is successfully called or when the
     * `parameter` values have changed
     */
    hasErrorState(): boolean
    /**
     * Returns true if `filter` has significant filter value(s) (any value except null, undefined, or empty string),
     * otherwise false
     */
    hasFilter(): boolean
    /**
     * Return true when a change to `filters` require the `reload` method
     * to be run so as to ensure the data presented to the user reflects these filters
     */
    hasFilterChanges(): boolean
    /**
     * Returns true when at least one group has been set
     */
    hasGroup(): boolean
    /**
     * Returns true when the `group` and when supplied, the `sortDirection` matches an existing group
     */
    hasGroup(group: string | IGroupingFunc<T>, sortDirection?: string): boolean
    /**
     * Return true when a change to this instance should require the `reload` method
     * to be run so as to ensure the data rows presented to the user reflects the current state.
     *
     * Note that this method will return false when the `reload` method has run but fails. In this case
     * `hasErrorState` will return true.
     *
     * The built-in `ngTable` directives will watch for when this function returns true and will then call
     * the `reload` method to load its data rows
     */
    isDataReloadRequired(): boolean
    /**
     * Returns sorting values in a format that can be consumed by the angular `$orderBy` filter service
     */
    orderBy(): string[]
    /**
     * Trigger a reload of the data rows
     */
    reload<TResult extends DataResult<T>>(): IPromise<TResult[]>
    /**
     * Returns the settings for the table.
     */
    settings(): ISettings<T>
    /**
     * Sets the settings for the table; new setting values will be merged with the existing settings.
     * Supplying a new `dataset` will cause `isDataReloadRequired` to return true and the `ngTableEventsChannel`
     * to fire its `datasetChanged` event
     */
    settings(newSettings: ISettings<T>): INgTableParams<T>
    /**
     * Returns the current sorting used to order the data rows.
     * Changes to sorting will cause `isDataReloadRequired` to return true
     */
    sorting(): ISortingValues
    /**
     * Sets sorting values to the `sorting` supplied; any existing sorting will be removed.
     * Changes to sorting will cause `isDataReloadRequired` to return true
     */
    sorting(sorting: ISortingValues): INgTableParams<T>
    /**
     * Sets sorting to the `field` and `direction` supplied; any existing sorting will be removed
     */
    sorting(field: string, direction: string): INgTableParams<T>
    /**
     * Returns true if sorting by the field supplied. Where direction supplied
     * the field must also be sorted by that direction to return true
     */
    isSortBy(field: string, direction?: string): boolean;
    /**
     * Returns the index of the current "slice" of data rows
     */
    page(): number
    /**
     * Sets the index of the current "slice" of data rows. The index starts at 1.
     * Changing the page number will cause `isDataReloadRequired` to return true
     */
    page(page: number): INgTableParams<T>
    parameters(): IParamValues<T>
    /**
     * Set new parameters
     */
    parameters(newParameters: IParamValues<T> | { [name: string]: string }, parseParamsFromUrl?: boolean): this
    reloadPages(): void
    /**
     * Returns the count of the data rows that match the current `filter`
     */
    total(): number
    /**
     * Sets `settings().total` to the value supplied.
     * Typically you will need to set a `total` in the body of any custom `getData` function
     * you supply as a setting value to this instance.
     * @example
     * ```js
     * var tp = new NgTableParams({}, { getData: customGetData })
     * function customGetData(params) {
     *      var queryResult = // code to fetch current data rows and total //
     *      params.total(queryResult.total);
     *      return queryResult.dataRowsPage;
     * }
     * ```
     */
    total(total: number): INgTableParams<T>
    /**
     * Returns the current parameter values uri-encoded. Set `asString` to
     * true for the parameters to be returned as an array of strings of the form 'paramName=value'
     * otherwise parameters returned as a key-value object
     */
    url(asString?: boolean): { [name: string]: string } | string[]
}

export type FilterComparator<T> = boolean | IFilterComparatorFunc<T>;

/**
 * Signature of a function to compare two data values for equality
 */
export interface IFilterComparatorFunc<T> {
    (actual: T, expected: T): boolean;
}

/**
 * Signature of a function used as a custom filter implementation
 */
export interface IFilterFunc<T> {
    (data: T[], filter: IFilterValues, filterComparator: FilterComparator<T>): T[]
}


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
     * Available values:
     * - stack (the default)
     * - horizontal
     */
    filterLayout?: string
}

/**
 * Signature of a function that will called whenever {@link INgTableParams} requires to load
 * data rows into the table.
 * @param params the table requesting the data rows
 */
export interface IGetDataFunc<T> {
    (params: INgTableParams<T>): T[] | IPromise<T[]>;
}

/**
 * Signature of a function that will called whenever {@link INgTableParams} requires to group
 * the data rows for display in the table
 * @param params the table requesting the rows to be grouped
 */
export interface IGetGroupFunc<T> {
    (params: INgTableParams<T>): { [name: string]: IDataRowGroup<T>[] }
}

/**
 * A custom object that can be registered with an {@link INgTableParams} instance that can be used
 * to post-process the results (and failures) returned by its `getData` function
 */
export interface IInterceptor<T> {
    response?: <TData>(data: TData, params: INgTableParams<T>) => TData;
    responseError?: (reason: any, params: INgTableParams<T>) => any;
}

/**
 * Variation of the {@link IGetDataFunc} function signature that allows for flexibility for
 * the shape of the return value.
 * Typcially you will use this function signature when you want to configure {@link INgTableParams}
 * with interceptors that will return the final data rows array.
 */
export interface IInterceptableGetDataFunc<T> {
    <TResult>(params: INgTableParams<T>): TResult;
}

/**
 * Configuration that determines the data row grouping behaviour of a table
 */
export interface IGroupSettings {
    /**
     * The default sort direction that will be used whenever a group is supplied that
     * does not define its own sort direction
     */
    defaultSort?: string;
    /**
     * Determines whether groups should be displayed expanded to show their items. Defaults to true
     */
    isExpanded?: boolean;
}

/**
 * Definition of the buttons rendered by the data row pager directive
 */
export interface IPageButton {
    type: string;
    number?: number;
    active: boolean;
    current?: boolean;
}


/**
 * The runtime values for {@link INgTableParams} that determine the set of data rows and
 * how they are to be displayed in a table
 */
export interface IParamValues<T> {
    /**
     * The index of the "slice" of data rows, starting at 1, to be displayed by the table.
     */
    page?: number;
    /**
     * The number of data rows per page
     */
    count?: number;
    /**
     * The filter that should be applied to restrict the set of data rows
     */
    filter?: IFilterValues;
    /**
     * The sort order that should be applied to the data rows.
     */
    sorting?: ISortingValues;
    /**
     * The grouping that should be applied to the data rows
     */
    group?: string | Grouping<T>;
}


/**
 * Map of the names of fields on a data row and the corrosponding sort direction;
 * Set the value of a key to undefined to let value of {@link ISettings} `defaultSort` apply
 */
export interface ISortingValues { [name: string]: string }

/**
 * Configuration settings for {@link INgTableParams}
 */
export interface ISettings<T> {
    /**
     * Returns true whenever a call to `getData` is in progress
     */
    $loading?: boolean;
    /**
     * An array that contains all the data rows that table should manage.
     * The `gateData` function will be used to manage the data rows
     * that ultimately will be displayed.
     */
    dataset?: T[];
    dataOptions?: {};
    debugMode?: boolean;
    /**
     * The total number of data rows before paging has been applied.
     * Typically you will not need to supply this yourself
     */
    total?: number;
    /**
     * The default sort direction that will be used whenever a sorting is supplied that
     * does not define its own sort direction
     */
    defaultSort?: string;
    filterOptions?: IFilterSettings<T>;
    groupOptions?: IGroupSettings;
    /**
     * The page size buttons that should be displayed. Each value defined in the array
     * determines the possible values that can be supplied to {@link INgTableParams} `page`
     */
    counts?: number[];
    /**
     * The collection of interceptors that should apply to the results of a call to
     * the `getData` function before the data rows are displayed in the table
     */
    interceptors?: IInterceptor<T>[];
    /**
     * Configuration for the template that will display the page size buttons
     */
    paginationMaxBlocks?: number;
    /**
     * Configuration for the template that will display the page size buttons
     */
    paginationMinBlocks?: number;
    /**
     * The html tag that will be used to display the sorting indicator in the table header
     */
    sortingIndicator?: string;
    /**
     * The function that will be used fetch data rows. Leave undefined to let the {@link IDefaultGetData}
     * service provide a default implementation that will work with the `dataset` array you supply.
     *
     * Typically you will supply a custom function when you need to execute filtering, paging and sorting
     * on the server
     */
    getData?: IGetDataFunc<T> | IInterceptableGetDataFunc<T>;
    /**
     * The function that will be used group data rows according to the groupings returned by {@link INgTableParams} `group`
    */
    getGroups?: IGetGroupFunc<T>;
}

/**
 * Definition of the constructor function that will construct new instances of `NgTableParams`.
 * On construction of {@link INgTableParams} the {@link IEventsChannel} will fire its `afterCreated` event.
 */
export interface ITableParamsConstructor<T> {
    new (baseParameters?: IParamValues<T> | boolean, baseSettings?: ISettings<T>): INgTableParams<T>
}

/**
 * Alias for the types that can be used to filter events
 */
export type EventSelector<T> = INgTableParams<T> | IEventSelectorFunc

/**
 * Signature of the event hander that is registered to receive the *afterCreated* event
 */
export interface IAfterCreatedListener {
    (publisher: INgTableParams<any>): any
}
/**
 * Signature of the event hander that is registered to receive the *afterReloadData* event
 */
export interface IAfterReloadDataListener<T> {
    (publisher: INgTableParams<T>, newData: DataResult<T>[], oldData: DataResult<T>[]): any
}
/**
 * Signature of the event hander that is registered to receive the *datasetChanged* event
 */
export interface IDatasetChangedListener<T> {
    (publisher: INgTableParams<T>, newDataset: T[], oldDataset: T[]): any
}
/**
 * Signature of the function used to filter the events to only specific instances of 
 * {@link INgTableParams}
 */
export interface IEventSelectorFunc {
    (publisher: INgTableParams<any>): boolean
}
/**
 * Signature of the event hander that is registered to receive the *pagesChanged* event
 */
export interface IPagesChangedListener {
    (publisher: INgTableParams<any>, newPages: IPageButton[], oldPages: IPageButton[]): any
}

/**
 * Signature of the function used to explicitly unregister an event handler so that it stops
 * receiving notifications
 */
export interface IUnregistrationFunc {
    (): void
}

/**
 * Strongly typed pub/sub for {@link INgTableParams}
 *
 * Supported events:
 *
 * * afterCreated - raised when a new instance of {@link INgTableParams} has finished being constructed
 * * afterReloadData - raised when the {@link INgTableParams} `reload` method has finished loading new data
 * * datasetChanged - raised when {@link ISettings} `dataset` receives a new data array
 * * pagesChanged - raised when a new pages array has been generated
 */
export interface IEventsChannel {
    /**
     * Subscribe to receive notification whenever a new `NgTableParams` instance has finished being constructed.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterCreated(listener: IAfterCreatedListener, scope: IScope, eventFilter?: IEventSelectorFunc): IUnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new `NgTableParams` instance has finished being constructed.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterCreated(listener: IAfterCreatedListener, eventFilter?: IEventSelectorFunc): IUnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the `reload` method of an `NgTableParams` instance has successfully executed
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterReloadData<T>(listener: IAfterReloadDataListener<T>, scope: IScope, eventFilter?: EventSelector<T>): IUnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the `reload` method of an `NgTableParams` instance has successfully executed
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterReloadData<T>(listener: IAfterReloadDataListener<T>, eventFilter?: EventSelector<T>): IUnregistrationFunc;

    /**
     * Subscribe to receive notification whenever a new data rows *array* is supplied as a `settings` value to a `NgTableParams` instance.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onDatasetChanged<T>(listener: IDatasetChangedListener<T>, scope: IScope, eventFilter?: EventSelector<T>): IUnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new data rows *array* is supplied as a `settings` value to a `NgTableParams` instance.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onDatasetChanged<T>(listener: IDatasetChangedListener<T>, eventFilter?: EventSelector<T>): IUnregistrationFunc;

    /**
     * Subscribe to receive notification whenever the paging buttons for an `NgTableParams` instance change
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onPagesChanged<T>(listener: IPagesChangedListener, scope: IScope, eventFilter?: EventSelector<T>): IUnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the paging buttons for an `NgTableParams` instance change
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onPagesChanged<T>(listener: IPagesChangedListener, eventFilter?: EventSelector<T>): IUnregistrationFunc;

    publishAfterCreated<T>(publisher: INgTableParams<T>): void;
    publishAfterReloadData<T>(publisher: INgTableParams<T>, newData: T[], oldData: T[]): void;
    publishDatasetChanged<T>(publisher: INgTableParams<T>, newDataset: T[], oldDataset: T[]): void;
    publishPagesChanged<T>(publisher: INgTableParams<T>, newPages: IPageButton[], oldPages: IPageButton[]): void;
}