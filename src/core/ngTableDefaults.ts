/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import { IParamValues } from './ngTableParams';
import { ISettings } from './ngTableSettings';


/**
 * An angular value object that allow for overriding of the initial default values used when constructing
 * an instance of `NgTableParams`
 */
export interface IDefaults {
    params?: IParamValues<any>;
    settings?: ISettings<any>
}

/**
 * Default values for ngTable
 */
export let ngTableDefaults : IDefaults = {
    params: {},
    settings: {}
};