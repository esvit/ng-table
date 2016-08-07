import * as ng1 from 'angular';
import coreModule from './src/core';
import browserModule from './src/browser';

const ngTable = ng1.module('ngTable', [coreModule.name, browserModule.name]);

export { ngTable };
export * from './src/core';
export * from './src/browser';