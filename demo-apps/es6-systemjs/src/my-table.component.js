import { NgTableParams } from 'ng-table';

// note: because of Firefox (v45-v48) native class syntax causes a problem in angular.
// This is not likely going to be fixed in angular as it's a bug in the browser deviating from the spec
// Therefore if you do not want a transpiler step, you will NOT be able to use class syntax
// For more details see: https://github.com/angular/angular.js/issues/14240#issuecomment-197418167

function MyTableController() {
    var data = [
        { name: "Moroni", age: 50 },
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 },
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 },
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 },
        { name: "Tiancum", age: 43 },
        { name: "Jacob", age: 27 },
        { name: "Nephi", age: 29 },
        { name: "Enos", age: 34 }
    ];

    this.tableParams = new NgTableParams({}, {
        dataset: data
    });
}

MyTableController.$inject = [];

const myTableComponent = {
    templateUrl: 'src/my-table.component.html',
    controller: MyTableController
};

export { myTableComponent };