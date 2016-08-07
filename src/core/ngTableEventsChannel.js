/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
var ng1 = require('angular');
ngTableEventsChannel.$inject = ['$rootScope'];
/**
 * @ngdoc service
 * @name ngTableEventsChannel
 * @description strongly typed pub/sub for `NgTableParams`
 *
 * Supported events:
 *
 * * afterCreated - raised when a new instance of `NgTableParams` has finished being constructed
 * * afterReloadData - raised when the `reload` event has finished loading new data
 * * datasetChanged - raised when `settings` receives a new data array
 * * pagesChanged - raised when a new pages array has been generated
 */
function ngTableEventsChannel($rootScope) {
    var events = {};
    events = addTableParamsEvent('afterCreated', events);
    events = addTableParamsEvent('afterReloadData', events);
    events = addTableParamsEvent('datasetChanged', events);
    events = addTableParamsEvent('pagesChanged', events);
    return events;
    //////////
    function addTableParamsEvent(eventName, target) {
        var fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
        var event = (_a = {},
            _a['on' + fnName] = createEventSubscriptionFn(eventName),
            _a['publish' + fnName] = createPublishEventFn(eventName),
            _a
        );
        return ng1.extend(target, event);
        var _a;
    }
    function createEventSubscriptionFn(eventName) {
        return function subscription(handler, eventSelectorOrScope, eventSelector) {
            var actualEvtSelector;
            var scope = $rootScope;
            if (isScopeLike(eventSelectorOrScope)) {
                scope = eventSelectorOrScope;
                actualEvtSelector = createEventSelectorFn(eventSelector);
            }
            else {
                actualEvtSelector = createEventSelectorFn(eventSelectorOrScope);
            }
            return scope.$on('ngTable:' + eventName, function (event, params) {
                var eventArgs = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    eventArgs[_i - 2] = arguments[_i];
                }
                // don't send events published by the internal NgTableParams created by ngTableController
                if (params.isNullInstance)
                    return;
                var fnArgs = [params].concat(eventArgs);
                if (actualEvtSelector.apply(this, fnArgs)) {
                    handler.apply(this, fnArgs);
                }
            });
        };
        function createEventSelectorFn(eventSelector) {
            if (!eventSelector) {
                return function (publisher) { return true; };
            }
            else if (isEventSelectorFunc(eventSelector)) {
                return eventSelector;
            }
            else {
                // shorthand for subscriber to only receive events from a specific publisher instance
                return function (publisher) { return publisher === eventSelector; };
            }
        }
        function isEventSelectorFunc(val) {
            return typeof val === 'function';
        }
        function isScopeLike(val) {
            return val && typeof val.$new === 'function';
        }
    }
    function createPublishEventFn(eventName) {
        return function publish() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            $rootScope.$broadcast.apply($rootScope, ['ngTable:' + eventName].concat(args));
        };
    }
}
exports.ngTableEventsChannel = ngTableEventsChannel;
