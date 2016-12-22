import * as ng1 from 'angular';
import * as _ from 'lodash';
import { NgTableFilterConfig, NgTableFilterConfigProvider, FilterConfigValues, ngTableBrowserModule } from '../../src/browser';

describe('ngTableFilterConfig', () => {
    let ngTableFilterConfig: NgTableFilterConfig,
        ngTableFilterConfigProvider: NgTableFilterConfigProvider;

    beforeAll(() => expect(ngTableBrowserModule).toBeDefined());
    beforeEach(ng1.mock.module("ngTable-browser"));
    beforeEach(() => {
        ng1.mock.module((_ngTableFilterConfigProvider_: NgTableFilterConfigProvider) => {
            ngTableFilterConfigProvider = _ngTableFilterConfigProvider_;
            ngTableFilterConfigProvider.resetConfigs();
        });
    });

    beforeEach(inject((_ngTableFilterConfig_: NgTableFilterConfig) => {
        ngTableFilterConfig = _ngTableFilterConfig_;
    }));


    it('should return defaults', () => {
        ngTableFilterConfig = ngTableFilterConfigProvider.$get();

        expect(ngTableFilterConfig.config).toEqualPlainObject({
            defaultBaseUrl: 'ng-table/filters/',
            defaultExt: '.html',
            aliasUrls: {}
        });
    })


    describe('setConfig', () => {

        let allSettings: FilterConfigValues
        beforeEach(() => {
            allSettings = new FilterConfigValues();
        });

        it('should set aliasUrls supplied', () => {

            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'text': 'custom/url/custom-text.html'
                }
            });
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.config.aliasUrls['text']).toBe('custom/url/custom-text.html');
        });

        it('should merge aliasUrls with previous values', () => {
            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'text': 'custom/url/text.html'
                }
            });

            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'number': 'custom/url/custom-number.html'
                }
            });

            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.config.aliasUrls['text']).toBe('custom/url/text.html');
            expect(ngTableFilterConfig.config.aliasUrls['number']).toBe('custom/url/custom-number.html');
        });

        it('undefined values in new settings should be ignored', () => {
            const newSettings = _.mapValues(allSettings, _.constant(undefined));
            // when
            ngTableFilterConfigProvider.setConfig(newSettings);
            // then
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.config).toEqualPlainObject(allSettings);
        });

        it('undefined nested values in new settings should be ignored', () => {
            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'text': 'custom/url/text.html'
                }
            });

            // cheating the compiler here and allowing an undefined value
            // to be supplied (oridinarily this would be disallowed by the compiler)
            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'text': undefined as any
                }
            });

            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.config.aliasUrls['text']).toBe('custom/url/text.html');
        });
    });

    describe('getTemplateUrl', () => {

        it('explicit url supplied', () => {
            let explicitUrl = 'path/to/my-template.html';
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.getTemplateUrl(explicitUrl)).toBe(explicitUrl);
        });

        it('inbuilt alias supplied', () => {
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.getTemplateUrl('text')).toBe('ng-table/filters/text.html');
        });

        it('custom alias supplied', () => {
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.getTemplateUrl('my-template')).toBe('ng-table/filters/my-template.html');
        });

        it('alias registered with custom url', () => {
            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'my-template': 'custom/url/my-template.html'
                }
            });
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.getTemplateUrl('my-template')).toBe('custom/url/my-template.html');
        });

        it('inbuilt alias registered with custom url', () => {
            ngTableFilterConfigProvider.setConfig({
                aliasUrls: {
                    'text': 'custom/url/custom-text.html'
                }
            });
            ngTableFilterConfig = ngTableFilterConfigProvider.$get();
            expect(ngTableFilterConfig.getTemplateUrl('text')).toBe('custom/url/custom-text.html');
        });
    });
});