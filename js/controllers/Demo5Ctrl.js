define('controllers/Demo5Ctrl', [
    'app',
], function (app) {

    app.controller('Demo5Ctrl', ['$scope', '$location', '$filter', 'ngTableParams', function($scope, $location, $filter, ngTableParams) {
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

            $scope.tableParams = new ngTableParams(
                // merge default params with url
                angular.extend({
                    page: 1,            // show first page
                    total: data.length, // length of data
                    count: 10,          // count per page
                    sorting: {
                        name: 'asc'     // initial sorting
                    }
                },
                $location.search())
            );
            
            $scope.$watch('tableParams', function(params) {
                $location.search(params.url()); // put params in url

                // use build-in angular filter
                var orderedData = params.sorting ? 
                                    $filter('orderBy')(data, params.orderBy()) :
                                    data;
 
                $scope.users = orderedData.slice((params.page - 1) * params.count, params.page * params.count);
            }, true);
        }]);

});