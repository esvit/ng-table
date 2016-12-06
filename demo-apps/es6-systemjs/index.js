import * as ng from 'angular';
import { ngTableModule } from 'ng-table';
import { myTableComponent } from './src/my-table.component';

ng.module('demo-app', [ngTableModule.name])
    .component('myTable', myTableComponent);

ng.element(document).ready(() => {
    ng.bootstrap(document, ["demo-app"], {
        strictDi: true
    });
});