import angular from 'angular';
import { ngTableDefaultGetDataProvider } from './ngTableDefaultGetData';
import { ngTableDefaults } from './ngTableDefaults';
import { ngTableParamsFactory } from './ngTableParams';
import { ngTableEventsChannel } from './ngTableEventsChannel';

var module = angular.module('ngTable-core', [])
    .provider('ngTableDefaultGetData', ngTableDefaultGetDataProvider)
    .value('ngTableDefaults',ngTableDefaults)
    .factory('NgTableParams', ngTableParamsFactory)
    .factory('ngTableEventsChannel', ngTableEventsChannel);

export { module as default };