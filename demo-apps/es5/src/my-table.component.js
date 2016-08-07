(function () {
    'use strict';

    angular.module('demo-app')
        .component('myTable', {
            templateUrl: 'src/my-table.component.html',
            controller: myTableController
        });

    myTableController.$inject = ['NgTableParams'];
    function myTableController(NgTableParams) {
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

})();