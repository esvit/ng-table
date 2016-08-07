"use strict";
var angular = require('angular');
var ngTable_directive_1 = require('./ngTable.directive');
var ngTableColumn_1 = require('./ngTableColumn');
var ngTableColumnsBinding_directive_1 = require('./ngTableColumnsBinding.directive');
var ngTableController_1 = require('./ngTableController');
var ngTableDynamic_directive_1 = require('./ngTableDynamic.directive');
var ngTableFilterConfig_1 = require('./ngTableFilterConfig');
var ngTableFilterRow_directive_1 = require('./ngTableFilterRow.directive');
var ngTableFilterRowController_1 = require('./ngTableFilterRowController');
var ngTableGroupRow_directive_1 = require('./ngTableGroupRow.directive');
var ngTableGroupRowController_1 = require('./ngTableGroupRowController');
var ngTablePagination_directive_1 = require('./ngTablePagination.directive');
var ngTableSelectFilterDs_directive_1 = require('./ngTableSelectFilterDs.directive');
var ngTableSorterRow_directive_1 = require('./ngTableSorterRow.directive');
var ngTableSorterRowController_1 = require('./ngTableSorterRowController');
require('./filters/number.html');
require('./filters/select.html');
require('./filters/select-multiple.html');
require('./filters/text.html');
require('./pager.html');
require('./header.html');
var module = angular.module('ngTable-browser', [])
    .directive('ngTable', ngTable_directive_1.ngTable)
    .factory('ngTableColumn', ngTableColumn_1.ngTableColumn)
    .directive('ngTableColumnsBinding', ngTableColumnsBinding_directive_1.ngTableColumnsBinding)
    .controller('ngTableController', ngTableController_1.ngTableController)
    .directive('ngTableDynamic', ngTableDynamic_directive_1.ngTableDynamic)
    .provider('ngTableFilterConfig', ngTableFilterConfig_1.ngTableFilterConfigProvider)
    .directive('ngTableFilterRow', ngTableFilterRow_directive_1.ngTableFilterRow)
    .controller('ngTableFilterRowController', ngTableFilterRowController_1.ngTableFilterRowController)
    .directive('ngTableGroupRow', ngTableGroupRow_directive_1.ngTableGroupRow)
    .controller('ngTableGroupRowController', ngTableGroupRowController_1.ngTableGroupRowController)
    .directive('ngTablePagination', ngTablePagination_directive_1.ngTablePagination)
    .directive('ngTableSelectFilterDs', ngTableSelectFilterDs_directive_1.ngTableSelectFilterDs)
    .directive('ngTableSorterRow', ngTableSorterRow_directive_1.ngTableSorterRow)
    .controller('ngTableSorterRowController', ngTableSorterRowController_1.ngTableSorterRowController);
exports.default = module;
