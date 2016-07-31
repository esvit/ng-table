import angular from 'angular';
import coreModule from './src/core';
import browserModule from './src/browser';

var module = angular.module('ngTable', [coreModule.name, browserModule.name]);

export { module as default };