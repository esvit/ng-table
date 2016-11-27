import * as ng1 from 'angular';
import { ngTableModule } from 'ng-table';
import './shared/site.scss'
import { myTableComponent } from './my-table/my-table.component';

ng1.module('demo-app', [ngTableModule.name])
    .component('myTable', myTableComponent);