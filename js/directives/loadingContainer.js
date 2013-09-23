define('directives/loadingContainer', [
    'app',
], function (app) {

    app.directive('loadingContainer', function () {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var loadingLayer = $('<div class="loading"></div>').appendTo(element);
                $(element).addClass('loading-container');
                scope.$watch(attrs.loadingContainer, function(value) {
                    loadingLayer.toggle(value);
                });
            }
        };
    });

});