import * as ng1 from 'angular';
import { ngTableCoreModule } from './src/core';
import { ngTableBrowserModule } from './src/browser';

const ngTableModule = ng1.module('ngTable', [ngTableCoreModule.name, ngTableBrowserModule.name]);

export { ngTableModule };
export { IDefaults } from './src/core/ngTableDefaults';
export * from './src/core/ngTableEventsChannel';
// note: having to export as individual modules rather than `*` to avoid webpack (bug?)
// causing the final bundle to throw an error `Cannot redefine property: NgTableParams`
// todo: replace with commented out export below once webpack produces a working bundle
export { InternalTableParams, NgTableParams, IParamValues } from './src/core/ngTableParams';
// export * from './src/core/ngTableParams';
export * from './src/core/data';
export * from './src/core/filtering';
export * from './src/core/grouping/publicExports';
export * from './src/core/paging';
export * from './src/core/sorting';
export * from './src/browser';