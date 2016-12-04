import * as angular from 'angular';

import { IDefaultGetData, NgTableDefaultGetDataProvider } from './data/ngTableDefaultGetData';
import { IGroupSettings } from './grouping/groupSettings';
import { ngTableDefaultGetGroups } from './grouping/ngTableDefaultGetGroups';
// import { NgTableDefaultGetDataProvider, IDefaultGetData } from './data';
// import { IGroupSettings, ngTableDefaultGetGroups } from './grouping';
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

export { IDefaults } from './ngTableDefaults';
export * from './ngTableEventsChannel';
// note: having to export as individual modules rather than `*` to avoid webpack (bug?) causing
//       the final bundle to throw an error `Cannot redefine property: NgTableParams`
export { InternalTableParams, NgTableParams, IParamValues } from './ngTableParams';
export { ISettings } from './ngTableSettings';
export { IDataSettings } from './data/dataSettings';
export { IGetDataFunc, IInterceptableGetDataFunc } from './data/getData';
export { IInterceptor } from './data/interceptor';
export { IDefaultGetData, NgTableDefaultGetDataProvider } from './data/ngTableDefaultGetData';
export { DataResult, DataResults, IDataRowGroup, GroupedDataResults } from './data/results';
export { FilterComparator, IFilterComparatorFunc } from './filtering/filterComparator';
export { IFilterValues, IFilterFunc } from './filtering/filterFunc';
export { FilterLayout, IFilterSettings } from './filtering/filterSettings';
export { IGetGroupFunc } from './grouping/getGroup';
export { Grouping, GroupSort, IGroupingFunc, IGroupValues } from './grouping/groupingFunc';
export { IGroupSettings } from './grouping/groupSettings';
export { IPageButton } from './paging';
export { SortDirection, ISortingValues} from './sorting';
export { ngTableCoreModule };

// todo: replace individual exports above with commented out exports below once webpack produces a working bundle
//       to track the progress of this, see https://github.com/webpack/webpack/issues/3415
/*
export * from './data';
export * from './filtering';
export * from './grouping/publicExports';
export * from './paging';
export * from './sorting';
 */