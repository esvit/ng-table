/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IFilterConfig, IFilterTemplateDef, IFilterTemplateDefMap } from './public-interfaces';

interface IScopeExtensions {
    config: IFilterConfig;
    getFilterCellCss(filter: IFilterTemplateDefMap, layout: string): string;
    getFilterPlaceholderValue(filterDef: string | IFilterTemplateDef, filterKey?: string): string;
}

ngTableFilterRowController.$inject = ['$scope', 'ngTableFilterConfig'];

function ngTableFilterRowController($scope: ng1.IScope & IScopeExtensions, ngTableFilterConfig: IFilterConfig){

    $scope.config = ngTableFilterConfig;

    $scope.getFilterCellCss = function (filter: IFilterTemplateDefMap, layout: string) {
        if (layout !== 'horizontal') {
            return 's12';
        }

        var size = Object.keys(filter).length;
        var width = parseInt((12 / size).toString(), 10);
        return 's' + width;
    };

    $scope.getFilterPlaceholderValue = function(filterDef: string | IFilterTemplateDef, filterKey?: string){
        if (typeof filterDef === 'string') {
            return '';
        } else {
            return filterDef.placeholder;
        }
    };
}

export { ngTableFilterRowController };