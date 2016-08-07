import * as ng1 from 'angular';
import { ngTable } from 'ng-table';
import './shared/site.scss'
import { myTableComponent } from './my-table/my-table.component';

ng1.module('demo-app', [ngTable.name])
    .component('myTable', myTableComponent);