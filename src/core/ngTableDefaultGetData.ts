/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IDefaultGetDataProvider, IDefaultGetData, IFilterFunc, INgTableParams } from './public-interfaces';

/**
 * Allows for the configuration of the ngTableDefaultGetData service.
 *
 * Set filterFilterName to the name of a angular filter that knows how to apply the values returned by
 * `NgTableParams.filter()` to restrict an array of data.
 *
 * Set sortingFilterName to the name of a angular filter that knows how to apply the values returned by
 * `NgTableParams.orderBy()` to sort an array of data.
 *
 * Out of the box the `ngTableDefaultGetData` service will be configured to use the angular `filter` and `orderBy`
 * filters respectively
 * 
 * @ngdoc provider
 */
export class ngTableDefaultGetDataProvider implements IDefaultGetDataProvider {
    filterFilterName = 'filter';
    sortingFilterName = 'orderBy';
    $get: ($filter: ng1.IFilterService) => IDefaultGetData<any>;
    constructor() {
        var provider = this;
        this.$get = ngTableDefaultGetData;

        ngTableDefaultGetData.$inject = ['$filter'];

        /**
         * Implementation of the {@link IDefaultGetData IDefaultGetData} interface
         * 
         * @ngdoc service
         */
        function ngTableDefaultGetData<T>($filter: ng1.IFilterService): IDefaultGetData<T> {

            var defaultDataOptions = { applyFilter: true, applySort: true, applyPaging: true };

            (getData as IDefaultGetData<T>).applyPaging = applyPaging;
            (getData as IDefaultGetData<T>).getFilterFn = getFilterFn;
            (getData as IDefaultGetData<T>).getOrderByFn = getOrderByFn;

            return getData as IDefaultGetData<T>;

            function getFilterFn(params: INgTableParams<T>): IFilterFunc<T> {
                var filterOptions = params.settings().filterOptions;
                if (ng1.isFunction(filterOptions.filterFn)) {
                    return filterOptions.filterFn;
                } else {
                    return $filter<ng1.IFilterFilter>(filterOptions.filterFilterName || provider.filterFilterName);
                }
            }

            function getOrderByFn(params: INgTableParams<T>) {
                return $filter<ng1.IFilterOrderBy>(provider.sortingFilterName);
            }

            function applyFilter(data: T[], params: INgTableParams<T>): T[] {
                if (!params.hasFilter()) {
                    return data;
                }

                var filter = params.filter(true);
                var filterKeys = Object.keys(filter);
                var parsedFilter = filterKeys.reduce(function (result, key) {
                    result = setPath(result, filter[key], key);
                    return result;
                }, {});
                var filterFn = getFilterFn(params);
                return filterFn.call(params, data, parsedFilter, params.settings().filterOptions.filterComparator);
            }

            function applyPaging(data: T[], params: INgTableParams<T>): T[] {
                var pagedData = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(data.length); // set total for recalc pagination
                return pagedData;
            }

            function applySort(data: T[], params: INgTableParams<T>): T[] {
                var orderBy = params.orderBy();
                var orderByFn = getOrderByFn(params);
                return orderBy.length ? orderByFn(data, orderBy) : data;
            }

            function getData(data: T[], params: INgTableParams<T>): T[] {
                if (data == null) {
                    return [];
                }

                var options = ng1.extend({}, defaultDataOptions, params.settings().dataOptions);

                var fData = options.applyFilter ? applyFilter(data, params) : data;
                var orderedData = options.applySort ? applySort(fData, params) : fData;
                return options.applyPaging ? applyPaging(orderedData, params) : orderedData;
            }

            // Sets the value at any depth in a nested object based on the path
            // note: adapted from: underscore-contrib#setPath
            function setPath(obj: any, value: any, path: string) {
                var keys = path.split('.');
                var ret = obj;
                var lastKey = keys[keys.length - 1];
                var target = ret;

                var parentPathKeys = keys.slice(0, keys.length - 1);
                parentPathKeys.forEach(function (key) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = {};
                    }
                    target = target[key];
                });

                target[lastKey] = value;
                return ret;
            }
        }
    }
}