import * as ng1 from 'angular';
import { ngTableModule } from 'ng-table';

import { ColumnBindingEgComponent } from './column-binding-eg.component';
import { DeclarativeTableComponent } from './declarative-table.component';
import { DynamicTableComponent } from './dynamic-table.component';
import { ColumnPickerComponent } from './column-picker.component';

import './column-binding.scss';

export const columnBindingEgModule = ng1.module('column-binding-eg', [ngTableModule.name])
    .component('columnBindingEg', new ColumnBindingEgComponent())
    .component('declarativeTable', new DeclarativeTableComponent())
    .component('dynamicTable', new DynamicTableComponent())
    .component('columnPicker', new ColumnPickerComponent());