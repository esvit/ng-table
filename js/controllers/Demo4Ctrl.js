define('controllers/Demo4Ctrl', [
    'app',
], function (app) {

    app.controller('Demo4Ctrl', ['$scope', '$filter', 'ngTableParams', function($scope, $filter, ngTableParams) {
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
                count: 10,          // count per page
                filter: {
                    name: 'M'       // initial filter
                }
            });
            
            $scope.$watch('tableParams', function(params) {
                // use build-in angular filter
                var orderedData = params.filter ? 
                                    $filter('filter')(data, params.filter) :
                                    data;

                params.total = orderedData.length; // set total for recalc pagination
                $scope.users = orderedData.slice((params.page - 1) * params.count, params.page * params.count);
            }, true);
        }]);

});