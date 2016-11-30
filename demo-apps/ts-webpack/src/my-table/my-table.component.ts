import { IComponentOptions } from 'angular';
import { NgTableParams } from 'ng-table';

import { demoData } from '../shared/demo-data';

export class MyTableComponent implements IComponentOptions {
    controller = MyTableController;
    templateUrl = './my-table.component.html';
}
class MyTableController {
    tableParams = new NgTableParams<Person>({}, {
        dataset: demoData
    });
}

interface Person {
    name: string;
    age: number;
}