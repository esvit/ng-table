/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IAugmentedJQuery, IDirective, IScope } from 'angular';
import * as ng1 from 'angular';
import { ColumnDef, DynamicTableColDef, DynamicTableHtmlAttributes } from './public-interfaces';
import { NgTableController } from './ngTableController';

interface ScopeExtensions {
    $columns: ColumnDef[]
}

function toArray<T>(arr: ArrayLike<T>) {
    return Array.prototype.slice.call(arr) as T[];
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
export function ngTableDynamic(): IDirective {

    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function (tElement: IAugmentedJQuery) {

            const tRows = toArray(tElement[0].getElementsByTagName('tr'));
            const tRow = tRows.filter(tr => !ng1.element(tr).hasClass('ng-table-group'))[0];

            if (!tRow) {
                return undefined;
            }

            toArray(tRow.getElementsByTagName('td')).forEach(tCell => {
                const el = ng1.element(tCell);
                const getAttrValue = (attr: string) => {
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };

                // this used in responsive table
                const titleExpr = getAttrValue('title');
                if (!titleExpr) {
                    el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                }
                const showExpr = el.attr('ng-if');
                if (!showExpr) {
                    el.attr('ng-if', '$columns[$index].show(this)');
                }
            });
            return function (scope: IScope & ScopeExtensions, element: IAugmentedJQuery, attrs: DynamicTableHtmlAttributes, controller: NgTableController<any, DynamicTableColDef>) {
                const expr = controller.parseNgTableDynamicExpr(attrs.ngTableDynamic);

                controller.setupBindingsToInternalScope(expr.tableParams);
                controller.compileDirectiveTemplates();

                scope.$watchCollection<DynamicTableColDef[]>(expr.columns, (newCols/*, oldCols*/) => {
                    scope.$columns = controller.buildColumns(newCols);
                    controller.loadFilterData(scope.$columns);
                });
            };
        }
    };
}