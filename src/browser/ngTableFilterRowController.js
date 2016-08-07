/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
"use strict";
ngTableFilterRowController.$inject = ['$scope', 'ngTableFilterConfig'];
function ngTableFilterRowController($scope, ngTableFilterConfig) {
    $scope.config = ngTableFilterConfig;
    $scope.getFilterCellCss = function (filter, layout) {
        if (layout !== 'horizontal') {
            return 's12';
        }
        var size = Object.keys(filter).length;
        var width = parseInt((12 / size).toString(), 10);
        return 's' + width;
    };
    $scope.getFilterPlaceholderValue = function (filterDef, filterKey) {
        if (typeof filterDef === 'string') {
            return '';
        }
        else {
            return filterDef.placeholder;
        }
    };
}
exports.ngTableFilterRowController = ngTableFilterRowController;
