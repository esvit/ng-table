define('controllers/Demo7Ctrl', [
    'app',
], function (app) {

    app.controller('Demo7Ctrl', ['$scope', '$filter', 'ngTableParams', function($scope, $filter, ngTableParams) {
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
                page: 1,   // show first page
                total: 1,  // value less than count hide pagination
                count: 5,  // count per page
                counts: [] // hide page counts control
            });
            
            $scope.$watch('tableParams', function(params) {
                // use build-in angular filter
                var orderedData = params.sorting ? 
                                    $filter('orderBy')(data, params.orderBy()) :
                                    data;
 
                $scope.users = orderedData.slice((params.page - 1) * params.count, params.page * params.count);
            }, true);
        }]);

});