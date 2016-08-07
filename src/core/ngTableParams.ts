/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { 
    IDataRowGroup, IDefaults, IDefaultGetData, IEventsChannel, IFilterSettings, IFilterValues, IGetDataFunc, Grouping, 
    IGroupValues, IGroupingFunc, IGroupSettings, IPageButton, IParamValues, ISettings, ISortingValues, INgTableParams, 
    ITableParamsConstructor } from './public-interfaces'

ngTableParamsFactory.$inject = [
    '$q', '$log', '$filter', 'ngTableDefaults', 'ngTableDefaultGetData', 'ngTableEventsChannel'
];

/**
 * Implmenentation of the {@link INgTableParams INgTableParams} interface
 * @ngdoc service
 */
export function ngTableParamsFactory<T>(
    $q: ng1.IQService, $log: ng1.ILogService, $filter: ng1.IFilterService, ngTableDefaults: IDefaults, 
    ngTableDefaultGetData: IDefaultGetData<any>, ngTableEventsChannel: IEventsChannel) {

    return NgTableParams;
    

    function NgTableParams<T>(baseParameters: IParamValues<T> | boolean, baseSettings: ISettings<T>): INgTableParams<T> {

        type Memento = {
            params: IParamValues<T>;
            groupSortDirection?: string;
        };

        function isNumber(n: any) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        // the ngTableController "needs" to create a dummy/null instance and it's important to know whether an instance
        // is one of these
        if (typeof baseParameters === "boolean"){
            this.isNullInstance = true;
        }

        var self: INgTableParams<T> = this,
            prevParamsMemento: Memento,
            errParamsMemento: Memento,
            isCommittedDataset = false,
            initialEvents: Function[] = [],
            log = function(...args: any[]) {
                if (_settings.debugMode && $log.debug) {
                    $log.debug(...args);
                }
            },
            defaultFilterOptions: IFilterSettings<T> = {
                filterComparator: undefined, // look for a substring match in case insensitive way
                filterDelay: 500,
                filterDelayThreshold: 10000, // size of dataset array that will trigger the filterDelay being applied
                filterFilterName: undefined, // when defined overrides ngTableDefaultGetDataProvider.filterFilterName
                filterFn: undefined, // when defined overrides the filter function that ngTableDefaultGetData uses
                filterLayout: 'stack' // alternative: 'horizontal'
            },
            defaultGroupOptions: IGroupSettings = {
                defaultSort: 'asc', // set to 'asc' or 'desc' to apply sorting to groups
                isExpanded: true
            },
            defaultSettingsFns = getDefaultSettingFns();

        this.data = [];

        this.parameters = function(newParameters?: IParamValues<T>| { [name: string]: string }, parseParamsFromUrl?: boolean) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (typeof newParameters !== undefined) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse()
                        var lastKey = '';
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var name = keys[i];
                            if (name !== '') {
                                var v = value;
                                value = {};
                                value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                            }
                        }
                        if (lastKey === 'sorting') {
                            _params[lastKey] = {};
                        }
                        _params[lastKey] = ng1.extend(_params[lastKey] || {}, value[lastKey]);
                    } else {
                        if (key === 'group'){
                            _params[key] = parseGroup(newParameters[key]);
                        } else {
                            _params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                        }
                    }
                }
                log('ngTable: set parameters', _params);
                return this;
            }
            return _params;
        };

        function parseGroup(group: string | Grouping<T>){
            var defaultSort = _settings.groupOptions && _settings.groupOptions.defaultSort;
            if (!group) {
                return group;
            } else if (isGroupingFun(group)) {
                if (group.sortDirection == null){
                    group.sortDirection = defaultSort;
                }
                return group;
            } else if (typeof group === 'object') {
                for (var key in group) {
                    if (group[key] == null){
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

        /**
         * @ngdoc method
         * @name NgTableParams#settings
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function(newSettings?: ISettings<T>) {
            if (ng1.isDefined(newSettings)) {

                // todo: don't modify newSettings object: this introduces unexpected side effects;
                // instead take a copy of newSettings

                if (newSettings.filterOptions){
                    newSettings.filterOptions = ng1.extend({}, _settings.filterOptions, newSettings.filterOptions);
                }
                if (newSettings.groupOptions){
                    newSettings.groupOptions = ng1.extend({}, _settings.groupOptions, newSettings.groupOptions);
                }

                if (ng1.isArray(newSettings.dataset)) {
                    //auto-set the total from passed in dataset
                    newSettings.total = newSettings.dataset.length;
                }

                var originalDataset = _settings.dataset;
                _settings = ng1.extend(_settings, newSettings);

                if (ng1.isArray(newSettings.dataset)) {
                    optimizeFilterDelay();
                }

                // note: using != as want null and undefined to be treated the same
                var hasDatasetChanged = newSettings.hasOwnProperty('dataset') && (newSettings.dataset != originalDataset);
                if (hasDatasetChanged) {
                    if (isCommittedDataset){
                        this.page(1); // reset page as a new dataset has been supplied
                    }
                    isCommittedDataset = false;

                    var fireEvent = function () {
                        ngTableEventsChannel.publishDatasetChanged(self, newSettings.dataset, originalDataset);
                    };

                    if (initialEvents){
                        initialEvents.push(fireEvent);
                    } else {
                        fireEvent();
                    }
                }
                log('ngTable: set settings', _settings);
                return this;
            }
            return _settings;
        };

        this.page = function(page?: number) {
            return page !== undefined ? this.parameters({
                'page': page
            }) : _params.page;
        };

        this.total = function(total?: number) {
            return total !== undefined ? this.settings({
                'total': total
            }) : _settings.total;
        };

        this.count = function(count?: number) {
            // reset to first page because can be blank page
            return count !== undefined ? this.parameters({
                'count': count,
                'page': 1
            }) : _params.count;
        };

        this.filter = function(filter?: IFilterValues | boolean) {
            if (filter != null && typeof filter === 'object') {
                return this.parameters({
                    'filter': filter,
                    'page': 1
                });
            } else if (filter === true){
                var keys = Object.keys(_params.filter);
                var significantFilter: IFilterValues = {};
                for (var i=0; i < keys.length; i++){
                    var filterValue = _params.filter[keys[i]];
                    if (filterValue != null && filterValue !== '') {
                        significantFilter[keys[i]] = filterValue;
                    }
                }
                return significantFilter;
            } else {
                return _params.filter;
            }
        };

        this.group = function(group?: Grouping<T> | string, sortDirection?: string) {
            if (group === undefined){
                return _params.group;
            }

            var newParameters: IParamValues<T> = {
                page: 1
            };
            if (isGroupingFun(group) && sortDirection !== undefined){
                group.sortDirection = sortDirection;
                newParameters.group = group;
            } else if (typeof group === 'string' && sortDirection !== undefined) {
                newParameters.group = { [group]: sortDirection };
            } else {
                newParameters.group = group;
            }
            this.parameters(newParameters);
            return this;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#sorting
         * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function(sorting?: ISortingValues | string, direction?: string) {
            if (typeof sorting === 'string' && direction !== undefined) {
                this.parameters({
                    'sorting': { [sorting]: direction }
                });
                return this;
            }
            return sorting !== undefined ? this.parameters({
                'sorting': sorting
            }) : _params.sorting;
        };

        this.isSortBy = function(field: string, direction?: string) {
            if(direction !== undefined) {
                return _params.sorting[field] !== undefined && _params.sorting[field] == direction;
            } else {
                return _params.sorting[field] !== undefined;
            }
        };

        /**
         * @ngdoc method
         * @name NgTableParams#orderBy
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function() {
            return convertSortToOrderBy(_params.sorting);
        };

        function convertSortToOrderBy(sorting: ISortingValues){
            var result: string[] = [];
            for (var column in sorting) {
                result.push((sorting[column] === "asc" ? "+" : "-") + column);
            }
            return result;
        }

        /**
         * @ngdoc method
         * @name NgTableParams#generatePagesArray
         * @description Generate array of pages
         *
         * When no arguments supplied, the current parameter state of this `NgTableParams` instance will be used
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @param {number} maxBlocks    Quantity of blocks for pagination
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function(currentPage?: number, totalItems?: number, pageSize?: number, maxBlocks?: number) {
            if (!arguments.length){
                currentPage = this.page();
                totalItems = this.total();
                pageSize = this.count();
            }

            var maxPage: number, maxPivotPages: number, minPage: number, numPages: number;
            maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;

            var pages: IPageButton[] = [];
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
                maxPivotPages = Math.round((_settings.paginationMaxBlocks - _settings.paginationMinBlocks) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                var i = minPage;
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
        };

        /**
         * @ngdoc method
         * @name NgTableParams#isDataReloadRequired
         * @description Return true when a change to this `NgTableParams` instance should require the reload method
         * to be run so as to ensure the data presented to the user reflects the `NgTableParams`
         *
         * Note that this method will return false when the reload method has run but fails. In this case
         * `hasErrorState` will return true.
         */
        this.isDataReloadRequired = function(){
            // note: using != as want to treat null and undefined the same
            return !isCommittedDataset || !ng1.equals(createComparableParams(), prevParamsMemento)
                || hasGlobalSearchFieldChanges();
        };

        function createComparableParams(): Memento {
            var group = _params.group;
            return {
                params: _params,
                groupSortDirection: isGroupingFun(group) ? group.sortDirection : undefined
            };
        }
        function isGroupingFun(val: string | Grouping<T>): val is IGroupingFunc<T> {
                return typeof val === 'function'
        }
        /**
         * @ngdoc method
         * @name NgTableParams#hasFilter
         * @description Determines if NgTableParams#filter has significant filter value(s)
         * (any value except null, undefined, or empty string)
         * @returns {Boolean} true when NgTableParams#filter has at least one significant field value
         */
        this.hasFilter = function(){
            return Object.keys(this.filter(true)).length > 0;
        };

        this.hasGroup = function(group?: IGroupingFunc<T> | string, sortDirection?: string){
            if (group == null) {
                return isGroupingFun(_params.group) || Object.keys(_params.group).length > 0
            }

            if (isGroupingFun(group)) {
                if (sortDirection == null) {
                    return _params.group === group;
                } else {
                    return _params.group === group && group.sortDirection === sortDirection;
                }
            } else {
                if (sortDirection == null) {
                    return Object.keys(_params.group).indexOf(group) !== -1;
                } else {
                    return( _params.group as IGroupValues)[group] === sortDirection;
                }
            }
        };

        this.hasFilterChanges = function(){
            var previousFilter = (prevParamsMemento && prevParamsMemento.params.filter);
            return !ng1.equals((_params.filter), previousFilter) || hasGlobalSearchFieldChanges();
        };

        function hasGlobalSearchFieldChanges(){
            var currentVal = (_params.filter && _params.filter['$']);
            var previousVal =
                (prevParamsMemento && prevParamsMemento.params.filter && prevParamsMemento.params.filter['$']);
            return !ng1.equals(currentVal, previousVal);
        }

        this.url = function(asString?: boolean) {
            // this function is an example of Typescript gone bad!!
            asString = asString || false;
            var pairs: any[] | { [name: string]: string } = (asString ? [] : {});
            for (var key in _params) {
                if (_params.hasOwnProperty(key)) {
                    var item = (_params as { [name: string]: any })[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (isSignificantValue(item[subkey], key)) {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                collectValue(item[subkey], pname);
                            }
                        }
                    } else if (!ng1.isFunction(item) && isSignificantValue(item, key)) {
                        collectValue(item, name);
                    }
                }
            }
            return pairs;

            function collectValue(value: any, key: string){
                if (isArray(pairs)) {
                    pairs.push(key + "=" + encodeURIComponent(value));
                } else {
                    pairs[key] = encodeURIComponent(value);
                }
            }

            function isArray(pairs: any[] | {}): pairs is Array<any> {
                return asString;
            }

            function isSignificantValue(value: any, key: string){
                return key === "group" ? true : typeof value !== undefined && value !== "";
            }
        };

        this.reload = function() {
            var self: INgTableParams<T> = this,
                pData: ng1.IPromise<any> = null;

            _settings.$loading = true;

            prevParamsMemento = ng1.copy(createComparableParams());
            isCommittedDataset = true;

            if (self.hasGroup()) {
                pData = runInterceptorPipeline($q.when(_settings.getGroups(self)));
            } else {
                const fn = _settings.getData as IGetDataFunc<T>;
                pData = runInterceptorPipeline($q.when(fn(self)));
            }

            log('ngTable: reload data');

            var oldData = self.data;
            return pData.then(function(data) {
                _settings.$loading = false;
                errParamsMemento = null;

                self.data = data;
                // note: I think it makes sense to publish this event even when data === oldData
                // subscribers can always set a filter to only receive the event when data !== oldData
                ngTableEventsChannel.publishAfterReloadData(self, data, oldData);
                self.reloadPages();

                return data;
            }).catch(function(reason){
                errParamsMemento = prevParamsMemento;
                // "rethrow"
                return $q.reject(reason);
            });
        };

        this.hasErrorState = function(){
            return !!(errParamsMemento && ng1.equals(errParamsMemento, createComparableParams()));
        };

        function optimizeFilterDelay(){
            // don't debounce by default filter input when working with small synchronous datasets
            if (_settings.filterOptions.filterDelay === defaultFilterOptions.filterDelay &&
                _settings.total <= _settings.filterOptions.filterDelayThreshold &&
                _settings.getData === defaultSettingsFns.getData){
                _settings.filterOptions.filterDelay = 0;
            }
        }

        this.reloadPages = (function() {
            var currentPages: IPageButton[];
            return function(){
                var oldPages = currentPages;
                var newPages = self.generatePagesArray(self.page(), self.total(), self.count());
                if (!ng1.equals(oldPages, newPages)){
                    currentPages = newPages;
                    ngTableEventsChannel.publishPagesChanged(this, newPages, oldPages);
                }
            }
        })();

        function runInterceptorPipeline(fetchedData: ng1.IPromise<any>){
            var interceptors = _settings.interceptors || [];

            return interceptors.reduce(function(result, interceptor){
                var thenFn = (interceptor.response && interceptor.response.bind(interceptor)) || $q.when;
                var rejectFn = (interceptor.responseError && interceptor.responseError.bind(interceptor)) || $q.reject;
                return result.then(function(data){
                    return thenFn(data, self);
                }, function(reason){
                    return rejectFn(reason, self);
                });
            }, fetchedData);
        }

        function getDefaultSettingFns(){

            return {
                getData: getData,
                getGroups: getGroups
            };

            /**
             * @ngdoc method
             * @name settings#getData
             * @description Returns the data to display in the table
             *
             * Called by `NgTableParams` whenever it considers new data is to be loaded
             *
             * @param {Object} params the `NgTableParams` requesting data
             */
            function getData(params: INgTableParams<T>) {
                return ngTableDefaultGetData(params.settings().dataset, params);
            }

            /**
             * @ngdoc method
             * @name settings#getGroups
             * @description Return groups of data to display in the table
             *
             * Called by `NgTableParams` whenever it considers new data is to be loaded
             * and when a `group` value has been assigned
             *
             * @param {Object} params the `NgTableParams` requesting data
             */
            function getGroups(params: INgTableParams<T>) {

                var group = params.group();
                var groupFn: IGroupingFunc<T>;
                var sortDirection: string = undefined;
                if (isGroupingFun(group)) {
                    groupFn = group;
                    sortDirection = group.sortDirection;
                } else {
                    // currently support for only one group implemented
                    var groupField = Object.keys(group)[0];
                    sortDirection = group[groupField];
                    groupFn = function(item){
                        return getPath(item, groupField);
                    };
                }

                var settings = params.settings();
                var originalDataOptions = settings.dataOptions;
                settings.dataOptions = { applyPaging: false };
                const getData: IGetDataFunc<T> = settings.getData;
                var gotData = $q.when(getData(params));
                return gotData.then(function(data) {
                    var groups: { [name: string]: IDataRowGroup<T> } = {};
                    ng1.forEach(data, function(item) {
                        var groupName = groupFn(item);
                        groups[groupName] = groups[groupName] || {
                                data: [],
                                $hideRows: !settings.groupOptions.isExpanded,
                                value: groupName
                            };
                        groups[groupName].data.push(item);
                    });
                    var result: IDataRowGroup<T>[] = [];
                    for (var i in groups) {
                        result.push(groups[i]);
                    }
                    if (sortDirection) {
                        var orderByFn = ngTableDefaultGetData.getOrderByFn();
                        var orderBy = convertSortToOrderBy({
                            value: sortDirection
                        });
                        result = orderByFn(result, orderBy);
                    }

                    return ngTableDefaultGetData.applyPaging(result, params);
                }).finally(function(){
                    // restore the real options
                    settings.dataOptions = originalDataOptions;
                });
            }

            function getPath (obj: { [name: string]: any}, ks: string | string[]): any {
                // origianl source https://github.com/documentcloud/underscore-contrib

                let keys: string[];
                if (typeof ks === "string"){
                    keys = ks.split(".");
                } else {
                    keys = ks;
                }

                // If we have reached an undefined property
                // then stop executing and return undefined
                if (obj === undefined) return void 0;

                // If the path array has no more elements, we've reached
                // the intended property and return its value
                if (keys.length === 0) return obj;

                // If we still have elements in the path array and the current
                // value is null, stop executing and return undefined
                if (obj === null) return void 0;

                return getPath(obj[keys[0]], keys.slice(1));
            }
        }

        var _params: IParamValues<T> = {
            page: 1,
            count: 10,
            filter: {},
            sorting: {},
            group: {}
        };
        ng1.extend(_params, ngTableDefaults.params);

        /**
         * @ngdoc object
         * @name settings
         * @module ngTable
         * @description configuration settings for `NgTableParams`
         */
        var _settings: ISettings<T> = {
            $loading: false,
            dataset: null, //allows data to be set when table is initialized
            total: 0,
            defaultSort: 'desc',
            filterOptions: ng1.copy(defaultFilterOptions),
            groupOptions: ng1.copy(defaultGroupOptions),
            counts: [10, 25, 50, 100],
            interceptors: [],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator: 'span'
        };

        this.settings(defaultSettingsFns);
        this.settings(ngTableDefaults.settings);
        this.settings(baseSettings);
        this.parameters(baseParameters, true);

        ngTableEventsChannel.publishAfterCreated(this);
        // run events during construction after the initial create event. That way a consumer
        // can subscribe to all events for a table without "dropping" an event
        ng1.forEach(initialEvents, function(event){
            event();
        });
        initialEvents = null;

        return this;
    }
}