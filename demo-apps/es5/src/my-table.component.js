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

        this.tableParams = new NgTableParams({
            page: 1,
            count: 7,
            sort: { name: 'asc' }
        }, {
                // for server-side data load
                // getData: function (params) {
                //     params.total(data.length);
                //     return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                // }

                // for clientside data
                dataset: data
            });
    }

})();