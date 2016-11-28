/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

const templateUrl = require('./filterRow.html');

ngTableFilterRow.$inject = [];

/**
 * directive that renders the filter header row for a table 
 * @ngdoc directive
 * @example
 * ```html
 * <ng-table-filter-row></ng-table-filter-row>
 * ```
 */
export function ngTableFilterRow(){
    const directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableFilterRowController',
        controllerAs: '$ctrl'
    };
    return directive;
}