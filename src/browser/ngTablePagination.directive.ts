/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

import * as ng1 from 'angular';
import { IEventsChannel, IPageButton } from '../core'
import { ITableScope } from './ngTableController';

interface IScopeExtensions {
    pages: IPageButton[]
}

ngTablePagination.$inject = ['$compile', '$document', 'ngTableEventsChannel', '$timeout'];

/**
 * Directive that renders the table pagination controls
 * @ngdoc directive
 */
export function ngTablePagination<T>($compile: ng1.ICompileService, $document: ng1.IDocumentService, ngTableEventsChannel: IEventsChannel, $timeout: ng1.ITimeoutService): ng1.IDirective {

    return {
        restrict: 'A',
        scope: {
            'params': '=ngTablePagination',
            'templateUrl': '='
        },
        replace: false,
        link: function (scope: ITableScope<T> & IScopeExtensions, element: ng1.IAugmentedJQuery/*, attrs*/) {

            ngTableEventsChannel.onAfterReloadData<T>(function (pubParams) {
                scope.pages = pubParams.generatePagesArray();
            }, scope, function (pubParams) {
                return pubParams === scope.params;
            });

            /**
             * Directive needs to know when the pages have changed so that it can reset focus
             * on the button that initiated the page change. This was necessary for accessbility.
             */
            ngTableEventsChannel.onPagesChanged<T>(function (pubParams) {
                if (pubParams.pageButtonToRefocus) {
                    $timeout(function () {
                        var theElement = ng1.element(document.querySelector('#' + pubParams.pageButtonToRefocus.getAttribute('id')))[0] as HTMLButtonElement;
                        theElement.focus();
                    });

                }
            }, scope, function (pubParams) {
                return pubParams === scope.params;
            });

            scope.$watch<string>('templateUrl', function (templateUrl) {
                if (templateUrl === undefined) {
                    return;
                }
                var template = ng1.element('<div ng-include="templateUrl"></div>', $document);
                element.append(template);
                $compile(template)(scope);
            });
        }
    };
}