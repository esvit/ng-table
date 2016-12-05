import * as ng1 from 'angular';
import { ngTableCoreModule } from './src/core';
import { ngTableBrowserModule } from './src/browser';

const ngTableModule = ng1.module('ngTable', [ngTableCoreModule.name, ngTableBrowserModule.name]);

export { ngTableModule };
export * from './src/core';
export * from './src/browser';