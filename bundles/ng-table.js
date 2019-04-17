(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else if(typeof exports === 'object')
		exports["ng-table"] = factory(require("angular"));
	else
		root["ng-table"] = factory(root["angular"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ },
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!******************************!*\
  !*** ./src/browser/index.ts ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var angular = __webpack_require__(/*! angular */ 0);
var ngTable_directive_1 = __webpack_require__(/*! ./ngTable.directive */ 4);
var ngTableColumn_1 = __webpack_require__(/*! ./ngTableColumn */ 5);
var ngTableColumnsBinding_directive_1 = __webpack_require__(/*! ./ngTableColumnsBinding.directive */ 6);
var ngTableController_1 = __webpack_require__(/*! ./ngTableController */ 7);
var ngTableDynamic_directive_1 = __webpack_require__(/*! ./ngTableDynamic.directive */ 8);
var ngTableFilterConfig_1 = __webpack_require__(/*! ./ngTableFilterConfig */ 9);
var ngTableFilterRow_directive_1 = __webpack_require__(/*! ./ngTableFilterRow.directive */ 10);
var ngTableFilterRowController_1 = __webpack_require__(/*! ./ngTableFilterRowController */ 11);
var ngTableGroupRow_directive_1 = __webpack_require__(/*! ./ngTableGroupRow.directive */ 12);
var ngTableGroupRowController_1 = __webpack_require__(/*! ./ngTableGroupRowController */ 13);
var ngTablePagination_directive_1 = __webpack_require__(/*! ./ngTablePagination.directive */ 14);
var ngTableSelectFilterDs_directive_1 = __webpack_require__(/*! ./ngTableSelectFilterDs.directive */ 15);
var ngTableSorterRow_directive_1 = __webpack_require__(/*! ./ngTableSorterRow.directive */ 16);
var ngTableSorterRowController_1 = __webpack_require__(/*! ./ngTableSorterRowController */ 17);
__webpack_require__(/*! ./filters/number.html */ 25);
__webpack_require__(/*! ./filters/select.html */ 27);
__webpack_require__(/*! ./filters/select-multiple.html */ 26);
__webpack_require__(/*! ./filters/text.html */ 28);
__webpack_require__(/*! ./pager.html */ 31);
__webpack_require__(/*! ./header.html */ 30);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('ngTable-browser', [])
    .directive('ngTable', ngTable_directive_1.ngTable)
    .factory('ngTableColumn', ngTableColumn_1.ngTableColumn)
    .directive('ngTableColumnsBinding', ngTableColumnsBinding_directive_1.ngTableColumnsBinding)
    .controller('ngTableController', ngTableController_1.ngTableController)
    .directive('ngTableDynamic', ngTableDynamic_directive_1.ngTableDynamic)
    .provider('ngTableFilterConfig', ngTableFilterConfig_1.ngTableFilterConfigProvider)
    .directive('ngTableFilterRow', ngTableFilterRow_directive_1.ngTableFilterRow)
    .controller('ngTableFilterRowController', ngTableFilterRowController_1.ngTableFilterRowController)
    .directive('ngTableGroupRow', ngTableGroupRow_directive_1.ngTableGroupRow)
    .controller('ngTableGroupRowController', ngTableGroupRowController_1.ngTableGroupRowController)
    .directive('ngTablePagination', ngTablePagination_directive_1.ngTablePagination)
    .directive('ngTableSelectFilterDs', ngTableSelectFilterDs_directive_1.ngTableSelectFilterDs)
    .directive('ngTableSorterRow', ngTableSorterRow_directive_1.ngTableSorterRow)
    .controller('ngTableSorterRowController', ngTableSorterRowController_1.ngTableSorterRowController);
__export(__webpack_require__(/*! ./public-interfaces */ 18));


/***/ },
/* 2 */
/* unknown exports provided */
/* all exports used */
/*!***************************!*\
  !*** ./src/core/index.ts ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var angular = __webpack_require__(/*! angular */ 0);
var ngTableDefaultGetData_1 = __webpack_require__(/*! ./ngTableDefaultGetData */ 19);
var ngTableDefaults_1 = __webpack_require__(/*! ./ngTableDefaults */ 20);
var ngTableParams_1 = __webpack_require__(/*! ./ngTableParams */ 22);
var ngTableEventsChannel_1 = __webpack_require__(/*! ./ngTableEventsChannel */ 21);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('ngTable-core', [])
    .provider('ngTableDefaultGetData', ngTableDefaultGetData_1.ngTableDefaultGetDataProvider)
    .value('ngTableDefaults', ngTableDefaults_1.ngTableDefaults)
    .factory('NgTableParams', ngTableParams_1.ngTableParamsFactory)
    .factory('ngTableEventsChannel', ngTableEventsChannel_1.ngTableEventsChannel);
__export(__webpack_require__(/*! ./public-interfaces */ 23));


/***/ },
/* 3 */,
/* 4 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ./src/browser/ngTable.directive.ts ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTable.$inject = ['$q', '$parse'];
/**
 * Directive that instantiates {@link ngTableController ngTableController}.
 * @ngdoc directive
 * @name ngTable
 * @example
 *
 * ```html
 * <table ng-table="$ctrl.tableParams" show-filter="true" class="table table-bordered">
 *  <tr ng-repeat="user in $data">
 *      <td data-title="'Name'" sortable="'name'" filter="{ 'name': 'text' }">
 *          {{user.name}}
 *      </td>
 *      <td data-title="'Age'" sortable="'age'" filter="{ 'age': 'text' }">
 *          {{user.age}}
 *      </td>
 *  </tr>
 * </table>
 * ```
 */
function ngTable($q, $parse) {
    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function (element) {
            var columns = [], i = 0, dataRow, groupRow, rows = [];
            ng1.forEach(element.find('tr'), function (tr) {
                rows.push(ng1.element(tr));
            });
            dataRow = rows.filter(function (tr) {
                return !tr.hasClass('ng-table-group');
            })[0];
            groupRow = rows.filter(function (tr) {
                return tr.hasClass('ng-table-group');
            })[0];
            if (!dataRow) {
                return undefined;
            }
            ng1.forEach(dataRow.find('td'), function (item) {
                var el = ng1.element(item);
                if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                    return;
                }
                var getAttrValue = function (attr) {
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };
                var setAttrValue = function (attr, value) {
                    if (el.attr('x-data-' + attr)) {
                        el.attr('x-data-' + attr, value);
                    }
                    else if (el.attr('data' + attr)) {
                        el.attr('data' + attr, value);
                    }
                    else {
                        el.attr(attr, value);
                    }
                };
                var parsedAttribute = function (attr) {
                    var expr = getAttrValue(attr);
                    if (!expr) {
                        return undefined;
                    }
                    var localValue;
                    var getter = function (context) {
                        if (localValue !== undefined) {
                            return localValue;
                        }
                        return $parse(expr)(context);
                    };
                    getter.assign = function ($scope, value) {
                        var parsedExpr = $parse(expr);
                        if (parsedExpr.assign) {
                            // we should be writing back to the parent scope as this is where the expression
                            // came from
                            parsedExpr.assign($scope.$parent, value);
                        }
                        else {
                            localValue = value;
                        }
                    };
                    return getter;
                };
                var titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                if (titleExpr) {
                    el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                }
                // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend ngTableColumn with
                // a corresponding "safe" default
                columns.push({
                    id: i++,
                    title: parsedAttribute('title'),
                    titleAlt: parsedAttribute('title-alt'),
                    headerTitle: parsedAttribute('header-title'),
                    sortable: parsedAttribute('sortable'),
                    'class': parsedAttribute('header-class'),
                    filter: parsedAttribute('filter'),
                    groupable: parsedAttribute('groupable'),
                    headerTemplateURL: parsedAttribute('header'),
                    filterData: parsedAttribute('filter-data'),
                    show: el.attr("ng-if") ? parsedAttribute('ng-if') : undefined
                });
                if (groupRow || el.attr("ng-if")) {
                    // change ng-if to bind to our column definition which we know will be writable
                    // because this will potentially increase the $watch count, only do so if we already have an
                    // ng-if or when we definitely need to change visibility of the columns.
                    // currently only ngTableGroupRow directive needs to change visibility
                    setAttrValue('ng-if', '$columns[' + (columns.length - 1) + '].show(this)');
                }
            });
            return function (scope, element, attrs, controller) {
                scope.$columns = columns = controller.buildColumns(columns);
                controller.setupBindingsToInternalScope(attrs.ngTable);
                controller.loadFilterData(columns);
                controller.compileDirectiveTemplates();
            };
        }
    };
}
exports.ngTable = ngTable;


/***/ },
/* 5 */
/* unknown exports provided */
/* all exports used */
/*!**************************************!*\
  !*** ./src/browser/ngTableColumn.ts ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTableColumn.$inject = [];
/**
 * @private
 * Service to construct a $column definition used by {@link ngTable ngTable} directive
 */
function ngTableColumn() {
    return {
        buildColumn: buildColumn
    };
    //////////////
    function buildColumn(column, defaultScope, columns) {
        // note: we're not modifying the original column object. This helps to avoid unintended side affects
        var extendedCol = Object.create(column);
        var defaults = createDefaults();
        for (var prop in defaults) {
            if (extendedCol[prop] === undefined) {
                extendedCol[prop] = defaults[prop];
            }
            if (!ng1.isFunction(extendedCol[prop])) {
                // wrap raw field values with "getter" functions
                // - this is to ensure consistency with how ngTable.compile builds columns
                // - note that the original column object is being "proxied"; this is important
                //   as it ensure that any changes to the original object will be returned by the "getter"
                (function (prop1) {
                    var getterSetter = function getterSetter() {
                        if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                            getterSetter.assign(null, arguments[0]);
                        }
                        else {
                            return column[prop1];
                        }
                    };
                    getterSetter.assign = function ($scope, value) {
                        column[prop1] = value;
                    };
                    extendedCol[prop1] = getterSetter;
                })(prop);
            }
            (function (prop1) {
                // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
                var getterFn = extendedCol[prop1];
                extendedCol[prop1] = function () {
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        getterFn.assign(null, arguments[0]);
                    }
                    else {
                        var scope = arguments[0] || defaultScope;
                        var context = Object.create(scope);
                        ng1.extend(context, {
                            $column: extendedCol,
                            $columns: columns
                        });
                        return getterFn.call(column, context);
                    }
                };
                if (getterFn.assign) {
                    extendedCol[prop1].assign = getterFn.assign;
                }
            })(prop);
        }
        return extendedCol;
    }
    function createDefaults() {
        return {
            'class': createGetterSetter(''),
            filter: createGetterSetter(false),
            groupable: createGetterSetter(false),
            filterData: ng1.noop,
            headerTemplateURL: createGetterSetter(false),
            headerTitle: createGetterSetter(''),
            sortable: createGetterSetter(false),
            show: createGetterSetter(true),
            title: createGetterSetter(''),
            titleAlt: createGetterSetter('')
        };
    }
    function createGetterSetter(initialValue) {
        var value = initialValue;
        var getterSetter = function getterSetter() {
            if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                getterSetter.assign(null, arguments[0]);
            }
            else {
                return value;
            }
        };
        getterSetter.assign = function ($scope, newValue) {
            value = newValue;
        };
        return getterSetter;
    }
    function isScopeLike(object) {
        return object != null && ng1.isFunction(object.$new);
    }
}
exports.ngTableColumn = ngTableColumn;


/***/ },
/* 6 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************!*\
  !*** ./src/browser/ngTableColumnsBinding.directive.ts ***!
  \********************************************************/
/***/ function(module, exports) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
ngTableColumnsBinding.$inject = ["$parse"];
/**
 * One-way data binds the $columns array generated by ngTable/ngTableDynamic to the specified
 * expression.
 * This allows the $columns array created for the table to be accessed outside of the html table
 * markup.
 *
 * @ngdoc directive
 *
 * @example
 * ```html
 * <table ng-table="$ctrl.tableParams" class="table" ng-table-columns-binding="$ctlr.tableColumns">
 * ```
 */
function ngTableColumnsBinding($parse) {
    var directive = {
        restrict: 'A',
        require: 'ngTable',
        link: linkFn
    };
    return directive;
    function linkFn($scope, $element, $attrs) {
        var setter = $parse($attrs.ngTableColumnsBinding).assign;
        if (setter) {
            $scope.$watch('$columns', function (newColumns) {
                var shallowClone = (newColumns || []).slice(0);
                setter($scope, shallowClone);
            });
        }
    }
}
exports.ngTableColumnsBinding = ngTableColumnsBinding;


/***/ },
/* 7 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ./src/browser/ngTableController.ts ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTableController.$inject = [
    '$scope', 'NgTableParams', '$timeout', '$parse', '$compile', '$attrs', '$element', '$document', 'ngTableColumn', 'ngTableEventsChannel'
];
/**
 * The controller for the {@link ngTable ngTable} and {@link ngTableDynamic ngTableDynamic} directives
 */
function ngTableController($scope, NgTableParams, $timeout, $parse, $compile, $attrs, $element, $document, ngTableColumn, ngTableEventsChannel) {
    var isFirstTimeLoad = true;
    $scope.$filterRow = { disabled: false };
    $scope.$loading = false;
    // until such times as the directive uses an isolated scope, we need to ensure that the check for
    // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
    // field on a $scope higher up in the prototype chain
    if (!$scope.hasOwnProperty("params")) {
        $scope.params = new NgTableParams(true);
    }
    var delayFilter = (function () {
        var timer;
        return function (callback, ms) {
            $timeout.cancel(timer);
            timer = $timeout(callback, ms);
        };
    })();
    function onDataReloadStatusChange(newStatus /*, oldStatus*/) {
        if (!newStatus || $scope.params.hasErrorState()) {
            return;
        }
        var currentParams = $scope.params;
        var filterOptions = currentParams.settings().filterOptions;
        if (currentParams.hasFilterChanges()) {
            var applyFilter = function () {
                currentParams.page(1);
                currentParams.reload();
            };
            if (filterOptions.filterDelay) {
                delayFilter(applyFilter, filterOptions.filterDelay);
            }
            else {
                applyFilter();
            }
        }
        else {
            currentParams.reload();
        }
    }
    // watch for when a new NgTableParams is bound to the scope
    // CRITICAL: the watch must be for reference and NOT value equality; this is because NgTableParams maintains
    // the current data page as a field. Checking this for value equality would be terrible for performance
    // and potentially cause an error if the items in that array has circular references
    $scope.$watch('params', function (newParams, oldParams) {
        if (newParams === oldParams || !newParams) {
            return;
        }
        newParams.reload();
    }, false);
    $scope.$watch('params.isDataReloadRequired()', onDataReloadStatusChange);
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
            ng1.forEach($element.children(), function (e) {
                if (e.tagName === 'THEAD') {
                    theadFound = true;
                }
            });
            if (!theadFound) {
                headerTemplate = ng1.element('<thead ng-include="templates.header"></thead>', $document);
                $element.prepend(headerTemplate);
            }
            var paginationTemplate = ng1.element('<div ng-table-pagination="params" template-url="templates.pagination"></div>', $document);
            $element.after(paginationTemplate);
            if (headerTemplate) {
                $compile(headerTemplate)($scope);
            }
            $compile(paginationTemplate)($scope);
        }
    };
    this.loadFilterData = function ($columns) {
        ng1.forEach($columns, function ($column) {
            var result = $column.filterData($scope);
            if (!result) {
                delete $column.filterData;
                return undefined;
            }
            if (isPromiseLike(result)) {
                delete $column.filterData;
                return result.then(function (data) {
                    // our deferred can eventually return arrays, functions and objects
                    if (!ng1.isArray(data) && !ng1.isFunction(data) && !ng1.isObject(data)) {
                        // if none of the above was found - we just want an empty array
                        data = [];
                    }
                    $column.data = data;
                });
            }
            else {
                return $column.data = result;
            }
        });
        function isPromiseLike(val) {
            return val && typeof val === 'object' && typeof val.then === 'function';
        }
    };
    this.buildColumns = function (columns) {
        var result = [];
        (columns || []).forEach(function (col) {
            result.push(ngTableColumn.buildColumn(col, $scope, result));
        });
        return result;
    };
    this.parseNgTableDynamicExpr = function (attr) {
        if (!attr || attr.indexOf(" with ") > -1) {
            var parts = attr.split(/\s+with\s+/);
            return {
                tableParams: parts[0],
                columns: parts[1]
            };
        }
        else {
            throw new Error('Parse error (expected example: ng-table-dynamic=\'tableParams with cols\')');
        }
    };
    this.setupBindingsToInternalScope = function (tableParamsExpr) {
        // note: this we're setting up watches to simulate angular's isolated scope bindings
        // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
        // $watch for value equivalence. This is because ngTableParams references the current page of data as
        // a field and it's important not to watch this
        $scope.$watch(tableParamsExpr, function (params) {
            if (params === undefined) {
                return;
            }
            $scope.params = params;
        }, false);
        setupFilterRowBindingsToInternalScope();
        setupGroupRowBindingsToInternalScope();
    };
    function setupFilterRowBindingsToInternalScope() {
        if ($attrs.showFilter) {
            $scope.$parent.$watch($attrs.showFilter, function (value) {
                $scope.show_filter = value;
            });
        }
        else {
            $scope.$watch(hasVisibleFilterColumn, function (value) {
                $scope.show_filter = value;
            });
        }
        if ($attrs.disableFilter) {
            $scope.$parent.$watch($attrs.disableFilter, function (value) {
                $scope.$filterRow.disabled = value;
            });
        }
    }
    function setupGroupRowBindingsToInternalScope() {
        $scope.$groupRow = { show: false };
        if ($attrs.showGroup) {
            var showGroupGetter = $parse($attrs.showGroup);
            $scope.$parent.$watch(showGroupGetter, function (value) {
                $scope.$groupRow.show = value;
            });
            if (showGroupGetter.assign) {
                // setup two-way databinding thus allowing ngTableGrowRow to assign to the showGroup expression
                $scope.$watch('$groupRow.show', function (value) {
                    showGroupGetter.assign($scope.$parent, value);
                });
            }
        }
        else {
            $scope.$watch('params.hasGroup()', function (newValue) {
                $scope.$groupRow.show = newValue;
            });
        }
    }
    function getVisibleColumns() {
        return ($scope.$columns || []).filter(function (c) {
            return c.show($scope);
        });
    }
    function hasVisibleFilterColumn() {
        if (!$scope.$columns)
            return false;
        return some($scope.$columns, function ($column) {
            return $column.show($scope) && !!$column.filter($scope);
        });
    }
    function some(array, predicate) {
        var found = false;
        for (var i = 0; i < array.length; i++) {
            var obj = array[i];
            if (predicate(obj)) {
                found = true;
                break;
            }
        }
        return found;
    }
    function commonInit() {
        ngTableEventsChannel.onAfterReloadData(function (params, newDatapage) {
            var visibleColumns = getVisibleColumns();
            if (params.hasGroup()) {
                $scope.$groups = (newDatapage || []);
                $scope.$groups.visibleColumnCount = visibleColumns.length;
            }
            else {
                $scope.$data = (newDatapage || []);
                $scope.$data.visibleColumnCount = visibleColumns.length;
            }
        }, $scope, function (publisher) { return $scope.params === publisher; });
        ngTableEventsChannel.onPagesChanged(function (params, newPages) {
            $scope.pages = newPages;
        }, $scope, function (publisher) { return $scope.params === publisher; });
    }
    commonInit();
}
exports.ngTableController = ngTableController;


/***/ },
/* 8 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ./src/browser/ngTableDynamic.directive.ts ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTableDynamic.$inject = [];
/**
 * A dynamic version of the {@link ngTable ngTable} directive that accepts a dynamic list of columns
 * definitions to render
 * @ngdoc directive
 *
 * @example
 * ```html
 * <table ng-table-dynamic="$ctrl.tableParams with $ctrl.cols" class="table">
 *  <tr ng-repeat="row in $data">
 *    <td ng-repeat="col in $columns">{{row[col.field]}}</td>
 *  </tr>
 * </table>
 * ```
 */
function ngTableDynamic() {
    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function (tElement) {
            var row;
            // IE 8 fix :not(.ng-table-group) selector
            ng1.forEach(tElement.find('tr'), function (tr) {
                tr = ng1.element(tr);
                if (!tr.hasClass('ng-table-group') && !row) {
                    row = tr;
                }
            });
            if (!row) {
                return undefined;
            }
            ng1.forEach(row.find('td'), function (item) {
                var el = ng1.element(item);
                var getAttrValue = function (attr) {
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };
                // this used in responsive table
                var titleExpr = getAttrValue('title');
                if (!titleExpr) {
                    el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                }
                var showExpr = el.attr('ng-if');
                if (!showExpr) {
                    el.attr('ng-if', '$columns[$index].show(this)');
                }
            });
            return function (scope, element, attrs, controller) {
                var expr = controller.parseNgTableDynamicExpr(attrs.ngTableDynamic);
                controller.setupBindingsToInternalScope(expr.tableParams);
                controller.compileDirectiveTemplates();
                scope.$watchCollection(expr.columns, function (newCols /*, oldCols*/) {
                    scope.$columns = controller.buildColumns(newCols);
                    controller.loadFilterData(scope.$columns);
                });
            };
        }
    };
}
exports.ngTableDynamic = ngTableDynamic;


/***/ },
/* 9 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ./src/browser/ngTableFilterConfig.ts ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTableFilterConfigProvider.$inject = [];
/**
 * The angular provider used to configure the behaviour of the `ngTableFilterConfig` service.
 *
 * Implements the {@link IFilterConfigProvider IFilterConfigProvider} interface
 */
function ngTableFilterConfigProvider() {
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
    function init() {
        resetConfigs();
    }
    function resetConfigs() {
        config = defaultConfig;
    }
    function setConfig(customConfig) {
        var mergeConfig = ng1.extend({}, config, customConfig);
        mergeConfig.aliasUrls = ng1.extend({}, config.aliasUrls, customConfig.aliasUrls);
        config = mergeConfig;
    }
    /////////
    ngTableFilterConfig.$inject = [];
    function ngTableFilterConfig() {
        var publicConfig;
        var service = {
            config: publicConfig,
            getTemplateUrl: getTemplateUrl,
            getUrlForAlias: getUrlForAlias
        };
        Object.defineProperty(service, "config", {
            get: function () {
                return publicConfig = publicConfig || ng1.copy(config);
            },
            enumerable: true
        });
        return service;
        /////////
        function getTemplateUrl(filterDef, filterKey) {
            var filterName;
            if (typeof filterDef !== 'string') {
                filterName = filterDef.id;
            }
            else {
                filterName = filterDef;
            }
            if (filterName.indexOf('/') !== -1) {
                return filterName;
            }
            return service.getUrlForAlias(filterName, filterKey);
        }
        function getUrlForAlias(aliasName, filterKey) {
            return config.aliasUrls[aliasName] || config.defaultBaseUrl + aliasName + config.defaultExt;
        }
    }
}
exports.ngTableFilterConfigProvider = ngTableFilterConfigProvider;


/***/ },
/* 10 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ./src/browser/ngTableFilterRow.directive.ts ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var templateUrl = __webpack_require__(/*! ./filterRow.html */ 24);
ngTableFilterRow.$inject = [];
/**
 * directive that renders the filter header row for a table
 * @ngdoc directive
 * @example
 * ```html
 * <ng-table-filter-row></ng-table-filter-row>
 * ```
 */
function ngTableFilterRow() {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableFilterRowController'
    };
    return directive;
}
exports.ngTableFilterRow = ngTableFilterRow;


/***/ },
/* 11 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ./src/browser/ngTableFilterRowController.ts ***!
  \***************************************************/
/***/ function(module, exports) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
ngTableFilterRowController.$inject = ['$scope', 'ngTableFilterConfig'];
/**
 * Controller for the {@link ngTableFilterRow ngTableFilterRow} directive
 */
function ngTableFilterRowController($scope, ngTableFilterConfig) {
    $scope.config = ngTableFilterConfig;
    $scope.getFilterCellCss = function (filter, layout) {
        if (layout !== 'horizontal') {
            return 's12';
        }
        var size = Object.keys(filter).length;
        var width = parseInt((12 / size).toString(), 10);
        return 's' + width;
    };
    $scope.getFilterPlaceholderValue = function (filterDef, filterKey) {
        if (typeof filterDef === 'string') {
            return '';
        }
        else {
            return filterDef.placeholder;
        }
    };
}
exports.ngTableFilterRowController = ngTableFilterRowController;


/***/ },
/* 12 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ./src/browser/ngTableGroupRow.directive.ts ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var templateUrl = __webpack_require__(/*! ./groupRow.html */ 29);
ngTableGroupRow.$inject = [];
/**
 * directive that renders the group header row for a table
 * @ngdoc directive
 * @example
 * ```html
 * <ng-table-group-row></ng-table-group-row>
 * ```
 */
function ngTableGroupRow() {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableGroupRowController',
        controllerAs: 'dctrl'
    };
    return directive;
}
exports.ngTableGroupRow = ngTableGroupRow;


/***/ },
/* 13 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ./src/browser/ngTableGroupRowController.ts ***!
  \**************************************************/
/***/ function(module, exports) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
ngTableGroupRowController.$inject = ['$scope'];
/**
 * Controller for the {@link ngTableGroupRow ngTableGroupRow} directive
 */
function ngTableGroupRowController($scope) {
    var groupFns = [];
    init();
    function init() {
        $scope.getGroupables = getGroupables;
        $scope.getGroupTitle = getGroupTitle;
        $scope.getVisibleColumns = getVisibleColumns;
        $scope.groupBy = groupBy;
        $scope.isSelectedGroup = isSelectedGroup;
        $scope.toggleDetail = toggleDetail;
        $scope.$watch('params.group()', setGroup, true);
    }
    function changeSortDirection() {
        var newDirection;
        if ($scope.params.hasGroup($scope.$selGroup, 'asc')) {
            newDirection = 'desc';
        }
        else if ($scope.params.hasGroup($scope.$selGroup, 'desc')) {
            newDirection = '';
        }
        else {
            newDirection = 'asc';
        }
        $scope.params.group($scope.$selGroup, newDirection);
    }
    function findGroupColumn(groupKey) {
        return $scope.$columns.filter(function ($column) {
            return $column.groupable($scope) === groupKey;
        })[0];
    }
    function getGroupTitle(group) {
        return isGroupingFunc(group) ? group.title : group.title($scope);
    }
    function getGroupables() {
        var groupableCols = $scope.$columns.filter(function ($column) {
            return !!$column.groupable($scope);
        });
        return groupFns.concat(groupableCols);
    }
    function getVisibleColumns() {
        return $scope.$columns.filter(function ($column) {
            return $column.show($scope);
        });
    }
    function groupBy(group) {
        if (isSelectedGroup(group)) {
            changeSortDirection();
        }
        else {
            if (isGroupingFunc(group)) {
                $scope.params.group(group);
            }
            else {
                // it's OK, we know that groupable will return a string
                // this is guaranteed by getGroupables returning only
                // columns that return (truthy) strings
                $scope.params.group(group.groupable($scope));
            }
        }
    }
    function isGroupingFunc(val) {
        return typeof val === 'function';
    }
    function isSelectedGroup(group) {
        if (isGroupingFunc(group)) {
            return group === $scope.$selGroup;
        }
        else {
            return group.groupable($scope) === $scope.$selGroup;
        }
    }
    function setGroup(grouping) {
        var existingGroupCol = findGroupColumn($scope.$selGroup);
        if (existingGroupCol && existingGroupCol.show.assign) {
            existingGroupCol.show.assign($scope, true);
        }
        if (isGroupingFunc(grouping)) {
            groupFns = [grouping];
            $scope.$selGroup = grouping;
            $scope.$selGroupTitle = grouping.title;
        }
        else {
            // note: currently only one group is implemented
            var groupKey = Object.keys(grouping || {})[0];
            var groupedColumn = findGroupColumn(groupKey);
            if (groupedColumn) {
                $scope.$selGroupTitle = groupedColumn.title($scope);
                $scope.$selGroup = groupKey;
                if (groupedColumn.show.assign) {
                    groupedColumn.show.assign($scope, false);
                }
            }
        }
    }
    function toggleDetail() {
        $scope.params.settings().groupOptions.isExpanded = !$scope.params.settings().groupOptions.isExpanded;
        return $scope.params.reload();
    }
}
exports.ngTableGroupRowController = ngTableGroupRowController;


/***/ },
/* 14 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ./src/browser/ngTablePagination.directive.ts ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTablePagination.$inject = ['$compile', '$document', 'ngTableEventsChannel', '$timeout'];
/**
 * Directive that renders the table pagination controls
 * @ngdoc directive
 */
function ngTablePagination($compile, $document, ngTableEventsChannel, $timeout) {
    return {
        restrict: 'A',
        scope: {
            'params': '=ngTablePagination',
            'templateUrl': '='
        },
        replace: false,
        link: function (scope, element /*, attrs*/) {
            ngTableEventsChannel.onAfterReloadData(function (pubParams) {
                scope.pages = pubParams.generatePagesArray();
            }, scope, function (pubParams) {
                return pubParams === scope.params;
            });
            /**
             * Directive needs to know when the pages have changed so that it can reset focus
             * on the button that initiated the page change. This was necessary for accessbility.
             */
            ngTableEventsChannel.onPagesChanged(function (pubParams) {
                if (pubParams.pageButtonToRefocus) {
                    $timeout(function () {
                        var theElement = ng1.element(document.querySelector('#' + pubParams.pageButtonToRefocus.getAttribute('id')))[0];
                        theElement.focus();
                    });
                }
            }, scope, function (pubParams) {
                return pubParams === scope.params;
            });
            scope.$watch('templateUrl', function (templateUrl) {
                if (templateUrl === undefined) {
                    return;
                }
                var template = ng1.element('<div ng-include="templateUrl"></div>', $document);
                element.append(template);
                $compile(template)(scope);
            });
        }
    };
}
exports.ngTablePagination = ngTablePagination;


/***/ },
/* 15 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************!*\
  !*** ./src/browser/ngTableSelectFilterDs.directive.ts ***!
  \********************************************************/
/***/ function(module, exports) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
ngTableSelectFilterDs.$inject = [];
/**
 * Takes the array returned by $column.filterData and makes it available as `$selectData` on the `$scope`.
 *
 * The resulting `$selectData` array will contain an extra item that is suitable to represent the user
 * "deselecting" an item from a `<select>` tag
 *
 * This directive is is focused on providing a datasource to an `ngOptions` directive
 * @ngdoc directive
 * @private
 */
function ngTableSelectFilterDs() {
    // note: not using isolated or child scope "by design"
    // this is to allow this directive to be combined with other directives that do
    var directive = {
        restrict: 'A',
        controller: ngTableSelectFilterDsController
    };
    return directive;
}
exports.ngTableSelectFilterDs = ngTableSelectFilterDs;
ngTableSelectFilterDsController.$inject = ['$scope', '$parse', '$attrs', '$q'];
function ngTableSelectFilterDsController($scope, $parse, $attrs, $q) {
    var $column;
    init();
    function init() {
        $column = $parse($attrs.ngTableSelectFilterDs)($scope);
        $scope.$watch(function () {
            return $column && $column.data;
        }, bindDataSource);
    }
    function bindDataSource() {
        getSelectListData($column).then(function (data) {
            if (data && !hasEmptyOption(data)) {
                data.unshift({ id: '', title: '' });
            }
            data = data || [];
            $scope.$selectData = data;
        });
    }
    function hasEmptyOption(data) {
        var isMatch;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item && item.id === '') {
                isMatch = true;
                break;
            }
        }
        return isMatch;
    }
    function getSelectListData($column) {
        var dataInput = $column.data;
        if (dataInput instanceof Array) {
            return $q.when(dataInput);
        }
        else {
            return $q.when(dataInput && dataInput());
        }
    }
}


/***/ },
/* 16 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ./src/browser/ngTableSorterRow.directive.ts ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var templateUrl = __webpack_require__(/*! ./sorterRow.html */ 32);
ngTableSorterRow.$inject = [];
/**
 * directive that renders the sorting header row for a table
 * @ngdoc directive
 * @example
 * ```html
 * <ng-table-sorter-row></ng-table-sorter-row>
 * ```
 */
function ngTableSorterRow() {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableSorterRowController'
    };
    return directive;
}
exports.ngTableSorterRow = ngTableSorterRow;


/***/ },
/* 17 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ./src/browser/ngTableSorterRowController.ts ***!
  \***************************************************/
/***/ function(module, exports) {

"use strict";
"use strict";
ngTableSorterRowController.$inject = ['$scope'];
/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
function ngTableSorterRowController($scope) {
    $scope.sortBy = sortBy;
    ///////////
    function sortBy($column, event) {
        var parsedSortable = $column.sortable && $column.sortable();
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        }
        else {
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
}
exports.ngTableSorterRowController = ngTableSorterRowController;


/***/ },
/* 18 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ./src/browser/public-interfaces.ts ***!
  \******************************************/
/***/ function(module, exports) {

"use strict";
"use strict";


/***/ },
/* 19 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************!*\
  !*** ./src/core/ngTableDefaultGetData.ts ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
/**
 * Allows for the configuration of the ngTableDefaultGetData service.
 *
 * Set filterFilterName to the name of a angular filter that knows how to apply the values returned by
 * `NgTableParams.filter()` to restrict an array of data.
 *
 * Set sortingFilterName to the name of a angular filter that knows how to apply the values returned by
 * `NgTableParams.orderBy()` to sort an array of data.
 *
 * Out of the box the `ngTableDefaultGetData` service will be configured to use the angular `filter` and `orderBy`
 * filters respectively
 *
 * @ngdoc provider
 */
var ngTableDefaultGetDataProvider = (function () {
    function ngTableDefaultGetDataProvider() {
        this.filterFilterName = 'filter';
        this.sortingFilterName = 'orderBy';
        var provider = this;
        this.$get = ngTableDefaultGetData;
        ngTableDefaultGetData.$inject = ['$filter'];
        /**
         * Implementation of the {@link IDefaultGetData IDefaultGetData} interface
         *
         * @ngdoc service
         */
        function ngTableDefaultGetData($filter) {
            var defaultDataOptions = { applyFilter: true, applySort: true, applyPaging: true };
            getData.applyPaging = applyPaging;
            getData.getFilterFn = getFilterFn;
            getData.getOrderByFn = getOrderByFn;
            return getData;
            function getFilterFn(params) {
                var filterOptions = params.settings().filterOptions;
                if (ng1.isFunction(filterOptions.filterFn)) {
                    return filterOptions.filterFn;
                }
                else {
                    return $filter(filterOptions.filterFilterName || provider.filterFilterName);
                }
            }
            function getOrderByFn(params) {
                return $filter(provider.sortingFilterName);
            }
            function applyFilter(data, params) {
                if (!params.hasFilter()) {
                    return data;
                }
                var filter = params.filter(true);
                var filterKeys = Object.keys(filter);
                var parsedFilter = filterKeys.reduce(function (result, key) {
                    result = setPath(result, filter[key], key);
                    return result;
                }, {});
                var filterFn = getFilterFn(params);
                return filterFn.call(params, data, parsedFilter, params.settings().filterOptions.filterComparator);
            }
            function applyPaging(data, params) {
                var pagedData = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(data.length); // set total for recalc pagination
                return pagedData;
            }
            function applySort(data, params) {
                var orderBy = params.orderBy();
                var orderByFn = getOrderByFn(params);
                return orderBy.length ? orderByFn(data, orderBy) : data;
            }
            function getData(data, params) {
                if (data == null) {
                    return [];
                }
                var options = ng1.extend({}, defaultDataOptions, params.settings().dataOptions);
                var fData = options.applyFilter ? applyFilter(data, params) : data;
                var orderedData = options.applySort ? applySort(fData, params) : fData;
                return options.applyPaging ? applyPaging(orderedData, params) : orderedData;
            }
            // Sets the value at any depth in a nested object based on the path
            // note: adapted from: underscore-contrib#setPath
            function setPath(obj, value, path) {
                var keys = path.split('.');
                var ret = obj;
                var lastKey = keys[keys.length - 1];
                var target = ret;
                var parentPathKeys = keys.slice(0, keys.length - 1);
                parentPathKeys.forEach(function (key) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = {};
                    }
                    target = target[key];
                });
                target[lastKey] = value;
                return ret;
            }
        }
    }
    return ngTableDefaultGetDataProvider;
}());
exports.ngTableDefaultGetDataProvider = ngTableDefaultGetDataProvider;


/***/ },
/* 20 */
/* unknown exports provided */
/* all exports used */
/*!*************************************!*\
  !*** ./src/core/ngTableDefaults.ts ***!
  \*************************************/
/***/ function(module, exports) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
/**
 * Default values for ngTable
 * @ngdoc object
 */
exports.ngTableDefaults = {
    params: {},
    settings: {}
};


/***/ },
/* 21 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ./src/core/ngTableEventsChannel.ts ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTableEventsChannel.$inject = ['$rootScope'];
/**
 * Implementation of the {@link IEventsChannel IEventsChannel} interface
 * @ngdoc service
 */
function ngTableEventsChannel($rootScope) {
    var events = {};
    events = addTableParamsEvent('afterCreated', events);
    events = addTableParamsEvent('afterReloadData', events);
    events = addTableParamsEvent('datasetChanged', events);
    events = addTableParamsEvent('pagesChanged', events);
    return events;
    //////////
    function addTableParamsEvent(eventName, target) {
        var fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
        var event = (_a = {},
            _a['on' + fnName] = createEventSubscriptionFn(eventName),
            _a['publish' + fnName] = createPublishEventFn(eventName),
            _a
        );
        return ng1.extend(target, event);
        var _a;
    }
    function createEventSubscriptionFn(eventName) {
        return function subscription(handler, eventSelectorOrScope, eventSelector) {
            var actualEvtSelector;
            var scope = $rootScope;
            if (isScopeLike(eventSelectorOrScope)) {
                scope = eventSelectorOrScope;
                actualEvtSelector = createEventSelectorFn(eventSelector);
            }
            else {
                actualEvtSelector = createEventSelectorFn(eventSelectorOrScope);
            }
            return scope.$on('ngTable:' + eventName, function (event, params) {
                var eventArgs = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    eventArgs[_i - 2] = arguments[_i];
                }
                // don't send events published by the internal NgTableParams created by ngTableController
                if (params.isNullInstance)
                    return;
                var fnArgs = [params].concat(eventArgs);
                if (actualEvtSelector.apply(this, fnArgs)) {
                    handler.apply(this, fnArgs);
                }
            });
        };
        function createEventSelectorFn(eventSelector) {
            if (!eventSelector) {
                return function (publisher) { return true; };
            }
            else if (isEventSelectorFunc(eventSelector)) {
                return eventSelector;
            }
            else {
                // shorthand for subscriber to only receive events from a specific publisher instance
                return function (publisher) { return publisher === eventSelector; };
            }
        }
        function isEventSelectorFunc(val) {
            return typeof val === 'function';
        }
        function isScopeLike(val) {
            return val && typeof val.$new === 'function';
        }
    }
    function createPublishEventFn(eventName) {
        return function publish() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            $rootScope.$broadcast.apply($rootScope, ['ngTable:' + eventName].concat(args));
        };
    }
}
exports.ngTableEventsChannel = ngTableEventsChannel;


/***/ },
/* 22 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ./src/core/ngTableParams.ts ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = __webpack_require__(/*! angular */ 0);
ngTableParamsFactory.$inject = [
    '$q', '$log', '$filter', 'ngTableDefaults', 'ngTableDefaultGetData', 'ngTableEventsChannel'
];
/**
 * Implmenentation of the {@link INgTableParams INgTableParams} interface
 * @ngdoc service
 */
function ngTableParamsFactory($q, $log, $filter, ngTableDefaults, ngTableDefaultGetData, ngTableEventsChannel) {
    return NgTableParams;
    function NgTableParams(baseParameters, baseSettings) {
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        // the ngTableController "needs" to create a dummy/null instance and it's important to know whether an instance
        // is one of these
        if (typeof baseParameters === "boolean") {
            this.isNullInstance = true;
        }
        var self = this, prevParamsMemento, errParamsMemento, isCommittedDataset = false, initialEvents = [], log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (_settings.debugMode && $log.debug) {
                $log.debug.apply($log, args);
            }
        }, defaultFilterOptions = {
            filterComparator: undefined,
            filterDelay: 500,
            filterDelayThreshold: 10000,
            filterFilterName: undefined,
            filterFn: undefined,
            filterLayout: 'stack' // alternative: 'horizontal'
        }, defaultGroupOptions = {
            defaultSort: 'asc',
            isExpanded: true
        }, defaultSettingsFns = getDefaultSettingFns();
        this.data = [];
        this.parameters = function (newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (typeof newParameters !== undefined) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse();
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
                    }
                    else {
                        if (key === 'group') {
                            _params[key] = parseGroup(newParameters[key]);
                        }
                        else {
                            _params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                        }
                    }
                }
                log('ngTable: set parameters', _params);
                return this;
            }
            return _params;
        };
        function parseGroup(group) {
            var defaultSort = _settings.groupOptions && _settings.groupOptions.defaultSort;
            if (!group) {
                return group;
            }
            else if (isGroupingFun(group)) {
                if (group.sortDirection == null) {
                    group.sortDirection = defaultSort;
                }
                return group;
            }
            else if (typeof group === 'object') {
                for (var key in group) {
                    if (group[key] == null) {
                        group[key] = defaultSort;
                    }
                }
                return group;
            }
            else {
                return (_a = {},
                    _a[group] = defaultSort,
                    _a
                );
            }
            var _a;
        }
        /**
         * @ngdoc method
         * @name NgTableParams#settings
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function (newSettings) {
            if (ng1.isDefined(newSettings)) {
                // todo: don't modify newSettings object: this introduces unexpected side effects;
                // instead take a copy of newSettings
                if (newSettings.filterOptions) {
                    newSettings.filterOptions = ng1.extend({}, _settings.filterOptions, newSettings.filterOptions);
                }
                if (newSettings.groupOptions) {
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
                    if (isCommittedDataset) {
                        this.page(1); // reset page as a new dataset has been supplied
                    }
                    isCommittedDataset = false;
                    var fireEvent = function () {
                        ngTableEventsChannel.publishDatasetChanged(self, newSettings.dataset, originalDataset);
                    };
                    if (initialEvents) {
                        initialEvents.push(fireEvent);
                    }
                    else {
                        fireEvent();
                    }
                }
                log('ngTable: set settings', _settings);
                return this;
            }
            return _settings;
        };
        this.page = function (page) {
            return page !== undefined ? this.parameters({
                'page': page
            }) : _params.page;
        };
        // wrapper for page() function so that focus can be
        // retained on the button that initiated the page change
        this.pageFocus = function (page, event) {
            this.pageButtonToRefocus = event.target;
            return this.page(page);
        };
        this.accessibilityOptions = function (field) {
            if (field != null && field !== undefined) {
                return _params.accessibilityOptions[field] ? _params.accessibilityOptions[field] : '';
            }
            return '';
        };
        this.total = function (total) {
            return total !== undefined ? this.settings({
                'total': total
            }) : _settings.total;
        };
        this.count = function (count) {
            // reset to first page because can be blank page
            return count !== undefined ? this.parameters({
                'count': count,
                'page': 1
            }) : _params.count;
        };
        this.filter = function (filter) {
            if (filter != null && typeof filter === 'object') {
                return this.parameters({
                    'filter': filter,
                    'page': 1
                });
            }
            else if (filter === true) {
                var keys = Object.keys(_params.filter);
                var significantFilter = {};
                for (var i = 0; i < keys.length; i++) {
                    var filterValue = _params.filter[keys[i]];
                    if (filterValue != null && filterValue !== '') {
                        significantFilter[keys[i]] = filterValue;
                    }
                }
                return significantFilter;
            }
            else {
                return _params.filter;
            }
        };
        this.group = function (group, sortDirection) {
            if (group === undefined) {
                return _params.group;
            }
            var newParameters = {
                page: 1
            };
            if (isGroupingFun(group) && sortDirection !== undefined) {
                group.sortDirection = sortDirection;
                newParameters.group = group;
            }
            else if (typeof group === 'string' && sortDirection !== undefined) {
                newParameters.group = (_a = {}, _a[group] = sortDirection, _a);
            }
            else {
                newParameters.group = group;
            }
            this.parameters(newParameters);
            return this;
            var _a;
        };
        /**
         * @ngdoc method
         * @name NgTableParams#sorting
         * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function (sorting, direction) {
            if (typeof sorting === 'string' && direction !== undefined) {
                this.parameters({
                    'sorting': (_a = {}, _a[sorting] = direction, _a)
                });
                return this;
            }
            return sorting !== undefined ? this.parameters({
                'sorting': sorting
            }) : _params.sorting;
            var _a;
        };
        this.isSortBy = function (field, direction) {
            if (direction !== undefined) {
                return _params.sorting[field] !== undefined && _params.sorting[field] == direction;
            }
            else {
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
        this.orderBy = function () {
            return convertSortToOrderBy(_params.sorting);
        };
        function convertSortToOrderBy(sorting) {
            var result = [];
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
        this.generatePagesArray = function (currentPage, totalItems, pageSize, maxBlocks) {
            if (!arguments.length) {
                currentPage = this.page();
                totalItems = this.total();
                pageSize = this.count();
            }
            var maxPage, maxPivotPages, minPage, numPages;
            maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;
            var pages = [];
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
                    }
                    else {
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
        this.isDataReloadRequired = function () {
            // note: using != as want to treat null and undefined the same
            return !isCommittedDataset || !ng1.equals(createComparableParams(), prevParamsMemento)
                || hasGlobalSearchFieldChanges();
        };
        function createComparableParams() {
            var group = _params.group;
            return {
                params: _params,
                groupSortDirection: isGroupingFun(group) ? group.sortDirection : undefined
            };
        }
        function isGroupingFun(val) {
            return typeof val === 'function';
        }
        /**
         * @ngdoc method
         * @name NgTableParams#hasFilter
         * @description Determines if NgTableParams#filter has significant filter value(s)
         * (any value except null, undefined, or empty string)
         * @returns {Boolean} true when NgTableParams#filter has at least one significant field value
         */
        this.hasFilter = function () {
            return Object.keys(this.filter(true)).length > 0;
        };
        this.hasGroup = function (group, sortDirection) {
            if (group == null) {
                return isGroupingFun(_params.group) || Object.keys(_params.group).length > 0;
            }
            if (isGroupingFun(group)) {
                if (sortDirection == null) {
                    return _params.group === group;
                }
                else {
                    return _params.group === group && group.sortDirection === sortDirection;
                }
            }
            else {
                if (sortDirection == null) {
                    return Object.keys(_params.group).indexOf(group) !== -1;
                }
                else {
                    return _params.group[group] === sortDirection;
                }
            }
        };
        this.hasFilterChanges = function () {
            var previousFilter = (prevParamsMemento && prevParamsMemento.params.filter);
            return !ng1.equals((_params.filter), previousFilter) || hasGlobalSearchFieldChanges();
        };
        function hasGlobalSearchFieldChanges() {
            var currentVal = (_params.filter && _params.filter['$']);
            var previousVal = (prevParamsMemento && prevParamsMemento.params.filter && prevParamsMemento.params.filter['$']);
            return !ng1.equals(currentVal, previousVal);
        }
        this.url = function (asString) {
            // this function is an example of Typescript gone bad!!
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (var key in _params) {
                if (_params.hasOwnProperty(key)) {
                    var item = _params[key], name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (isSignificantValue(item[subkey], key)) {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                collectValue(item[subkey], pname);
                            }
                        }
                    }
                    else if (!ng1.isFunction(item) && isSignificantValue(item, key)) {
                        collectValue(item, name);
                    }
                }
            }
            return pairs;
            function collectValue(value, key) {
                if (isArray(pairs)) {
                    pairs.push(key + "=" + encodeURIComponent(value));
                }
                else {
                    pairs[key] = encodeURIComponent(value);
                }
            }
            function isArray(pairs) {
                return asString;
            }
            function isSignificantValue(value, key) {
                return key === "group" ? true : typeof value !== undefined && value !== "";
            }
        };
        this.reload = function () {
            var self = this, pData = null;
            _settings.$loading = true;
            prevParamsMemento = ng1.copy(createComparableParams());
            isCommittedDataset = true;
            if (self.hasGroup()) {
                pData = runInterceptorPipeline($q.when(_settings.getGroups(self)));
            }
            else {
                var fn = _settings.getData;
                pData = runInterceptorPipeline($q.when(fn(self)));
            }
            log('ngTable: reload data');
            var oldData = self.data;
            return pData.then(function (data) {
                _settings.$loading = false;
                errParamsMemento = null;
                self.data = data;
                // note: I think it makes sense to publish this event even when data === oldData
                // subscribers can always set a filter to only receive the event when data !== oldData
                ngTableEventsChannel.publishAfterReloadData(self, data, oldData);
                self.reloadPages();
                return data;
            }).catch(function (reason) {
                errParamsMemento = prevParamsMemento;
                // "rethrow"
                return $q.reject(reason);
            });
        };
        this.hasErrorState = function () {
            return !!(errParamsMemento && ng1.equals(errParamsMemento, createComparableParams()));
        };
        function optimizeFilterDelay() {
            // don't debounce by default filter input when working with small synchronous datasets
            if (_settings.filterOptions.filterDelay === defaultFilterOptions.filterDelay &&
                _settings.total <= _settings.filterOptions.filterDelayThreshold &&
                _settings.getData === defaultSettingsFns.getData) {
                _settings.filterOptions.filterDelay = 0;
            }
        }
        this.reloadPages = (function () {
            var currentPages;
            return function () {
                var oldPages = currentPages;
                var newPages = self.generatePagesArray(self.page(), self.total(), self.count());
                if (!ng1.equals(oldPages, newPages)) {
                    currentPages = newPages;
                    ngTableEventsChannel.publishPagesChanged(this, newPages, oldPages);
                }
            };
        })();
        function runInterceptorPipeline(fetchedData) {
            var interceptors = _settings.interceptors || [];
            return interceptors.reduce(function (result, interceptor) {
                var thenFn = (interceptor.response && interceptor.response.bind(interceptor)) || $q.when;
                var rejectFn = (interceptor.responseError && interceptor.responseError.bind(interceptor)) || $q.reject;
                return result.then(function (data) {
                    return thenFn(data, self);
                }, function (reason) {
                    return rejectFn(reason, self);
                });
            }, fetchedData);
        }
        function getDefaultSettingFns() {
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
            function getData(params) {
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
            function getGroups(params) {
                var group = params.group();
                var groupFn;
                var sortDirection = undefined;
                if (isGroupingFun(group)) {
                    groupFn = group;
                    sortDirection = group.sortDirection;
                }
                else {
                    // currently support for only one group implemented
                    var groupField = Object.keys(group)[0];
                    sortDirection = group[groupField];
                    groupFn = function (item) {
                        return getPath(item, groupField);
                    };
                }
                var settings = params.settings();
                var originalDataOptions = settings.dataOptions;
                settings.dataOptions = { applyPaging: false };
                var getData = settings.getData;
                var gotData = $q.when(getData(params));
                return gotData.then(function (data) {
                    var groups = {};
                    ng1.forEach(data, function (item) {
                        var groupName = groupFn(item);
                        groups[groupName] = groups[groupName] || {
                            data: [],
                            $hideRows: !settings.groupOptions.isExpanded,
                            value: groupName
                        };
                        groups[groupName].data.push(item);
                    });
                    var result = [];
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
                }).finally(function () {
                    // restore the real options
                    settings.dataOptions = originalDataOptions;
                });
            }
            function getPath(obj, ks) {
                // origianl source https://github.com/documentcloud/underscore-contrib
                var keys;
                if (typeof ks === "string") {
                    keys = ks.split(".");
                }
                else {
                    keys = ks;
                }
                // If we have reached an undefined property
                // then stop executing and return undefined
                if (obj === undefined)
                    return void 0;
                // If the path array has no more elements, we've reached
                // the intended property and return its value
                if (keys.length === 0)
                    return obj;
                // If we still have elements in the path array and the current
                // value is null, stop executing and return undefined
                if (obj === null)
                    return void 0;
                return getPath(obj[keys[0]], keys.slice(1));
            }
        }
        var _params = {
            page: 1,
            count: 10,
            filter: {},
            sorting: {},
            group: {},
            accessibilityOptions: {
                pagerTitle: '',
                current: 'Current Page',
                more: 'More Pages',
                next: 'Next Page',
                prev: 'Previous Page',
                pageNumPrefix: 'Page'
            }
        };
        ng1.extend(_params, ngTableDefaults.params);
        /**
         * @ngdoc object
         * @name settings
         * @module ngTable
         * @description configuration settings for `NgTableParams`
         */
        var _settings = {
            $loading: false,
            dataset: null,
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
        ng1.forEach(initialEvents, function (event) {
            event();
        });
        initialEvents = null;
        return this;
    }
}
exports.ngTableParamsFactory = ngTableParamsFactory;


/***/ },
/* 23 */
/* unknown exports provided */
/* all exports used */
/*!***************************************!*\
  !*** ./src/core/public-interfaces.ts ***!
  \***************************************/
/***/ function(module, exports) {

"use strict";
"use strict";


/***/ },
/* 24 */
/* unknown exports provided */
/* all exports used */
/*!************************************!*\
  !*** ./src/browser/filterRow.html ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filterRow.html';
var html = "<tr ng-show=\"show_filter\" class=\"ng-table-filters\">\r\n  <th scope=\"col\" data-title-text=\"{{$column.titleAlt(this) || $column.title(this)}}\" ng-repeat=\"$column in $columns\" ng-if=\"$column.show(this)\"\r\n    class=\"filter {{$column.class(this)}}\" ng-class=\"params.settings().filterOptions.filterLayout === 'horizontal' ? 'filter-horizontal' : ''\">\r\n    <div ng-repeat=\"(name, filter) in $column.filter(this)\" ng-include=\"config.getTemplateUrl(filter)\" class=\"filter-cell\" ng-class=\"[getFilterCellCss($column.filter(this), params.settings().filterOptions.filterLayout), $last ? 'last' : '']\">\r\n    </div>\r\n  </th>\r\n</tr>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 25 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************!*\
  !*** ./src/browser/filters/number.html ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/number.html';
var html = "<input type=\"number\" name=\"{{name}}\" ng-disabled=\"$filterRow.disabled\" ng-model=\"params.filter()[name]\" class=\"input-filter form-control\"\r\n       placeholder=\"{{getFilterPlaceholderValue(filter, name)}}\"/>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 26 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ./src/browser/filters/select-multiple.html ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/select-multiple.html';
var html = "<select ng-options=\"data.id as data.title for data in $column.data\"\r\n        ng-disabled=\"$filterRow.disabled\"\r\n        multiple ng-multiple=\"true\"\r\n        ng-model=\"params.filter()[name]\"\r\n        class=\"filter filter-select-multiple form-control\" name=\"{{name}}\">\r\n</select>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 27 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************!*\
  !*** ./src/browser/filters/select.html ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/select.html';
var html = "<select ng-options=\"data.id as data.title for data in $selectData\"\r\n        ng-table-select-filter-ds=\"$column\"\r\n        ng-disabled=\"$filterRow.disabled\"\r\n        ng-model=\"params.filter()[name]\"\r\n        class=\"filter filter-select form-control\" name=\"{{name}}\">\r\n    <option style=\"display:none\" value=\"\"></option>\r\n</select>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 28 */
/* unknown exports provided */
/* all exports used */
/*!***************************************!*\
  !*** ./src/browser/filters/text.html ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/text.html';
var html = "<input type=\"text\" name=\"{{name}}\" ng-disabled=\"$filterRow.disabled\" ng-model=\"params.filter()[name]\" class=\"input-filter form-control\"\r\n       placeholder=\"{{getFilterPlaceholderValue(filter, name)}}\"/>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 29 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ./src/browser/groupRow.html ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/groupRow.html';
var html = "<tr ng-if=\"params.hasGroup()\" ng-show=\"$groupRow.show\" class=\"ng-table-group-header\">\r\n    <th colspan=\"{{getVisibleColumns().length}}\" class=\"sortable\" ng-class=\"{\r\n                    'sort-asc': params.hasGroup($selGroup, 'asc'),\r\n                    'sort-desc':params.hasGroup($selGroup, 'desc')\r\n                  }\">\r\n        <a href=\"\" ng-click=\"isSelectorOpen = !isSelectorOpen\" class=\"ng-table-group-selector\">\r\n            <strong class=\"sort-indicator\">{{$selGroupTitle}}</strong>\r\n            <button class=\"btn btn-default btn-xs ng-table-group-close\"\r\n                    ng-click=\"$groupRow.show = false; $event.preventDefault(); $event.stopPropagation();\">\r\n                <span class=\"glyphicon glyphicon-remove\"></span>\r\n            </button>\r\n            <button class=\"btn btn-default btn-xs ng-table-group-toggle\"\r\n                    ng-click=\"toggleDetail(); $event.preventDefault(); $event.stopPropagation();\">\r\n                <span class=\"glyphicon\" ng-class=\"{\r\n                    'glyphicon-resize-small': params.settings().groupOptions.isExpanded,\r\n                    'glyphicon-resize-full': !params.settings().groupOptions.isExpanded\r\n                }\"></span>\r\n            </button>\r\n        </a>\r\n        <div class=\"list-group\" ng-if=\"isSelectorOpen\">\r\n            <a href=\"\" class=\"list-group-item\" ng-repeat=\"group in getGroupables()\" ng-click=\"groupBy(group)\">\r\n                <strong>{{ getGroupTitle(group)}}</strong>\r\n                <strong ng-class=\"isSelectedGroup(group) && 'sort-indicator'\"></strong>\r\n            </a>\r\n        </div>\r\n    </th>\r\n</tr>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 30 */
/* unknown exports provided */
/* all exports used */
/*!*********************************!*\
  !*** ./src/browser/header.html ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/header.html';
var html = "<ng-table-group-row></ng-table-group-row>\r\n<ng-table-sorter-row></ng-table-sorter-row>\r\n<ng-table-filter-row></ng-table-filter-row>\r\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 31 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ./src/browser/pager.html ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/pager.html';
var html = "<nav class=\"ng-cloak ng-table-pager\" ng-if=\"params.data.length\" role=\"navigation\" aria-label=\"{{params.accessibilityOptions('pagerTitle')}}\">\r\n    <div ng-if=\" params.settings().counts.length \" class=\"ng-table-counts btn-group pull-right \">\r\n        <button ng-repeat=\"count in params.settings().counts\" type=\"button \" ng-class=\"{ 'active':params.count()==count} \" ng-click=\"params.count(count) \"\r\n            class=\"btn btn-default \">\r\n            <span ng-bind=\"count \"></span>\r\n        </button>\r\n    </div>\r\n    <ul ng-if=\"pages.length \" class=\"pagination ng-table-pagination \">\r\n        <!--\r\n                The page that is the current page needs to have aria-current set to 'page'. If the page\r\n                is not current, the aria-current attribute should not even be on the element.\r\n            -->\r\n        <li ng-class=\"{ 'disabled': !page.active && !page.current, 'active': page.current}\" aria-disabled=\"{{!page.active && !page.current}}\"\r\n            ng-repeat=\"page in pages\" ng-attr-aria-current=\"{{page.current ? 'page' : undefined}}\" ng-switch=\"page.type\">            \r\n            <button id=\"page_prev\" aria-disabled=\"{{!page.active && !page.current}}\" ng-switch-when=\"prev\" ng-click=\"params.pageFocus(page.number, $event) \" aria-label=\"{{'NG_TABLE_PREVIOUS_PAGE' | translate}} \">&laquo;</button>                \r\n            <button id=\"page_{{page.number}}\" ng-switch-when=\"first\" ng-click=\"params.pageFocus(page.number, $event) \" aria-label=\"{{(page.current ? 'NG_TABLE_SELECTED_PAGE ':'NG_TABLE_PAGENUM_PREFIX') | translate}} {{page.number}}\">{{page.number}}</button>            \r\n            <button id=\"page_{{page.number}}\" ng-switch-when=\"page\" ng-click=\"params.pageFocus(page.number, $event) \" aria-label=\"{{(page.current ? 'NG_TABLE_SELECTED_PAGE ':'NG_TABLE_PAGENUM_PREFIX') | translate}} {{page.number}}\">{{page.number}}</button>            \r\n            <button id=\"page_more\" ng-switch-when=\"more\" ng-click=\"params.pageFocus(page.number, $event) \" aria-label=\"{{'NG_TABLE_MORE_PAGES' | translate}} \">&#8230;</button>            \r\n            <button id=\"page_{{page.number}}\" ng-switch-when=\"last\" ng-click=\"params.pageFocus(page.number, $event) \"  aria-label=\"{{(page.current ? 'NG_TABLE_SELECTED_PAGE ':'NG_TABLE_PAGENUM_PREFIX') | translate}} {{page.number}}\">{{page.number}}</button>           \r\n            <button id=\"page_next\" aria-disabled=\"{{!page.active && !page.current}}\" ng-switch-when=\"next\" ng-click=\"params.pageFocus(page.number, $event) \" aria-label=\"{{'NG_TABLE_NEXT_PAGE' | translate}} \">&raquo;</button>   \r\n        </li>\r\n    </ul>\r\n</nav>";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 32 */
/* unknown exports provided */
/* all exports used */
/*!************************************!*\
  !*** ./src/browser/sorterRow.html ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/sorterRow.html';
var html = "<tr class=\"ng-table-sort-header\" role=\"row\">\r\n  <!--\r\n     In an effort to provide accessible tables, if a column is sortable it should be given the aria-sort attribute \r\n     with a value of 'none', 'ascending', or 'descending'. The child element should have its role set to 'button'\r\n  -->\r\n  <th scope=\"col\" title=\"{{$column.headerTitle(this)}}\" role=\"columnheader\" ng-attr-aria-sort=\"{{!$column.sortable(this) ? undefined : params.sorting()[$column.sortable(this)]=='asc' ? 'ascending' : params.sorting()[$column.sortable(this)]=='desc' ? 'descending' : 'none'}}\"\r\n    ng-repeat=\"$column in $columns\" ng-class=\"{ \r\n                    'sortable': $column.sortable(this),\r\n                    'sort-asc': params.sorting()[$column.sortable(this)]=='asc',\r\n                    'sort-desc': params.sorting()[$column.sortable(this)]=='desc'\r\n                  }\" ng-init=\"template = $column.headerTemplateURL(this)\" class=\"header {{$column.class(this)}}\" ng-if=\"$column.show(this)\">\r\n    <a role=\"button\" aria-describeby=\"sortDescription\" tabindex=\"0\" ng-if=\"$column.sortable(this) && (template || $column.title(this))\" ng-click=\"sortBy($column, $event)\"\r\n      ng-keydown=\"($event.key === 'Enter' || $event.key === ' ') && sortBy($column, $event)\" class=\"sort-button\">\r\n      <div ng-if=\"!template\" class=\"ng-table-header\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'div'}\">\r\n        <span ng-bind=\"$column.title(this)\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'span'}\"></span>\r\n\t\t<!-- Visually hidden element to be used for aria-describeby for sorting button -->\r\n\t\t<span id=\"sortDescription\" class=\"hidden\">Sort <span ng-if=\"params.sorting()[$column.sortable(this)]=='asc'\">in ascending </span><span ng-if=\"params.sorting()[$column.sortable(this)]=='desc'\">in descending </span>order</span>\r\n      </div>\r\n      <div ng-if=\"template\" ng-include=\"template\"></div>\r\n    </a>\r\n    <!--This header column is used for non-sortable columns.-->\r\n    <div ng-if=\"!$column.sortable(this) && (template || $column.title(this))\">\r\n      <div ng-if=\"!template\" class=\"ng-table-header\">\r\n        <span ng-bind=\"$column.title(this)\"></span>\r\n      </div>\r\n      <div ng-if=\"template\" ng-include=\"template\"></div>\r\n    </div>\r\n  </th>\r\n</tr>";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 33 */
/* unknown exports provided */
/* all exports used */
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var ng1 = __webpack_require__(/*! angular */ 0);
var core_1 = __webpack_require__(/*! ./src/core */ 2);
var browser_1 = __webpack_require__(/*! ./src/browser */ 1);
var ngTable = ng1.module('ngTable', [core_1.default.name, browser_1.default.name]);
exports.ngTable = ngTable;
__export(__webpack_require__(/*! ./src/core */ 2));
__export(__webpack_require__(/*! ./src/browser */ 1));


/***/ }
/******/ ])
});
;
//# sourceMappingURL=ng-table.js.map