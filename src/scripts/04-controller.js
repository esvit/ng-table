/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name ngTableController
 *
 * @description
 * Each {@link ngTable ngTable} directive creates an instance of `ngTableController`
 */
app.controller('ngTableController', ['$scope', 'NgTableParams', '$timeout', '$parse', '$compile', '$attrs', '$element',
    'ngTableColumn',
function($scope, NgTableParams, $timeout, $parse, $compile, $attrs, $element, ngTableColumn) {
    var isFirstTimeLoad = true;
    $scope.$filterRow = {};
    $scope.$loading = false;

    // until such times as the directive uses an isolated scope, we need to ensure that the check for
    // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
    // field on a $scope higher up in the prototype chain
    if (!$scope.hasOwnProperty("params")) {
        $scope.params = new NgTableParams();
        $scope.params.isNullInstance = true;
    }
    $scope.params.settings().$scope = $scope;

    var delayFilter = (function() {
        var timer = 0;
        return function(callback, ms) {
            $timeout.cancel(timer);
            timer = $timeout(callback, ms);
        };
    })();

    function resetPage() {
        $scope.params.$params.page = 1;
    }

    $scope.$watch('params.$params', function(newParams, oldParams) {

        // We don't want to watch for changes to $params whilst the NgTableParams.reload function is executing
        // (ie $loading === true).
        // This is important for cases where you have a want to *chain* a subsequent call to reload.
        // Take the following code example:
        //
        // tableParams.reload().then(function(){
        //   if (!tableParams.total() && _.size(tableParams.filter()) > 0) {
        //     tableParams.filter({});
        //     return tableParams.reload();
        //   }
        // });
        //
        // In the code above, you're checking whether to remove the table filter. When removing the filter
        // you want the second reload to execute in the *same promise chain* initiated by the first call
        // to reload; you do NOT want the second reload to trigger sometime later because of a $watch
        // seeing the change to the filter.
        if (newParams === oldParams || $scope.params.settings().$loading) {
            return;
        }

        $scope.params.settings().$scope = $scope;

        if (!angular.equals(newParams.filter, oldParams.filter)) {
            var maybeResetPage = isFirstTimeLoad ? angular.noop : resetPage;
            delayFilter(function() {
                maybeResetPage();
                $scope.params.reload();
            }, $scope.params.settings().filterDelay);
        } else {
            $scope.params.reload();
        }

        if (!$scope.params.isNullInstance) {
            isFirstTimeLoad = false;
        }

    }, true);

    this.compileDirectiveTemplates = function () {
        if (!$element.hasClass('ng-table')) {
            $scope.templates = {
                header: ($attrs.templateHeader ? $attrs.templateHeader : 'ng-table/header.html'),
                pagination: ($attrs.templatePagination ? $attrs.templatePagination : 'ng-table/pager.html')
            };
            $element.addClass('ng-table');
            var headerTemplate = null;

            // $element.find('> thead').length === 0 doesn't work on jqlite
            var theadFound = false;
            angular.forEach($element.children, function(e) {
                if (e.tagName === 'THEAD') {
                    theadFound = true;
                }
            });
            if (!theadFound) {
                headerTemplate = angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                $element.prepend(headerTemplate);
            }
            var paginationTemplate = angular.element(document.createElement('div')).attr({
                'ng-table-pagination': 'params',
                'template-url': 'templates.pagination'
            });
            $element.after(paginationTemplate);
            if (headerTemplate) {
                $compile(headerTemplate)($scope);
            }
            $compile(paginationTemplate)($scope);
        }
    };

    this.loadFilterData = function ($columns) {
        angular.forEach($columns, function ($column) {
            var def;
            def = $column.filterData($scope, {
                $column: $column
            });
            if (!def) {
                delete $column.filterData;
                return;
            }

            // if we're working with a deferred object, let's wait for the promise
            if ((angular.isObject(def) && angular.isObject(def.promise))) {
                delete $column.filterData;
                return def.promise.then(function(data) {
                    // our deferred can eventually return arrays, functions and objects
                    if (!angular.isArray(data) && !angular.isFunction(data) && !angular.isObject(data)) {
                        // if none of the above was found - we just want an empty array
                        data = [];
                    } else if (angular.isArray(data)) {
                        data.unshift({
                            title: '-',
                            id: ''
                        });
                    }
                    $column.data = data;
                });
            }
            // otherwise, we just return what the user gave us. It could be a function, array, object, whatever
            else {
                return $column.data = def;
            }
        });
    };

    this.buildColumns = function (columns) {
        return columns.map(function(col){
            return ngTableColumn.buildColumn(col, $scope)
        })
    };

    this.parseNgTableDynamicExpr = function (attr) {
        if (!attr || attr.indexOf(" with ") > -1) {
            var parts = attr.split(/\s+with\s+/);
            return {
                tableParams: parts[0],
                columns: parts[1]
            };
        } else {
            throw new Error('Parse error (expected example: ng-table-dynamic=\'tableParams with cols\')');
        }
    };

    this.setupBindingsToInternalScope = function(tableParamsExpr){

        // note: this we're setting up watches to simulate angular's isolated scope bindings

        // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
        // $watch for value equivalence. This is because ngTableParams references the current page of data as
        // a field and it's important not to watch this
        var tableParamsGetter = $parse(tableParamsExpr);
        $scope.$watch(tableParamsGetter, (function (params) {
            if (angular.isUndefined(params)) {
                return;
            }
            $scope.paramsModel = tableParamsGetter;
            $scope.params = params;
        }), false);

        if ($attrs.showFilter) {
            $scope.$parent.$watch($attrs.showFilter, function(value) {
                $scope.show_filter = value;
            });
        }
        if ($attrs.disableFilter) {
            $scope.$parent.$watch($attrs.disableFilter, function(value) {
                $scope.$filterRow.disabled = value;
            });
        }
    };
}]);


/**
 * @ngdoc service
 * @name ngTableColumn
 * @module ngTable
 * @description
 * Service to construct a $column definition used by {@link ngTable ngTable} directive
 */
app.factory('ngTableColumn', [function () {

    var defaults = {
        'class': function(){ return ''; },
        filter: function(){ return false; },
        filterData: angular.noop,
        headerTemplateURL: function(){ return false; },
        headerTitle: function(){ return ''; },
        sortable: function(){ return false; },
        show: function(){ return true; },
        title: function(){ return ''; },
        titleAlt: function(){ return ''; }
    };

    /**
     * @ngdoc method
     * @name ngTableColumn#buildColumn
     * @description Creates a $column for use within a header template
     *
     * @param {Object} column an existing $column or simple column data object
     * @param {Scope} defaultScope the $scope to supply to the $column getter methods when not supplied by caller
     * @returns {Object} a $column object
     */
    function buildColumn(column, defaultScope){
        // note: we're not modifying the original column object. This helps to avoid unintended side affects
        var extendedCol = Object.create(column);
        for (var prop in defaults) {
            if (extendedCol[prop] === undefined) {
                extendedCol[prop] = defaults[prop];
            }
            if(!angular.isFunction(extendedCol[prop])){
                // wrap raw field values with "getter" functions
                // - this is to ensure consistency with how ngTable.compile builds columns
                // - note that the original column object is being "proxied"; this is important
                //   as it ensure that any changes to the original object will be returned by the "getter"
                (function(prop1){
                    extendedCol[prop1] = function(){
                        return column[prop1];
                    };
                })(prop);
            }
            (function(prop1){
                // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
                var getterFn = extendedCol[prop1];
                extendedCol[prop1] = function(){
                    if (arguments.length === 0){
                        return getterFn.call(column, defaultScope);
                    } else {
                        return getterFn.apply(column, arguments);
                    }
                };
            })(prop);
        }
        return extendedCol;
    }

    return {
        buildColumn: buildColumn
    };
}]);

(function(){
    'use strict';

    angular.module('ngTable')
        .controller('ngTableSorterRowController', ngTableSorterRowController);

    ngTableSorterRowController.$inject = ['$scope'];

    function ngTableSorterRowController($scope){

        $scope.sortBy = sortBy;

        ///////////

        function sortBy($column, event) {
            var parsedSortable = $column.sortable && $column.sortable();
            if (!parsedSortable) {
                return;
            }
            var defaultSort = $scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            $scope.params.parameters({
                sorting: sortingParams
            });
        }
    }
})();

(function(){
    'use strict';

    angular.module('ngTable')
        .controller('ngTableFilterRowController', ngTableFilterRowController);

    ngTableFilterRowController.$inject = ['$scope', 'ngTableFilterConfig'];

    function ngTableFilterRowController($scope, ngTableFilterConfig){

        $scope.config = ngTableFilterConfig;
    }
})();
