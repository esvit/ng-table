/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IColumnDef, SelectData, ISelectDataFunc, ISelectOption } from './public-interfaces';

/**
 * @private
 */
export interface IInputAttributes extends ng1.IAttributes {
    ngTableSelectFilterDs: string;
}

/**
 * @private
 */
export interface IScopeExtensions {
    $selectData: ISelectOption[]
}

ngTableSelectFilterDs.$inject = [];

/**
 * Takes the array returned by $column.filterData and makes it available as `$selectData` on the `$scope`.
 *
 * The resulting `$selectData` array will contain an extra item that is suitable to represent the user
 * "deselecting" an item from a `<select>` tag
 *
 * This directive is is focused on providing a datasource to an `ngOptions` directive
 */
function ngTableSelectFilterDs(): ng1.IDirective {
    // note: not using isolated or child scope "by design"
    // this is to allow this directive to be combined with other directives that do

    const directive = {
        restrict: 'A',
        controller: NgTableSelectFilterDsController
    };
    return directive;
}

/**
 * @private
 */
export class NgTableSelectFilterDsController {
    static $inject = ['$scope', '$parse', '$attrs', '$q'];
    $column: IColumnDef;
    constructor(
        private $scope: ng1.IScope & IScopeExtensions,
        $parse: ng1.IParseService,
        private $attrs: IInputAttributes,
        private $q: ng1.IQService) {

        this.$column = $parse($attrs.ngTableSelectFilterDs)($scope);
        $scope.$watch<SelectData>(
            () => this.$column && this.$column.data,
            () => { this.bindDataSource(); });
    }
    private bindDataSource() {
        this.getSelectListData(this.$column).then(data => {
            if (data && !this.hasEmptyOption(data)) {
                data.unshift({ id: '', title: '' });
            }
            data = data || [];
            this.$scope.$selectData = data;
        });
    }

    private hasEmptyOption(data: ISelectOption[]) {
        let isMatch: boolean;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item && item.id === '') {
                isMatch = true;
                break;
            }
        }
        return isMatch;
    }

    private getSelectListData($column: IColumnDef) {
        const dataInput = $column.data;
        if (dataInput instanceof Array) {
            return this.$q.when(dataInput);
        } else {
            return this.$q.when(dataInput && dataInput());
        }
    }
}
export { ngTableSelectFilterDs };