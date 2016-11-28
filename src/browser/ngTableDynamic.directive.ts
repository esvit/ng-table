/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IAugmentedJQuery, IDirective, IScope } from 'angular';
import * as ng1 from 'angular';
import { IColumnDef, IDynamicTableColDef, ITableInputAttributes } from './public-interfaces';
import { NgTableController } from './ngTableController';

interface IScopeExtensions {
    $columns: IColumnDef[]
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
export function ngTableDynamic () : IDirective{

    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function(tElement: IAugmentedJQuery) {
            let row: IAugmentedJQuery;

            // IE 8 fix :not(.ng-table-group) selector
            ng1.forEach(tElement.find('tr'), (tr: JQuery) => {
                tr = ng1.element(tr);
                if (!tr.hasClass('ng-table-group') && !row) {
                    row = tr;
                }
            });
            if (!row) {
                return undefined;
            }

            ng1.forEach(row.find('td'), (item: JQuery) => {
                const el = ng1.element(item);
                const getAttrValue = (attr: string) => {
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };

                // this used in responsive table
                const titleExpr = getAttrValue('title');
                if (!titleExpr){
                    el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                }
                const showExpr = el.attr('ng-if');
                if (!showExpr){
                    el.attr('ng-if', '$columns[$index].show(this)');
                }
            });
            return function (scope: IScope & IScopeExtensions, element: IAugmentedJQuery, attrs: ITableInputAttributes, controller: NgTableController<any, IDynamicTableColDef>) {
                const expr = controller.parseNgTableDynamicExpr(attrs.ngTableDynamic);

                controller.setupBindingsToInternalScope(expr.tableParams);
                controller.compileDirectiveTemplates();

                scope.$watchCollection<IDynamicTableColDef[]>(expr.columns, (newCols/*, oldCols*/) => {
                    scope.$columns = controller.buildColumns(newCols);
                    controller.loadFilterData(scope.$columns);
                });
            };
        }
    };
}