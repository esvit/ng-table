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
         .directive('ngTableSummaryRow', ngTableSummaryRow);

     ngTableSummaryRow.$inject = [];

     function ngTableSummaryRow(){
         var directive = {
             restrict: 'E',
             replace: true,
             templateUrl: 'ng-table/summaryRow.html',
             scope: true,
             controller: 'ngTableSummaryRowController'
         };
         return directive;
     }
 })();
