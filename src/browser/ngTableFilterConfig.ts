/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IServiceProvider, auto } from 'angular';
import { assignPartialDeep } from '../shared';
import { FilterTemplateDef } from './public-interfaces';

/**
 * Configuration values that determine the behaviour of the `ngTableFilterConfig` service
 */
export class FilterConfigValues {
    /**
     * The default base url to use when deriving the url for a filter template given just an alias name
     */
    defaultBaseUrl = 'ng-table/filters/';
    /**
     * The extension to use when deriving the url of a filter template when given just an alias name
     */
    defaultExt = '.html';
    /**
     * A map of alias names and their corrosponding urls. A lookup against this map will be used
     * to find the url matching an alias name.
     * If no match is found then a url will be derived using the following pattern `${defaultBaseUrl}${aliasName}.${defaultExt}`
     */
    aliasUrls: { [name: string]: string } = {};
}

export type FilterConfigValuesPartial = Partial<FilterConfigValues>

/**
 * The angular provider used to configure the behaviour of the `NgTableFilterConfig` service.
 */
export class NgTableFilterConfigProvider implements IServiceProvider {
    static $inject = ['$injector'];
    $get: () => NgTableFilterConfig;
    private config: FilterConfigValues;
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
        this.config = new FilterConfigValues();
    }

    /**
     * Set the config values used by `NgTableFilterConfig` service
     */
    setConfig(customConfig: FilterConfigValuesPartial) {
        this.config = assignPartialDeep(ng1.copy(this.config), customConfig);
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