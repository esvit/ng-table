/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IScope } from 'angular';
import { IFilterTemplateDef, IFilterTemplateDefMap } from './public-interfaces';
import { NgTableFilterConfig } from './ngTableFilterConfig';

/**
 * @private
 */
export interface IScopeExtensions {
    getFilterPlaceholderValue(filterDef: string | IFilterTemplateDef, filterKey?: string): string;
}

/**
 * Controller for the {@link ngTableFilterRow ngTableFilterRow} directive
 */
export class NgTableFilterRowController {
    static $inject = ['$scope', 'ngTableFilterConfig'];
    config: NgTableFilterConfig;
    constructor($scope: IScope & IScopeExtensions, ngTableFilterConfig: NgTableFilterConfig) {
        this.config = ngTableFilterConfig;

        // todo: stop doing this. Why?
        // * scope inheritance makes it hard to know how supplies functions
        // * scope is not a concept in angular 2
        // make function available to filter templates
        $scope.getFilterPlaceholderValue = this.getFilterPlaceholderValue.bind(this);
    }

    getFilterCellCss(filter: IFilterTemplateDefMap, layout: string) {
        if (layout !== 'horizontal') {
            return 's12';
        }

        const size = Object.keys(filter).length;
        const width = parseInt((12 / size).toString(), 10);
        return 's' + width;
    }

    getFilterPlaceholderValue(filterDef: string | IFilterTemplateDef, filterKey?: string) {
        if (typeof filterDef === 'string') {
            return '';
        } else {
            return filterDef.placeholder;
        }
    }
}