import angular from 'angular';
import { ngTable } from './ngTable.directive';
import { ngTableColumn } from './ngTableColumn';
import { ngTableColumnsBinding } from './ngTableColumnsBinding.directive';
import { ngTableController } from './ngTableController';
import { ngTableDynamic } from './ngTableDynamic.directive';
import { ngTableFilterConfigProvider } from './ngTableFilterConfig';
import { ngTableFilterRow } from './ngTableFilterRow.directive';
import { ngTableFilterRowController } from './ngTableFilterRowController';
import { ngTableGroupRow } from './ngTableGroupRow.directive';
import { ngTableGroupRowController } from './ngTableGroupRowController';
import { ngTablePagination } from './ngTablePagination.directive';
import { ngTableSelectFilterDs } from './ngTableSelectFilterDs.directive';
import { ngTableSorterRow } from './ngTableSorterRow.directive';
import { ngTableSorterRowController } from './ngTableSorterRowController';
import './filters/number.html';
import './filters/select.html';
import './filters/select-multiple.html';
import './filters/text.html';
import './pager.html';
import './header.html';

var module = angular.module('ngTable-browser', [])
    .directive('ngTable', ngTable)
    .factory('ngTableColumn', ngTableColumn)
    .directive('ngTableColumnsBinding', ngTableColumnsBinding)
    .controller('ngTableController', ngTableController)
    .directive('ngTableDynamic', ngTableDynamic)
    .provider('ngTableFilterConfig', ngTableFilterConfigProvider)
    .directive('ngTableFilterRow', ngTableFilterRow)
    .controller('ngTableFilterRowController', ngTableFilterRowController)
    .directive('ngTableGroupRow', ngTableGroupRow)
    .controller('ngTableGroupRowController', ngTableGroupRowController)
    .directive('ngTablePagination', ngTablePagination)
    .directive('ngTableSelectFilterDs', ngTableSelectFilterDs)
    .directive('ngTableSorterRow', ngTableSorterRow)
    .controller('ngTableSorterRowController', ngTableSorterRowController);

export { module as default };