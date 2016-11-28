/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

const templateUrl = require('./groupRow.html');

ngTableGroupRow.$inject = [];

/**
 * directive that renders the group header row for a table 
 * @ngdoc directive
 * @example
 * ```html
 * <ng-table-group-row></ng-table-group-row>
 * ```
 */
export function ngTableGroupRow(){
    const directive = {
        restrict: 'E',
        replace: true,
        templateUrl: templateUrl,
        scope: true,
        controller: 'ngTableGroupRowController',
        controllerAs: '$ctrl'
    };
    return directive;
}