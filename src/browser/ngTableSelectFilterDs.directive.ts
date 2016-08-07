/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IColumnDef, SelectData, ISelectDataFunc, ISelectOption } from './public-interfaces';

interface IInputAttributes extends ng1.IAttributes {
    ngTableSelectFilterDs: string;
}

interface IScopeExtensions {
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
 * @ngdoc directive
 * @private
 */
function ngTableSelectFilterDs(): ng1.IDirective{
    // note: not using isolated or child scope "by design"
    // this is to allow this directive to be combined with other directives that do

    var directive = {
        restrict: 'A',
        controller: ngTableSelectFilterDsController
    };
    return directive;
}

ngTableSelectFilterDsController.$inject = ['$scope', '$parse', '$attrs', '$q'];
function ngTableSelectFilterDsController($scope: ng1.IScope & IScopeExtensions, $parse: ng1.IParseService, $attrs: IInputAttributes, $q: ng1.IQService){

    var $column: IColumnDef;
    init();

    function init(){
        $column = $parse($attrs.ngTableSelectFilterDs)($scope);
        $scope.$watch<SelectData>(function(){
            return $column && $column.data;
        }, bindDataSource);
    }

    function bindDataSource(){
        getSelectListData($column).then(function(data){
            if (data && !hasEmptyOption(data)){
                data.unshift({ id: '', title: ''});
            }
            data = data || [];
            $scope.$selectData = data;
        });
    }

    function hasEmptyOption(data: ISelectOption[]) {
        var isMatch: boolean;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item && item.id === '') {
                isMatch = true;
                break;
            }
        }
        return isMatch;
    }

    function getSelectListData($column: IColumnDef) {
        var dataInput = $column.data;
        if (dataInput instanceof Array) {
            return $q.when(dataInput);
        } else {
            return $q.when(dataInput && dataInput());
        }
    }
}

export { ngTableSelectFilterDs };