import * as ng1 from 'angular';
import { ngTableCoreModule } from './src/core';
import { ngTableBrowserModule } from './src/browser';

const ngTableModule = ng1.module('ngTable', [ngTableCoreModule.name, ngTableBrowserModule.name]);

export { ngTableModule };


// todo: replace individual exports below with commented out export below once webpack produces a working bundle
//       to track the progress of this, see https://github.com/webpack/webpack/issues/3415

// export * from './src/core';
export { IDefaults } from './src/core/ngTableDefaults';
export * from './src/core/ngTableEventsChannel';
export { InternalTableParams, NgTableParams, IParamValues } from './src/core/ngTableParams';
export { ISettings } from './src/core/ngTableSettings';
export { IDataSettings } from './src/core/data/dataSettings';
export { IGetDataFunc, IInterceptableGetDataFunc } from './src/core/data/getData';
export { IInterceptor } from './src/core/data/interceptor';
export { IDefaultGetData, NgTableDefaultGetDataProvider } from './src/core/data/ngTableDefaultGetData';
export { DataResult, DataResults, IDataRowGroup, GroupedDataResults } from './src/core/data/results';
export { FilterComparator, IFilterComparatorFunc } from './src/core/filtering/filterComparator';
export { IFilterValues, IFilterFunc } from './src/core/filtering/filterFunc';
export { FilterLayout, IFilterSettings } from './src/core/filtering/filterSettings';
export { IGetGroupFunc } from './src/core/grouping/getGroup';
export { Grouping, GroupSort, IGroupingFunc, IGroupValues } from './src/core/grouping/groupingFunc';
export { IGroupSettings } from './src/core/grouping/groupSettings';
export { IPageButton } from './src/core/paging';
export { SortDirection, ISortingValues} from './src/core/sorting';
export { ngTableCoreModule };

export * from './src/browser';