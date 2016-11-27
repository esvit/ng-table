/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IScope } from 'angular';
import * as ng1 from 'angular';
import { IColumnDef, IDynamicTableColDef } from './public-interfaces';

/**
 * @private
 */
function isScopeLike(object: any) {
    return object != null && ng1.isFunction(object.$new);
}

/**
 * @private
 * Service to construct a $column definition used by {@link ngTable ngTable} directive
 */
export class NgTableColumn<TCol extends IColumnDef | IDynamicTableColDef> {
    static $inject : string[] = [];

    /**
     * Creates a $column for use within a header template
     *
     * @param column the initial definition for $column to build
     * @param defaultScope the $scope to supply to the $column getter methods when not supplied by caller
     * @param columns a reference to the $columns array to make available on the context supplied to the
     * $column getter methods
     */
    buildColumn(column: TCol, defaultScope: IScope, columns: IColumnDef[]): IColumnDef {
        // note: we're not modifying the original column object. This helps to avoid unintended side affects
        var extendedCol = Object.create(column);
        var defaults = this.createDefaults();
        for (var prop in defaults) {
            if (extendedCol[prop] === undefined) {
                extendedCol[prop] = defaults[prop];
            }
            if (!ng1.isFunction(extendedCol[prop])) {
                // wrap raw field values with "getter" functions
                // - this is to ensure consistency with how ngTable.compile builds columns
                // - note that the original column object is being "proxied"; this is important
                //   as it ensure that any changes to the original object will be returned by the "getter"
                (function (prop1: string) {
                    var getterSetter = function getterSetter(/*[value] || [$scope, locals]*/) {
                        if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                            (getterSetter as any).assign(null, arguments[0]);
                        } else {
                            return column[prop1];
                        }
                    };
                    (getterSetter as any).assign = function ($scope: IScope, value: any) {
                        column[prop1] = value;
                    };
                    extendedCol[prop1] = getterSetter;
                })(prop);
            }
            (function (prop1: string) {
                // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
                var getterFn = extendedCol[prop1];
                extendedCol[prop1] = function () {
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        getterFn.assign(null, arguments[0]);
                    } else {
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
        return extendedCol as IColumnDef;
    }

    private createDefaults() {
        return {
            'class': this.createGetterSetter(''),
            filter: this.createGetterSetter(false),
            groupable: this.createGetterSetter(false),
            filterData: ng1.noop,
            headerTemplateURL: this.createGetterSetter(false),
            headerTitle: this.createGetterSetter(''),
            sortable: this.createGetterSetter(false),
            show: this.createGetterSetter(true),
            title: this.createGetterSetter(''),
            titleAlt: this.createGetterSetter('')
        };
    }

    private createGetterSetter(initialValue: any) {
        var value = initialValue;
        var getterSetter = function getterSetter(/*[value] || [$scope, locals]*/) {
            if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                (getterSetter as any).assign(null, arguments[0]);
            } else {
                return value;
            }
        };
        (getterSetter as any).assign = function ($scope: IScope, newValue: any) {
            value = newValue;
        };
        return getterSetter;
    }
}