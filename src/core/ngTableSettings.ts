import * as ng1 from 'angular';
import { assignPartialDeep } from '../shared';
import { IPromise } from 'angular';
import { Defaults } from './ngTableDefaults';
import { DataRowGroup, DataSettingsPartial, DataSettings, DefaultGetData, GetDataFunc, Interceptor, InterceptableGetDataFunc } from './data';
import { FilterValues, FilterSettingsPartial, FilterSettings } from './filtering';
import { GetGroupFunc, GroupSettingsPartial, GroupSettings } from './grouping';
import { SortDirection } from './sorting';
import { NgTableParams } from './ngTableParams';

/**
 * Configuration settings for {@link NgTableParams}
 */
export class Settings<T> {
    /**
     * Returns true whenever a call to `getData` is in progress
     */
    $loading = false;
    /**
     * The page size buttons that should be displayed. Each value defined in the array
     * determines the possible values that can be supplied to {@link NgTableParams} `page`
     */
    counts = [10, 25, 50, 100];
    /**
     * An array that contains all the data rows that table should manage.
     * The `gateData` function will be used to manage the data rows
     * that ultimately will be displayed.
     */
    dataset?: T[] = undefined;
    dataOptions = new DataSettings();
    debugMode = false;
    /**
     * The total number of data rows before paging has been applied.
     * Typically you will not need to supply this yourself
     */
    total = 0;
    /**
     * The default sort direction that will be used whenever a sorting is supplied that
     * does not define its own sort direction
     */
    defaultSort: SortDirection = 'desc';
    filterOptions = new FilterSettings<T>();
    /**
     * The function that will be used fetch data rows. Leave undefined to let the {@link IDefaultGetData}
     * service provide a default implementation that will work with the `dataset` array you supply.
     *
     * Typically you will supply a custom function when you need to execute filtering, paging and sorting
     * on the server
     */
    getData: GetDataFunc<T> | InterceptableGetDataFunc<T> = (params: NgTableParams<T>) => {
        return Settings.ngTableDefaultGetData(params.settings().dataset, params) as T[];
    };
    /**
     * The function that will be used group data rows according to the groupings returned by {@link NgTableParams} `group`
    */
    getGroups: GetGroupFunc<T> = Settings.ngTableDefaultGetGroups;
    groupOptions = new GroupSettings();
    /**
     * The collection of interceptors that should apply to the results of a call to
     * the `getData` function before the data rows are displayed in the table
     */
    interceptors = new Array<Interceptor<T>>();
    /**
     * Configuration for the template that will display the page size buttons
     */
    paginationMaxBlocks = 11;
    /**
     * Configuration for the template that will display the page size buttons
     */
    paginationMinBlocks = 5;
    /**
     * The html tag that will be used to display the sorting indicator in the table header
     */
    sortingIndicator = 'span'
    private static ngTableDefaultGetData: DefaultGetData<any>;
    private static ngTableDefaultGetGroups: GetGroupFunc<any>;
    static init(ngTableDefaultGetData: DefaultGetData<any>,
        ngTableDefaultGetGroups: GetGroupFunc<any>) {
        Settings.ngTableDefaultGetData = ngTableDefaultGetData;
        Settings.ngTableDefaultGetGroups = ngTableDefaultGetGroups;
    }
}

Settings.init.$inject = ['ngTableDefaultGetData', 'ngTableDefaultGetGroups'];

export type SettingsPartial<T> =
    Partial<Pick<Settings<T>,
    '$loading' |
    'counts' |
    'dataset' |
    'debugMode' |
    'total' |
    'defaultSort' |
    'getData' |
    'getGroups' |
    'interceptors' |
    'paginationMaxBlocks' |
    'paginationMinBlocks' |
    'sortingIndicator'>>
    & {
        dataOptions?: DataSettingsPartial;
        filterOptions?: FilterSettingsPartial<T>;
        groupOptions?: GroupSettingsPartial;
    }

/**
 * @private
 */
export class NgTableSettings {
    static $inject = ['ngTableDefaults'];
    private defaults = new Settings();
    constructor(
        private ngTableDefaults: Defaults) {
    }
    createDefaults<T>(): Settings<T> {
        return this.merge(this.defaults, this.ngTableDefaults.settings);
    }
    merge<T>(existing: Settings<T>, newSettings: SettingsPartial<T>): Settings<T> {

        const results = assignPartialDeep(ng1.copy(existing), newSettings, (destValue: any, srcValue: any, key: keyof Settings<T>) => {
            // copy *reference* to dataset
            if (key === 'dataset'){
                return srcValue;
            }
            return undefined;
        });

        if (newSettings.dataset) {
            results.total = newSettings.dataset.length;
            this.optimizeFilterDelay(results);
        }
        return results;
    }
    private optimizeFilterDelay<T>(settings: Settings<T>) {
        // don't debounce by default filter input when working with small synchronous datasets
        if (settings.filterOptions.filterDelay === this.defaults.filterOptions.filterDelay &&
            settings.total <= settings.filterOptions.filterDelayThreshold &&
            settings.getData === this.defaults.getData) {
            settings.filterOptions.filterDelay = 0;
        }
    }
}