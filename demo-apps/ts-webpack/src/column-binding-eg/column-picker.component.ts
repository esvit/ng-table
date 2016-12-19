import { IComponentOptions } from 'angular';
import { ColumnDef } from 'ng-table';

export class ColumnPickerComponent implements IComponentOptions {
    templateUrl = './column-picker.html';
    controller = ColumnPickerController;
    bindings = {
        columns: '<'
    }
}
class ColumnPickerController {
    columns: ColumnDef[];
}