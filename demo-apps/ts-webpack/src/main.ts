import * as ng1 from 'angular';
import { ngTableModule } from 'ng-table';

import './shared/site.scss'

import { appRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyTableComponent } from './my-table/my-table.component';
import { GroupedTableComponent } from './grouped-table/grouped-table.component';

ng1.module('demo-app', [ngTableModule.name, appRoutingModule.name])
    .component('appRoot', new AppComponent())
    .component('myTable', new MyTableComponent())
    .component('groupedTable', new GroupedTableComponent());