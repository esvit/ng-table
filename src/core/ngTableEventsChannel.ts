/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IEventsChannel, InternalTableParams, INgTableParams } from './public-interfaces';

ngTableEventsChannel.$inject = ['$rootScope'];

/**
 * Implementation of the {@link IEventsChannel IEventsChannel} interface
 * @ngdoc service
 */
export function ngTableEventsChannel($rootScope: ng1.IRootScopeService): IEventsChannel {

    var events = {};
    events = addTableParamsEvent('afterCreated', events);
    events = addTableParamsEvent('afterReloadData', events);
    events = addTableParamsEvent('datasetChanged', events);
    events = addTableParamsEvent('pagesChanged', events);
    return events as IEventsChannel;

    //////////

    function addTableParamsEvent(eventName: string, target: {}){
        var fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
        var event = {
            ['on' + fnName]: createEventSubscriptionFn(eventName),
            ['publish' + fnName]: createPublishEventFn(eventName)
        };
        return ng1.extend(target, event);
    }

    type EventSelector = INgTableParams<any>|((publisher: INgTableParams<any>) => boolean);

    function createEventSubscriptionFn(eventName: string){
        
        return function subscription(
            handler: (...args: any[]) => void, 
            eventSelectorOrScope: EventSelector|ng1.IScope, 
            eventSelector?: EventSelector) {

            var actualEvtSelector: (publisher: INgTableParams<any>) => boolean;
            var scope: ng1.IScope = $rootScope;

            if (isScopeLike(eventSelectorOrScope)) {
                scope = eventSelectorOrScope;
                actualEvtSelector = createEventSelectorFn(eventSelector);
            } else {
                actualEvtSelector = createEventSelectorFn(eventSelectorOrScope);
            }

            return scope.$on('ngTable:' + eventName, function(event: ng1.IAngularEvent, params: InternalTableParams<any>, ...eventArgs: any[]){
                // don't send events published by the internal NgTableParams created by ngTableController
                if (params.isNullInstance) return;

                var fnArgs = [params].concat(eventArgs);
                if (actualEvtSelector.apply(this, fnArgs)){
                    handler.apply(this, fnArgs);
                }
            });
        }

        function createEventSelectorFn(eventSelector: EventSelector): (publisher: INgTableParams<any>) => boolean {
            if (!eventSelector) {
                return (publisher: INgTableParams<any>) => true;
            } else if (isEventSelectorFunc(eventSelector)) {
                return eventSelector
            } else {
                // shorthand for subscriber to only receive events from a specific publisher instance
                return (publisher: INgTableParams<any>) => publisher === eventSelector;
            }
        }

        function isEventSelectorFunc(val: EventSelector): val is (publisher: INgTableParams<any>) => boolean {
            return typeof val === 'function';
        }

        function isScopeLike(val: any): val is ng1.IScope {
            return val && typeof val.$new === 'function';
        }
    }

    function createPublishEventFn(eventName: string){
        return function publish(...args: any[]){
            $rootScope.$broadcast('ngTable:' + eventName, ...args);
        }
    }
}