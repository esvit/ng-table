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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
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
/* exports provided: ngTableCoreModule, Settings, NgTableEventsChannel, ParamValues, NgTableParams, DataSettings, NgTableDefaultGetDataProvider, FilterSettings, GroupSettings */
/* exports used: NgTableParams, ngTableCoreModule, Settings, NgTableEventsChannel, ParamValues, DataSettings, NgTableDefaultGetDataProvider, FilterSettings, GroupSettings */
/*!***************************!*\
  !*** ./src/core/index.ts ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data__ = __webpack_require__(/*! ./data */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__grouping__ = __webpack_require__(/*! ./grouping */ 8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngTableDefaults__ = __webpack_require__(/*! ./ngTableDefaults */ 32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngTableSettings__ = __webpack_require__(/*! ./ngTableSettings */ 11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngTableParams__ = __webpack_require__(/*! ./ngTableParams */ 10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngTableEventsChannel__ = __webpack_require__(/*! ./ngTableEventsChannel */ 9);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "d", function() { return __WEBPACK_IMPORTED_MODULE_6__ngTableEventsChannel__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_4__ngTableSettings__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_5__ngTableParams__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "e", function() { return __WEBPACK_IMPORTED_MODULE_5__ngTableParams__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "f", function() { return __WEBPACK_IMPORTED_MODULE_1__data__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "g", function() { return __WEBPACK_IMPORTED_MODULE_1__data__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__filtering__ = __webpack_require__(/*! ./filtering */ 6);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "h", function() { return __WEBPACK_IMPORTED_MODULE_7__filtering__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__grouping_publicExports__ = __webpack_require__(/*! ./grouping/publicExports */ 31);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "i", function() { return __WEBPACK_IMPORTED_MODULE_8__grouping_publicExports__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ngTableCoreModule; });







var ngTableCoreModule = __WEBPACK_IMPORTED_MODULE_0_angular__["module"]('ngTable-core', [])
    .provider('ngTableDefaultGetData', __WEBPACK_IMPORTED_MODULE_1__data__["b" /* NgTableDefaultGetDataProvider */])
    .factory('ngTableDefaultGetGroups', __WEBPACK_IMPORTED_MODULE_2__grouping__["b" /* ngTableDefaultGetGroups */])
    .value('ngTableDefaults', __WEBPACK_IMPORTED_MODULE_3__ngTableDefaults__["a" /* ngTableDefaults */])
    .service('ngTableEventsChannel', __WEBPACK_IMPORTED_MODULE_6__ngTableEventsChannel__["a" /* NgTableEventsChannel */])
    .run(__WEBPACK_IMPORTED_MODULE_4__ngTableSettings__["a" /* Settings */].init)
    .run(__WEBPACK_IMPORTED_MODULE_5__ngTableParams__["a" /* NgTableParams */].init);
// note: if you are using ES6 or typescript prefer:
// import { NgTableParams } from 'ng-table';
ngTableCoreModule.value('NgTableParams', __WEBPACK_IMPORTED_MODULE_5__ngTableParams__["a" /* NgTableParams */]);









/***/ },
/* 2 */
/* exports provided: NgTableController, ngTableBrowserModule, FilterConfigValues, NgTableFilterConfigProvider, NgTableFilterConfig */
/* exports used: ngTableBrowserModule, NgTableController, FilterConfigValues, NgTableFilterConfigProvider, NgTableFilterConfig */
/*!******************************!*\
  !*** ./src/browser/index.ts ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngTable_directive__ = __webpack_require__(/*! ./ngTable.directive */ 14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngTableColumn__ = __webpack_require__(/*! ./ngTableColumn */ 15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngTableColumnsBinding_directive__ = __webpack_require__(/*! ./ngTableColumnsBinding.directive */ 16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngTableController__ = __webpack_require__(/*! ./ngTableController */ 17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngTableDynamic_directive__ = __webpack_require__(/*! ./ngTableDynamic.directive */ 18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngTableFilterConfig__ = __webpack_require__(/*! ./ngTableFilterConfig */ 5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngTableFilterRow_directive__ = __webpack_require__(/*! ./ngTableFilterRow.directive */ 19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngTableFilterRowController__ = __webpack_require__(/*! ./ngTableFilterRowController */ 20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ngTableGroupRow_directive__ = __webpack_require__(/*! ./ngTableGroupRow.directive */ 21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ngTableGroupRowController__ = __webpack_require__(/*! ./ngTableGroupRowController */ 22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ngTablePagination_directive__ = __webpack_require__(/*! ./ngTablePagination.directive */ 23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ngTableSelectFilterDs_directive__ = __webpack_require__(/*! ./ngTableSelectFilterDs.directive */ 24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ngTableSorterRow_directive__ = __webpack_require__(/*! ./ngTableSorterRow.directive */ 25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ngTableSorterRowController__ = __webpack_require__(/*! ./ngTableSorterRowController */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__filters_number_html__ = __webpack_require__(/*! ./filters/number.html */ 36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__filters_number_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__filters_number_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__filters_select_html__ = __webpack_require__(/*! ./filters/select.html */ 38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__filters_select_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__filters_select_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__filters_select_multiple_html__ = __webpack_require__(/*! ./filters/select-multiple.html */ 37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__filters_select_multiple_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__filters_select_multiple_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__filters_text_html__ = __webpack_require__(/*! ./filters/text.html */ 39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__filters_text_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__filters_text_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pager_html__ = __webpack_require__(/*! ./pager.html */ 42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pager_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__pager_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__header_html__ = __webpack_require__(/*! ./header.html */ 41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__header_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__header_html__);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_4__ngTableController__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_6__ngTableFilterConfig__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "d", function() { return __WEBPACK_IMPORTED_MODULE_6__ngTableFilterConfig__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "e", function() { return __WEBPACK_IMPORTED_MODULE_6__ngTableFilterConfig__["c"]; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ngTableBrowserModule; });





















var ngTableBrowserModule = __WEBPACK_IMPORTED_MODULE_0_angular__["module"]('ngTable-browser', [])
    .directive('ngTable', __WEBPACK_IMPORTED_MODULE_1__ngTable_directive__["a" /* ngTable */])
    .service('ngTableColumn', __WEBPACK_IMPORTED_MODULE_2__ngTableColumn__["a" /* NgTableColumn */])
    .directive('ngTableColumnsBinding', __WEBPACK_IMPORTED_MODULE_3__ngTableColumnsBinding_directive__["a" /* ngTableColumnsBinding */])
    .controller('ngTableController', __WEBPACK_IMPORTED_MODULE_4__ngTableController__["a" /* NgTableController */])
    .directive('ngTableDynamic', __WEBPACK_IMPORTED_MODULE_5__ngTableDynamic_directive__["a" /* ngTableDynamic */])
    .provider('ngTableFilterConfig', __WEBPACK_IMPORTED_MODULE_6__ngTableFilterConfig__["a" /* NgTableFilterConfigProvider */])
    .directive('ngTableFilterRow', __WEBPACK_IMPORTED_MODULE_7__ngTableFilterRow_directive__["a" /* ngTableFilterRow */])
    .controller('ngTableFilterRowController', __WEBPACK_IMPORTED_MODULE_8__ngTableFilterRowController__["a" /* NgTableFilterRowController */])
    .directive('ngTableGroupRow', __WEBPACK_IMPORTED_MODULE_9__ngTableGroupRow_directive__["a" /* ngTableGroupRow */])
    .controller('ngTableGroupRowController', __WEBPACK_IMPORTED_MODULE_10__ngTableGroupRowController__["a" /* NgTableGroupRowController */])
    .directive('ngTablePagination', __WEBPACK_IMPORTED_MODULE_11__ngTablePagination_directive__["a" /* ngTablePagination */])
    .directive('ngTableSelectFilterDs', __WEBPACK_IMPORTED_MODULE_12__ngTableSelectFilterDs_directive__["a" /* ngTableSelectFilterDs */])
    .directive('ngTableSorterRow', __WEBPACK_IMPORTED_MODULE_13__ngTableSorterRow_directive__["a" /* ngTableSorterRow */])
    .controller('ngTableSorterRowController', __WEBPACK_IMPORTED_MODULE_14__ngTableSorterRowController__["a" /* NgTableSorterRowController */]);




/***/ },
/* 3 */
/* exports provided: DataSettings, NgTableDefaultGetDataProvider */
/* exports used: DataSettings, NgTableDefaultGetDataProvider */
/*!********************************!*\
  !*** ./src/core/data/index.ts ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dataSettings__ = __webpack_require__(/*! ./dataSettings */ 27);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__dataSettings__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngTableDefaultGetData__ = __webpack_require__(/*! ./ngTableDefaultGetData */ 28);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__ngTableDefaultGetData__["a"]; });




/***/ },
/* 4 */
/* exports provided: assignPartialDeep, checkClassInit */
/* exports used: checkClassInit, assignPartialDeep */
/*!*****************************!*\
  !*** ./src/shared/index.ts ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assign_partial_deep__ = __webpack_require__(/*! ./assign-partial-deep */ 33);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__assign_partial_deep__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__check_class_init__ = __webpack_require__(/*! ./check-class-init */ 34);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__check_class_init__["a"]; });




/***/ },
/* 5 */
/* exports provided: FilterConfigValues, NgTableFilterConfigProvider, NgTableFilterConfig */
/* exports used: NgTableFilterConfigProvider, FilterConfigValues, NgTableFilterConfig */
/*!********************************************!*\
  !*** ./src/browser/ngTableFilterConfig.ts ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared__ = __webpack_require__(/*! ../shared */ 4);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return FilterConfigValues; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableFilterConfigProvider; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return NgTableFilterConfig; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */


/**
 * Configuration values that determine the behaviour of the `ngTableFilterConfig` service
 */
var FilterConfigValues = (function () {
    function FilterConfigValues() {
        /**
         * The default base url to use when deriving the url for a filter template given just an alias name
         */
        this.defaultBaseUrl = 'ng-table/filters/';
        /**
         * The extension to use when deriving the url of a filter template when given just an alias name
         */
        this.defaultExt = '.html';
        /**
         * A map of alias names and their corrosponding urls. A lookup against this map will be used
         * to find the url matching an alias name.
         * If no match is found then a url will be derived using the following pattern `${defaultBaseUrl}${aliasName}.${defaultExt}`
         */
        this.aliasUrls = {};
    }
    return FilterConfigValues;
}());

/**
 * The angular provider used to configure the behaviour of the `NgTableFilterConfig` service.
 */
var NgTableFilterConfigProvider = (function () {
    function NgTableFilterConfigProvider($injector) {
        var _this = this;
        this.$get = function () {
            return $injector.instantiate(NgTableFilterConfig, { config: __WEBPACK_IMPORTED_MODULE_0_angular__["copy"](_this.config) });
        };
        this.$get.$inject = [];
        this.resetConfigs();
    }
    /**
     * Reset back to factory defaults the config values that `NgTableFilterConfig` service will use
     */
    NgTableFilterConfigProvider.prototype.resetConfigs = function () {
        this.config = new FilterConfigValues();
    };
    /**
     * Set the config values used by `NgTableFilterConfig` service
     */
    NgTableFilterConfigProvider.prototype.setConfig = function (customConfig) {
        this.config = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["b" /* assignPartialDeep */])(__WEBPACK_IMPORTED_MODULE_0_angular__["copy"](this.config), customConfig);
    };
    return NgTableFilterConfigProvider;
}());

NgTableFilterConfigProvider.$inject = ['$injector'];
/**
 * Exposes configuration values and methods used to return the location of the html
 * templates used to render the filter row of an ng-table directive
 */
var NgTableFilterConfig = (function () {
    function NgTableFilterConfig(
        /**
         * Readonly copy of the final values used to configure the service.
         */
        config) {
        this.config = config;
    }
    /**
     * Return the url of the html filter template registered with the alias supplied
     */
    NgTableFilterConfig.prototype.getUrlForAlias = function (aliasName, filterKey) {
        return this.config.aliasUrls[aliasName] || this.config.defaultBaseUrl + aliasName + this.config.defaultExt;
    };
    /**
     * Return the url of the html filter template for the supplied definition and key.
     * For more information see the documentation for {@link FilterTemplateMap}
     */
    NgTableFilterConfig.prototype.getTemplateUrl = function (filterDef, filterKey) {
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
        return this.getUrlForAlias(filterName, filterKey);
    };
    return NgTableFilterConfig;
}());

NgTableFilterConfig.$inject = ['config'];


/***/ },
/* 6 */
/* exports provided: FilterSettings */
/* exports used: FilterSettings */
/*!*************************************!*\
  !*** ./src/core/filtering/index.ts ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filterSettings__ = __webpack_require__(/*! ./filterSettings */ 29);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__filterSettings__["a"]; });



/***/ },
/* 7 */
/* exports provided: GroupSettings */
/* exports used: GroupSettings */
/*!********************************************!*\
  !*** ./src/core/grouping/groupSettings.ts ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return GroupSettings; });
/**
 * Configuration that determines the data row grouping behaviour of a table
 */
var GroupSettings = (function () {
    function GroupSettings() {
        /**
         * The default sort direction that will be used whenever a group is supplied that
         * does not define its own sort direction
         */
        this.defaultSort = 'asc';
        /**
         * Determines whether groups should be displayed expanded to show their items. Defaults to true
         */
        this.isExpanded = true;
    }
    return GroupSettings;
}());



/***/ },
/* 8 */
/* exports provided: GroupSettings, ngTableDefaultGetGroups */
/* exports used: GroupSettings, ngTableDefaultGetGroups */
/*!************************************!*\
  !*** ./src/core/grouping/index.ts ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__groupSettings__ = __webpack_require__(/*! ./groupSettings */ 7);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__groupSettings__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngTableDefaultGetGroups__ = __webpack_require__(/*! ./ngTableDefaultGetGroups */ 30);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__ngTableDefaultGetGroups__["a"]; });




/***/ },
/* 9 */
/* exports provided: NgTableEventsChannel */
/* exports used: NgTableEventsChannel */
/*!******************************************!*\
  !*** ./src/core/ngTableEventsChannel.ts ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableEventsChannel; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

var NgTableEventsChannel = (function () {
    function NgTableEventsChannel($rootScope) {
        this.$rootScope = $rootScope;
        var events = this;
        events = this.addTableParamsEvent('afterCreated', events);
        events = this.addTableParamsEvent('afterReloadData', events);
        events = this.addTableParamsEvent('datasetChanged', events);
        events = this.addTableParamsEvent('pagesChanged', events);
        events = this.addTableParamsEvent('afterDataFiltered', events);
        events = this.addTableParamsEvent('afterDataSorted', events);
    }
    NgTableEventsChannel.prototype.addTableParamsEvent = function (eventName, target) {
        var fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
        var event = (_a = {},
            _a['on' + fnName] = this.createEventSubscriptionFn(eventName),
            _a['publish' + fnName] = this.createPublishEventFn(eventName),
            _a);
        return __WEBPACK_IMPORTED_MODULE_0_angular__["extend"](target, event);
        var _a;
    };
    NgTableEventsChannel.prototype.createPublishEventFn = function (eventName) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            (_a = _this.$rootScope).$broadcast.apply(_a, ['ngTable:' + eventName].concat(args));
            var _a;
        };
    };
    NgTableEventsChannel.prototype.createEventSubscriptionFn = function (eventName) {
        var _this = this;
        return function (handler, eventSelectorOrScope, eventSelector) {
            var actualEvtSelector;
            var scope = _this.$rootScope;
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
            if (eventSelector === void 0) { eventSelector = function () { return true; }; }
            if (isEventSelectorFunc(eventSelector)) {
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
    };
    return NgTableEventsChannel;
}());

NgTableEventsChannel.$inject = ['$rootScope'];


/***/ },
/* 10 */
/* exports provided: ParamValues, NgTableParams */
/* exports used: NgTableParams, ParamValues */
/*!***********************************!*\
  !*** ./src/core/ngTableParams.ts ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(/*! ./util */ 12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared__ = __webpack_require__(/*! ../shared */ 4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngTableSettings__ = __webpack_require__(/*! ./ngTableSettings */ 11);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return ParamValues; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableParams; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */




/**
 * The runtime values for {@link NgTableParams} that determine the set of data rows and
 * how they are to be displayed in a table
 */
var ParamValues = (function () {
    function ParamValues() {
        /**
         * The index of the "slice" of data rows, starting at 1, to be displayed by the table.
         */
        this.page = 1;
        /**
         * The number of data rows per page
         */
        this.count = 10;
        /**
         * The filter that should be applied to restrict the set of data rows
         */
        this.filter = {};
        /**
         * The sort order that should be applied to the data rows.
         */
        this.sorting = {};
        /**
         * The grouping that should be applied to the data rows
         */
        this.group = {};
    }
    return ParamValues;
}());

/**
 * @private
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 * Parameters manager for an ngTable directive
 */
var NgTableParams = (function () {
    function NgTableParams(baseParameters, baseSettings) {
        if (baseParameters === void 0) { baseParameters = {}; }
        if (baseSettings === void 0) { baseSettings = {}; }
        var _this = this;
        /**
         * The page of data rows currently being displayed in the table
         */
        this.data = [];
        this.defaultSettings = __WEBPACK_IMPORTED_MODULE_3__ngTableSettings__["a" /* Settings */].createWithOverrides();
        this.isCommittedDataset = false;
        this.initialEvents = [];
        this._params = new ParamValues();
        this._settings = this.defaultSettings;
        // the ngTableController "needs" to create a dummy/null instance and it's important to know whether an instance
        // is one of these
        if (typeof baseParameters === "boolean") {
            this.isNullInstance = true;
        }
        this.reloadPages = (function () {
            var currentPages;
            return function () {
                var oldPages = currentPages;
                var newPages = _this.generatePagesArray(_this.page(), _this.total(), _this.count());
                if (!__WEBPACK_IMPORTED_MODULE_0_angular__["equals"](oldPages, newPages)) {
                    currentPages = newPages;
                    _this.ngTableEventsChannel.publishPagesChanged(_this, newPages, oldPages);
                }
            };
        })();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__shared__["b" /* assignPartialDeep */])(this._params, this.ngTableDefaults.params);
        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        this.ngTableEventsChannel.publishAfterCreated(this);
        // run events during construction after the initial create event. That way a consumer
        // can subscribe to all events for a table without "dropping" an event
        __WEBPACK_IMPORTED_MODULE_0_angular__["forEach"](this.initialEvents, function (event) {
            event();
        });
        this.initialEvents = null;
    }
    NgTableParams.prototype.count = function (count) {
        // reset to first page because can be blank page
        return count !== undefined ? this.parameters({
            'count': count,
            'page': 1
        }) : this._params.count;
    };
    NgTableParams.prototype.filter = function (filter) {
        if (filter != null && typeof filter === 'object') {
            return this.parameters({
                'filter': filter,
                'page': 1
            });
        }
        else if (filter === true) {
            var keys = Object.keys(this._params.filter);
            var significantFilter = {};
            for (var i = 0; i < keys.length; i++) {
                var filterValue = this._params.filter[keys[i]];
                if (filterValue != null && filterValue !== '') {
                    significantFilter[keys[i]] = filterValue;
                }
            }
            return significantFilter;
        }
        else {
            return this._params.filter;
        }
    };
    /**
     * Generate array of pages.
     * When no arguments supplied, the current parameter state of this `NgTableParams` instance will be used
     * @param currentPage Which page must be active
     * @param totalItems  Total quantity of items
     * @param pageSize    Quantity of items on page
     * @param maxBlocks   Quantity of blocks for pagination
     * @returns Array of pages
     */
    NgTableParams.prototype.generatePagesArray = function (currentPage, totalItems, pageSize, maxBlocks) {
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
            maxPivotPages = Math.round((this._settings.paginationMaxBlocks - this._settings.paginationMinBlocks) / 2);
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
    NgTableParams.prototype.group = function (group, sortDirection) {
        if (group === undefined) {
            return this._params.group;
        }
        var newParameters = {
            page: 1
        };
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* isGroupingFun */])(group) && sortDirection !== undefined) {
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
     * Returns true when an attempt to `reload` the current `parameter` values have resulted in a failure.
     * This method will continue to return true until the `reload` is successfully called or when the
     * `parameter` values have changed
     */
    NgTableParams.prototype.hasErrorState = function () {
        return !!(this.errParamsMemento && __WEBPACK_IMPORTED_MODULE_0_angular__["equals"](this.errParamsMemento, this.createComparableParams()));
    };
    /**
     * Returns true if `filter` has significant filter value(s) (any value except null, undefined, or empty string),
     * otherwise false
     */
    NgTableParams.prototype.hasFilter = function () {
        return Object.keys(this.filter(true)).length > 0;
    };
    /**
     * Return true when a change to `filters` require the `reload` method
     * to be run so as to ensure the data presented to the user reflects these filters
     */
    NgTableParams.prototype.hasFilterChanges = function () {
        var previousFilter = (this.prevParamsMemento && this.prevParamsMemento.params.filter);
        return !__WEBPACK_IMPORTED_MODULE_0_angular__["equals"]((this._params.filter), previousFilter) || this.hasGlobalSearchFieldChanges();
    };
    NgTableParams.prototype.hasGroup = function (group, sortDirection) {
        if (group == null) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* isGroupingFun */])(this._params.group) || Object.keys(this._params.group).length > 0;
        }
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* isGroupingFun */])(group)) {
            if (sortDirection == null) {
                return this._params.group === group;
            }
            else {
                return this._params.group === group && group.sortDirection === sortDirection;
            }
        }
        else {
            if (sortDirection == null) {
                return Object.keys(this._params.group).indexOf(group) !== -1;
            }
            else {
                return this._params.group[group] === sortDirection;
            }
        }
    };
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
    NgTableParams.prototype.isDataReloadRequired = function () {
        // note: using != as want to treat null and undefined the same
        return !this.isCommittedDataset || !__WEBPACK_IMPORTED_MODULE_0_angular__["equals"](this.createComparableParams(), this.prevParamsMemento)
            || this.hasGlobalSearchFieldChanges();
    };
    /**
     * Returns true if sorting by the field supplied. Where direction supplied
     * the field must also be sorted by that direction to return true
     */
    NgTableParams.prototype.isSortBy = function (field, direction) {
        if (direction !== undefined) {
            return this._params.sorting[field] !== undefined && this._params.sorting[field] == direction;
        }
        else {
            return this._params.sorting[field] !== undefined;
        }
    };
    /**
     * Returns sorting values in a format that can be consumed by the angular `$orderBy` filter service
     */
    NgTableParams.prototype.orderBy = function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* convertSortToOrderBy */])(this._params.sorting);
    };
    NgTableParams.prototype.page = function (page) {
        return page !== undefined ? this.parameters({
            'page': page
        }) : this._params.page;
    };
    NgTableParams.prototype.parameters = function (newParameters, parseParamsFromUrl) {
        if (newParameters === undefined) {
            return this._params;
        }
        // todo: move parsing of url like parameters into a seperate method
        parseParamsFromUrl = parseParamsFromUrl || false;
        for (var key in newParameters) {
            var value = newParameters[key];
            if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                var keys = key.split(/\[(.*)\]/).reverse();
                var lastKey = '';
                for (var i = 0, len = keys.length; i < len; i++) {
                    var name_1 = keys[i];
                    if (name_1 !== '') {
                        var v = value;
                        value = {};
                        value[lastKey = name_1] = (isNumber(v) ? parseFloat(v) : v);
                    }
                }
                if (lastKey === 'sorting') {
                    this._params[lastKey] = {};
                }
                this._params[lastKey] = __WEBPACK_IMPORTED_MODULE_0_angular__["extend"](this._params[lastKey] || {}, value[lastKey]);
            }
            else {
                if (newParameters[key] === undefined) {
                }
                else if (key === 'group') {
                    this._params[key] = this.parseGroup(newParameters[key]);
                }
                else {
                    this._params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                }
            }
        }
        this.log('ngTable: set parameters', this._params);
        return this;
    };
    /**
     * Trigger a reload of the data rows
     */
    NgTableParams.prototype.reload = function () {
        var _this = this;
        var pData;
        this._settings.$loading = true;
        this.prevParamsMemento = __WEBPACK_IMPORTED_MODULE_0_angular__["copy"](this.createComparableParams());
        this.isCommittedDataset = true;
        if (this.hasGroup()) {
            pData = this.runInterceptorPipeline(this.$q.when(this._settings.getGroups(this)));
        }
        else {
            var fn = this._settings.getData;
            pData = this.runInterceptorPipeline(this.$q.when(fn(this)));
        }
        this.log('ngTable: reload data');
        var oldData = this.data;
        return pData.then(function (data) {
            _this._settings.$loading = false;
            _this.errParamsMemento = null;
            _this.data = data;
            // note: I think it makes sense to publish this event even when data === oldData
            // subscribers can always set a filter to only receive the event when data !== oldData
            _this.ngTableEventsChannel.publishAfterReloadData(_this, data, oldData);
            _this.reloadPages();
            return data;
        }).catch(function (reason) {
            _this.errParamsMemento = _this.prevParamsMemento;
            // "rethrow"
            return _this.$q.reject(reason);
        });
    };
    NgTableParams.prototype.settings = function (newSettings) {
        var _this = this;
        if (newSettings === undefined) {
            return this._settings;
        }
        var settings = __WEBPACK_IMPORTED_MODULE_3__ngTableSettings__["a" /* Settings */].merge(this._settings, newSettings);
        var originalDataset = this._settings.dataset;
        this._settings = settings;
        // note: using != as want null and undefined to be treated the same
        var hasDatasetChanged = newSettings.hasOwnProperty('dataset') && (newSettings.dataset != originalDataset);
        if (hasDatasetChanged) {
            if (this.isCommittedDataset) {
                this.page(1); // reset page as a new dataset has been supplied
            }
            this.isCommittedDataset = false;
            var fireEvent = function () {
                _this.ngTableEventsChannel.publishDatasetChanged(_this, newSettings.dataset, originalDataset);
            };
            if (this.initialEvents) {
                this.initialEvents.push(fireEvent);
            }
            else {
                fireEvent();
            }
        }
        this.log('ngTable: set settings', this._settings);
        return this;
    };
    NgTableParams.prototype.sorting = function (sorting, direction) {
        if (typeof sorting === 'string') {
            this.parameters({
                'sorting': (_a = {}, _a[sorting] = direction || this.settings().defaultSort, _a)
            });
            return this;
        }
        return sorting !== undefined ? this.parameters({
            'sorting': sorting
        }) : this._params.sorting;
        var _a;
    };
    NgTableParams.prototype.total = function (total) {
        return total !== undefined ? this.settings({
            'total': total
        }) : this._settings.total;
    };
    /**
     * Returns the current parameter values uri-encoded. Set `asString` to
     * true for the parameters to be returned as an array of strings of the form 'paramName=value'
     * otherwise parameters returned as a key-value object
     */
    NgTableParams.prototype.url = function (asString) {
        if (asString === void 0) { asString = false; }
        var pairs = (asString ? [] : {});
        for (var key in this._params) {
            if (this._params.hasOwnProperty(key)) {
                var item = this._params[key], name_2 = encodeURIComponent(key);
                if (typeof item === "object") {
                    for (var subkey in item) {
                        if (isSignificantValue(item[subkey], key)) {
                            var pname = name_2 + "[" + encodeURIComponent(subkey) + "]";
                            collectValue(item[subkey], pname);
                        }
                    }
                }
                else if (!__WEBPACK_IMPORTED_MODULE_0_angular__["isFunction"](item) && isSignificantValue(item, key)) {
                    collectValue(item, name_2);
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
    NgTableParams.prototype.createComparableParams = function () {
        var group = this._params.group;
        return {
            params: this._params,
            groupSortDirection: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* isGroupingFun */])(group) ? group.sortDirection : undefined
        };
    };
    NgTableParams.prototype.hasGlobalSearchFieldChanges = function () {
        var currentVal = (this._params.filter && this._params.filter['$']);
        var previousVal = (this.prevParamsMemento && this.prevParamsMemento.params.filter && this.prevParamsMemento.params.filter['$']);
        return !__WEBPACK_IMPORTED_MODULE_0_angular__["equals"](currentVal, previousVal);
    };
    NgTableParams.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._settings.debugMode && this.$log.debug) {
            (_a = this.$log).debug.apply(_a, args);
        }
        var _a;
    };
    NgTableParams.prototype.parseGroup = function (group) {
        var defaultSort = this._settings.groupOptions.defaultSort;
        if (!group) {
            return group;
        }
        else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* isGroupingFun */])(group)) {
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
            return _a = {},
                _a[group] = defaultSort,
                _a;
        }
        var _a;
    };
    NgTableParams.prototype.runInterceptorPipeline = function (fetchedData) {
        var _this = this;
        return this._settings.interceptors.reduce(function (result, interceptor) {
            var thenFn = (interceptor.response && interceptor.response.bind(interceptor)) || _this.$q.when;
            var rejectFn = (interceptor.responseError && interceptor.responseError.bind(interceptor)) || _this.$q.reject;
            return result.then(function (data) {
                return thenFn(data, _this);
            }, function (reason) {
                return rejectFn(reason, _this);
            });
        }, fetchedData);
    };
    NgTableParams.init = function ($q, $log, ngTableDefaults, ngTableEventsChannel) {
        __WEBPACK_IMPORTED_MODULE_0_angular__["extend"](NgTableParams.prototype, {
            $q: $q, $log: $log, ngTableDefaults: ngTableDefaults, ngTableEventsChannel: ngTableEventsChannel
        });
    };
    return NgTableParams;
}());

NgTableParams.init.$inject = ['$q', '$log', 'ngTableDefaults', 'ngTableEventsChannel'];


/***/ },
/* 11 */
/* exports provided: Settings */
/* exports used: Settings */
/*!*************************************!*\
  !*** ./src/core/ngTableSettings.ts ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared__ = __webpack_require__(/*! ../shared */ 4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data__ = __webpack_require__(/*! ./data */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__filtering__ = __webpack_require__(/*! ./filtering */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__grouping__ = __webpack_require__(/*! ./grouping */ 8);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Settings; });





/**
 * Configuration settings for {@link NgTableParams}
 */
var Settings = (function () {
    function Settings() {
        /**
         * Returns true whenever a call to `getData` is in progress
         */
        this.$loading = false;
        /**
         * The page size buttons that should be displayed. Each value defined in the array
         * determines the possible values that can be supplied to {@link NgTableParams} `page`
         */
        this.counts = [10, 25, 50, 100];
        /**
         * An array that contains all the data rows that table should manage.
         * The `gateData` function will be used to manage the data rows
         * that ultimately will be displayed.
         */
        this.dataset = undefined;
        this.dataOptions = new __WEBPACK_IMPORTED_MODULE_2__data__["a" /* DataSettings */]();
        this.debugMode = false;
        /**
         * The total number of data rows before paging has been applied.
         * Typically you will not need to supply this yourself
         */
        this.total = 0;
        /**
         * The default sort direction that will be used whenever a sorting is supplied that
         * does not define its own sort direction
         */
        this.defaultSort = 'desc';
        this.filterOptions = new __WEBPACK_IMPORTED_MODULE_3__filtering__["a" /* FilterSettings */]();
        /**
         * The function that will be used fetch data rows. Leave undefined to let the {@link IDefaultGetData}
         * service provide a default implementation that will work with the `dataset` array you supply.
         *
         * Typically you will supply a custom function when you need to execute filtering, paging and sorting
         * on the server
         */
        this.getData = Settings.defaultGetData;
        /**
         * The function that will be used group data rows according to the groupings returned by {@link NgTableParams} `group`
        */
        this.getGroups = Settings.defaultGetGroups;
        this.groupOptions = new __WEBPACK_IMPORTED_MODULE_4__grouping__["a" /* GroupSettings */]();
        /**
         * The collection of interceptors that should apply to the results of a call to
         * the `getData` function before the data rows are displayed in the table
         */
        this.interceptors = new Array();
        /**
         * Configuration for the template that will display the page size buttons
         */
        this.paginationMaxBlocks = 11;
        /**
         * Configuration for the template that will display the page size buttons
         */
        this.paginationMinBlocks = 5;
        /**
         * The html tag that will be used to display the sorting indicator in the table header
         */
        this.sortingIndicator = 'span';
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["a" /* checkClassInit */])(Settings);
    }
    Settings.createWithOverrides = function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["a" /* checkClassInit */])(Settings);
        return Settings.merge(Settings.instance, Settings.ngTableDefaults.settings || {});
    };
    Settings.merge = function (existing, newSettings) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["a" /* checkClassInit */])(Settings);
        var optionalPropNames = ['dataset'];
        var results = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shared__["b" /* assignPartialDeep */])(__WEBPACK_IMPORTED_MODULE_0_angular__["copy"](existing), newSettings, function (key) { return optionalPropNames.indexOf(key) !== -1; }, function (destValue, srcValue, key) {
            // copy *reference* to dataset
            if (key === 'dataset') {
                return srcValue;
            }
            return undefined;
        });
        if (newSettings.dataset) {
            results.total = newSettings.dataset.length;
            Settings.optimizeFilterDelay(results);
        }
        return results;
    };
    Settings.optimizeFilterDelay = function (settings) {
        // don't debounce by default filter input when working with small synchronous datasets
        if (settings.filterOptions.filterDelay === Settings.instance.filterOptions.filterDelay &&
            settings.total <= settings.filterOptions.filterDelayThreshold &&
            settings.getData === Settings.instance.getData) {
            settings.filterOptions.filterDelay = 0;
        }
    };
    Settings.init = function (ngTableDefaultGetData, ngTableDefaultGetGroups, ngTableDefaults) {
        Settings.defaultGetData = function (params) {
            return ngTableDefaultGetData(params.settings().dataset, params);
        };
        Settings.defaultGetGroups = ngTableDefaultGetGroups;
        Settings.ngTableDefaults = ngTableDefaults;
        Settings.isInitialized = true;
        Settings.instance = new Settings();
    };
    return Settings;
}());

Settings.isInitialized = false;
Settings.init.$inject = ['ngTableDefaultGetData', 'ngTableDefaultGetGroups', 'ngTableDefaults'];


/***/ },
/* 12 */
/* exports provided: convertSortToOrderBy, isGroupingFun */
/* exports used: isGroupingFun, convertSortToOrderBy */
/*!**************************!*\
  !*** ./src/core/util.ts ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["b"] = convertSortToOrderBy;
/* harmony export (immutable) */ exports["a"] = isGroupingFun;
/**
 * @private
 */
function convertSortToOrderBy(sorting) {
    var result = [];
    for (var column in sorting) {
        result.push((sorting[column] === "asc" ? "+" : "-") + column);
    }
    return result;
}
/**
 * @private
 */
function isGroupingFun(val) {
    return typeof val === 'function';
}


/***/ },
/* 13 */,
/* 14 */
/* exports provided: ngTable */
/* exports used: ngTable */
/*!******************************************!*\
  !*** ./src/browser/ngTable.directive.ts ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (immutable) */ exports["a"] = ngTable;

ngTable.$inject = ['$q', '$parse'];
/**
 * Directive that instantiates {@link NgTableController NgTableController}.
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
            var compiledColumns = [], i = 0, dataRow, groupRow;
            var rows = [];
            __WEBPACK_IMPORTED_MODULE_0_angular__["forEach"](element.find('tr'), function (tr) {
                rows.push(__WEBPACK_IMPORTED_MODULE_0_angular__["element"](tr));
            });
            dataRow = rows.filter(function (tr) { return !tr.hasClass('ng-table-group'); })[0];
            groupRow = rows.filter(function (tr) { return tr.hasClass('ng-table-group'); })[0];
            if (!dataRow) {
                return undefined;
            }
            __WEBPACK_IMPORTED_MODULE_0_angular__["forEach"](dataRow.find('td'), function (item) {
                var el = __WEBPACK_IMPORTED_MODULE_0_angular__["element"](item);
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
                compiledColumns.push({
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
                    setAttrValue('ng-if', '$columns[' + (compiledColumns.length - 1) + '].show(this)');
                }
            });
            return function (scope, element, attrs, controller) {
                var columns = scope.$columns = controller.buildColumns(compiledColumns);
                controller.setupBindingsToInternalScope(attrs.ngTable);
                controller.loadFilterData(columns);
                controller.compileDirectiveTemplates();
            };
        }
    };
}


/***/ },
/* 15 */
/* exports provided: NgTableColumn */
/* exports used: NgTableColumn */
/*!**************************************!*\
  !*** ./src/browser/ngTableColumn.ts ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableColumn; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @private
 */
function isScopeLike(object) {
    return object != null && __WEBPACK_IMPORTED_MODULE_0_angular__["isFunction"](object.$new);
}
/**
 * @private
 * Service to construct a $column definition used by {@link ngTable ngTable} directive
 */
var NgTableColumn = (function () {
    function NgTableColumn() {
    }
    /**
     * Creates a $column for use within a header template
     *
     * @param column the initial definition for $column to build
     * @param defaultScope the $scope to supply to the $column getter methods when not supplied by caller
     * @param columns a reference to the $columns array to make available on the context supplied to the
     * $column getter methods
     */
    NgTableColumn.prototype.buildColumn = function (column, defaultScope, columns) {
        // note: we're not modifying the original column object. This helps to avoid unintended side affects
        var extendedCol = Object.create(column);
        var defaults = this.createDefaults();
        var _loop_1 = function (prop) {
            if (extendedCol[prop] === undefined) {
                extendedCol[prop] = defaults[prop];
            }
            if (!__WEBPACK_IMPORTED_MODULE_0_angular__["isFunction"](extendedCol[prop])) {
                // wrap raw field values with "getter" functions
                // - this is to ensure consistency with how ngTable.compile builds columns
                // - note that the original column object is being "proxied"; this is important
                //   as it ensure that any changes to the original object will be returned by the "getter"
                var getterSetter = function getterSetter() {
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        getterSetter.assign(null, arguments[0]);
                    }
                    else {
                        return column[prop];
                    }
                };
                getterSetter.assign = function ($scope, value) {
                    column[prop] = value;
                };
                extendedCol[prop] = getterSetter;
            }
            // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
            var getterFn = extendedCol[prop];
            extendedCol[prop] = function () {
                if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                    getterFn.assign(defaultScope, arguments[0]);
                }
                else {
                    var scope = arguments[0] || defaultScope;
                    var context = Object.create(scope);
                    __WEBPACK_IMPORTED_MODULE_0_angular__["extend"](context, {
                        $column: extendedCol,
                        $columns: columns
                    });
                    return getterFn.call(column, context);
                }
            };
            if (getterFn.assign) {
                extendedCol[prop].assign = getterFn.assign;
            }
            else {
                var wrappedGetterFn_1 = extendedCol[prop];
                var localValue_1;
                var getterSetter = function getterSetter() {
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        getterSetter.assign(null, arguments[0]);
                    }
                    else {
                        return localValue_1 != undefined ? localValue_1 : wrappedGetterFn_1.apply(extendedCol, arguments);
                    }
                };
                getterSetter.assign = function ($scope, value) {
                    localValue_1 = value;
                };
                extendedCol[prop] = getterSetter;
            }
        };
        for (var prop in defaults) {
            _loop_1(prop);
        }
        return extendedCol;
    };
    NgTableColumn.prototype.createDefaults = function () {
        return {
            'class': this.createGetterSetter(''),
            filter: this.createGetterSetter(false),
            groupable: this.createGetterSetter(false),
            filterData: __WEBPACK_IMPORTED_MODULE_0_angular__["noop"],
            headerTemplateURL: this.createGetterSetter(false),
            headerTitle: this.createGetterSetter(''),
            sortable: this.createGetterSetter(false),
            show: this.createGetterSetter(true),
            title: this.createGetterSetter(''),
            titleAlt: this.createGetterSetter('')
        };
    };
    NgTableColumn.prototype.createGetterSetter = function (initialValue) {
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
    };
    return NgTableColumn;
}());

NgTableColumn.$inject = [];


/***/ },
/* 16 */
/* exports provided: ngTableColumnsBinding */
/* exports used: ngTableColumnsBinding */
/*!********************************************************!*\
  !*** ./src/browser/ngTableColumnsBinding.directive.ts ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = ngTableColumnsBinding;
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
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


/***/ },
/* 17 */
/* exports provided: NgTableController */
/* exports used: NgTableController */
/*!******************************************!*\
  !*** ./src/browser/ngTableController.ts ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core__ = __webpack_require__(/*! ../core */ 1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableController; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */


/**
 * The controller for the {@link ngTable ngTable} and {@link ngTableDynamic ngTableDynamic} directives
 */
var NgTableController = (function () {
    function NgTableController($scope, $timeout, $parse, $compile, $attrs, $element, $document, ngTableColumn, ngTableEventsChannel) {
        this.$scope = $scope;
        this.$parse = $parse;
        this.$compile = $compile;
        this.$attrs = $attrs;
        this.$element = $element;
        this.$document = $document;
        this.ngTableColumn = ngTableColumn;
        this.ngTableEventsChannel = ngTableEventsChannel;
        var isFirstTimeLoad = true;
        $scope.$filterRow = { disabled: false };
        $scope.$loading = false;
        // until such times as the directive uses an isolated scope, we need to ensure that the check for
        // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
        // field on a $scope higher up in the prototype chain
        if (!$scope.hasOwnProperty("params")) {
            $scope.params = new __WEBPACK_IMPORTED_MODULE_1__core__["a" /* NgTableParams */](true);
        }
        this.delayFilter = (function () {
            var timer;
            return function (callback, ms) {
                $timeout.cancel(timer);
                timer = $timeout(callback, ms);
            };
        })();
        // watch for when a new NgTableParams is bound to the scope
        // CRITICAL: the watch must be for reference and NOT value equality; this is because NgTableParams maintains
        // the current data page as a field. Checking this for value equality would be terrible for performance
        // and potentially cause an error if the items in that array has circular references
        this.$scope.$watch('params', function (newParams, oldParams) {
            if (newParams === oldParams || !newParams) {
                return;
            }
            newParams.reload();
        }, false);
        this.subscribeToTableEvents();
    }
    Object.defineProperty(NgTableController.prototype, "hasVisibleFilterColumn", {
        get: function () {
            var _this = this;
            if (!this.$scope.$columns)
                return false;
            return this.some(this.$scope.$columns, function ($column) {
                return $column.show(_this.$scope) && !!$column.filter(_this.$scope);
            });
        },
        enumerable: true,
        configurable: true
    });
    NgTableController.prototype.onDataReloadStatusChange = function (newStatus /*, oldStatus*/) {
        if (!newStatus || this.$scope.params.hasErrorState()) {
            return;
        }
        var currentParams = this.$scope.params;
        var filterOptions = currentParams.settings().filterOptions;
        if (currentParams.hasFilterChanges()) {
            var applyFilter = function () {
                currentParams.page(1);
                currentParams.reload();
            };
            if (filterOptions.filterDelay) {
                this.delayFilter(applyFilter, filterOptions.filterDelay);
            }
            else {
                applyFilter();
            }
        }
        else {
            currentParams.reload();
        }
    };
    NgTableController.prototype.compileDirectiveTemplates = function () {
        if (!this.$element.hasClass('ng-table')) {
            this.$scope.templates = {
                header: (this.$attrs.templateHeader ? this.$attrs.templateHeader : 'ng-table/header.html'),
                pagination: (this.$attrs.templatePagination ? this.$attrs.templatePagination : 'ng-table/pager.html')
            };
            this.$element.addClass('ng-table');
            var headerTemplate = void 0;
            // $element.find('> thead').length === 0 doesn't work on jqlite
            var theadFound_1 = false;
            __WEBPACK_IMPORTED_MODULE_0_angular__["forEach"](this.$element.children(), function (e) {
                if (e.tagName === 'THEAD') {
                    theadFound_1 = true;
                }
            });
            if (!theadFound_1) {
                headerTemplate = __WEBPACK_IMPORTED_MODULE_0_angular__["element"]('<thead ng-include="templates.header"></thead>', this.$document);
                this.$element.prepend(headerTemplate);
            }
            var paginationTemplate = __WEBPACK_IMPORTED_MODULE_0_angular__["element"]('<div ng-table-pagination="params" template-url="templates.pagination"></div>', this.$document);
            this.$element.after(paginationTemplate);
            if (headerTemplate) {
                this.$compile(headerTemplate)(this.$scope);
            }
            this.$compile(paginationTemplate)(this.$scope);
        }
    };
    NgTableController.prototype.loadFilterData = function ($columns) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_0_angular__["forEach"]($columns, function ($column) {
            var result = $column.filterData(_this.$scope);
            if (!result) {
                delete $column.filterData;
                return undefined;
            }
            if (isPromiseLike(result)) {
                delete $column.filterData;
                return result.then(function (data) {
                    // our deferred can eventually return arrays, functions and objects
                    if (!__WEBPACK_IMPORTED_MODULE_0_angular__["isArray"](data) && !__WEBPACK_IMPORTED_MODULE_0_angular__["isFunction"](data) && !__WEBPACK_IMPORTED_MODULE_0_angular__["isObject"](data)) {
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
    NgTableController.prototype.buildColumns = function (columns) {
        var _this = this;
        // todo: use strictNullChecks and remove guard clause
        var result = [];
        (columns || []).forEach(function (col) {
            result.push(_this.ngTableColumn.buildColumn(col, _this.$scope, result));
        });
        return result;
    };
    NgTableController.prototype.parseNgTableDynamicExpr = function (attr) {
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
    NgTableController.prototype.setupBindingsToInternalScope = function (tableParamsExpr) {
        // note: this we're setting up watches to simulate angular's isolated scope bindings
        var _this = this;
        // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
        // $watch for value equivalence. This is because ngTableParams references the current page of data as
        // a field and it's important not to watch this
        this.$scope.$watch(tableParamsExpr, function (params) {
            if (params === undefined) {
                return;
            }
            _this.$scope.params = params;
        }, false);
        this.setupFilterRowBindingsToInternalScope();
        this.setupGroupRowBindingsToInternalScope();
    };
    NgTableController.prototype.setupFilterRowBindingsToInternalScope = function () {
        var _this = this;
        if (this.$attrs.showFilter) {
            this.$scope.$parent.$watch(this.$attrs.showFilter, function (value) {
                _this.$scope.show_filter = value;
            });
        }
        else {
            this.$scope.$watch(function () { return _this.hasVisibleFilterColumn; }, function (value) {
                _this.$scope.show_filter = value;
            });
        }
        if (this.$attrs.disableFilter) {
            this.$scope.$parent.$watch(this.$attrs.disableFilter, function (value) {
                _this.$scope.$filterRow.disabled = value;
            });
        }
    };
    NgTableController.prototype.setupGroupRowBindingsToInternalScope = function () {
        var _this = this;
        this.$scope.$groupRow = { show: false };
        if (this.$attrs.showGroup) {
            var showGroupGetter_1 = this.$parse(this.$attrs.showGroup);
            this.$scope.$parent.$watch(showGroupGetter_1, function (value) {
                _this.$scope.$groupRow.show = value;
            });
            if (showGroupGetter_1.assign) {
                // setup two-way databinding thus allowing ngTableGrowRow to assign to the showGroup expression
                this.$scope.$watch('$groupRow.show', function (value) {
                    showGroupGetter_1.assign(_this.$scope.$parent, value);
                });
            }
        }
        else {
            this.$scope.$watch('params.hasGroup()', function (newValue) {
                _this.$scope.$groupRow.show = newValue;
            });
        }
    };
    NgTableController.prototype.getVisibleColumns = function () {
        var _this = this;
        return (this.$scope.$columns || []).filter(function (c) {
            return c.show(_this.$scope);
        });
    };
    NgTableController.prototype.subscribeToTableEvents = function () {
        var _this = this;
        this.$scope.$watch('params.isDataReloadRequired()', function (newStatus /*, oldStatus*/) {
            _this.onDataReloadStatusChange(newStatus);
        });
        this.ngTableEventsChannel.onAfterReloadData(function (params, newDatapage) {
            var visibleColumns = _this.getVisibleColumns();
            if (params.hasGroup()) {
                _this.$scope.$groups = (newDatapage || []);
                _this.$scope.$groups.visibleColumnCount = visibleColumns.length;
            }
            else {
                _this.$scope.$data = (newDatapage || []);
                _this.$scope.$data.visibleColumnCount = visibleColumns.length;
            }
        }, this.$scope, function (publisher) { return _this.$scope.params === publisher; });
        this.ngTableEventsChannel.onPagesChanged(function (params, newPages) {
            _this.$scope.pages = newPages;
        }, this.$scope, function (publisher) { return _this.$scope.params === publisher; });
    };
    NgTableController.prototype.some = function (array, predicate) {
        var found = false;
        for (var i = 0; i < array.length; i++) {
            var obj = array[i];
            if (predicate(obj)) {
                found = true;
                break;
            }
        }
        return found;
    };
    return NgTableController;
}());

NgTableController.$inject = [
    '$scope', '$timeout', '$parse', '$compile', '$attrs', '$element', '$document', 'ngTableColumn', 'ngTableEventsChannel'
];


/***/ },
/* 18 */
/* exports provided: ngTableDynamic */
/* exports used: ngTableDynamic */
/*!*************************************************!*\
  !*** ./src/browser/ngTableDynamic.directive.ts ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (immutable) */ exports["a"] = ngTableDynamic;
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

function toArray(arr) {
    return Array.prototype.slice.call(arr);
}
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
            var tRows = toArray(tElement[0].getElementsByTagName('tr'));
            var tRow = tRows.filter(function (tr) { return !__WEBPACK_IMPORTED_MODULE_0_angular__["element"](tr).hasClass('ng-table-group'); })[0];
            if (!tRow) {
                return undefined;
            }
            toArray(tRow.getElementsByTagName('td')).forEach(function (tCell) {
                var el = __WEBPACK_IMPORTED_MODULE_0_angular__["element"](tCell);
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


/***/ },
/* 19 */
/* exports provided: ngTableFilterRow */
/* exports used: ngTableFilterRow */
/*!***************************************************!*\
  !*** ./src/browser/ngTableFilterRow.directive.ts ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = ngTableFilterRow;
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
var templateUrl = __webpack_require__(/*! ./filterRow.html */ 35);
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
        controller: 'ngTableFilterRowController',
        controllerAs: '$ctrl'
    };
    return directive;
}


/***/ },
/* 20 */
/* exports provided: NgTableFilterRowController */
/* exports used: NgTableFilterRowController */
/*!***************************************************!*\
  !*** ./src/browser/ngTableFilterRowController.ts ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableFilterRowController; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
/**
 * Controller for the {@link ngTableFilterRow ngTableFilterRow} directive
 */
var NgTableFilterRowController = (function () {
    function NgTableFilterRowController($scope, ngTableFilterConfig) {
        this.config = ngTableFilterConfig;
        // todo: stop doing this. Why?
        // * scope inheritance makes it hard to know how supplies functions
        // * scope is not a concept in angular 2
        // make function available to filter templates
        $scope.getFilterPlaceholderValue = this.getFilterPlaceholderValue.bind(this);
    }
    NgTableFilterRowController.prototype.getFilterCellCss = function (filter, layout) {
        if (layout !== 'horizontal') {
            return 's12';
        }
        var size = Object.keys(filter).length;
        var width = parseInt((12 / size).toString(), 10);
        return 's' + width;
    };
    NgTableFilterRowController.prototype.getFilterPlaceholderValue = function (filterDef, filterKey) {
        if (typeof filterDef === 'string') {
            return '';
        }
        else {
            return filterDef.placeholder;
        }
    };
    return NgTableFilterRowController;
}());

NgTableFilterRowController.$inject = ['$scope', 'ngTableFilterConfig'];


/***/ },
/* 21 */
/* exports provided: ngTableGroupRow */
/* exports used: ngTableGroupRow */
/*!**************************************************!*\
  !*** ./src/browser/ngTableGroupRow.directive.ts ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = ngTableGroupRow;
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
var templateUrl = __webpack_require__(/*! ./groupRow.html */ 40);
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
        controllerAs: '$ctrl'
    };
    return directive;
}


/***/ },
/* 22 */
/* exports provided: NgTableGroupRowController */
/* exports used: NgTableGroupRowController */
/*!**************************************************!*\
  !*** ./src/browser/ngTableGroupRowController.ts ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableGroupRowController; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
/**
 * Controller for the {@link ngTableGroupRow ngTableGroupRow} directive
 */
var NgTableGroupRowController = (function () {
    function NgTableGroupRowController($scope) {
        var _this = this;
        this.$scope = $scope;
        this.groupFns = [];
        $scope.$watch('params.group()', function (newGrouping) {
            _this.setGroup(newGrouping);
        }, true);
    }
    NgTableGroupRowController.prototype.getGroupables = function () {
        var _this = this;
        var groupableCols = this.$scope.$columns.filter(function ($column) { return !!$column.groupable(_this.$scope); });
        return this.groupFns.concat(groupableCols);
    };
    NgTableGroupRowController.prototype.getGroupTitle = function (group) {
        return this.isGroupingFunc(group) ? group.title : group.title(this.$scope);
    };
    NgTableGroupRowController.prototype.getVisibleColumns = function () {
        var _this = this;
        return this.$scope.$columns.filter(function ($column) { return $column.show(_this.$scope); });
    };
    NgTableGroupRowController.prototype.groupBy = function (group) {
        if (this.isSelectedGroup(group)) {
            this.changeSortDirection();
        }
        else {
            if (this.isGroupingFunc(group)) {
                this.$scope.params.group(group);
            }
            else {
                // it's OK, we know that groupable will return a string
                // this is guaranteed by getGroupables returning only
                // columns that return (truthy) strings
                this.$scope.params.group(group.groupable(this.$scope));
            }
        }
    };
    NgTableGroupRowController.prototype.isSelectedGroup = function (group) {
        if (this.isGroupingFunc(group)) {
            return group === this.$scope.$selGroup;
        }
        else {
            return group.groupable(this.$scope) === this.$scope.$selGroup;
        }
    };
    NgTableGroupRowController.prototype.toggleDetail = function () {
        this.$scope.params.settings().groupOptions.isExpanded = !this.$scope.params.settings().groupOptions.isExpanded;
        return this.$scope.params.reload();
    };
    NgTableGroupRowController.prototype.changeSortDirection = function () {
        var newDirection;
        if (this.$scope.params.hasGroup(this.$scope.$selGroup, 'asc')) {
            newDirection = 'desc';
        }
        else if (this.$scope.params.hasGroup(this.$scope.$selGroup, 'desc')) {
            newDirection = '';
        }
        else {
            newDirection = 'asc';
        }
        this.$scope.params.group(this.$scope.$selGroup, newDirection);
    };
    NgTableGroupRowController.prototype.findGroupColumn = function (groupKey) {
        var _this = this;
        return this.$scope.$columns.filter(function ($column) { return $column.groupable(_this.$scope) === groupKey; })[0];
    };
    NgTableGroupRowController.prototype.isGroupingFunc = function (val) {
        return typeof val === 'function';
    };
    NgTableGroupRowController.prototype.setGroup = function (grouping) {
        var existingGroupCol = this.findGroupColumn(this.$scope.$selGroup);
        if (existingGroupCol && existingGroupCol.show.assign) {
            existingGroupCol.show.assign(this.$scope, true);
        }
        if (this.isGroupingFunc(grouping)) {
            this.groupFns = [grouping];
            this.$scope.$selGroup = grouping;
            this.$scope.$selGroupTitle = grouping.title || '';
        }
        else {
            // note: currently only one group is implemented
            var groupKey = Object.keys(grouping || {})[0];
            var groupedColumn = this.findGroupColumn(groupKey);
            if (groupedColumn) {
                this.$scope.$selGroupTitle = groupedColumn.title(this.$scope);
                this.$scope.$selGroup = groupKey;
                if (groupedColumn.show.assign) {
                    groupedColumn.show.assign(this.$scope, false);
                }
            }
        }
    };
    return NgTableGroupRowController;
}());

NgTableGroupRowController.$inject = ['$scope'];


/***/ },
/* 23 */
/* exports provided: ngTablePagination */
/* exports used: ngTablePagination */
/*!****************************************************!*\
  !*** ./src/browser/ngTablePagination.directive.ts ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (immutable) */ exports["a"] = ngTablePagination;
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

ngTablePagination.$inject = ['$compile', '$document', 'ngTableEventsChannel'];
/**
 * Directive that renders the table pagination controls
 * @ngdoc directive
 */
function ngTablePagination($compile, $document, ngTableEventsChannel) {
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
            scope.$watch('templateUrl', function (templateUrl) {
                if (templateUrl === undefined) {
                    return;
                }
                var template = __WEBPACK_IMPORTED_MODULE_0_angular__["element"]('<div ng-include="templateUrl"></div>', $document);
                element.append(template);
                $compile(template)(scope);
            });
        }
    };
}


/***/ },
/* 24 */
/* exports provided: NgTableSelectFilterDsController, ngTableSelectFilterDs */
/* exports used: ngTableSelectFilterDs */
/*!********************************************************!*\
  !*** ./src/browser/ngTableSelectFilterDs.directive.ts ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* unused harmony export NgTableSelectFilterDsController */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ngTableSelectFilterDs; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
ngTableSelectFilterDs.$inject = [];
/**
 * Takes the array returned by $column.filterData and makes it available as `$selectData` on the `$scope`.
 *
 * The resulting `$selectData` array will contain an extra item that is suitable to represent the user
 * "deselecting" an item from a `<select>` tag
 *
 * This directive is is focused on providing a datasource to an `ngOptions` directive
 */
function ngTableSelectFilterDs() {
    // note: not using isolated or child scope "by design"
    // this is to allow this directive to be combined with other directives that do
    var directive = {
        restrict: 'A',
        controller: NgTableSelectFilterDsController
    };
    return directive;
}
/**
 * @private
 */
var NgTableSelectFilterDsController = (function () {
    function NgTableSelectFilterDsController($scope, $parse, $attrs, $q) {
        var _this = this;
        this.$scope = $scope;
        this.$attrs = $attrs;
        this.$q = $q;
        this.$column = $parse($attrs.ngTableSelectFilterDs)($scope);
        $scope.$watch(function () { return _this.$column && _this.$column.data; }, function () { _this.bindDataSource(); });
    }
    NgTableSelectFilterDsController.prototype.bindDataSource = function () {
        var _this = this;
        this.getSelectListData(this.$column).then(function (data) {
            if (data && !_this.hasEmptyOption(data)) {
                data.unshift({ id: '', title: '' });
            }
            data = data || [];
            _this.$scope.$selectData = data;
        });
    };
    NgTableSelectFilterDsController.prototype.hasEmptyOption = function (data) {
        var isMatch = false;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item && item.id === '') {
                isMatch = true;
                break;
            }
        }
        return isMatch;
    };
    NgTableSelectFilterDsController.prototype.getSelectListData = function ($column) {
        var dataInput = $column.data;
        var result;
        if (typeof dataInput === 'function') {
            result = dataInput();
        }
        else {
            result = dataInput;
        }
        return this.$q.when(result);
    };
    return NgTableSelectFilterDsController;
}());

NgTableSelectFilterDsController.$inject = ['$scope', '$parse', '$attrs', '$q'];



/***/ },
/* 25 */
/* exports provided: ngTableSorterRow */
/* exports used: ngTableSorterRow */
/*!***************************************************!*\
  !*** ./src/browser/ngTableSorterRow.directive.ts ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = ngTableSorterRow;
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
var templateUrl = __webpack_require__(/*! ./sorterRow.html */ 43);
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
        controller: 'ngTableSorterRowController',
        controllerAs: '$ctrl'
    };
    return directive;
}


/***/ },
/* 26 */
/* exports provided: NgTableSorterRowController */
/* exports used: NgTableSorterRowController */
/*!***************************************************!*\
  !*** ./src/browser/ngTableSorterRowController.ts ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableSorterRowController; });
/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
var NgTableSorterRowController = (function () {
    function NgTableSorterRowController($scope) {
        this.$scope = $scope;
    }
    NgTableSorterRowController.prototype.sortBy = function ($column, event) {
        var parsedSortable = $column.sortable && $column.sortable();
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        }
        else {
            var defaultSort = this.$scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = this.$scope.params.sorting() && this.$scope.params.sorting()[parsedSortable] && (this.$scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams = (event.ctrlKey || event.metaKey) ? this.$scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            this.$scope.params.parameters({
                sorting: sortingParams
            });
        }
    };
    return NgTableSorterRowController;
}());

NgTableSorterRowController.$inject = ['$scope'];


/***/ },
/* 27 */
/* exports provided: DataSettings */
/* exports used: DataSettings */
/*!***************************************!*\
  !*** ./src/core/data/dataSettings.ts ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DataSettings; });
var DataSettings = (function () {
    function DataSettings() {
        this.applyFilter = true;
        this.applyPaging = true;
        this.applySort = true;
    }
    return DataSettings;
}());



/***/ },
/* 28 */
/* exports provided: NgTableDefaultGetDataProvider */
/* exports used: NgTableDefaultGetDataProvider */
/*!************************************************!*\
  !*** ./src/core/data/ngTableDefaultGetData.ts ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return NgTableDefaultGetDataProvider; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * Implementation of the {@link DefaultGetDataProvider} interface
 */
var NgTableDefaultGetDataProvider = (function () {
    function NgTableDefaultGetDataProvider() {
        /**
         * The name of a angular filter that knows how to apply the values returned by
         * `NgTableParams.filter()` to restrict an array of data.
         * (defaults to the angular `filter` filter service)
         */
        this.filterFilterName = 'filter';
        /**
         * The name of a angular filter that knows how to apply the values returned by
        * `NgTableParams.orderBy()` to sort an array of data.
        * (defaults to the angular `orderBy` filter service)
        */
        this.sortingFilterName = 'orderBy';
        var provider = this;
        this.$get = ngTableDefaultGetData;
        ngTableDefaultGetData.$inject = ['$filter', 'ngTableEventsChannel'];
        function ngTableDefaultGetData($filter, ngTableEventsChannel) {
            getData.applyPaging = applyPaging;
            getData.getFilterFn = getFilterFn;
            getData.getOrderByFn = getOrderByFn;
            return getData;
            function getFilterFn(params) {
                var filterOptions = params.settings().filterOptions;
                if (__WEBPACK_IMPORTED_MODULE_0_angular__["isFunction"](filterOptions.filterFn)) {
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
                var options = params.settings().dataOptions;
                var fData = options.applyFilter ? applyFilter(data, params) : data;
                ngTableEventsChannel.publishAfterDataFiltered(params, fData);
                var orderedData = options.applySort ? applySort(fData, params) : fData;
                ngTableEventsChannel.publishAfterDataSorted(params, orderedData);
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
    return NgTableDefaultGetDataProvider;
}());



/***/ },
/* 29 */
/* exports provided: FilterSettings */
/* exports used: FilterSettings */
/*!**********************************************!*\
  !*** ./src/core/filtering/filterSettings.ts ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return FilterSettings; });
var FilterSettings = (function () {
    function FilterSettings() {
        /**
         * Use this to determine how items are matched against the filter values.
         * This setting is identical to the `comparator` parameter supported by the angular
         * `$filter` filter service
         *
         * Defaults to `undefined` which will result in a case insensitive susbstring match when
         * `DefaultGetData` service is supplying the implementation for the
         * `Settings.getData` function
         */
        this.filterComparator = undefined; // look for a substring match in case insensitive way
        /**
         * A duration to wait for the user to stop typing before applying the filter.
         * Note: this delay will NOT be applied when *small* managed inmemory arrays are supplied as a
         *       `SettingsPartial.dataset` argument to `NgTableParams.settings`.
         */
        this.filterDelay = 500;
        /**
         * The number of elements up to which a managed inmemory array is considered small
         */
        this.filterDelayThreshold = 10000;
        /**
         * Overrides `DefaultGetDataProvider.filterFilterName`.
         * The value supplied should be the name of the angular `$filter` service that will be selected to perform
         * the actual filter logic.
         */
        this.filterFilterName = undefined;
        /**
         * Tells `DefaultGetData` to use this function supplied to perform the filtering instead of selecting an angular $filter.
         */
        this.filterFn = undefined;
        /**
         * The layout to use when multiple html templates are to rendered in a single table header column.
         */
        this.filterLayout = 'stack';
    }
    return FilterSettings;
}());



/***/ },
/* 30 */
/* exports provided: ngTableDefaultGetGroups */
/* exports used: ngTableDefaultGetGroups */
/*!******************************************************!*\
  !*** ./src/core/grouping/ngTableDefaultGetGroups.ts ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(/*! ../util */ 12);
/* harmony export (immutable) */ exports["a"] = ngTableDefaultGetGroups;


ngTableDefaultGetGroups.$inject = ['$q', 'ngTableDefaultGetData'];
/**
 * Implementation of the {@link DefaultGetData} interface
 *
 * @ngdoc service
 */
function ngTableDefaultGetGroups($q, ngTableDefaultGetData) {
    return getGroups;
    function getGroups(params) {
        var group = params.group();
        var groupFn;
        var sortDirection;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* isGroupingFun */])(group)) {
            groupFn = group;
            sortDirection = group.sortDirection;
        }
        else {
            // currently support for only one group implemented
            var groupField_1 = Object.keys(group)[0];
            sortDirection = group[groupField_1];
            groupFn = function (item) {
                return getPath(item, groupField_1);
            };
        }
        var settings = params.settings();
        var originalDataOptions = settings.dataOptions;
        settings.dataOptions = __WEBPACK_IMPORTED_MODULE_0_angular__["extend"]({}, originalDataOptions, { applyPaging: false });
        var getData = settings.getData;
        var gotData = $q.when(getData(params));
        return gotData.then(function (data) {
            var groups = {};
            __WEBPACK_IMPORTED_MODULE_0_angular__["forEach"](data, function (item) {
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
                var orderBy = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* convertSortToOrderBy */])({
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
}
/**
 * @private
 */
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


/***/ },
/* 31 */
/* exports provided: GroupSettings */
/* exports used: GroupSettings */
/*!********************************************!*\
  !*** ./src/core/grouping/publicExports.ts ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__groupSettings__ = __webpack_require__(/*! ./groupSettings */ 7);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__groupSettings__["a"]; });



/***/ },
/* 32 */
/* exports provided: ngTableDefaults */
/* exports used: ngTableDefaults */
/*!*************************************!*\
  !*** ./src/core/ngTableDefaults.ts ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ngTableDefaults; });
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
/**
 * Default values for ngTable
 */
var ngTableDefaults = {
    params: {},
    settings: {}
};


/***/ },
/* 33 */
/* exports provided: assignPartialDeep */
/* exports used: assignPartialDeep */
/*!*******************************************!*\
  !*** ./src/shared/assign-partial-deep.ts ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony export (immutable) */ exports["a"] = assignPartialDeep;

/**
 * @private
 */
function assignPartialDeep(destination, partial, optionalPropSelector, customizer) {
    if (optionalPropSelector === void 0) { optionalPropSelector = function () { return false; }; }
    if (customizer === void 0) { customizer = function () { return undefined; }; }
    var keys = Object.keys(partial);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var srcVal = partial[key];
        if (srcVal === undefined) {
            if (optionalPropSelector(key, destination)) {
                destination[key] = srcVal;
            }
            else {
            }
            continue;
        }
        var destVal = destination[key];
        var customVal = customizer(destVal, srcVal, key);
        if (customVal !== undefined) {
            destination[key] = customVal;
        }
        else if (__WEBPACK_IMPORTED_MODULE_0_angular__["isArray"](srcVal)) {
            destination[key] = srcVal.slice();
        }
        else if (!__WEBPACK_IMPORTED_MODULE_0_angular__["isObject"](srcVal)) {
            destination[key] = srcVal;
        }
        else {
            destination[key] = assignPartialDeep(destVal, srcVal);
        }
    }
    return destination;
}


/***/ },
/* 34 */
/* exports provided: checkClassInit */
/* exports used: checkClassInit */
/*!****************************************!*\
  !*** ./src/shared/check-class-init.ts ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = checkClassInit;
/**
 * @private
 */
function checkClassInit(clazz) {
    if (!clazz.isInitialized) {
        throw new Error('Class used before initialized. Hint: it is only safe to use this class after all run blocks (ng 1) / app initializers (ng 2) have executed.');
    }
}


/***/ },
/* 35 */
/* unknown exports provided */
/* all exports used */
/*!************************************!*\
  !*** ./src/browser/filterRow.html ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filterRow.html';
var html = "<tr ng-show=\"show_filter\" class=\"ng-table-filters\">\n    <th data-title-text=\"{{$column.titleAlt(this) || $column.title(this)}}\" ng-repeat=\"$column in $columns\" ng-if=\"$column.show(this)\" class=\"filter {{$column.class(this)}}\"\n        ng-class=\"params.settings().filterOptions.filterLayout === 'horizontal' ? 'filter-horizontal' : ''\">\n        <div ng-repeat=\"(name, filter) in $column.filter(this)\" ng-include=\"$ctrl.config.getTemplateUrl(filter)\" class=\"filter-cell\"\n             ng-class=\"[$ctrl.getFilterCellCss($column.filter(this), params.settings().filterOptions.filterLayout), $last ? 'last' : '']\">\n        </div>\n    </th>\n</tr>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 36 */
/* unknown exports provided */
/*!*****************************************!*\
  !*** ./src/browser/filters/number.html ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/number.html';
var html = "<input type=\"number\" name=\"{{name}}\" ng-disabled=\"$filterRow.disabled\" ng-model=\"params.filter()[name]\" class=\"input-filter form-control\"\n       placeholder=\"{{getFilterPlaceholderValue(filter, name)}}\"/>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 37 */
/* unknown exports provided */
/*!**************************************************!*\
  !*** ./src/browser/filters/select-multiple.html ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/select-multiple.html';
var html = "<select ng-options=\"data.id as data.title for data in $column.data\"\n        ng-disabled=\"$filterRow.disabled\"\n        multiple ng-multiple=\"true\"\n        ng-model=\"params.filter()[name]\"\n        class=\"filter filter-select-multiple form-control\" name=\"{{name}}\">\n</select>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 38 */
/* unknown exports provided */
/*!*****************************************!*\
  !*** ./src/browser/filters/select.html ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/select.html';
var html = "<select ng-options=\"data.id as data.title for data in $selectData\"\n        ng-table-select-filter-ds=\"$column\"\n        ng-disabled=\"$filterRow.disabled\"\n        ng-model=\"params.filter()[name]\"\n        class=\"filter filter-select form-control\" name=\"{{name}}\">\n    <option style=\"display:none\" value=\"\"></option>\n</select>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 39 */
/* unknown exports provided */
/*!***************************************!*\
  !*** ./src/browser/filters/text.html ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/filters/text.html';
var html = "<input type=\"text\" name=\"{{name}}\" ng-disabled=\"$filterRow.disabled\" ng-model=\"params.filter()[name]\" class=\"input-filter form-control\"\n       placeholder=\"{{getFilterPlaceholderValue(filter, name)}}\"/>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 40 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ./src/browser/groupRow.html ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/groupRow.html';
var html = "<tr ng-if=\"params.hasGroup()\" ng-show=\"$groupRow.show\" class=\"ng-table-group-header\">\n    <th colspan=\"{{$ctrl.getVisibleColumns().length}}\" class=\"sortable\" ng-class=\"{\n                    'sort-asc': params.hasGroup($selGroup, 'asc'),\n                    'sort-desc':params.hasGroup($selGroup, 'desc')\n                  }\">\n        <a href=\"\" ng-click=\"isSelectorOpen = !isSelectorOpen\" class=\"ng-table-group-selector\">\n            <strong class=\"sort-indicator\">{{$selGroupTitle}}</strong>\n            <button class=\"btn btn-default btn-xs ng-table-group-close\"\n                    ng-click=\"$groupRow.show = false; $event.preventDefault(); $event.stopPropagation();\">\n                <span class=\"glyphicon glyphicon-remove\"></span>\n            </button>\n            <button class=\"btn btn-default btn-xs ng-table-group-toggle\"\n                    ng-click=\"$ctrl.toggleDetail(); $event.preventDefault(); $event.stopPropagation();\">\n                <span class=\"glyphicon\" ng-class=\"{\n                    'glyphicon-resize-small': params.settings().groupOptions.isExpanded,\n                    'glyphicon-resize-full': !params.settings().groupOptions.isExpanded\n                }\"></span>\n            </button>\n        </a>\n        <div class=\"list-group\" ng-if=\"isSelectorOpen\">\n            <a href=\"\" class=\"list-group-item\" ng-repeat=\"group in $ctrl.getGroupables()\" ng-click=\"$ctrl.groupBy(group)\">\n                <strong>{{ $ctrl.getGroupTitle(group)}}</strong>\n                <strong ng-class=\"$ctrl.isSelectedGroup(group) && 'sort-indicator'\"></strong>\n            </a>\n        </div>\n    </th>\n</tr>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 41 */
/* unknown exports provided */
/*!*********************************!*\
  !*** ./src/browser/header.html ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/header.html';
var html = "<ng-table-group-row></ng-table-group-row>\n<ng-table-sorter-row></ng-table-sorter-row>\n<ng-table-filter-row></ng-table-filter-row>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 42 */
/* unknown exports provided */
/*!********************************!*\
  !*** ./src/browser/pager.html ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/pager.html';
var html = "<div class=\"ng-cloak ng-table-pager\" ng-if=\"params.data.length\">\n    <div ng-if=\"params.settings().counts.length\" class=\"ng-table-counts btn-group pull-right\">\n        <button ng-repeat=\"count in params.settings().counts\" type=\"button\"\n                ng-class=\"{'active':params.count() == count}\"\n                ng-click=\"params.count(count)\" class=\"btn btn-default\">\n            <span ng-bind=\"count\"></span>\n        </button>\n    </div>\n    <ul ng-if=\"pages.length\" class=\"pagination ng-table-pagination\">\n        <li class=\"page-item\" ng-class=\"{'disabled': !page.active && !page.current, 'active': page.current}\" ng-repeat=\"page in pages\" ng-switch=\"page.type\">\n            <a class=\"page-link\" ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\" href=\"\">&laquo;</a>\n            <a class=\"page-link\" ng-switch-when=\"first\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a>\n            <a class=\"page-link\" ng-switch-when=\"page\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a>\n            <a class=\"page-link\" ng-switch-when=\"more\" ng-click=\"params.page(page.number)\" href=\"\">&#8230;</a>\n            <a class=\"page-link\" ng-switch-when=\"last\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a>\n            <a class=\"page-link\" ng-switch-when=\"next\" ng-click=\"params.page(page.number)\" href=\"\">&raquo;</a>\n        </li>\n    </ul>\n</div>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 43 */
/* unknown exports provided */
/* all exports used */
/*!************************************!*\
  !*** ./src/browser/sorterRow.html ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

var path = 'ng-table/sorterRow.html';
var html = "<tr class=\"ng-table-sort-header\">\n    <th title=\"{{$column.headerTitle(this)}}\"\n        ng-repeat=\"$column in $columns\"\n        ng-class=\"{\n                    'sortable': $column.sortable(this),\n                    'sort-asc': params.sorting()[$column.sortable(this)]=='asc',\n                    'sort-desc': params.sorting()[$column.sortable(this)]=='desc'\n                  }\"\n        ng-click=\"$ctrl.sortBy($column, $event)\"\n        ng-if=\"$column.show(this)\"\n        ng-init=\"template = $column.headerTemplateURL(this)\"\n        class=\"header {{$column.class(this)}}\">\n        <div ng-if=\"!template\" class=\"ng-table-header\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'div'}\">\n            <span ng-bind=\"$column.title(this)\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'span'}\"></span>\n        </div>\n        <div ng-if=\"template\" ng-include=\"template\"></div>\n    </th>\n</tr>\n";
var angular = __webpack_require__(/*! angular */ 0);
angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ },
/* 44 */
/* exports provided: ngTableModule, ngTableCoreModule, Settings, NgTableController, ngTableBrowserModule, NgTableEventsChannel, ParamValues, NgTableParams, FilterConfigValues, NgTableFilterConfigProvider, NgTableFilterConfig, DataSettings, NgTableDefaultGetDataProvider, FilterSettings, GroupSettings */
/* all exports used */
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(/*! angular */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_core__ = __webpack_require__(/*! ./src/core */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_browser__ = __webpack_require__(/*! ./src/browser */ 2);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "ngTableCoreModule", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Settings", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgTableEventsChannel", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "ParamValues", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgTableParams", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "DataSettings", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgTableDefaultGetDataProvider", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FilterSettings", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "GroupSettings", function() { return __WEBPACK_IMPORTED_MODULE_1__src_core__["i"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgTableController", function() { return __WEBPACK_IMPORTED_MODULE_2__src_browser__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "ngTableBrowserModule", function() { return __WEBPACK_IMPORTED_MODULE_2__src_browser__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "FilterConfigValues", function() { return __WEBPACK_IMPORTED_MODULE_2__src_browser__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgTableFilterConfigProvider", function() { return __WEBPACK_IMPORTED_MODULE_2__src_browser__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "NgTableFilterConfig", function() { return __WEBPACK_IMPORTED_MODULE_2__src_browser__["e"]; });
/* harmony export (binding) */ __webpack_require__.d(exports, "ngTableModule", function() { return ngTableModule; });



var ngTableModule = __WEBPACK_IMPORTED_MODULE_0_angular__["module"]('ngTable', [__WEBPACK_IMPORTED_MODULE_1__src_core__["b" /* ngTableCoreModule */].name, __WEBPACK_IMPORTED_MODULE_2__src_browser__["a" /* ngTableBrowserModule */].name]);





/***/ }
/******/ ]);
});
//# sourceMappingURL=ng-table.js.map