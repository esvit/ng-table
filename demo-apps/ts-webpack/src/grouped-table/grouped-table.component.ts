import { IComponentOptions } from 'angular';
import { NgTableParams } from 'ng-table';

import { demoData } from '../shared/demo-data';

export class GroupedTableComponent implements IComponentOptions {
    controller = GroupedTableController;
    templateUrl = './grouped-table.component.html';
}
class GroupedTableController {
    tableParams = new NgTableParams<Person>(
        {
            // initial grouping
            group: 'country'
        }, {
            dataset: demoData
        });
    static $inject = ['NgTableParams'];
}

interface Person {
    name: string;
    age: number;
    money: number;
    country: string;
}