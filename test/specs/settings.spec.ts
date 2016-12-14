import * as ng1 from 'angular';
import * as _ from 'lodash';
import { areFunctions, areFunctionsEqual } from '../util/jasmine-extensions';
import {
    DataSettings, FilterSettings, IGetDataFunc, IGetGroupFunc,
    GroupSettings, SettingsPartial, Settings, ngTableCoreModule
} from '../../src/core';
import { NgTableSettings } from '../../src/core/ngTableSettings'


describe('NgTableSettings', () => {

    let ngTableSettings: NgTableSettings

    beforeAll(() => expect(ngTableCoreModule).toBeDefined());

    let defaultOverrides: SettingsPartial<any>;
    let standardSettings: SettingsPartial<any>;

    beforeEach(ng1.mock.module("ngTable-core"));

    beforeEach(() => {

        jasmine.addCustomEqualityTester(areFunctions);

        defaultOverrides = {};

        ng1.mock.module(($provide: ng1.auto.IProvideService) => {
            $provide.value('ngTableDefaults', {
                settings: defaultOverrides
            })
        });

        const fakeGetData = () => { };
        const fakeGetGroups = () => { };
        standardSettings = {
            $loading: false,
            dataset: undefined,
            total: 0,
            dataOptions: {
                applyFilter: true,
                applyPaging: true,
                applySort: true
            },
            debugMode: false,
            defaultSort: 'desc',
            counts: [10, 25, 50, 100],
            getData: fakeGetData as any,
            getGroups: fakeGetGroups as any,
            interceptors: [],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator: 'span',
            filterOptions: {
                filterComparator: undefined,
                filterDelay: 500,
                filterDelayThreshold: 10000,
                filterFilterName: undefined,
                filterFn: undefined,
                filterLayout: 'stack'
            },
            groupOptions: {
                defaultSort: 'asc',
                isExpanded: true
            }
        };
    });

    beforeEach(inject((_ngTableSettings_: NgTableSettings) => {
        ngTableSettings = _ngTableSettings_;
    }));

    it('should be injectable', () => {
        expect(ngTableSettings).toBeDefined();
    });

    describe('createDefaults', () => {

        it('should return standard defaults', () => {
            const actual = ngTableSettings.createDefaults();
            expect(actual).toEqualPlainObject(standardSettings);
        });

        it('should merge setting overrides with standard defaults', () => {
            const expected = standardSettings;
            expected.defaultSort = defaultOverrides.defaultSort = 'asc';
            expected.counts = defaultOverrides.counts = [50];

            const actual = ngTableSettings.createDefaults();
            expect(actual).toEqualPlainObject(expected);
        });
    });

    describe('merge', () => {

        function assertShallowClonedArray(actual: any[], expected: any[]) {
            expect(actual).toEqual(expected);
            expect(actual).not.toBe(expected);
            expect(actual[0]).toBe(expected[0]);
        }

        let allSettings: Settings<any>;
        beforeEach(() => {
            allSettings = new Settings();
        });

        it('should not modify arguments supplied', () => {
            const newSettings: SettingsPartial<any> = {
                filterOptions: {
                    filterDelay: 20
                }
            };
            const originalNewSettings = { ...newSettings, filterOptions: { ... newSettings.filterOptions } };

            const actual = ngTableSettings.merge(allSettings, newSettings);
            expect(actual).not.toBe(allSettings);
            expect(allSettings.filterOptions.filterDelay).not.toEqual(20);
            expect(newSettings).toEqual(originalNewSettings);
        });

        it('should merge shallow clone of new filterOptions', () => {
            const newSettings: SettingsPartial<any> = {
                filterOptions: {}
            };
            const expected = new Settings();
            expected.filterOptions.filterDelay = newSettings.filterOptions.filterDelay = 20;

            const actual = ngTableSettings.merge(allSettings, newSettings);
            expect(actual).toEqualPlainObject(expected);
        });

        it('undefined values in new settings should be ignored', () => {
            const newSettings = _.mapValues(allSettings, _.constant(undefined));

            const actual = ngTableSettings.merge(allSettings, newSettings);
            expect(actual).toEqualPlainObject(allSettings);
        });

        it('undefined nested values in new settings should be ignored', () => {
            const newSettings: SettingsPartial<any> = {
                filterOptions: _.mapValues(allSettings.filterOptions, _.constant(undefined)),
                dataOptions: _.mapValues(allSettings.dataOptions, _.constant(undefined)),
                groupOptions: _.mapValues(allSettings.groupOptions, _.constant(undefined))
            };

            const actual = ngTableSettings.merge(allSettings, newSettings);
            expect(actual).toEqualPlainObject(allSettings);
        });

        it('interceptor array should be shallow cloned', () => {
            const interceptor = { response: () => { } };
            const newSettings: SettingsPartial<any> = {
                interceptors: [interceptor]
            };

            const actual = ngTableSettings.merge(allSettings, newSettings);
            assertShallowClonedArray(actual.interceptors, newSettings.interceptors);
        });

        it('counts array should be shallow cloned', () => {
            const newSettings: SettingsPartial<any> = {
                counts: [10, 15]
            };

            const actual = ngTableSettings.merge(allSettings, newSettings);
            assertShallowClonedArray(actual.counts, newSettings.counts);
        });

        it('dataset array reference should be copied', () => {
            const item = {};
            const dataset = [item];
            const newSettings: SettingsPartial<any> = {
                dataset: dataset
            };

            const actual = ngTableSettings.merge(allSettings, newSettings);
            expect(actual.dataset).toBe(dataset);
            expect(actual.dataset[0]).toBe(item);
        });

        it('functions references should be copied', () => {
            const fakeGetData = () => { };
            const fakeGetGroups = () => { };
            const fakeComparator = () => { };
            const fakeFilterFn = () => { };
            const newSettings: SettingsPartial<any> = {
                getData: fakeGetData,
                getGroups: fakeGetGroups as any,
                filterOptions: {
                    filterComparator: fakeComparator as any,
                    filterFn: fakeFilterFn as any
                }
            };

            const actual = ngTableSettings.merge(allSettings, newSettings);
            expect(actual.getData).toBe(fakeGetData);
            expect(actual.filterOptions.filterComparator).toBe(fakeComparator);
            expect(actual.filterOptions.filterFn).toBe(fakeFilterFn);
        });
    })
});