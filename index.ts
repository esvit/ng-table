import * as ng1 from 'angular';
import coreModule from './src/core';
import browserModule from './src/browser';

var module = ng1.module('ngTable', [coreModule.name, browserModule.name]);

export { module as default };