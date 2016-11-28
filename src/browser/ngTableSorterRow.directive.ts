/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

const templateUrl = require('./sorterRow.html');

ngTableSorterRow.$inject = [];

/**
 * directive that renders the sorting header row for a table 
 * @ngdoc directive
 * @example
 * ```html
 * <ng-table-sorter-row></ng-table-sorter-row>
 * ```
 */
export function ngTableSorterRow(){
    const directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableSorterRowController',
        controllerAs: '$ctrl'
    };
    return directive;
}