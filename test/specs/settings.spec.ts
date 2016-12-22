import * as ng1 from 'angular';
import * as _ from 'lodash';
import { areFunctions, areFunctionsEqual } from '../util/jasmine-extensions';
import {
    DataSettings, FilterSettings, GetDataFunc, GetGroupFunc,
    GroupSettings, SettingsPartial, Settings, ngTableCoreModule
} from '../../src/core';


describe('Settings', () => {

    beforeAll(() => expect(ngTableCoreModule).toBeDefined());

    let defaultOverrides: SettingsPartial<any>;
    let standardSettings: Settings<any>;

    beforeEach(ng1.mock.module('ngTable-core'));

    beforeEach(() => {

        jasmine.addCustomEqualityTester(areFunctions);

        defaultOverrides = {};

        ng1.mock.module(($provide: ng1.auto.IProvideService) => {
            $provide.value('ngTableDefaults', {
                settings: defaultOverrides
            })
        });

        // causes the run blocks defined by 'ngTable-core' to run
        // this is required to ensure the Settings class is initialized before it's first used
        inject();

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

    describe('createDefaults', () => {

        it('should return standard defaults', () => {
            const actual = Settings.createWithOverrides();
            expect(actual).toEqualPlainObject(standardSettings);
        });

        it('should merge setting overrides with standard defaults', () => {
            const expected = standardSettings;
            expected.defaultSort = defaultOverrides.defaultSort = 'asc';
            expected.counts = defaultOverrides.counts = [50];

            const actual = Settings.createWithOverrides();
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
            const originalNewSettings = { ...newSettings, filterOptions: { ...newSettings.filterOptions } };

            const actual = Settings.merge(allSettings, newSettings);
            expect(actual).not.toBe(allSettings);
            expect(allSettings.filterOptions.filterDelay).not.toEqual(20);
            expect(newSettings).toEqual(originalNewSettings);
        });

        it('should merge shallow clone of new filterOptions', () => {
            const newSettings: SettingsPartial<any> = {
                filterOptions: {}
            };
            const expected = new Settings();
            newSettings.filterOptions!.filterDelay = expected.filterOptions.filterDelay = 20;

            const actual = Settings.merge(allSettings, newSettings);
            expect(actual).toEqualPlainObject(expected);
        });

        it('undefined values for mandatory properties in new settings should be ignored', () => {
            const newSettings = _.mapValues(allSettings, _.constant(undefined));

            const actual = Settings.merge(allSettings, newSettings);
            expect(actual).toEqualPlainObject(allSettings);
        });

        it('undefined dataset (optional property) value in new settings should NOT be ignored', () => {
            const existingSettings = allSettings;
            existingSettings.dataset = [1, 2];

            const newSettings: SettingsPartial<number> = {
                dataset: undefined
            }

            const actual = Settings.merge(existingSettings, newSettings);
            expect(actual.dataset).not.toBeDefined();
        });

        it('undefined nested values in new settings should be ignored', () => {
            const newSettings: SettingsPartial<any> = {
                filterOptions: _.mapValues(allSettings.filterOptions, _.constant(undefined)),
                dataOptions: _.mapValues(allSettings.dataOptions, _.constant(undefined)),
                groupOptions: _.mapValues(allSettings.groupOptions, _.constant(undefined))
            };

            const actual = Settings.merge(allSettings, newSettings);
            expect(actual).toEqualPlainObject(allSettings);
        });

        it('interceptor array should be shallow cloned', () => {
            const interceptor = { response: () => { } };
            const newSettings: SettingsPartial<any> = {
                interceptors: [interceptor]
            };

            const actual = Settings.merge(allSettings, newSettings);
            assertShallowClonedArray(actual.interceptors, newSettings.interceptors!);
        });

        it('counts array should be shallow cloned', () => {
            const newSettings: SettingsPartial<any> = {
                counts: [10, 15]
            };

            const actual = Settings.merge(allSettings, newSettings);
            assertShallowClonedArray(actual.counts, newSettings.counts!);
        });

        it('dataset array reference should be copied', () => {
            const item = {};
            const dataset = [item];
            const newSettings: SettingsPartial<any> = {
                dataset: dataset
            };

            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.dataset).toBe(dataset);
            expect(actual.dataset![0]).toBe(item);
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

            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.getData).toBe(fakeGetData);
            expect(actual.filterOptions.filterComparator).toBe(fakeComparator);
            expect(actual.filterOptions.filterFn).toBe(fakeFilterFn);
        });

        it('should remove filterDelay when working with synchronous dataset', () => {
            const newSettings = { dataset: [1, 2, 3] };
            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.filterOptions.filterDelay).toBe(0);
        });

        it('should remove filterDelay when working with synchronous dataset (empty dataset)', () => {
            const newSettings: SettingsPartial<any> = { dataset: [] };
            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.filterOptions.filterDelay).toBe(0);
        });

        it('should not remove filterDelay when not certain whether working with synchronous dataset', () => {
            const newSettings = {
                dataset: [1, 2], getData: () => {
                    // am I sync or async?
                    return [1];
                }
            };
            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.filterOptions.filterDelay).toBe(allSettings.filterOptions.filterDelay);
        });

        it('should not remove filterDelay when dataset exceeds filterDelayThreshold', () => {
            const newSettings = { filterOptions: { filterDelayThreshold: 5 }, dataset: [, 2, 3, 4, 5, 6] };
            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.filterOptions.filterDelay).toBe(allSettings.filterOptions.filterDelay);
        });

        it('should allow filterDelay to be set explicitly', () => {
            const newSettings = { filterOptions: { filterDelay: 100 }, dataset: [1, 2] };
            const actual = Settings.merge(allSettings, newSettings);
            expect(actual.filterOptions.filterDelay).toBe(newSettings.filterOptions.filterDelay);
        });
    })
});