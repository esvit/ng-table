import { IPromise } from 'angular';
import { NgTableParams } from '../ngTableParams';

/**
 * Signature of a function that will called whenever {@link NgTableParams} requires to load
 * data rows into the table.
 * @param params the table requesting the data rows
 */
export interface GetDataFunc<T> {
    (params: NgTableParams<T>): T[] | IPromise<T[]>;
}

/**
 * Variation of the {@link GetDataFunc} function signature that allows for flexibility for
 * the shape of the return value.
 * Typcially you will use this function signature when you want to configure {@link NgTableParams}
 * with interceptors that will return the final data rows array.
 */
export interface InterceptableGetDataFunc<T> {
    <TResult>(params: NgTableParams<T>): TResult;
}