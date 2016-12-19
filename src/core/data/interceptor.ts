import { NgTableParams } from '../ngTableParams'

/**
 * A custom object that can be registered with an {@link NgTableParams} instance that can be used
 * to post-process the results (and failures) returned by its `getData` function
 */
export interface Interceptor<T> {
    response?: <TData>(data: TData, params: NgTableParams<T>) => TData;
    responseError?: (reason: any, params: NgTableParams<T>) => any;
}