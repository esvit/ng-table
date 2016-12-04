import * as angular from 'angular';
import { NgTableDefaultGetDataProvider, IDefaultGetData } from './data';
import { ngTableDefaults, IDefaults } from './ngTableDefaults';
import { NgTableSettings, ISettings } from './ngTableSettings';
import { IGroupSettings, ngTableDefaultGetGroups } from './grouping';
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

export { IDefaults };
export * from './ngTableEventsChannel';
// note: having to export as individual modules rather than `*` to avoid webpack (bug?)
// causing the final bundle to throw an error `Cannot redefine property: NgTableParams`
// todo: replace with commented out export below once webpack produces a working bundle
// export { InternalTableParams, NgTableParams, IParamValues } from './ngTableParams';
export * from './ngTableParams';
export { ISettings } from './ngTableSettings';
export * from './data';
export * from './filtering';
export * from './grouping/publicExports';
export * from './paging';
export * from './sorting';
export { ngTableCoreModule };