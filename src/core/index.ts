import * as angular from 'angular';
import { ngTableDefaultGetDataProvider } from './ngTableDefaultGetData';
import { ngTableDefaults } from './ngTableDefaults';
import { ngTableParamsFactory } from './ngTableParams';
import { ngTableEventsChannel } from './ngTableEventsChannel';

export default angular.module('ngTable-core', [])
    .provider('ngTableDefaultGetData', ngTableDefaultGetDataProvider)
    .value('ngTableDefaults',ngTableDefaults)
    .factory('NgTableParams', ngTableParamsFactory)
    .factory('ngTableEventsChannel', ngTableEventsChannel);

export * from './public-interfaces';