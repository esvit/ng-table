import * as ng from 'angular';
import { ngTable } from 'ng-table';
import { myTableComponent } from './src/my-table.component';

ng.module('demo-app', [ngTable.name])
    .component('myTable', myTableComponent);

ng.element(document).ready(() => {
    ng.bootstrap(document, ["demo-app"]);
});