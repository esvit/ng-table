describe('ngTableFilterConfig', function () {
    var ngTableFilterConfig,
        ngTableFilterConfigProvider;

    beforeEach(function () {
        // Initialize the service provider
        // by injecting it to a fake module's config block
        var fakeModule = angular.module('test.config', function () {});
        fakeModule.config( function (_ngTableFilterConfigProvider_) {
            ngTableFilterConfigProvider = _ngTableFilterConfigProvider_;
        });
        // Initialize test.app injector
        module('ngTable', 'test.config');
    });

    beforeEach(inject(function (_ngTableFilterConfig_) {
        ngTableFilterConfig = _ngTableFilterConfig_;
    }));

    describe('getTemplateUrl', function(){

        it('explicit url supplied', function(){
            var explicitUrl = 'path/to/my-template.html';
            expect(ngTableFilterConfig.getTemplateUrl(explicitUrl)).toBe(explicitUrl);
        });

        it('inbuilt alias supplied', function(){
            expect(ngTableFilterConfig.getTemplateUrl('text')).toBe('ng-table/filters/text.html');
        });

        it('custom alias supplied', function(){
            expect(ngTableFilterConfig.getTemplateUrl('my-template')).toBe('ng-table/filters/my-template.html');
        });

        it('alias registered with custom url', function(){
            ngTableFilterConfigProvider.setConfig({ aliasUrls: {
                'my-template': 'custom/url/my-template.html'
            }});
            expect(ngTableFilterConfig.getTemplateUrl('my-template')).toBe('custom/url/my-template.html');
        });

        it('inbuilt alias registered with custom url', function(){
            ngTableFilterConfigProvider.setConfig({ aliasUrls: {
                'text': 'custom/url/custom-text.html'
            }});
            expect(ngTableFilterConfig.getTemplateUrl('text')).toBe('custom/url/custom-text.html');
        });
    });
});
