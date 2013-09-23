define('directives/prettyprint', [
    'app', 'prettify', 'lang-css'
], function (app, prettify) {

    app.directive('prettyprint', function() {
        return {
            restrict: 'C',
            link: function(scope, element) {
                var code = prettify.prettyPrintOne(element.html(), undefined, true);
                element.addClass('linenums').html(code);
                element.find('code').popover({
                    html: true,
                    trigger: 'hover',
                    placement: 'left'
                }).pulse();
            }
        };
    });

});