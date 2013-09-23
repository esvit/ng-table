define('controllers/Demo6Ctrl', [
    'app',
], function (app) {

    app.controller('Demo6Ctrl', ['$scope', '$timeout', '$resource', 'ngTableParams', function($scope, $timeout, $resource, ngTableParams) {
            var Api = $resource('/data');

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                total: 0,           // length of data
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            });

            $scope.$watch('tableParams', function(params) {
                $scope.loading = true;
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                    $scope.loading = false;
                    // set new data
                    $scope.users = data.result;

                    // update table params
                    $scope.tableParams.total = data.total;
                    }, 500);
                });
            }, true);
        }]);

});