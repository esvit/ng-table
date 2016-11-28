import * as ng1 from 'angular';
import { IPromise } from 'angular';
import { IDefaults } from './ngTableDefaults';
import { IDataRowGroup, IDataSettings, IDefaultGetData, IGetDataFunc, IInterceptor, IInterceptableGetDataFunc } from './data';
import { IFilterValues, IFilterSettings } from './filtering';
import { IGetGroupFunc, IGroupSettings } from './grouping';
import { SortDirection } from './sorting';
import { NgTableParams } from './ngTableParams';

/**
 * Configuration settings for {@link NgTableParams}
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
    dataOptions?: IDataSettings;
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
    defaultSort?: SortDirection;
    filterOptions?: IFilterSettings<T>;
    groupOptions?: IGroupSettings;
    /**
     * The page size buttons that should be displayed. Each value defined in the array
     * determines the possible values that can be supplied to {@link NgTableParams} `page`
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
     * The function that will be used group data rows according to the groupings returned by {@link NgTableParams} `group`
    */
    getGroups?: IGetGroupFunc<T>;
}

/**
 * @private
 */
export class NgTableSettings {
    static $inject = ['ngTableDefaults', 'ngTableDefaultGetData', 'ngTableDefaultGetGroups'];
    private defaults: ISettings<any>;
    constructor(
        private ngTableDefaults: IDefaults,
        private ngTableDefaultGetData: IDefaultGetData<any>,
        private ngTableDefaultGetGroups: IGetGroupFunc<any>) {

        this.defaults = {
            $loading: false,
            dataset: null, //allows data to be set when table is initialized
            total: 0,
            defaultSort: 'desc',
            counts: [10, 25, 50, 100],
            filterOptions: {
                filterComparator: undefined, // look for a substring match in case insensitive way
                filterDelay: 500,
                filterDelayThreshold: 10000, // size of dataset array that will trigger the filterDelay being applied
                filterFilterName: undefined, // when defined overrides ngTableDefaultGetDataProvider.filterFilterName
                filterFn: undefined, // when defined overrides the filter function that ngTableDefaultGetData uses
                filterLayout: 'stack'
            },
            getData: (params: NgTableParams<any>) => {
                return this.ngTableDefaultGetData(params.settings().dataset, params);
            },
            getGroups: this.ngTableDefaultGetGroups,
            groupOptions: {
                defaultSort: 'asc', // set to 'asc' or 'desc' to apply sorting to groups
                isExpanded: true
            },
            interceptors: [],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator: 'span'
        };
    }
    createDefaults<T>(): ISettings<T> {
        return this.merge(this.defaults, this.ngTableDefaults.settings);
    }
    merge<T>(existing: ISettings<T>, newSettings: ISettings<T>): ISettings<T> {

        newSettings = ng1.extend({}, newSettings);

        if (newSettings.filterOptions) {
            newSettings.filterOptions = ng1.extend({}, existing.filterOptions || {}, newSettings.filterOptions);
        }
        if (newSettings.groupOptions) {
            newSettings.groupOptions = ng1.extend({}, existing.groupOptions || {}, newSettings.groupOptions);
        }

        if (ng1.isArray(newSettings.dataset)) {
            //auto-set the total from passed in dataset
            newSettings.total = newSettings.dataset.length;
        }
        const results = ng1.extend({}, existing, newSettings);
        if (ng1.isArray(newSettings.dataset)) {
            this.optimizeFilterDelay(results);
        }
        return ng1.extend({}, existing, newSettings);
    }
    private optimizeFilterDelay<T>(settings: ISettings<T>) {
        // don't debounce by default filter input when working with small synchronous datasets
        if (settings.filterOptions.filterDelay === this.defaults.filterOptions.filterDelay &&
            settings.total <= settings.filterOptions.filterDelayThreshold &&
            settings.getData === this.defaults.getData) {
            settings.filterOptions.filterDelay = 0;
        }
    }
}