define('controllers/Demo1Ctrl', [
    'app',
], function (app) {

    app.controller('Demo1Ctrl', ['$scope', 'ngTableParams', function($scope, ngTableParams) {
        var data = [{name: "Moroni", age: 50},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34},
                    {name: "Tiancum", age: 43},
                    {name: "Jacob", age: 27},
                    {name: "Nephi", age: 29},
                    {name: "Enos", age: 34}];

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            total: data.length, // length of data
            count: 10           // count per page
        });
        
        $scope.$watch('tableParams', function(params) {
            $scope.users = data.slice((params.page - 1) * params.count, params.page * params.count);
        }, true);
    }]);

});