import * as angular from 'angular';
import { ngTable } from './ngTable.directive';
import { NgTableColumn } from './ngTableColumn';
import { ngTableColumnsBinding } from './ngTableColumnsBinding.directive';
import { NgTableController } from './ngTableController';
import { ngTableDynamic } from './ngTableDynamic.directive';
import { NgTableFilterConfigProvider, NgTableFilterConfig } from './ngTableFilterConfig';
import { ngTableFilterRow } from './ngTableFilterRow.directive';
import { NgTableFilterRowController } from './ngTableFilterRowController';
import { ngTableGroupRow } from './ngTableGroupRow.directive';
import { NgTableGroupRowController } from './ngTableGroupRowController';
import { ngTablePagination } from './ngTablePagination.directive';
import { ngTableSelectFilterDs } from './ngTableSelectFilterDs.directive';
import { ngTableSorterRow } from './ngTableSorterRow.directive';
import { NgTableSorterRowController } from './ngTableSorterRowController';
import './filters/number.html';
import './filters/select.html';
import './filters/select-multiple.html';
import './filters/text.html';
import './pager.html';
import './header.html';

const ngTableBrowserModule = angular.module('ngTable-browser', [])
    .directive('ngTable', ngTable)
    .service('ngTableColumn', NgTableColumn)
    .directive('ngTableColumnsBinding', ngTableColumnsBinding)
    .controller('ngTableController', NgTableController)
    .directive('ngTableDynamic', ngTableDynamic)
    .provider('ngTableFilterConfig', NgTableFilterConfigProvider)
    .directive('ngTableFilterRow', ngTableFilterRow)
    .controller('ngTableFilterRowController', NgTableFilterRowController)
    .directive('ngTableGroupRow', ngTableGroupRow)
    .controller('ngTableGroupRowController', NgTableGroupRowController)
    .directive('ngTablePagination', ngTablePagination)
    .directive('ngTableSelectFilterDs', ngTableSelectFilterDs)
    .directive('ngTableSorterRow', ngTableSorterRow)
    .controller('ngTableSorterRowController', NgTableSorterRowController);

export * from './public-interfaces';
export { NgTableController, ngTableBrowserModule };
export * from './ngTableFilterConfig';