/**
 * ngTable: Table + Angular JS
 *
 * @author Bruno Oliveira <321.bruno@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTablePaginationScroll
 * @restrict A
 */
app.directive('ngTablePaginationScroll', [
    '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    'use strict';
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, elem, attrs){
            var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
            $window = angular.element($window);
            scrollDistance = 0;
            if (attrs.infiniteScrollDistance != null) {
                scope.$watch(attrs.infiniteScrollDistance, function(value) {
                    return scrollDistance = parseInt(value, 10);
                });
            }
            scrollEnabled = true;
            checkWhenEnabled = false;
            if (attrs.infiniteScrollDisabled != null) {
                scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                    scrollEnabled = !value;
                    if (scrollEnabled && checkWhenEnabled) {
                        checkWhenEnabled = false;
                        return handler();
                    }
                });
            }
            handler = function() {
                var elementBottom, remaining, shouldScroll, windowBottom, documentInfo;
                documentInfo = $window[0].document.body;
                windowBottom = document.documentElement.clientHeight + documentInfo.scrollTop;
                elementBottom = elem[0].offsetTop + elem[0].scrollHeight;
                remaining = elementBottom - windowBottom;
                shouldScroll = remaining <= document.documentElement.clientHeight * scrollDistance;
                if (shouldScroll && scrollEnabled && documentInfo.scrollTop) {
                    var total = scope.params.total();
                    var qtyItems = scope.params.data.length;
                    var qtyPages = Math.ceil(total / scope.params.count());
                    var pageCurrent = scope.params.page();
                    var pageNew = pageCurrent + 1;
                    if(qtyItems<=total && pageNew<=qtyPages){
                            scope.params.page( scope.params.page() + 1 );
                            scope.$apply(scope);
                    }
                } else if (shouldScroll) {
                    return checkWhenEnabled = true;
                }
            };
            var promise = null;
            $window.on('scroll', handler);
            scope.$on('$destroy', function() {
                return $window.off('scroll', handler);
            });
            return $timeout((function() {
                if (attrs.infiniteScrollImmediateCheck) {
                    if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                        return handler();
                    }
                } else {
                    return handler();
                }
            }), 300);
        }
    };
}]);