/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IScope } from 'angular';
import * as ng1 from 'angular';
import { ColumnDef, ColumnDefPartial, DynamicTableColDef } from './public-interfaces';

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
export class NgTableColumn<TCol extends ColumnDefPartial | DynamicTableColDef> {
    static $inject: string[] = [];

    /**
     * Creates a $column for use within a header template
     *
     * @param column the initial definition for $column to build
     * @param defaultScope the $scope to supply to the $column getter methods when not supplied by caller
     * @param columns a reference to the $columns array to make available on the context supplied to the
     * $column getter methods
     */
    buildColumn(column: TCol, defaultScope: IScope, columns: ColumnDef[]): ColumnDef {
        // note: we're not modifying the original column object. This helps to avoid unintended side affects
        const extendedCol = Object.create(column);
        const defaults = this.createDefaults();
        for (const prop in defaults) {
            if (extendedCol[prop] === undefined) {
                extendedCol[prop] = defaults[prop];
            }
            if (!ng1.isFunction(extendedCol[prop])) {
                // wrap raw field values with "getter" functions
                // - this is to ensure consistency with how ngTable.compile builds columns
                // - note that the original column object is being "proxied"; this is important
                //   as it ensure that any changes to the original object will be returned by the "getter"
                const getterSetter = function getterSetter(/*[value] || [$scope, locals]*/) {
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        (getterSetter as any).assign(null, arguments[0]);
                    } else {
                        return column[prop];
                    }
                };
                (getterSetter as any).assign = function ($scope: IScope, value: any) {
                    column[prop] = value;
                };
                extendedCol[prop] = getterSetter;
            }
            // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
            const getterFn = extendedCol[prop];
            extendedCol[prop] = function () {
                if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                    getterFn.assign(defaultScope, arguments[0]);
                } else {
                    const scope = arguments[0] || defaultScope;
                    const context = Object.create(scope);
                    ng1.extend(context, {
                        $column: extendedCol,
                        $columns: columns
                    });
                    return getterFn.call(column, context);
                }
            };
            if (getterFn.assign) {
                extendedCol[prop].assign = getterFn.assign;
            } else {
                const wrappedGetterFn = extendedCol[prop];
                let localValue: any;
                const getterSetter = function getterSetter(/*[value] || [$scope, locals]*/) {
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        (getterSetter as any).assign(null, arguments[0]);
                    } else {
                        return localValue != undefined ? localValue : wrappedGetterFn.apply(extendedCol, arguments);
                    }
                };
                (getterSetter as any).assign = function ($scope: IScope, value: any) {
                    localValue = value;
                };
                extendedCol[prop] = getterSetter;
            }
        }
        return extendedCol as ColumnDef;
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
        let value = initialValue;
        const getterSetter = function getterSetter(/*[value] || [$scope, locals]*/) {
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