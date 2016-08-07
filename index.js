"use strict";
var ng1 = require('angular');
var core_1 = require('./src/core');
var browser_1 = require('./src/browser');
var module = ng1.module('ngTable', [core_1.default.name, browser_1.default.name]);
exports.default = module;
