import { IQService } from 'angular';
import * as ng1 from 'angular';
import { convertSortToOrderBy, isGroupingFun } from '../util';
import { NgTableParams,  } from '../ngTableParams';
import { IDataRowGroup, IDefaultGetData, IGetDataFunc } from '../data';
import { IGetGroupFunc, Grouping, IGroupingFunc } from './';
import { ISortingValues } from '../sorting';

ngTableDefaultGetGroups.$inject = ['$q', 'ngTableDefaultGetData'];

/**
 * Implementation of the {@link IDefaultGetData IDefaultGetData} interface
 * 
 * @ngdoc service
 */
export function ngTableDefaultGetGroups<T>($q: IQService, ngTableDefaultGetData: IDefaultGetData<IDataRowGroup<T>>): IGetGroupFunc<T> {

    return getGroups;

    function getGroups(params: NgTableParams<T>) {

        var group = params.group();
        var groupFn: IGroupingFunc<T>;
        var sortDirection: string = undefined;
        if (isGroupingFun(group)) {
            groupFn = group;
            sortDirection = group.sortDirection;
        } else {
            // currently support for only one group implemented
            var groupField = Object.keys(group)[0];
            sortDirection = group[groupField];
            groupFn = item => {
                return getPath(item, groupField);
            };
        }

        var settings = params.settings();
        var originalDataOptions = settings.dataOptions;
        settings.dataOptions = { applyPaging: false };
        const getData: IGetDataFunc<T> = settings.getData;
        var gotData = $q.when(getData(params));
        return gotData.then(data => {
            var groups: { [name: string]: IDataRowGroup<T> } = {};
            ng1.forEach(data, item => {
                var groupName = groupFn(item);
                groups[groupName] = groups[groupName] || {
                    data: [],
                    $hideRows: !settings.groupOptions.isExpanded,
                    value: groupName
                };
                groups[groupName].data.push(item);
            });
            var result: IDataRowGroup<T>[] = [];
            for (var i in groups) {
                result.push(groups[i]);
            }
            if (sortDirection) {
                var orderByFn = ngTableDefaultGetData.getOrderByFn();
                var orderBy = convertSortToOrderBy({
                    value: sortDirection
                });
                result = orderByFn(result, orderBy);
            }

            return ngTableDefaultGetData.applyPaging(result, params);
        }).finally(() => {
            // restore the real options
            settings.dataOptions = originalDataOptions;
        });
    }
}


/**
 * @private
 */
function getPath(obj: { [name: string]: any }, ks: string | string[]): any {
    // origianl source https://github.com/documentcloud/underscore-contrib

    let keys: string[];
    if (typeof ks === "string") {
        keys = ks.split(".");
    } else {
        keys = ks;
    }

    // If we have reached an undefined property
    // then stop executing and return undefined
    if (obj === undefined) return void 0;

    // If the path array has no more elements, we've reached
    // the intended property and return its value
    if (keys.length === 0) return obj;

    // If we still have elements in the path array and the current
    // value is null, stop executing and return undefined
    if (obj === null) return void 0;

    return getPath(obj[keys[0]], keys.slice(1));
}