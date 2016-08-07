/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IFilterConfig, IFilterConfigValues, IFilterTemplateDef } from './public-interfaces';

ngTableFilterConfigProvider.$inject = [];

/**
 * The angular provider used to configure the behaviour of the `ngTableFilterConfig` service.
 * 
 * Implements the {@link IFilterConfigProvider IFilterConfigProvider} interface
 */
export function ngTableFilterConfigProvider() {
    var config: IFilterConfigValues;
    var defaultConfig: IFilterConfigValues = {
        defaultBaseUrl: 'ng-table/filters/',
        defaultExt: '.html',
        aliasUrls: {}
    };

    this.$get = ngTableFilterConfig;
    this.resetConfigs = resetConfigs;
    this.setConfig = setConfig;

    init();

    /////////

    function init(){
        resetConfigs();
    }

    function resetConfigs(){
        config = defaultConfig;
    }

    function setConfig(customConfig: IFilterConfigValues){
        var mergeConfig = ng1.extend({}, config, customConfig);
        mergeConfig.aliasUrls = ng1.extend({}, config.aliasUrls, customConfig.aliasUrls);
        config = mergeConfig;
    }

    /////////

    ngTableFilterConfig.$inject = [];

    function ngTableFilterConfig(): IFilterConfig {

        var publicConfig: IFilterConfigValues;

        var service = {
            config: publicConfig,
            getTemplateUrl: getTemplateUrl,
            getUrlForAlias: getUrlForAlias
        };
        Object.defineProperty(service, "config", {
            get: function(){
                return publicConfig = publicConfig || ng1.copy(config);
            },
            enumerable: true
        });

        return service;

        /////////

        function getTemplateUrl(filterDef: string | IFilterTemplateDef, filterKey?: string){
            var filterName: string;
            if (typeof filterDef !== 'string'){
                filterName = filterDef.id;
            } else {
                filterName = filterDef;
            }
            if (filterName.indexOf('/') !== -1){
                return filterName;
            }

            return service.getUrlForAlias(filterName, filterKey);
        }

        function getUrlForAlias(aliasName: string, filterKey?: string){
            return config.aliasUrls[aliasName] || config.defaultBaseUrl + aliasName + config.defaultExt;
        }

    }
}