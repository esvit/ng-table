/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { NgTableEventsChannel, IPageButton } from '../core'
import { ITableScope } from './ngTableController';

interface IScopeExtensions {
    pages: IPageButton[]
}

ngTablePagination.$inject = ['$compile', '$document', 'ngTableEventsChannel'];

/**
 * Directive that renders the table pagination controls
 * @ngdoc directive
 */
export function ngTablePagination<T>($compile: ng1.ICompileService, $document: ng1.IDocumentService, ngTableEventsChannel: NgTableEventsChannel): ng1.IDirective {

    return {
        restrict: 'A',
        scope: {
            'params': '=ngTablePagination',
            'templateUrl': '='
        },
        replace: false,
        link: function(scope: ITableScope<T> & IScopeExtensions, element: ng1.IAugmentedJQuery/*, attrs*/) {

            ngTableEventsChannel.onAfterReloadData<T>(function(pubParams) {
                scope.pages = pubParams.generatePagesArray();
            }, scope, function(pubParams){
                return pubParams === scope.params;
            });

            scope.$watch<string>('templateUrl', function(templateUrl) {
                if (templateUrl === undefined) {
                    return;
                }
                const template = ng1.element('<div ng-include="templateUrl"></div>', $document);
                element.append(template);
                $compile(template)(scope);
            });
        }
    };
}