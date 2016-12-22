/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IAttributes, IDirective, IParseService, IQService, IPromise, IScope } from 'angular';
import { ColumnDef, SelectData, SelectDataFunc, SelectOption } from './public-interfaces';

/**
 * @private
 */
export interface InputAttributes extends IAttributes {
    ngTableSelectFilterDs: string;
}

/**
 * @private
 */
export interface ScopeExtensions {
    $selectData: SelectOption[]
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
function ngTableSelectFilterDs(): IDirective {
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
    $column: ColumnDef;
    constructor(
        private $scope: IScope & ScopeExtensions,
        $parse: IParseService,
        private $attrs: InputAttributes,
        private $q: IQService) {

        this.$column = $parse($attrs.ngTableSelectFilterDs)($scope);
        $scope.$watch<SelectData | undefined>(
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

    private hasEmptyOption(data: SelectOption[]) {
        let isMatch = false;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item && item.id === '') {
                isMatch = true;
                break;
            }
        }
        return isMatch;
    }

    private getSelectListData($column: ColumnDef) {
        const dataInput = $column.data;
        let result: IPromise<SelectOption[]> | SelectOption[] | undefined;
        if (typeof dataInput === 'function') {
            result = dataInput();
        } else {
            result = dataInput;
        }
        return this.$q.when<SelectOption[] | undefined>(result);
    }
}
export { ngTableSelectFilterDs };