import angular from 'angular';
import { ngTable } from './src/scripts/ngTable.directive';
import { ngTableColumn } from './src/scripts/ngTableColumn';
import { ngTableColumnsBinding } from './src/scripts/ngTableColumnsBinding.directive';
import { ngTableController } from './src/scripts/ngTableController';
import { ngTableDefaultGetDataProvider } from './src/scripts/ngTableDefaultGetData';
import { ngTableDefaults } from './src/scripts/ngTableDefaults';
import { ngTableDynamic } from './src/scripts/ngTableDynamic.directive';
import { ngTableEventsChannel } from './src/scripts/ngTableEventsChannel';
import { ngTableFilterConfigProvider } from './src/scripts/ngTableFilterConfig';
import { ngTableFilterRow } from './src/scripts/ngTableFilterRow.directive';
import { ngTableFilterRowController } from './src/scripts/ngTableFilterRowController';
import { ngTableGroupRow } from './src/scripts/ngTableGroupRow.directive';
import { ngTableGroupRowController } from './src/scripts/ngTableGroupRowController';
import { ngTablePagination } from './src/scripts/ngTablePagination.directive';
import { ngTableParamsFactory } from './src/scripts/ngTableParams';
import { ngTableSelectFilterDs } from './src/scripts/ngTableSelectFilterDs.directive';
import { ngTableSorterRow } from './src/scripts/ngTableSorterRow.directive';
import { ngTableSorterRowController } from './src/scripts/ngTableSorterRowController';

var module = angular.module('ngTable', [])
    .directive('ngTable', ngTable)
    .factory('ngTableColumn', ngTableColumn)
    .directive('ngTableColumnsBinding', ngTableColumnsBinding)
    .controller('ngTableController', ngTableController)
    .provider('ngTableDefaultGetData', ngTableDefaultGetDataProvider)
    .value('ngTableDefaults',ngTableDefaults)
    .directive('ngTableDynamic', ngTableDynamic)
    .factory('ngTableEventsChannel', ngTableEventsChannel)
    .provider('ngTableFilterConfig', ngTableFilterConfigProvider)
    .directive('ngTableFilterRow', ngTableFilterRow)
    .controller('ngTableFilterRowController', ngTableFilterRowController)
    .directive('ngTableGroupRow', ngTableGroupRow)
    .controller('ngTableGroupRowController', ngTableGroupRowController)
    .directive('ngTablePagination', ngTablePagination)
    .factory('NgTableParams', ngTableParamsFactory)
    .directive('ngTableSelectFilterDs', ngTableSelectFilterDs)
    .directive('ngTableSorterRow', ngTableSorterRow)
    .controller('ngTableSorterRowController', ngTableSorterRowController);

export { module as default };