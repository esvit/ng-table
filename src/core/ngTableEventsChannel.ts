/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IScope } from 'angular';
import { DataResult, DefaultGetData } from './data';
import { PageButton } from './paging';
import { InternalTableParams, NgTableParams } from './ngTableParams';


/**
 * Alias for the types that can be used to filter events
 */
export type EventSelector<T> = NgTableParams<T> | EventSelectorFunc

/**
 * Signature of the event hander that is registered to receive the *afterCreated* event
 */
export interface AfterCreatedListener {
    (publisher: NgTableParams<any>): any
}
/**
 * Signature of the event hander that is registered to receive the *afterReloadData* event
 */
export interface AfterReloadDataListener<T> {
    (publisher: NgTableParams<T>, newData: DataResult<T>[], oldData: DataResult<T>[]): any
}
/**
 * Signature of the event hander that is registered to receive the *datasetChanged* event
 */
export interface DatasetChangedListener<T> {
    (publisher: NgTableParams<T>, newDataset: T[], oldDataset: T[]): any
}
/**
 * Signature of the function used to filter the events to only specific instances of 
 * {@link NgTableParams}
 */
export interface EventSelectorFunc {
    (publisher: NgTableParams<any>): boolean
}
/**
 * Signature of the event hander that is registered to receive the *pagesChanged* event
 */
export interface PagesChangedListener {
    (publisher: NgTableParams<any>, newPages: PageButton[], oldPages: PageButton[]): any
}
/**
* Signature of the event hander that is registered to receive the *afterDataFiltered* event
*/
export interface AfterDataFilteredListener<T> {
    (publisher: NgTableParams<T>, newData: DataResult<T>[] ): any
}
/**
* Signature of the event hander that is registered to receive the *afterDataSorted* event
*/
export interface AfterDataSortedListener<T> {
    (publisher: NgTableParams<T>, newData: DataResult<T>[] ): any
}

/**
 * Signature of the function used to explicitly unregister an event handler so that it stops
 * receiving notifications
 */
export interface UnregistrationFunc {
    (): void
}

/**
 * Strongly typed pub/sub for {@link NgTableParams}
 *
 * Supported events:
 *
 * * afterCreated - raised when a new instance of {@link NgTableParams} has finished being constructed
 * * afterReloadData - raised when the {@link NgTableParams} `reload` method has finished loading new data
 * * datasetChanged - raised when {@link Settings} `dataset` receives a new data array
 * * pagesChanged - raised when a new pages array has been generated
 */
export interface NgTableEventsChannel {
    /**
     * Subscribe to receive notification whenever a new `NgTableParams` instance has finished being constructed.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterCreated(listener: AfterCreatedListener, scope: IScope, eventFilter?: EventSelectorFunc): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new `NgTableParams` instance has finished being constructed.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterCreated(listener: AfterCreatedListener, eventFilter?: EventSelectorFunc): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the `reload` method of an `NgTableParams` instance has successfully executed
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterReloadData<T>(listener: AfterReloadDataListener<T>, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the `reload` method of an `NgTableParams` instance has successfully executed
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterReloadData<T>(listener: AfterReloadDataListener<T>, eventFilter?: EventSelector<T>): UnregistrationFunc;

    /**
     * Subscribe to receive notification whenever a new data rows *array* is supplied as a `settings` value to a `NgTableParams` instance.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onDatasetChanged<T>(listener: DatasetChangedListener<T>, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new data rows *array* is supplied as a `settings` value to a `NgTableParams` instance.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onDatasetChanged<T>(listener: DatasetChangedListener<T>, eventFilter?: EventSelector<T>): UnregistrationFunc;

    /**
     * Subscribe to receive notification whenever the paging buttons for an `NgTableParams` instance change
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onPagesChanged<T>(listener: PagesChangedListener, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the paging buttons for an `NgTableParams` instance change
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onPagesChanged<T>(listener: PagesChangedListener, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance filters data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataFiltered<T>(listener: AfterDataFilteredListener<T>, scope: IScope, eventFilter?: EventSelector<T> ): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance filters data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataFiltered<T>(listener: AfterDataFilteredListener<T>, eventFilter?: EventSelector<T> ): UnregistrationFunc; 
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance orders data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataSorted<T>(listener: AfterDataSortedListener<T>, scope: IScope, eventFilter?: EventSelector<T> ): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance orders data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataSorted<T>(listener: AfterDataSortedListener<T>, eventFilter?: EventSelector<T> ): UnregistrationFunc;


    publishAfterCreated<T>(publisher: NgTableParams<T>): void;
    publishAfterReloadData<T>(publisher: NgTableParams<T>, newData: T[], oldData: T[]): void;
    publishDatasetChanged<T>(publisher: NgTableParams<T>, newDataset: T[] | undefined, oldDataset: T[] | undefined): void;
    publishPagesChanged<T>(publisher: NgTableParams<T>, newPages: PageButton[], oldPages: PageButton[]): void;
    publishAfterDataFiltered<T>(publisher: NgTableParams<T>, newData: T[]): void;
    publishAfterDataSorted<T>(params: NgTableParams<T>, newData: T[]): void;
}

export class NgTableEventsChannel {
    static $inject = ['$rootScope'];
    constructor(private $rootScope: ng1.IRootScopeService) {
        let events = this;
        events = this.addTableParamsEvent('afterCreated', events);
        events = this.addTableParamsEvent('afterReloadData', events);
        events = this.addTableParamsEvent('datasetChanged', events);
        events = this.addTableParamsEvent('pagesChanged', events);
        events = this.addTableParamsEvent('afterDataFiltered', events);
        events = this.addTableParamsEvent('afterDataSorted', events);
    }
    private addTableParamsEvent(eventName: string, target: {}) {
        const fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
        const event = {
            ['on' + fnName]: this.createEventSubscriptionFn(eventName),
            ['publish' + fnName]: this.createPublishEventFn(eventName)
        };
        return ng1.extend(target, event);
    }
    private createPublishEventFn(eventName: string) {
        return (...args: any[]) => {
            this.$rootScope.$broadcast('ngTable:' + eventName, ...args);
        }
    }
    private createEventSubscriptionFn(eventName: string) {

        return <T>(
            handler: (...args: any[]) => void,
            eventSelectorOrScope: EventSelector<T> | ng1.IScope,
            eventSelector?: EventSelector<T>) => {

            let actualEvtSelector: (publisher: NgTableParams<any>) => boolean;
            let scope: ng1.IScope = this.$rootScope;

            if (isScopeLike(eventSelectorOrScope)) {
                scope = eventSelectorOrScope;
                actualEvtSelector = createEventSelectorFn(eventSelector);
            } else {
                actualEvtSelector = createEventSelectorFn(eventSelectorOrScope);
            }

            return scope.$on('ngTable:' + eventName, function (event: ng1.IAngularEvent, params: InternalTableParams<any>, ...eventArgs: any[]) {
                // don't send events published by the internal NgTableParams created by ngTableController
                if (params.isNullInstance) return;

                const fnArgs = [params].concat(eventArgs);
                if (actualEvtSelector.apply(this, fnArgs)) {
                    handler.apply(this, fnArgs);
                }
            });
        }

        function createEventSelectorFn<T>(eventSelector: EventSelector<T> = () => true): EventSelectorFunc {
            if (isEventSelectorFunc(eventSelector)) {
                return eventSelector
            } else {
                // shorthand for subscriber to only receive events from a specific publisher instance
                return (publisher: NgTableParams<any>) => publisher === eventSelector;
            }
        }

        function isEventSelectorFunc<T>(val: EventSelector<T>): val is (publisher: NgTableParams<any>) => boolean {
            return typeof val === 'function';
        }

        function isScopeLike(val: any): val is ng1.IScope {
            return val && typeof val.$new === 'function';
        }
    }
}