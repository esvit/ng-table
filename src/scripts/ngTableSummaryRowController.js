/**
 * ngTable: Table + Angular JS
 *
 * @author Szymon Drosdzol <szymon.drosdzol@gmail.com>
 * @url https://github.com/sprzedamsanki/ng-table
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .controller('ngTableSummaryRowController', ngTableSummaryRowController);

    ngTableSummaryRowController.$inject = ['$scope'];

    function ngTableSummaryRowController($scope){
        $scope.params.settings().summaries = $scope.$columns.map(function($column){
            return $column.summary;
        });
    }
})();
