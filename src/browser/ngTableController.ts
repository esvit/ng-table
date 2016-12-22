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
    DataResult, DataResults, DataRowGroup, GroupedDataResults, NgTableParams, NgTableEventsChannel,
    PageButton
} from '../core';
import { ColumnDef, ColumnDefPartial, DynamicTableColDef, SelectData, TableHtmlAttributes } from './public-interfaces';
import { NgTableColumn } from './ngTableColumn';

/**
 * @private
 */
export interface TableScope<T> extends IScope {
    $columns: ColumnDef[];
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
    pages: PageButton[];
    templates: {
        header: string;
        pagination: string;
    },
    params: NgTableParams<T>
}

/**
 * The controller for the {@link ngTable ngTable} and {@link ngTableDynamic ngTableDynamic} directives
 */
export class NgTableController<TParams, TCol extends ColumnDefPartial | DynamicTableColDef> {
    static $inject = [
        '$scope', '$timeout', '$parse', '$compile', '$attrs', '$element', '$document', 'ngTableColumn', 'ngTableEventsChannel'
    ];
    private delayFilter: (callback: () => void, ms: number) => void;
    private get hasVisibleFilterColumn() {
        if (!this.$scope.$columns) return false;

        return this.some(this.$scope.$columns, ($column) => {
            return $column.show(this.$scope) && !!$column.filter(this.$scope);
        });
    }
    constructor(
        private $scope: TableScope<TParams>,
        $timeout: ITimeoutService,
        private $parse: IParseService,
        private $compile: ICompileService,
        private $attrs: IAttributes & TableHtmlAttributes,
        private $element: IAugmentedJQuery,
        private $document: IDocumentService,
        private ngTableColumn: NgTableColumn<TCol>,
        private ngTableEventsChannel: NgTableEventsChannel) {

        const isFirstTimeLoad = true;
        $scope.$filterRow = { disabled: false };
        $scope.$loading = false;

        // until such times as the directive uses an isolated scope, we need to ensure that the check for
        // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
        // field on a $scope higher up in the prototype chain
        if (!$scope.hasOwnProperty("params")) {
            $scope.params = new NgTableParams<TParams>(true);
        }

        this.delayFilter = (function () {
            let timer: IPromise<any>;
            return (callback: () => void, ms: number) => {
                $timeout.cancel(timer);
                timer = $timeout(callback, ms);
            };
        })();

        // watch for when a new NgTableParams is bound to the scope
        // CRITICAL: the watch must be for reference and NOT value equality; this is because NgTableParams maintains
        // the current data page as a field. Checking this for value equality would be terrible for performance
        // and potentially cause an error if the items in that array has circular references
        this.$scope.$watch<NgTableParams<TParams>>('params', (newParams, oldParams) => {
            if (newParams === oldParams || !newParams) {
                return;
            }

            newParams.reload();
        }, false);

        this.subscribeToTableEvents();
    }

    private onDataReloadStatusChange(newStatus: boolean/*, oldStatus*/) {
        if (!newStatus || this.$scope.params.hasErrorState()) {
            return;
        }

        const currentParams = this.$scope.params;
        const filterOptions = currentParams.settings().filterOptions;

        if (currentParams.hasFilterChanges()) {
            const applyFilter = () => {
                currentParams.page(1);
                currentParams.reload();
            };
            if (filterOptions.filterDelay) {
                this.delayFilter(applyFilter, filterOptions.filterDelay);
            } else {
                applyFilter();
            }
        } else {
            currentParams.reload();
        }
    }

    compileDirectiveTemplates() {
        if (!this.$element.hasClass('ng-table')) {
            this.$scope.templates = {
                header: (this.$attrs.templateHeader ? this.$attrs.templateHeader : 'ng-table/header.html'),
                pagination: (this.$attrs.templatePagination ? this.$attrs.templatePagination : 'ng-table/pager.html')
            };
            this.$element.addClass('ng-table');
            let headerTemplate: IAugmentedJQuery | undefined;

            // $element.find('> thead').length === 0 doesn't work on jqlite
            let theadFound = false;
            ng1.forEach(this.$element.children(), (e) => {
                if (e.tagName === 'THEAD') {
                    theadFound = true;
                }
            });
            if (!theadFound) {
                headerTemplate = ng1.element('<thead ng-include="templates.header"></thead>', this.$document);
                this.$element.prepend(headerTemplate);
            }
            const paginationTemplate = ng1.element(
                '<div ng-table-pagination="params" template-url="templates.pagination"></div>',
                this.$document
            );
            this.$element.after(paginationTemplate);
            if (headerTemplate) {
                this.$compile(headerTemplate)(this.$scope);
            }
            this.$compile(paginationTemplate)(this.$scope);
        }
    }

    loadFilterData($columns: ColumnDef[]) {
        ng1.forEach($columns, ($column) => {
            const result = $column.filterData(this.$scope);
            if (!result) {
                delete $column.filterData;
                return undefined;
            }

            if (isPromiseLike(result)) {
                delete $column.filterData;
                return result.then(data => {
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
    }

    buildColumns(columns: TCol[]): ColumnDef[] {
        // todo: use strictNullChecks and remove guard clause
        const result: ColumnDef[] = [];
        (columns || []).forEach(col => {
            result.push(this.ngTableColumn.buildColumn(col, this.$scope, result));
        });
        return result
    }

    parseNgTableDynamicExpr(attr: string) {
        if (!attr || attr.indexOf(" with ") > -1) {
            const parts = attr.split(/\s+with\s+/);
            return {
                tableParams: parts[0],
                columns: parts[1]
            };
        } else {
            throw new Error('Parse error (expected example: ng-table-dynamic=\'tableParams with cols\')');
        }
    }

    setupBindingsToInternalScope(tableParamsExpr: string) {

        // note: this we're setting up watches to simulate angular's isolated scope bindings

        // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
        // $watch for value equivalence. This is because ngTableParams references the current page of data as
        // a field and it's important not to watch this
        this.$scope.$watch<NgTableParams<TParams>>(tableParamsExpr, (params) => {
            if (params === undefined) {
                return;
            }
            this.$scope.params = params;
        }, false);

        this.setupFilterRowBindingsToInternalScope();
        this.setupGroupRowBindingsToInternalScope();
    }

    private setupFilterRowBindingsToInternalScope() {
        if (this.$attrs.showFilter) {
            this.$scope.$parent.$watch<boolean>(this.$attrs.showFilter, (value) => {
                this.$scope.show_filter = value;
            });
        } else {
            this.$scope.$watch(() => this.hasVisibleFilterColumn, (value) => {
                this.$scope.show_filter = value;
            })
        }

        if (this.$attrs.disableFilter) {
            this.$scope.$parent.$watch<boolean>(this.$attrs.disableFilter, (value) => {
                this.$scope.$filterRow.disabled = value;
            });
        }
    }

    private setupGroupRowBindingsToInternalScope() {
        this.$scope.$groupRow = { show: false };
        if (this.$attrs.showGroup) {
            const showGroupGetter = this.$parse(this.$attrs.showGroup);
            this.$scope.$parent.$watch<boolean>(showGroupGetter, (value) => {
                this.$scope.$groupRow.show = value;
            });
            if (showGroupGetter.assign) {
                // setup two-way databinding thus allowing ngTableGrowRow to assign to the showGroup expression
                this.$scope.$watch<boolean>('$groupRow.show', (value) => {
                    showGroupGetter.assign(this.$scope.$parent, value);
                });
            }
        } else {
            this.$scope.$watch<boolean>('params.hasGroup()', (newValue) => {
                this.$scope.$groupRow.show = newValue;
            });
        }
    }

    private getVisibleColumns() {
        return (this.$scope.$columns || []).filter((c) => {
            return c.show(this.$scope);
        });
    }

    private subscribeToTableEvents() {

        this.$scope.$watch('params.isDataReloadRequired()', (newStatus: boolean/*, oldStatus*/) => {
            this.onDataReloadStatusChange(newStatus);
        });

        this.ngTableEventsChannel.onAfterReloadData<TParams>(
            (params, newDatapage) => {
                const visibleColumns = this.getVisibleColumns();
                if (params.hasGroup()) {
                    this.$scope.$groups = (newDatapage || []) as GroupedDataResults<TParams>;
                    this.$scope.$groups.visibleColumnCount = visibleColumns.length;
                } else {
                    this.$scope.$data = (newDatapage || []) as DataResults<TParams>;
                    this.$scope.$data.visibleColumnCount = visibleColumns.length;
                }
            },
            this.$scope,
            (publisher) => this.$scope.params === publisher
        );

        this.ngTableEventsChannel.onPagesChanged<TParams>(
            (params, newPages) => {
                this.$scope.pages = newPages;
            },
            this.$scope,
            (publisher) => this.$scope.params === publisher
        );
    }

    private some<T>(array: T[], predicate: (item: T) => boolean) {
        let found = false;
        for (let i = 0; i < array.length; i++) {
            const obj = array[i];
            if (predicate(obj)) {
                found = true;
                break;
            }
        }
        return found;
    }
}