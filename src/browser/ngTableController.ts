/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { 
    IAttributes, IAugmentedJQuery, ICompileService, IDocumentService, IParseService, IPromise, IScope, 
    ITimeoutService 
} from 'angular';
import * as ng1 from 'angular';
import { 
    DataResult, DataResults, IDataRowGroup, GroupedDataResults, INgTableParams, IEventsChannel, 
    IPageButton, ITableParamsConstructor 
} from '../core';
import { IColumnDef, IDynamicTableColDef, SelectData, ITableInputAttributes } from './public-interfaces';
import { IColumnBuilder } from './ngTableColumn';

/**
 * @private
 */
export interface ITableScope<T> extends IScope {
    $columns: IColumnDef[];
    $loading: boolean;
    $filterRow: {
        disabled: boolean;
    };
    $data?: DataResults<T>;
    $groups?: GroupedDataResults<T>;
    $groupRow: {
        show: boolean;
    };
    show_filter: boolean;
    pages: IPageButton[];
    templates: {
        header: string;
        pagination: string;
    },
    params: INgTableParams<T>
}

ngTableController.$inject = [
    '$scope', 'NgTableParams', '$timeout', '$parse', '$compile', '$attrs', '$element', '$document', 'ngTableColumn', 'ngTableEventsChannel'
];

/**
 * The controller for the {@link ngTable ngTable} and {@link ngTableDynamic ngTableDynamic} directives
 */
export function ngTableController<T>(
    $scope: ITableScope<T>, NgTableParams: ITableParamsConstructor<T>, $timeout: ITimeoutService, $parse: IParseService,
    $compile: ICompileService, $attrs: IAttributes & ITableInputAttributes, $element: IAugmentedJQuery, $document: IDocumentService,
    ngTableColumn: IColumnBuilder, ngTableEventsChannel: IEventsChannel) {
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
        var timer: IPromise<any>;
        return function (callback: (...args: any[]) => void, ms: number) {
            $timeout.cancel(timer);
            timer = $timeout(callback, ms);
        };
    })();

    function onDataReloadStatusChange(newStatus: boolean/*, oldStatus*/) {
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
            } else {
                applyFilter();
            }
        } else {
            currentParams.reload();
        }
    }

    // watch for when a new NgTableParams is bound to the scope
    // CRITICAL: the watch must be for reference and NOT value equality; this is because NgTableParams maintains
    // the current data page as a field. Checking this for value equality would be terrible for performance
    // and potentially cause an error if the items in that array has circular references
    $scope.$watch<INgTableParams<T>>('params', (newParams, oldParams) => {
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
            var headerTemplate: IAugmentedJQuery = null;

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
            var paginationTemplate = ng1.element(
                '<div ng-table-pagination="params" template-url="templates.pagination"></div>',
                $document
            );
            $element.after(paginationTemplate);
            if (headerTemplate) {
                $compile(headerTemplate)($scope);
            }
            $compile(paginationTemplate)($scope);
        }
    };

    this.loadFilterData = function ($columns: IColumnDef[]) {
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
            // otherwise, we just return what the user gave us. It could be a function, array, object, whatever
            else {
                return $column.data = result;
            }
        });

        function isPromiseLike(val: any): val is IPromise<SelectData> {
            return val && typeof val === 'object' && typeof val.then === 'function';
        }
    };

    this.buildColumns = function (columns: Array<IColumnDef | IDynamicTableColDef>) {
        var result: Array<IColumnDef | IDynamicTableColDef> = [];
        (columns || []).forEach(function (col) {
            result.push(ngTableColumn.buildColumn(col, $scope, result));
        });
        return result
    };

    this.parseNgTableDynamicExpr = function (attr: string) {
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

    this.setupBindingsToInternalScope = function (tableParamsExpr: string) {

        // note: this we're setting up watches to simulate angular's isolated scope bindings

        // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
        // $watch for value equivalence. This is because ngTableParams references the current page of data as
        // a field and it's important not to watch this
        $scope.$watch<INgTableParams<T>>(tableParamsExpr, function (params) {
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
            $scope.$parent.$watch<boolean>($attrs.showFilter, function (value) {
                $scope.show_filter = value;
            });
        } else {
            $scope.$watch(hasVisibleFilterColumn, function (value) {
                $scope.show_filter = value;
            })
        }

        if ($attrs.disableFilter) {
            $scope.$parent.$watch<boolean>($attrs.disableFilter, function (value) {
                $scope.$filterRow.disabled = value;
            });
        }
    }

    function setupGroupRowBindingsToInternalScope() {
        $scope.$groupRow = { show: false };
        if ($attrs.showGroup) {
            var showGroupGetter = $parse($attrs.showGroup);
            $scope.$parent.$watch<boolean>(showGroupGetter, function (value) {
                $scope.$groupRow.show = value;
            });
            if (showGroupGetter.assign) {
                // setup two-way databinding thus allowing ngTableGrowRow to assign to the showGroup expression
                $scope.$watch<boolean>('$groupRow.show', function (value) {
                    showGroupGetter.assign($scope.$parent, value);
                });
            }
        } else {
            $scope.$watch<boolean>('params.hasGroup()', function (newValue) {
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
        if (!$scope.$columns) return false;

        return some($scope.$columns, function ($column) {
            return $column.show($scope) && !!$column.filter($scope);
        });
    }

    function some<T>(array: T[], predicate: (item: T) => boolean) {
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
        ngTableEventsChannel.onAfterReloadData<T>(
            (params, newDatapage) => {
                var visibleColumns = getVisibleColumns();
                if (params.hasGroup()) {
                    $scope.$groups = (newDatapage || []) as GroupedDataResults<T>;
                    $scope.$groups.visibleColumnCount = visibleColumns.length;
                } else {
                    $scope.$data = (newDatapage || []) as DataResults<T>;
                    $scope.$data.visibleColumnCount = visibleColumns.length;
                }
            },
            $scope,
            (publisher) => $scope.params === publisher
        );

        ngTableEventsChannel.onPagesChanged<T>(
            (params, newPages) => {
                $scope.pages = newPages;
            },
            $scope,
            (publisher) => $scope.params === publisher
        );
    }

    commonInit();
}