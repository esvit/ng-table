import * as angular from 'angular';
import { NgTableDefaultGetDataProvider, DefaultGetData } from './data';
import { GroupSettingsPartial, ngTableDefaultGetGroups } from './grouping';
import { ngTableDefaults, Defaults } from './ngTableDefaults';
import { SettingsPartial, Settings } from './ngTableSettings';
import { NgTableParams } from './ngTableParams';
import { NgTableEventsChannel } from './ngTableEventsChannel';

const ngTableCoreModule = angular.module('ngTable-core', [])
    .provider('ngTableDefaultGetData', NgTableDefaultGetDataProvider)
    .factory('ngTableDefaultGetGroups', ngTableDefaultGetGroups)
    .value('ngTableDefaults',ngTableDefaults)
    .service('ngTableEventsChannel', NgTableEventsChannel)
    .run(Settings.init)
    .run(NgTableParams.init);

// note: if you are using ES6 or typescript prefer:
// import { NgTableParams } from 'ng-table';
ngTableCoreModule.value('NgTableParams', NgTableParams)

export { ngTableCoreModule };

export { Defaults } from './ngTableDefaults';
export * from './ngTableEventsChannel';
export { SettingsPartial, Settings };
export * from './ngTableParams';
export * from './data';
export * from './filtering';
export * from './grouping/publicExports';
export * from './paging';
export * from './sorting';
