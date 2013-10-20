define('directives/editr', [
    'app',
    'Editr/editr'
], function (app, prettify) {

    app.directive('editr', function() {
        return {
            restrict: 'C',
            link: function(scope, element) {
            
            
                new Editr({
                    el: element,
                    path: 'editr',
                    theme: 'chrome',
                    gistProxyURL: '/proxy.gist.php',
                    callback: function(editr) {}
                });
            
            }
        };
    });

});