/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import * as ng1 from 'angular';
import { IColumnDef, ColumnFieldContext, IColumnField, IFilterTemplateDefMap, SelectData, ITableController } from './public-interfaces';
import { ITableInputAttributes } from './ngTableController';
    
interface IScopeExtensions {
    $columns: IColumnDef[]
}

/**
 * @ngdoc directive
 * @name ngTable
 * @module ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTableController ngTableController}.
 */
ngTable.$inject = ['$q', '$parse'];

function ngTable($q: ng1.IQService, $parse: ng1.IParseService) {

    return {
        restrict: 'A',
        priority: 1001,
        scope: true,
        controller: 'ngTableController',
        compile: function(element: ng1.IAugmentedJQuery) {
            var columns: IColumnDef[] = [],
                i = 0,
                dataRow: ng1.IAugmentedJQuery,
                groupRow: ng1.IAugmentedJQuery,
                rows: ng1.IAugmentedJQuery[] = [];

            ng1.forEach(element.find('tr'), function(tr) {
                rows.push(ng1.element(tr))
            });
            dataRow = rows.filter(function(tr){
                return !tr.hasClass('ng-table-group');
            })[0];
            groupRow = rows.filter(function(tr){
                return tr.hasClass('ng-table-group');
            })[0];

            if (!dataRow) {
                return undefined;
            }
            ng1.forEach(dataRow.find('td'), function(item) {
                var el = ng1.element(item);
                if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                    return;
                }

                var getAttrValue = function(attr: string){
                    return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                };
                var setAttrValue = function(attr: string, value: string){
                    if (el.attr('x-data-' + attr)){
                        el.attr('x-data-' + attr, value)
                    } else if (el.attr('data' + attr)){
                        el.attr('data' + attr, value)
                    } else {
                        el.attr(attr, value)
                    }
                };

                var parsedAttribute = function<T>(attr: string): IColumnField<T> {
                    var expr = getAttrValue(attr);
                    if (!expr){
                        return undefined;
                    }

                    var localValue: any;
                    var getter = function (context: ColumnFieldContext) {
                        if (localValue !== undefined){
                            return localValue as T;
                        }
                        return $parse(expr)(context) as T;
                    };
                    (getter as any).assign = function($scope: ColumnFieldContext, value: any){
                        var parsedExpr = $parse(expr);
                        if (parsedExpr.assign) {
                            // we should be writing back to the parent scope as this is where the expression
                            // came from
                            parsedExpr.assign($scope.$parent, value);
                        } else {
                            localValue = value;
                        }
                    };
                    return getter as IColumnField<T>;
                };
                var titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                if (titleExpr){
                    el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                }
                // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend ngTableColumn with
                // a corresponding "safe" default
                columns.push({
                    id: i++,
                    title: parsedAttribute<string>('title'),
                    titleAlt: parsedAttribute<string>('title-alt'),
                    headerTitle: parsedAttribute<string>('header-title'),
                    sortable: parsedAttribute<string | boolean>('sortable'),
                    'class': parsedAttribute<string>('header-class'),
                    filter: parsedAttribute<IFilterTemplateDefMap>('filter'),
                    groupable: parsedAttribute<string | boolean>('groupable'),
                    headerTemplateURL: parsedAttribute<string | boolean>('header'),
                    filterData: parsedAttribute<ng1.IPromise<SelectData> | SelectData>('filter-data'),
                    show: el.attr("ng-if") ? parsedAttribute<boolean>('ng-if') : undefined
                });

                if (groupRow || el.attr("ng-if")){
                    // change ng-if to bind to our column definition which we know will be writable
                    // because this will potentially increase the $watch count, only do so if we already have an
                    // ng-if or when we definitely need to change visibility of the columns.
                    // currently only ngTableGroupRow directive needs to change visibility
                    setAttrValue('ng-if', '$columns[' + (columns.length - 1) + '].show(this)');
                }
            });
            return function(scope: ng1.IScope & IScopeExtensions, element: ng.IAugmentedJQuery, attrs: ITableInputAttributes, controller: ITableController) {
                scope.$columns = columns = controller.buildColumns(columns);

                controller.setupBindingsToInternalScope(attrs.ngTable);
                controller.loadFilterData(columns);
                controller.compileDirectiveTemplates();
            };
        }
    }
}

export { ngTable };