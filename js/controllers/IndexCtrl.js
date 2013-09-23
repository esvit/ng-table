define('controllers/IndexCtrl', [
    'app',
], function (app) {

    app.controller('IndexCtrl', ['$scope', '$route', 'startPulse', function($scope, $route, startPulse) {
        $scope.users = [
            {name: "Moroni", age: 50},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}
        ];

        $scope.$on('$routeChangeSuccess', function () {
            $scope.showHeader = $route.current.$$route.showHeader;
        });
        startPulse();
    }]);

});