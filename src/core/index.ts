import * as angular from 'angular';
import { NgTableDefaultGetDataProvider, IDefaultGetData } from './data';
import { IGroupSettings, ngTableDefaultGetGroups } from './grouping';
import { ngTableDefaults, IDefaults } from './ngTableDefaults';
import { NgTableSettings, ISettings } from './ngTableSettings';
import { NgTableParams } from './ngTableParams';
import { NgTableEventsChannel } from './ngTableEventsChannel';

const ngTableCoreModule = angular.module('ngTable-core', [])
    .provider('ngTableDefaultGetData', NgTableDefaultGetDataProvider)
    .factory('ngTableDefaultGetGroups', ngTableDefaultGetGroups)
    .value('ngTableDefaults',ngTableDefaults)
    .service('ngTableEventsChannel', NgTableEventsChannel)
    .service('ngTableSettings', NgTableSettings)
    .run(NgTableParams.init);

// note: if you are using ES6 or typescript prefer:
// import { NgTableParams } from 'ng-table';
ngTableCoreModule.value('NgTableParams', NgTableParams)

export { ngTableCoreModule };

export { IDefaults } from './ngTableDefaults';
export * from './ngTableEventsChannel';
export { ISettings } from './ngTableSettings';
export * from './ngTableParams';
export * from './data';
export * from './filtering';
export * from './grouping/publicExports';
export * from './paging';
export * from './sorting';
