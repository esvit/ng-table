import { IPromise } from 'angular';
import { NgTableParams } from '../ngTableParams'
import { DataRowGroup } from '../data'

/**
 * Signature of a function that will called whenever {@link NgTableParams} requires to group
 * the data rows for display in the table
 * @param params the table requesting the rows to be grouped
 */
export interface GetGroupFunc<T> {
    (params: NgTableParams<T>): DataRowGroup<T>[] | IPromise<DataRowGroup<T>[]>
}