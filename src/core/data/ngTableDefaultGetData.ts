/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IFilterFilter, IFilterOrderBy, IFilterService, IPromise, IServiceProvider} from 'angular';
import { FilterFunc } from '../filtering';
import { NgTableParams } from '../ngTableParams';
import { NgTableEventsChannel } from '../ngTableEventsChannel';


/**
 * A default implementation of the getData function that will apply the `filter`, `orderBy` and
 * paging values from the {@link NgTableParams} instance supplied to the data array supplied.
 *
 * A call to this function will:
 * - return the resulting array
 * - assign the total item count after filtering to the `total` of the `NgTableParams` instance supplied
 */
export interface DefaultGetData<T> {
    (data: T[] | undefined, params: NgTableParams<T>): T[];
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
    getFilterFn(params: NgTableParams<T>): FilterFunc<T>,
    /**
     * Returns a reference to the function that this service will use to sort data rows
     */
    getOrderByFn(params?: NgTableParams<T>): IFilterOrderBy
}

/**
 * Implementation of the {@link DefaultGetDataProvider} interface
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
    $get: ($filter: IFilterService, ngTableEventsChannel: NgTableEventsChannel) => DefaultGetData<any>;
    constructor() {
        const provider = this;
        this.$get = ngTableDefaultGetData;

        ngTableDefaultGetData.$inject = ['$filter', 'ngTableEventsChannel'];

        function ngTableDefaultGetData<T>($filter: IFilterService, ngTableEventsChannel: NgTableEventsChannel): DefaultGetData<T> {

            (getData as DefaultGetData<T>).applyPaging = applyPaging;
            (getData as DefaultGetData<T>).getFilterFn = getFilterFn;
            (getData as DefaultGetData<T>).getOrderByFn = getOrderByFn;

            return getData as DefaultGetData<T>;

            function getFilterFn(params: NgTableParams<T>): FilterFunc<T> {
                const filterOptions = params.settings().filterOptions;
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

                const filter = params.filter(true);
                const filterKeys = Object.keys(filter);
                const parsedFilter = filterKeys.reduce((result, key) => {
                    result = setPath(result, filter[key], key);
                    return result;
                }, {});
                const filterFn = getFilterFn(params);
                return filterFn.call(params, data, parsedFilter, params.settings().filterOptions.filterComparator);
            }

            function applyPaging(data: T[], params: NgTableParams<any>): T[] {
                const pagedData = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(data.length); // set total for recalc pagination
                return pagedData;
            }

            function applySort(data: T[], params: NgTableParams<T>): T[] {
                const orderBy = params.orderBy();
                const orderByFn = getOrderByFn(params);
                return orderBy.length ? orderByFn(data, orderBy) : data;
            }

            function getData(data: T[], params: NgTableParams<T>): T[] {
                if (data == null) {
                    return [];
                }

                const options = params.settings().dataOptions;

                const fData = options.applyFilter ? applyFilter(data, params) : data;
                ngTableEventsChannel.publishAfterDataFiltered(params, fData);

                const orderedData = options.applySort ? applySort(fData, params) : fData;
                ngTableEventsChannel.publishAfterDataSorted(params,orderedData);

                return options.applyPaging ? applyPaging(orderedData, params) : orderedData;
            }

            // Sets the value at any depth in a nested object based on the path
            // note: adapted from: underscore-contrib#setPath
            function setPath(obj: any, value: any, path: string) {
                const keys = path.split('.');
                const ret = obj;
                const lastKey = keys[keys.length - 1];
                let target = ret;

                const parentPathKeys = keys.slice(0, keys.length - 1);
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
