import { Grouping, IGroupingFunc } from './grouping';
import { ISortingValues } from './sorting';

/**
 * @private
 */
export function convertSortToOrderBy(sorting: ISortingValues) {
    const result: string[] = [];
    for (let column in sorting) {
        result.push((sorting[column] === "asc" ? "+" : "-") + column);
    }
    return result;
}

/**
 * @private
 */
export function isGroupingFun(val: string | Grouping<any>): val is IGroupingFunc<any> {
    return typeof val === 'function'
}