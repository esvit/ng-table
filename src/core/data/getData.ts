import { IPromise } from 'angular';
import { NgTableParams } from '../ngTableParams';

/**
 * Signature of a function that will called whenever {@link NgTableParams} requires to load
 * data rows into the table.
 * @param params the table requesting the data rows
 */
export interface IGetDataFunc<T> {
    (params: NgTableParams<T>): T[] | IPromise<T[]>;
}

/**
 * Variation of the {@link IGetDataFunc} function signature that allows for flexibility for
 * the shape of the return value.
 * Typcially you will use this function signature when you want to configure {@link NgTableParams}
 * with interceptors that will return the final data rows array.
 */
export interface IInterceptableGetDataFunc<T> {
    <TResult>(params: NgTableParams<T>): TResult;
}