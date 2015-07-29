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

(function(){
    'use strict';

    angular.module('ngTable')
        .provider('ngTableFilterConfig', ngTableFilterConfigProvider);

    ngTableFilterConfigProvider.$inject = [];

    function ngTableFilterConfigProvider(){
        var config;
        var defaultConfig = {
            defaultBaseUrl: 'ng-table/filters/',
            defaultExt: '.html',
            aliasUrls: {}
        };

        this.$get = ngTableFilterConfig;
        this.resetConfigs = resetConfigs;
        this.setConfig = setConfig;

        init();

        /////////

        function init(){
            resetConfigs();
        }

        function resetConfigs(){
            config = defaultConfig;
        }

        function setConfig(customConfig){
            var mergeConfig = angular.extend({}, config, customConfig);
            mergeConfig.aliasUrls = angular.extend({}, config.aliasUrls, customConfig.aliasUrls);
            config = mergeConfig;
        }

        /////////

        ngTableFilterConfig.$inject = [];

        function ngTableFilterConfig(){

            var publicConfig;

            var service = {
                config: publicConfig,
                getTemplateUrl: getTemplateUrl,
                getUrlForAlias: getUrlForAlias
            };
            Object.defineProperty(service, "config", {
                get: function(){
                    return publicConfig = publicConfig || angular.copy(config);
                },
                enumerable: true
            });

            return service;

            /////////

            function getTemplateUrl(filterValue, filterKey){
                if (filterValue.indexOf('/') !== -1){
                    return filterValue;
                }

                return service.getUrlForAlias(filterValue, filterKey);
            }

            function getUrlForAlias(aliasName/*, filterKey*/){
                return config.aliasUrls[aliasName] || config.defaultBaseUrl + aliasName + config.defaultExt;
            }
        }
    }
})();


/**
 * @ngdoc service
 * @name NgTableParams
 * @module ngTable
 * @description Parameters manager for ngTable
 */

app.factory('NgTableParams', ['$q', '$log', 'ngTableDefaults', 'ngTableGetDataBcShim', 'ngTableDefaultGetData', function($q, $log, ngTableDefaults, ngTableGetDataBcShim, ngTableDefaultGetData) {
    var isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var NgTableParams = function(baseParameters, baseSettings) {
        var self = this,
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

                settings = angular.extend(settings, newSettings);
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
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @param {number} maxBlocks    Quantity of blocks for pagination
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function(currentPage, totalItems, pageSize, maxBlocks) {
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

            if (!settings.$scope) {
                return;
            }

            settings.$loading = true;
            if (settings.groupBy) {
                pData = runGetGroups();
            } else {
                pData = runGetData();
            }
            pData = runInterceptorPipeline(pData);

            log('ngTable: reload data');

            return pData.then(function(data) {
                settings.$loading = false;
                log('ngTable: current scope', settings.$scope);
                if (settings.groupBy) {
                    self.data = data;
                    if (settings.$scope) settings.$scope.$groups = data;
                } else {
                    self.data = data;
                    if (settings.$scope) settings.$scope.$data = data;
                }
                if (settings.$scope) {
                    settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
                    settings.$scope.$emit('ngTableAfterReloadData');
                }
                return data;
            });
        };

        this.reloadPages = function() {
            var self = this;
            settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
        };

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

        var params = this.$params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null
        };
        angular.extend(params, ngTableDefaults.params);

        var settings = {
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

(function(){
    'use strict';

    // todo: remove shim after an acceptable depreciation period

    angular.module('ngTable')
        .factory('ngTableGetDataBcShim', ngTableGetDataBcShim);

    ngTableGetDataBcShim.$inject = ['$q'];

    function ngTableGetDataBcShim($q){

        return createWrapper;

        function createWrapper(getDataFn){
            return function getDataShim(/*args*/){
                var $defer = $q.defer();
                var pData = getDataFn.apply(this, [$defer].concat(Array.prototype.slice.call(arguments)));
                if (!pData) {
                    // If getData resolved the $defer, and didn't promise us data,
                    //   create a promise from the $defer. We need to return a promise.
                    pData = $defer.promise;
                }
                return pData;
            }
        }
    }
})();


(function(){
    'use strict';


    angular.module('ngTable')
        .provider('ngTableDefaultGetData', ngTableDefaultGetDataProvider);

    ngTableDefaultGetDataProvider.$inject = [];

    /**
     * @ngdoc provider
     * @name ngTableDefaultGetDataProvider
     * @description Allows for the configuration of the {@link ngTable.ngTableDefaultGetData ngTableDefaultGetData}
     * service.
     *
     * Set filterFilterName to the name of a angular filter that knows how to take `NgTableParams.filter()`
     * to restrict an array of data.
     *
     * Set sortingFilterName to the name of a angular filter that knows how to take `NgTableParams.orderBy()`
     * to sort an array of data.
     *
     * Out of the box the `ngTableDefaultGetData` service will be configured to use the angular `filter` and `orderBy`
     * filters respectively
     */
    function ngTableDefaultGetDataProvider(){
        var provider = this;
        provider.$get = ngTableDefaultGetData;
        provider.filterFilterName = 'filter';
        provider.sortingFilterName = 'orderBy';

        ///////////

        ngTableDefaultGetData.$inject = ['$filter'];

        /**
         * @ngdoc service
         * @name ngTableDefaultGetData
         * @description A default implementation of the getData function that will apply the `filter`, `orderBy` and
         * paging values from the `NgTableParams` instance supplied to the data array supplied.
         *
         * The outcome will be to return the resulting array and to assign the total item count after filtering
         * to the `total` of the `NgTableParams` instance supplied
         */
        function ngTableDefaultGetData($filter) {

            return getData;

            function getData(data, params) {
                if (data == null){
                    return [];
                }

                var fData = params.hasFilter() ? $filter(provider.filterFilterName)(data, params.filter()) : data;
                var orderBy = params.orderBy();
                var orderedData = orderBy.length ? $filter(provider.sortingFilterName)(fData, orderBy) : fData;
                var pagedData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(orderedData.length); // set total for recalc pagination
                return pagedData;
            }
        }
    }
})();
