/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAugmentedJQuery, IDirective, IQService, IParseService, IPromise, IScope } from 'angular';
import * as ng1 from 'angular';
import { 
    ColumnDef, ColumnDefPartial, ColumnFieldContext, ColumnField, DeclarativeTableHtmlAttributes, 
    FilterTemplateDefMap, SelectData 
} from './public-interfaces';
import { NgTableController } from './ngTableController';

interface ScopeExtensions {
    $columns: ColumnDef[]
}

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
export function ngTable($q: IQService, $parse: IParseService) : IDirective {

    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function(element: IAugmentedJQuery) {
            let compiledColumns: ColumnDefPartial[] = [],
                i = 0,
                dataRow: JQuery,
                groupRow: JQuery
            const rows: JQuery[] = [];

            ng1.forEach(element.find('tr'), (tr: JQuery) => {
                rows.push(ng1.element(tr))
            });
            dataRow = rows.filter(tr => !tr.hasClass('ng-table-group'))[0];
            groupRow = rows.filter(tr => tr.hasClass('ng-table-group'))[0];

            if (!dataRow) {
                return undefined;
            }
            ng1.forEach(dataRow.find('td'), (item: JQuery) => {
                const el = ng1.element(item);
                if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                    return;
                }

                const getAttrValue = function(attr: string){
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };
                const setAttrValue = function(attr: string, value: string){
                    if (el.attr('x-data-' + attr)){
                        el.attr('x-data-' + attr, value)
                    } else if (el.attr('data' + attr)){
                        el.attr('data' + attr, value)
                    } else {
                        el.attr(attr, value)
                    }
                };

                const parsedAttribute = function<T>(attr: string): ColumnField<T> | undefined {
                    const expr = getAttrValue(attr);
                    if (!expr){
                        return undefined;
                    }

                    let localValue: any;
                    const getter = (context: ColumnFieldContext) => {
                        if (localValue !== undefined){
                            return localValue as T;
                        }
                        return $parse(expr)(context) as T;
                    };
                    (getter as any).assign = ($scope: ColumnFieldContext, value: any) => {
                        const parsedExpr = $parse(expr);
                        if (parsedExpr.assign) {
                            // we should be writing back to the parent scope as this is where the expression
                            // came from
                            parsedExpr.assign($scope.$parent, value);
                        } else {
                            localValue = value;
                        }
                    };
                    return getter as ColumnField<T>;
                };
                const titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                if (titleExpr){
                    el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                }
                // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend ngTableColumn with
                // a corresponding "safe" default
                compiledColumns.push({
                    id: i++,
                    title: parsedAttribute<string>('title'),
                    titleAlt: parsedAttribute<string>('title-alt'),
                    headerTitle: parsedAttribute<string>('header-title'),
                    sortable: parsedAttribute<string | boolean>('sortable'),
                    'class': parsedAttribute<string>('header-class'),
                    filter: parsedAttribute<FilterTemplateDefMap>('filter'),
                    groupable: parsedAttribute<string | boolean>('groupable'),
                    headerTemplateURL: parsedAttribute<string | boolean>('header'),
                    filterData: parsedAttribute<IPromise<SelectData> | SelectData>('filter-data'),
                    show: el.attr("ng-if") ? parsedAttribute<boolean>('ng-if') : undefined
                });

                if (groupRow || el.attr("ng-if")){
                    // change ng-if to bind to our column definition which we know will be writable
                    // because this will potentially increase the $watch count, only do so if we already have an
                    // ng-if or when we definitely need to change visibility of the columns.
                    // currently only ngTableGroupRow directive needs to change visibility
                    setAttrValue('ng-if', '$columns[' + (compiledColumns.length - 1) + '].show(this)');
                }
            });
            return function(scope: IScope & ScopeExtensions, element: IAugmentedJQuery, attrs: DeclarativeTableHtmlAttributes, controller: NgTableController<any, ColumnDefPartial>) {
                const columns = scope.$columns = controller.buildColumns(compiledColumns);

                controller.setupBindingsToInternalScope(attrs.ngTable);
                controller.loadFilterData(columns);
                controller.compileDirectiveTemplates();
            };
        }
    }
}