/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IFilterFilter, IFilterOrderBy, IFilterService, IPromise, IServiceProvider} from 'angular';
import { IFilterFunc } from '../filtering';
import { NgTableParams } from '../ngTableParams';


/**
 * A default implementation of the getData function that will apply the `filter`, `orderBy` and
 * paging values from the {@link NgTableParams} instance supplied to the data array supplied.
 *
 * A call to this function will:
 * - return the resulting array
 * - assign the total item count after filtering to the `total` of the `NgTableParams` instance supplied
 */
export interface IDefaultGetData<T> {
    (data: T[], params: NgTableParams<T>): T[];
    /**
     * Convenience function that this service will use to apply paging to the data rows.
     *
     * Returns a slice of rows from the `data` array supplied and sets the `NgTableParams.total()`
     * on the `params` instance supplied to `data.length`
     */
    applyPaging(data: T[], params: NgTableParams<any>): T[],
    /**
     * Returns a reference to the function that this service will use to filter data rows
     */
    getFilterFn(params: NgTableParams<T>): IFilterFunc<T>,
    /**
     * Returns a reference to the function that this service will use to sort data rows
     */
    getOrderByFn(params?: NgTableParams<T>): IFilterOrderBy
}

/**
 * Implementation of the {@link IDefaultGetDataProvider} interface
 */
export class NgTableDefaultGetDataProvider implements IServiceProvider {
    /**
     * The name of a angular filter that knows how to apply the values returned by
     * `NgTableParams.filter()` to restrict an array of data.
     * (defaults to the angular `filter` filter service)
     */
    filterFilterName = 'filter';
    /**
     * The name of a angular filter that knows how to apply the values returned by
    * `NgTableParams.orderBy()` to sort an array of data.
    * (defaults to the angular `orderBy` filter service)
    */
    sortingFilterName = 'orderBy';
    $get: ($filter: IFilterService) => IDefaultGetData<any>;
    constructor() {
        var provider = this;
        this.$get = ngTableDefaultGetData;

        ngTableDefaultGetData.$inject = ['$filter'];

        function ngTableDefaultGetData<T>($filter: IFilterService): IDefaultGetData<T> {

            var defaultDataOptions = { applyFilter: true, applySort: true, applyPaging: true };

            (getData as IDefaultGetData<T>).applyPaging = applyPaging;
            (getData as IDefaultGetData<T>).getFilterFn = getFilterFn;
            (getData as IDefaultGetData<T>).getOrderByFn = getOrderByFn;

            return getData as IDefaultGetData<T>;

            function getFilterFn(params: NgTableParams<T>): IFilterFunc<T> {
                var filterOptions = params.settings().filterOptions;
                if (ng1.isFunction(filterOptions.filterFn)) {
                    return filterOptions.filterFn;
                } else {
                    return $filter<IFilterFilter>(filterOptions.filterFilterName || provider.filterFilterName);
                }
            }

            function getOrderByFn(params: NgTableParams<T>) {
                return $filter<IFilterOrderBy>(provider.sortingFilterName);
            }

            function applyFilter(data: T[], params: NgTableParams<T>): T[] {
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

            function applyPaging(data: T[], params: NgTableParams<any>): T[] {
                var pagedData = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(data.length); // set total for recalc pagination
                return pagedData;
            }

            function applySort(data: T[], params: NgTableParams<T>): T[] {
                var orderBy = params.orderBy();
                var orderByFn = getOrderByFn(params);
                return orderBy.length ? orderByFn(data, orderBy) : data;
            }

            function getData(data: T[], params: NgTableParams<T>): T[] {
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