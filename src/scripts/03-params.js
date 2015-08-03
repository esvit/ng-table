/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name ngTableDefaultParams
 * @module ngTable
 * @description Default Parameters for ngTable
 */
app.value('ngTableDefaults', {
    params: {},
    settings: {}
});

/**
 * @ngdoc service
 * @name NgTableParams
 * @module ngTable
 * @description Parameters manager for ngTable
 */

app.factory('NgTableParams', ['$q', '$log', 'ngTableDefaults', 'ngTableGetDataBcShim', 'ngTableDefaultGetData', 'ngTableEventsChannel', function($q, $log, ngTableDefaults, ngTableGetDataBcShim, ngTableDefaultGetData, ngTableEventsChannel) {
    var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var NgTableParams = function(baseParameters, baseSettings) {

        // the ngTableController "needs" to create a dummy/null instance and it's important to know whether an instance
        // is one of these
        if (typeof baseParameters === "boolean"){
            this.isNullInstance = true;
        }

        var self = this,
            committedParams,
            isCommittedDataset = false,
            log = function() {
                if (settings.debugMode && $log.debug) {
                    $log.debug.apply(this, arguments);
                }
            };

        this.data = [];

        /**
         * @ngdoc method
         * @name NgTableParams#parameters
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function(newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (angular.isDefined(newParameters)) {
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
                            params[lastKey] = {};
                        }
                        params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                    } else {
                        params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                    }
                }
                log('ngTable: set parameters', params);
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#settings
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function(newSettings) {
            if (angular.isDefined(newSettings)) {
                if (angular.isArray(newSettings.data)) {
                    //auto-set the total from passed in data
                    newSettings.total = newSettings.data.length;
                }

                // todo: remove the backwards compatibility shim and the following two if blocks
                if (newSettings.getData && newSettings.getData.length > 1){
                    // support the old getData($defer, params) api
                    newSettings.getDataFnAdaptor = ngTableGetDataBcShim;
                }
                if (newSettings.getGroups && newSettings.getGroups.length > 2){
                    // support the old getGroups($defer, grouping, params) api
                    newSettings.getGroupsFnAdaptor = ngTableGetDataBcShim;
                }

                var originalDataset = settings.data;
                settings = angular.extend(settings, newSettings);

                // note: using != as want null and undefined to be treated the same
                var hasDatasetChanged = newSettings.hasOwnProperty('data') && (newSettings.data != originalDataset);
                if (hasDatasetChanged) {
                    if (isCommittedDataset){
                        this.page(1); // reset page as a new dataset has been supplied
                    }
                    isCommittedDataset = false;
                    ngTableEventsChannel.publishDatasetChanged(this, newSettings.data, originalDataset);
                }
                log('ngTable: set settings', settings);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#page
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} page Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function(page) {
            return angular.isDefined(page) ? this.parameters({
                'page': page
            }) : params.page;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#total
         * @description If parameter total not set return current quantity else set quantity
         *
         * @param {string} total Total quantity of items
         * @returns {Object|Number} Current page or `this`
         */
        this.total = function(total) {
            return angular.isDefined(total) ? this.settings({
                'total': total
            }) : settings.total;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#count
         * @description If parameter count not set return current count per page else set count per page
         *
         * @param {string} count Count per number
         * @returns {Object|Number} Count per page or `this`
         */
        this.count = function(count) {
            // reset to first page because can be blank page
            return angular.isDefined(count) ? this.parameters({
                'count': count,
                'page': 1
            }) : params.count;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#filter
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} filter New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function(filter) {
            return angular.isDefined(filter) ? this.parameters({
                'filter': filter,
                'page': 1
            }) : params.filter;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#sorting
         * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function(sorting) {
            if (arguments.length == 2) {
                var sortArray = {};
                sortArray[sorting] = arguments[1];
                this.parameters({
                    'sorting': sortArray
                });
                return this;
            }
            return angular.isDefined(sorting) ? this.parameters({
                'sorting': sorting
            }) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#isSortBy
         * @description Checks sort field
         *
         * @param {string} field     Field name
         * @param {string} direction Direction of sorting 'asc' or 'desc'
         * @returns {Array} Return true if field sorted by direction
         */
        this.isSortBy = function(field, direction) {
            return angular.isDefined(params.sorting[field]) && angular.equals(params.sorting[field], direction);
        };

        /**
         * @ngdoc method
         * @name NgTableParams#orderBy
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function() {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#getData
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} params New parameters
         */
        this.getData = function(params) {
            // note: this === settings
            return ngTableDefaultGetData(this.data, params);
        };

        /**
         * @ngdoc method
         * @name NgTableParams#getGroups
         * @description Return groups for table grouping
         */
        this.getGroups = function(column) {
            return runGetData().then(function(data) {
                var groups = {};
                angular.forEach(data, function(item) {
                    var groupName = angular.isFunction(column) ? column(item) : item[column];

                    groups[groupName] = groups[groupName] || {
                        data: []
                    };
                    groups[groupName]['value'] = groupName;
                    groups[groupName].data.push(item);
                });
                var result = [];
                for (var i in groups) {
                    result.push(groups[i]);
                }
                log('ngTable: refresh groups', result);
                return result;
            });
        };

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
        this.generatePagesArray = function(currentPage, totalItems, pageSize, maxBlocks) {
            if (!arguments.length){
                currentPage = this.page();
                totalItems = this.total();
                pageSize = this.count();
            }

            var maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;

            pages = [];
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
                maxPivotPages = Math.round((settings.paginationMaxBlocks - settings.paginationMinBlocks) / 2);
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
         */
        this.isDataReloadRequired = function(){
            // note: using != as want to treat null and undefined the same
            return !isCommittedDataset || !angular.equals(params, committedParams);
        };

        /**
         * @ngdoc method
         * @name NgTableParams#hasFilter
         * @description Determines if NgTableParams#filter has significant filter value(s)
         * (any value except null, undefined, or empty string)
         * @returns {Boolean} true when NgTableParams#filter has at least one significant field value
         */
        this.hasFilter = function(){
            var currentFilter = this.filter();
            var keys = Object.keys(currentFilter);
            var result = false;
            for (var i=0; i < keys.length; i++){
                var filterValue = currentFilter[keys[i]];
                if (filterValue != null && filterValue !== '') {
                    result = true;
                    break;
                }
            }
            return result;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#hasFilterChanges
         * @description Return true when a change to `NgTableParams.filters`require the reload method
         * to be run so as to ensure the data presented to the user reflects these filters
         */
        this.hasFilterChanges = function(){
            return !angular.equals((params && params.filter), (committedParams && committedParams.filter));
        };

        /**
         * @ngdoc method
         * @name NgTableParams#url
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function(asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + item[subkey]);
                                } else {
                                    pairs[pname] = item[subkey];
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                        if (asString) {
                            pairs.push(name + "=" + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        /**
         * @ngdoc method
         * @name NgTableParams#reload
         * @description Reload table data
         */
        this.reload = function() {
            var self = this,
                pData = null;

            settings.$loading = true;

            committedParams = angular.copy(params);
            isCommittedDataset = true;

            if (settings.groupBy) {
                pData = runGetGroups();
            } else {
                pData = runGetData();
            }
            pData = runInterceptorPipeline(pData);

            log('ngTable: reload data');

            var oldData = self.data;
            return pData.then(function(data) {
                settings.$loading = false;
                self.data = data;
                // note: I think it makes sense to publish this event even when data === oldData
                // subscribers can always set a filter to only receive the event when data !== oldData
                ngTableEventsChannel.publishAfterReloadData(self, data, oldData);
                self.reloadPages();

                // todo: remove after acceptable depreciation period
                if (settings.$scope) {
                    settings.$scope.$emit('ngTableAfterReloadData');
                }

                return data;
            }).catch(function(reason){
                committedParams = null;
                isCommittedDataset = false;
                // "rethrow"
                return $q.reject(reason);
            });
        };

        this.reloadPages = (function() {
            var currentPages;
            return function(){
                var oldPages = currentPages;
                var newPages = self.generatePagesArray(self.page(), self.total(), self.count());
                if (!angular.equals(oldPages, newPages)){
                    currentPages = newPages;
                    ngTableEventsChannel.publishPagesChanged(this, newPages, oldPages);
                }
            }
        })();

        function runGetData(){
            var getDataFn = settings.getDataFnAdaptor(settings.getData);
            return $q.when(getDataFn.call(settings, self));
        }

        function runGetGroups(){
            var getGroupsFn = settings.getGroupsFnAdaptor(settings.getGroups);
            return $q.when(getGroupsFn.call(settings, settings.groupBy, self));
        }

        function runInterceptorPipeline(dataFetched){
            var interceptors = settings.interceptors || [];
            return interceptors.reduce(function(result, interceptor){
                return result.then(function(data){
                    return $q.when(interceptor.response(data, self));
                });
            }, dataFetched);
        }

        var params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null
        };
        angular.extend(params, ngTableDefaults.params);

        var settings = {
            // todo: remove $scope after acceptable depreciation period as no longer required
            $scope: null, // set by ngTable controller
            $loading: false,
            data: null, //allows data to be set when table is initialized
            total: 0,
            defaultSort: 'desc',
            filterDelay: 750,
            counts: [10, 25, 50, 100],
            interceptors: [],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator: 'span',
            getDataFnAdaptor: angular.identity,
            getGroupsFnAdaptor: angular.identity,
            getGroups: this.getGroups,
            getData: this.getData
        };

        this.settings(ngTableDefaults.settings);
        this.settings(baseSettings);
        this.parameters(baseParameters, true);

        ngTableEventsChannel.publishAfterCreated(this);

        return this;
    };
    return NgTableParams;
}]);

/**
 * @ngdoc service
 * @name ngTableParams
 * @description Backwards compatible shim for lowercase 'n' in NgTableParams
 */
app.factory('ngTableParams', ['NgTableParams', function(NgTableParams) {
    return NgTableParams;
}]);
