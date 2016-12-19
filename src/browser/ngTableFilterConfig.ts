/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IServiceProvider, auto } from 'angular';
import { FilterConfigValues, FilterTemplateDef } from './public-interfaces';

/**
 * The angular provider used to configure the behaviour of the `NgTableFilterConfig` service.
 */
export class NgTableFilterConfigProvider implements IServiceProvider {
    static $inject = ['$injector'];
    $get: () => NgTableFilterConfig;
    private config: FilterConfigValues;
    private defaultConfig: FilterConfigValues = {
        defaultBaseUrl: 'ng-table/filters/',
        defaultExt: '.html',
        aliasUrls: {}
    };
    constructor($injector: auto.IInjectorService) {
        this.$get = () => {
            return $injector.instantiate<NgTableFilterConfig>(NgTableFilterConfig, { config: ng1.copy(this.config) });
        }
        this.$get.$inject = [];
        this.resetConfigs();
    }

    /**
     * Reset back to factory defaults the config values that `NgTableFilterConfig` service will use
     */
    resetConfigs() {
        this.config = this.defaultConfig;
    }

    /**
     * Set the config values used by `NgTableFilterConfig` service
     */
    setConfig(customConfig: FilterConfigValues) {
        const mergeConfig = ng1.extend({}, this.config, customConfig);
        mergeConfig.aliasUrls = ng1.extend({}, this.config.aliasUrls, customConfig.aliasUrls);
        this.config = mergeConfig;
    }
}

/**
 * Exposes configuration values and methods used to return the location of the html
 * templates used to render the filter row of an ng-table directive
 */
export class NgTableFilterConfig {
    static $inject = ['config'];
    constructor(
        /**
         * Readonly copy of the final values used to configure the service.
         */
        public readonly config: FilterConfigValues
    ) { }

    /**
     * Return the url of the html filter template registered with the alias supplied
     */
    getUrlForAlias(aliasName: string, filterKey?: string) {
        return this.config.aliasUrls[aliasName] || this.config.defaultBaseUrl + aliasName + this.config.defaultExt;
    }
    
    /**
     * Return the url of the html filter template for the supplied definition and key.
     * For more information see the documentation for {@link FilterTemplateMap}
     */
    getTemplateUrl(filterDef: string | FilterTemplateDef, filterKey?: string) {
        let filterName: string;
        if (typeof filterDef !== 'string') {
            filterName = filterDef.id;
        } else {
            filterName = filterDef;
        }
        if (filterName.indexOf('/') !== -1) {
            return filterName;
        }

        return this.getUrlForAlias(filterName, filterKey);
    }
}