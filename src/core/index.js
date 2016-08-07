"use strict";
var angular = require('angular');
var ngTableDefaultGetData_1 = require('./ngTableDefaultGetData');
var ngTableDefaults_1 = require('./ngTableDefaults');
var ngTableParams_1 = require('./ngTableParams');
var ngTableEventsChannel_1 = require('./ngTableEventsChannel');
var module = angular.module('ngTable-core', [])
    .provider('ngTableDefaultGetData', ngTableDefaultGetData_1.ngTableDefaultGetDataProvider)
    .value('ngTableDefaults', ngTableDefaults_1.ngTableDefaults)
    .factory('NgTableParams', ngTableParams_1.ngTableParamsFactory)
    .factory('ngTableEventsChannel', ngTableEventsChannel_1.ngTableEventsChannel);
exports.default = module;
