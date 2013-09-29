(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ngTable', ['jquery', 'angular'], function($, angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc module
 * @name ngTable
 * @description ngTable: Table + Angular JS
 * @example
   <doc:example>
     <doc:source>
        <script>
        var app = angular.module('myApp', ['ngTable']);
        app.controller('MyCtrl', function($scope) {
            $scope.users = [
                {name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}
            ];
        });
        </script>
        <table ng-table class="table">
        <tr ng-repeat="user in users">
            <td data-title="'Name'">{{user.name}}</td>
            <td data-title="'Age'">{{user.age}}</td>
        </tr>
        </table>
     </doc:source>
   </doc:example>
 */
var app = angular.module('ngTable', []);
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc service
 * @name ngTable.factory:ngTableParams
 * @description Parameters manager for ngTable
 */
app.factory('ngTableParams', function () {
    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var ngTableParams = function (baseParameters, baseSettings) {
    
        var params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null
        };
        var settings = {
            liveFiltering: false,
            total: 0,
            counts: [10, 25, 50, 100]
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#parameters
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function (newParameters, parseParamsFromUrl) {
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
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#settings
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new settings for table
         *
         * @param {string} New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function (newSettings) {
            if (angular.isDefined(newSettings)) {
                settings = angular.extend(settings, newSettings);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#page
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function (page) {
            return page ? this.parameters({'page': page}) : params.page;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#filter
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function (filter) {
            return filter ? this.parameters({'filter': filter}) : params.filter;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#sorting
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current sorting else set current sorting
         *
         * @param {string} New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function (sorting) {
            return sorting ? this.parameters({'sorting': sorting}) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#orderBy
         * @methodOf ngTable.factory:ngTableParams
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function () {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getData
         * @methodOf ngTable.factory:ngTableParams
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} params New parameters
         * @returns {Array} Array of data
         */
        this.getData = function (params) {
            return [];
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getGroups
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         *
         * @returns {Array} Array of unique groups
         */
        this.getGroups = function (column) {
            data = this.getData(params);
            
            var groups = {};
            for (var k in data) {
                var item = data[k];

                groups[item[column]] = groups[item[column]] || {
                    data: []
                };
                groups[item[column]]['value'] = item[column];
                groups[item[column]].data.push(item);
            }
            var result = [];
            for (var i in groups) {
                result.push(groups[i]);
            }
            return result;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#generatePagesArray
         * @methodOf ngTable.factory:ngTableParams
         * @description Generate array of pages
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function (currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = 11;
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
                    active: currentPage > 1
                });
                maxPivotPages = Math.round((maxBlocks - 5) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                i = minPage;
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
                            active: currentPage !== i
                        });
                    }
                    i++;
                }
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages
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
         * @name ngTable.factory:ngTableParams#url
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function (asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + encodeURIComponent(item[subkey]));
                                } else {
                                    pairs[pname] = encodeURIComponent(item[subkey]);
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

        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        return this;
    };
    return ngTableParams;
});
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name ngTable.directive:ngTable.ngTableController
 *
 * @description
 * Each {@link ngTable.directive:ngTable ngTable} directive creates an instance of `ngTableController`
 */
var ngTableController = ['$scope', 'ngTableParams', function($scope, ngTableParams) {

    var updateParams = function (newParams) {
        newParams = angular.extend($scope.params, newParams);
        $scope.$groups = $scope.params.getGroups($scope.params.settings().groupBy);
        if ($scope.paramsModel) {
            $scope.paramsModel.assign($scope.$parent, new ngTableParams(newParams));
        }
        $scope.params = angular.copy(newParams);
    };

    $scope.params = $scope.params || {
        page: 1,
        count: 10
    };
    // update result every time filter changes
    $scope.$watch('params.filter', function (value) {
        if ($scope.params.$liveFiltering) {
            updateParams({
                filter: value
            });
            $scope.goToPage(1);
        }
    }, true);
    $scope.$watch('params.sorting', (function (value) {
        updateParams({
            sorting: value
        });
    }), true);

    // goto page
    $scope.goToPage = function (page) {
        if (page > 0 && $scope.params.page !== page && $scope.params.count * (page - 1) <= $scope.params.total) {
            updateParams({
                page: page
            });
        }
    };
    // change items per page
    $scope.changeCount = function (count) {
        updateParams({
            page: 1,
            count: count
        });
    };
    $scope.doFilter = function () {
        updateParams({
            page: 1
        });
    };
    $scope.sortBy = function (column) {
        var sorting, sortingParams;
        if (!column.sortable) {
            return;
        }
        sorting = $scope.params.sorting && $scope.params.sorting[column.sortable] && ($scope.params.sorting[column.sortable] === "desc");
        sortingParams = {};
        sortingParams[column.sortable] = (sorting ? 'asc' : 'desc');
        updateParams({
            sorting: sortingParams
        });
    };
}];
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTable.directive:ngTable.ngTableController ngTableController}.
 */
app.directive('ngTable', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        var ngTable = {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: ngTableController,
            compile: function (element) {
            
                var tableElement = element.clone();
                
                var columns, i;
                i = 0;
                columns = [];
                angular.forEach(element.find('tr:not(.ng-table-group)').eq(0).find('td'), function (item) {
                    var el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }
                    var parsedTitle = function (scope) {
                        return $parse(el.attr('x-data-title') || el.attr('data-title') || el.attr('title'))(scope, {
                            $columns: columns
                        }) || ' ';
                    };
                    el.attr('data-title-text', parsedTitle());
                    var headerTemplateURL = function (scope) {
                        return $parse(el.attr("x-data-header") || el.attr("data-header") || el.attr("header"))(scope, {
                            $columns: columns
                        }) || false;
                    };
                    var filter = el.attr("filter") ? $parse(el.attr("filter"))() : false;
                    var filterTemplateURL = false;
                    if (filter && filter.templateURL) {
                        filterTemplateURL = filter.templateURL;
                        delete filter.templateURL;
                    }
                    columns.push({
                        id: i++,
                        title: parsedTitle,
                        sortable: (el.attr("sortable") ? el.attr("sortable") : false),
                        filter: filter,
                        filterTemplateURL: filterTemplateURL,
                        headerTemplateURL: headerTemplateURL,
                        filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
                        show: (el.attr("ng-show") ? function (scope) {
                            return $parse(el.attr("ng-show"))(scope);
                        } : function () {
                            return true;
                        })
                    });
                });
                return function (scope, element, attrs) {
                    scope.columns = columns;

                    scope.$parent.$watch(attrs.ngTable, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.ngTable);
                        scope.pages = params.generatePagesArray(params.page(), params.settings().total, params.parameters().count);
                        scope.params = angular.copy(params);
                    }), true);
                    scope.parse = function (text) {
                        return text(scope);
                    };
                    if (attrs.showFilter) {
                        scope.$parent.$watch(attrs.showFilter, function (value) {
                            scope.show_filter = value;
                        });
                    }
                    angular.forEach(columns, function (column) {
                        var def;
                        if (!column.filterData) {
                            return;
                        }
                        def = $parse(column.filterData)(scope, {
                            $column: column
                        });
                        if (!(angular.isObject(def) && angular.isObject(def.promise))) {
                            throw new Error('Function ' + column.filterData + ' must be instance of $q.defer()');
                        }
                        delete column['filterData'];
                        return def.promise.then(function (data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({
                                title: '-',
                                id: ''
                            });
                            column.data = data;
                        });
                    });
                    if (!element.hasClass('ng-table')) {
                        scope.templates = {
                            header: (attrs.templateHeader ? attrs.templateHeader : 'ng-table/header.html'),
                            pagination: (attrs.templatePagination ? attrs.templatePagination : 'ng-table/pager.html')
                        };
                        var headerTemplate = $compile('<thead ng-include="templates.header"></thead>')(scope);
                        var paginationTemplate = $compile('<div ng-include="templates.pagination"></div>')(scope);
                        element.find('thead').remove();
                        var tbody = element.find('tbody');
                        if (tbody[0]) {
                            angular.element(tbody[0]).before(headerTemplate);
                        } else {
                            element.prepend(headerTemplate);
                        }
                        element.addClass('ng-table');
                        return element.after(paginationTemplate);
                    }
                };
            },
            link: function() {
                console.info(tableElement);
            }
        };
        return ngTable;
    }
]);
    return app;
}));