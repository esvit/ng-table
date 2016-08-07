import ng from 'angular';
import { ngTable } from 'ng-table';
import './shared/site.scss'
import { myTableComponent } from './my-table/my-table.component';

ng.module('demo-app', [ngTable.name])
    .component('myTable', myTableComponent);