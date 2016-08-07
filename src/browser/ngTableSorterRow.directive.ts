/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

var templateUrl = require('./sorterRow.html');

ngTableSorterRow.$inject = [];

function ngTableSorterRow(){
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableSorterRowController'
    };
    return directive;
}

export { ngTableSorterRow };