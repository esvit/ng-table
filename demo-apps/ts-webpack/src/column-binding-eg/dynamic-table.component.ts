import { IComponentOptions, IComponentController } from 'angular';
import { DynamicTableColDef, NgTableParams } from 'ng-table';
import { Person } from '../shared';

interface ExtendedDynamicTableColDef extends DynamicTableColDef {
    field: string;
}

export class DynamicTableComponent implements IComponentOptions {
    controller = DynamicTableController;
    templateUrl = './dynamic-table..html';
    bindings = {
        data: '<'
    };
}
class DynamicTableController implements IComponentController {
    columns: ExtendedDynamicTableColDef[] = [
        { field: 'name', title: 'Name', show: true, filter: { name: 'text' }, sortable: 'name' },
        { field: 'age', title: 'Age', show: true, filter: { age: 'number' }, sortable: 'age' },
        { field: 'money', title: 'Money', show: true, filter: { money: 'number' }, sortable: 'money'  }
    ];
    data: Person[];
    tableParams = new NgTableParams<Person>({});
    $onInit() {
        this.tableParams.settings({ dataset: this.data });
    }
}