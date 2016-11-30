import * as ng1 from 'angular';
import { ngTableModule } from 'ng-table';

import { appRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyTableComponent } from './my-table/my-table.component';
import { GroupedTableComponent } from './grouped-table/grouped-table.component';
import { columnBindingEgModule } from './column-binding-eg/column-binding-eg.module';

ng1.module('demo-app', [ngTableModule.name, appRoutingModule.name, columnBindingEgModule.name])
    .component('appRoot', new AppComponent())
    .component('myTable', new MyTableComponent())
    .component('groupedTable', new GroupedTableComponent());