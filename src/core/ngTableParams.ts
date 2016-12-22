/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { ILogService, IPromise, IQService } from 'angular';
import { convertSortToOrderBy, isGroupingFun } from './util';
import { assignPartialDeep } from '../shared';
import { Defaults } from './ngTableDefaults'
import { NgTableEventsChannel } from './ngTableEventsChannel'
import { SettingsPartial, Settings } from './ngTableSettings'
import { DataResult, DataRowGroup, GetDataFunc } from './data';
import { FilterValues } from './filtering';
import { GetGroupFunc, Grouping, GroupingPartial, GroupValuesPartial, GroupingFunc, GroupSort, GroupValues } from './grouping';
import { SortDirection, SortingValues } from './sorting';
import { PageButton } from './paging';

/**
 * @private
 */
export interface InternalTableParams<T> extends NgTableParams<T> {
    isNullInstance: boolean
}


export type ParamValuesPartial<T> =
    Partial<Pick<ParamValues<T>, 'page' | 'count' | 'filter' | 'sorting'>>
    & {
        group?: string | GroupingPartial<T>
    };

/**
 * The runtime values for {@link NgTableParams} that determine the set of data rows and
 * how they are to be displayed in a table
 */
export class ParamValues<T> {
    /**
     * The index of the "slice" of data rows, starting at 1, to be displayed by the table.
     */
    page = 1;
    /**
     * The number of data rows per page
     */
    count = 10;
    /**
     * The filter that should be applied to restrict the set of data rows
     */
    filter: FilterValues = {};
    /**
     * The sort order that should be applied to the data rows.
     */
    sorting: SortingValues = {};
    /**
     * The grouping that should be applied to the data rows
     */
    group: string | Grouping<T> = {};
}


/**
 * @private
 */
function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * @private
 */
type Memento<T> = {
    params: ParamValues<T>;
    groupSortDirection?: string;
};

/**
 * Parameters manager for an ngTable directive
 */
export class NgTableParams<T> {
    /**
     * The page of data rows currently being displayed in the table
     */
    data: T[] = [];
    reloadPages: () => void;
    private defaultSettings = Settings.createWithOverrides<T>();
    private errParamsMemento: Memento<T> | null;
    private isCommittedDataset = false;
    isNullInstance: boolean;
    private initialEvents: Function[] | null = [];
    private ngTableDefaults: Defaults
    private ngTableEventsChannel: NgTableEventsChannel;
    private prevParamsMemento: Memento<T>;
    private _params = new ParamValues<T>();
    private _settings = this.defaultSettings;
    private $q: IQService;
    private $log: ILogService
    constructor(baseParameters: ParamValuesPartial<T> | boolean = {}, baseSettings: SettingsPartial<T> = {}) {

        // the ngTableController "needs" to create a dummy/null instance and it's important to know whether an instance
        // is one of these
        if (typeof baseParameters === "boolean") {
            this.isNullInstance = true;
        }

        this.reloadPages = (() => {
            let currentPages: PageButton[];
            return () => {
                const oldPages = currentPages;
                const newPages = this.generatePagesArray(this.page(), this.total(), this.count());
                if (!ng1.equals(oldPages, newPages)) {
                    currentPages = newPages;
                    this.ngTableEventsChannel.publishPagesChanged(this, newPages, oldPages);
                }
            }
        })();

        assignPartialDeep(this._params, this.ngTableDefaults.params);

        this.settings(baseSettings);
        this.parameters(baseParameters, true);

        this.ngTableEventsChannel.publishAfterCreated(this);
        // run events during construction after the initial create event. That way a consumer
        // can subscribe to all events for a table without "dropping" an event
        ng1.forEach(this.initialEvents, event => {
            event();
        });
        this.initialEvents = null;
    }
    /**
     * Returns the number of data rows per page
     */
    count(): number
    /**
     * Sets the number of data rows per page.
     * Changes to count will cause `isDataReloadRequired` to return true
     */
    count(count: number): this
    count(count?: number) {
        // reset to first page because can be blank page
        return count !== undefined ? this.parameters({
            'count': count,
            'page': 1
        }) : this._params.count;
    }
    /**
     * Returns the current filter values used to restrict the set of data rows.
     * @param trim supply true to return the current filter minus any insignificant values
     * (null,  undefined and empty string)
     */
    filter(trim?: boolean): FilterValues
    /**
     * Sets filter values to the `filter` supplied; any existing filter will be removed
     * Changes to filter will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    filter(filter: FilterValues): this
    filter(filter?: FilterValues | boolean) {
        if (filter != null && typeof filter === 'object') {
            return this.parameters({
                'filter': filter,
                'page': 1
            });
        } else if (filter === true) {
            const keys = Object.keys(this._params.filter);
            const significantFilter: FilterValues = {};
            for (let i = 0; i < keys.length; i++) {
                const filterValue = this._params.filter[keys[i]];
                if (filterValue != null && filterValue !== '') {
                    significantFilter[keys[i]] = filterValue;
                }
            }
            return significantFilter;
        } else {
            return this._params.filter;
        }
    }
    /**
     * Generate array of pages.
     * When no arguments supplied, the current parameter state of this `NgTableParams` instance will be used
     * @param currentPage Which page must be active
     * @param totalItems  Total quantity of items
     * @param pageSize    Quantity of items on page
     * @param maxBlocks   Quantity of blocks for pagination
     * @returns Array of pages
     */
    generatePagesArray(currentPage?: number, totalItems?: number, pageSize?: number, maxBlocks?: number) {
        if (!arguments.length) {
            currentPage = this.page();
            totalItems = this.total();
            pageSize = this.count();
        }

        let maxPage: number, maxPivotPages: number, minPage: number, numPages: number;
        maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;

        const pages: PageButton[] = [];
        numPages = Math.ceil(totalItems / pageSize);
        if (numPages > 1) {
            pages.push({
                type: 'prev',
                number: Math.max(1, currentPage - 1),
                active: currentPage > 1
            });
            pages.push({
                type: 'first',
                number: 1,
                active: currentPage > 1,
                current: currentPage === 1
            });
            maxPivotPages = Math.round((this._settings.paginationMaxBlocks - this._settings.paginationMinBlocks) / 2);
            minPage = Math.max(2, currentPage - maxPivotPages);
            maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
            minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
            let i = minPage;
            while (i <= maxPage) {
                if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                    pages.push({
                        type: 'more',
                        active: false
                    });
                } else {
                    pages.push({
                        type: 'page',
                        number: i,
                        active: currentPage !== i,
                        current: currentPage === i
                    });
                }
                i++;
            }
            pages.push({
                type: 'last',
                number: numPages,
                active: currentPage !== numPages,
                current: currentPage === numPages
            });
            pages.push({
                type: 'next',
                number: Math.min(numPages, currentPage + 1),
                active: currentPage < numPages
            });
        }
        return pages;
    }
    /**
     * Returns the current grouping used to group the data rows
     */
    group(): Grouping<T>
    /**
     * Sets grouping to the `group` supplied; any existing grouping will be removed.
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(group: GroupValuesPartial): this
    /**
     * Sets grouping to the `field` and `sortDirection` supplied; any existing grouping will be removed
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(field: string, sortDirection?: GroupSort): this
    /**
     * Sets grouping to the `group` supplied; any existing grouping will be removed.
     * If `sortDirection` is supplied, this will be assigned to the sortDirection property of `group`
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(group: GroupingFunc<T> | string, sortDirection?: GroupSort): this
    group(group?: GroupingPartial<T> | string, sortDirection?: GroupSort): string | Grouping<T> | this {
        if (group === undefined) {
            return this._params.group;
        }

        const newParameters: ParamValuesPartial<T> = {
            page: 1
        };
        if (isGroupingFun(group) && sortDirection !== undefined) {
            group.sortDirection = sortDirection;
            newParameters.group = group;
        } else if (typeof group === 'string' && sortDirection !== undefined) {
            newParameters.group = { [group]: sortDirection };
        } else {
            newParameters.group = group;
        }
        this.parameters(newParameters);
        return this;
    }
    /**
     * Returns true when an attempt to `reload` the current `parameter` values have resulted in a failure.
     * This method will continue to return true until the `reload` is successfully called or when the
     * `parameter` values have changed
     */
    hasErrorState() {
        return !!(this.errParamsMemento && ng1.equals(this.errParamsMemento, this.createComparableParams()));
    }
    /**
     * Returns true if `filter` has significant filter value(s) (any value except null, undefined, or empty string),
     * otherwise false
     */
    hasFilter() {
        return Object.keys(this.filter(true)).length > 0;
    }
    /**
     * Return true when a change to `filters` require the `reload` method
     * to be run so as to ensure the data presented to the user reflects these filters
     */
    hasFilterChanges() {
        const previousFilter = (this.prevParamsMemento && this.prevParamsMemento.params.filter);
        return !ng1.equals((this._params.filter), previousFilter) || this.hasGlobalSearchFieldChanges();
    }
    /**
     * Returns true when at least one group has been set
     */
    hasGroup(): boolean
    /**
     * Returns true when the `group` and when supplied, the `sortDirection` matches an existing group
     */
    hasGroup(group: string | GroupingFunc<T>, sortDirection?: string): boolean
    hasGroup(group?: string | GroupingFunc<T>, sortDirection?: string) {
        if (group == null) {
            return isGroupingFun(this._params.group) || Object.keys(this._params.group).length > 0
        }

        if (isGroupingFun(group)) {
            if (sortDirection == null) {
                return this._params.group === group;
            } else {
                return this._params.group === group && group.sortDirection === sortDirection;
            }
        } else {
            if (sortDirection == null) {
                return Object.keys(this._params.group).indexOf(group) !== -1;
            } else {
                return (this._params.group as GroupValues)[group] === sortDirection;
            }
        }
    }
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
    isDataReloadRequired() {
        // note: using != as want to treat null and undefined the same
        return !this.isCommittedDataset || !ng1.equals(this.createComparableParams(), this.prevParamsMemento)
            || this.hasGlobalSearchFieldChanges();
    }
    /**
     * Returns true if sorting by the field supplied. Where direction supplied
     * the field must also be sorted by that direction to return true
     */
    isSortBy(field: string, direction?: string) {
        if (direction !== undefined) {
            return this._params.sorting[field] !== undefined && this._params.sorting[field] == direction;
        } else {
            return this._params.sorting[field] !== undefined;
        }
    }
    /**
     * Returns sorting values in a format that can be consumed by the angular `$orderBy` filter service
     */
    orderBy() {
        return convertSortToOrderBy(this._params.sorting);
    }
    /**
     * Returns the index of the current "slice" of data rows
     */
    page(): number
    /**
     * Sets the index of the current "slice" of data rows. The index starts at 1.
     * Changing the page number will cause `isDataReloadRequired` to return true
     */
    page(page: number): this
    page(page?: number) {
        return page !== undefined ? this.parameters({
            'page': page
        }) : this._params.page;
    }
    parameters(): ParamValues<T>
    /**
     * Set new parameters
     */
    parameters(newParameters?: ParamValuesPartial<T> | { [name: string]: string }, parseParamsFromUrl?: boolean): this
    parameters(newParameters?: ParamValuesPartial<T> | { [name: string]: string }, parseParamsFromUrl?: boolean): ParamValues<T> | this {
        if (newParameters === undefined) {
            return this._params;
        }

        // todo: move parsing of url like parameters into a seperate method

        parseParamsFromUrl = parseParamsFromUrl || false;
        for (const key in newParameters) {
            let value = newParameters[key];
            if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                const keys = key.split(/\[(.*)\]/).reverse()
                let lastKey = '';
                for (let i = 0, len = keys.length; i < len; i++) {
                    const name = keys[i];
                    if (name !== '') {
                        const v = value;
                        value = {};
                        value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                    }
                }
                if (lastKey === 'sorting') {
                    this._params[lastKey] = {};
                }
                this._params[lastKey] = ng1.extend(this._params[lastKey] || {}, value[lastKey]);
            } else {
                if (newParameters[key] === undefined) {
                    // skip
                }
                else if (key === 'group') {
                    this._params[key] = this.parseGroup(newParameters[key]);
                } else {
                    this._params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                }
            }
        }
        this.log('ngTable: set parameters', this._params);
        return this;
    }
    /**
     * Trigger a reload of the data rows
     */
    reload<TResult extends DataResult<T>>(): IPromise<TResult[]> {
        let pData: ng1.IPromise<any>;

        this._settings.$loading = true;

        this.prevParamsMemento = ng1.copy(this.createComparableParams());
        this.isCommittedDataset = true;

        if (this.hasGroup()) {
            pData = this.runInterceptorPipeline(this.$q.when(this._settings.getGroups(this)));
        } else {
            const fn = this._settings.getData as GetDataFunc<T>;
            pData = this.runInterceptorPipeline(this.$q.when(fn(this)));
        }

        this.log('ngTable: reload data');

        const oldData = this.data;
        return pData.then(data => {
            this._settings.$loading = false;
            this.errParamsMemento = null;

            this.data = data;
            // note: I think it makes sense to publish this event even when data === oldData
            // subscribers can always set a filter to only receive the event when data !== oldData
            this.ngTableEventsChannel.publishAfterReloadData(this, data, oldData);
            this.reloadPages();

            return data;
        }).catch(reason => {
            this.errParamsMemento = this.prevParamsMemento;
            // "rethrow"
            return this.$q.reject(reason);
        });
    }
    /**
     * Returns the settings for the table.
     */
    settings(): Settings<T>
    /**
     * Sets the settings for the table; new setting values will be merged with the existing settings.
     * Supplying a new `dataset` will cause `isDataReloadRequired` to return true and the `ngTableEventsChannel`
     * to fire its `datasetChanged` event
     */
    settings(newSettings: SettingsPartial<T>): this
    settings(newSettings?: SettingsPartial<T>): this | Settings<T> {
        if (newSettings === undefined) {
            return this._settings;
        }

        const settings = Settings.merge(this._settings, newSettings);

        const originalDataset = this._settings.dataset;
        this._settings = settings;

        // note: using != as want null and undefined to be treated the same
        const hasDatasetChanged = newSettings.hasOwnProperty('dataset') && (newSettings.dataset != originalDataset);
        if (hasDatasetChanged) {
            if (this.isCommittedDataset) {
                this.page(1); // reset page as a new dataset has been supplied
            }
            this.isCommittedDataset = false;

            const fireEvent = () => {
                this.ngTableEventsChannel.publishDatasetChanged(this, newSettings.dataset, originalDataset);
            };

            if (this.initialEvents) {
                this.initialEvents.push(fireEvent);
            } else {
                fireEvent();
            }
        }
        this.log('ngTable: set settings', this._settings);
        return this;
    }
    /**
     * Returns the current sorting used to order the data rows.
     * Changes to sorting will cause `isDataReloadRequired` to return true
     */
    sorting(): SortingValues
    /**
     * Sets sorting values to the `sorting` supplied; any existing sorting will be removed.
     * Changes to sorting will cause `isDataReloadRequired` to return true
     */
    sorting(sorting: SortingValues): this
    /**
     * Sets sorting to the `field` and `direction` supplied; any existing sorting will be removed
     */
    sorting(field: string, direction?: string): this
    sorting(sorting?: SortingValues | string, direction?: SortDirection) {
        if (typeof sorting === 'string') {
            this.parameters({
                'sorting': { [sorting]: direction || this.settings().defaultSort }
            });
            return this;
        }
        return sorting !== undefined ? this.parameters({
            'sorting': sorting
        }) : this._params.sorting;
    }
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
     * const tp = new NgTableParams({}, { getData: customGetData })
     * function customGetData(params) {
     *      const queryResult = // code to fetch current data rows and total //
     *      params.total(queryResult.total);
     *      return queryResult.dataRowsPage;
     * }
     * ```
     */
    total(total: number): this
    total(total?: number) {
        return total !== undefined ? this.settings({
            'total': total
        }) : this._settings.total;
    }
    /**
     * Returns the current parameter values uri-encoded. Set `asString` to
     * true for the parameters to be returned as an array of strings of the form 'paramName=value'
     * otherwise parameters returned as a key-value object
     */
    url(asString = false) {
        const pairs: any[] | { [name: string]: string } = (asString ? [] : {});
        for (const key in this._params) {
            if (this._params.hasOwnProperty(key)) {
                const item = (this._params as { [name: string]: any })[key],
                    name = encodeURIComponent(key);
                if (typeof item === "object") {
                    for (const subkey in item) {
                        if (isSignificantValue(item[subkey], key)) {
                            const pname = name + "[" + encodeURIComponent(subkey) + "]";
                            collectValue(item[subkey], pname);
                        }
                    }
                } else if (!ng1.isFunction(item) && isSignificantValue(item, key)) {
                    collectValue(item, name);
                }
            }
        }
        return pairs;

        function collectValue(value: any, key: string) {
            if (isArray(pairs)) {
                pairs.push(key + "=" + encodeURIComponent(value));
            } else {
                pairs[key] = encodeURIComponent(value);
            }
        }

        function isArray(pairs: any[] | {}): pairs is Array<any> {
            return asString;
        }

        function isSignificantValue(value: any, key: string) {
            return key === "group" ? true : typeof value !== undefined && value !== "";
        }
    }
    private createComparableParams(): Memento<T> {
        const group = this._params.group;
        return {
            params: this._params,
            groupSortDirection: isGroupingFun(group) ? group.sortDirection : undefined
        };
    }
    private hasGlobalSearchFieldChanges() {
        const currentVal = (this._params.filter && this._params.filter['$']);
        const previousVal =
            (this.prevParamsMemento && this.prevParamsMemento.params.filter && this.prevParamsMemento.params.filter['$']);
        return !ng1.equals(currentVal, previousVal);
    }
    private log(...args: any[]) {
        if (this._settings.debugMode && this.$log.debug) {
            this.$log.debug(...args);
        }
    }
    private parseGroup(group: string | Grouping<T>) {
        const defaultSort = this._settings.groupOptions.defaultSort;
        if (!group) {
            return group;
        } else if (isGroupingFun(group)) {
            if (group.sortDirection == null) {
                group.sortDirection = defaultSort;
            }
            return group;
        } else if (typeof group === 'object') {
            for (const key in group) {
                if (group[key] == null) {
                    group[key] = defaultSort;
                }
            }
            return group;
        } else {
            return {
                [group]: defaultSort
            };
        }
    }
    private runInterceptorPipeline(fetchedData: IPromise<any>) {
        return this._settings.interceptors.reduce((result, interceptor) => {
            const thenFn = (interceptor.response && interceptor.response.bind(interceptor)) || this.$q.when;
            const rejectFn = (interceptor.responseError && interceptor.responseError.bind(interceptor)) || this.$q.reject;
            return result.then(data => {
                return thenFn(data, this);
            }, reason => {
                return rejectFn(reason, this);
            });
        }, fetchedData);
    }

    static init(
        $q: IQService,
        $log: ILogService,
        ngTableDefaults: Defaults,
        ngTableEventsChannel: NgTableEventsChannel) {
        ng1.extend(NgTableParams.prototype, {
            $q, $log, ngTableDefaults, ngTableEventsChannel
        });
    }
}

NgTableParams.init.$inject = ['$q', '$log', 'ngTableDefaults', 'ngTableEventsChannel'];