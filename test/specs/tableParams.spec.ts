import { IControllerService, IQService, IScope } from 'angular';
import * as ng1 from 'angular';
import * as _ from 'lodash';
import {
    DataRowGroup, DataSettings, DefaultGetData, Defaults, NgTableEventsChannel, FilterSettings,
    GroupingFunc, GroupSettings, GroupValues, InternalTableParams, NgTableParams, PageButton, ParamValues, ParamValuesPartial, SettingsPartial,
    ngTableCoreModule
} from '../../src/core';

describe('NgTableParams', () => {
    interface ScopeWithPrivates extends IScope {
        $$listenerCount: { [name: string]: number }
    }

    let scope: IScope,
        $rootScope: ScopeWithPrivates;

    beforeAll(() => expect(ngTableCoreModule).toBeDefined());

    beforeEach(ng1.mock.module("ngTable-core"));
    beforeEach(() => {
        ng1.mock.module(($provide: ng1.auto.IProvideService) => {
            $provide.decorator('ngTableDefaultGetData', createSpy);


            createSpy.$inject = ['$delegate'];
            function createSpy(ngTableDefaultGetData: DefaultGetData<any>) {
                return jasmine.createSpy('ngTableDefaultGetDataSpy', ngTableDefaultGetData).and.callThrough();
            }
        });
    });

    beforeEach(inject(($controller: IControllerService, _$rootScope_: ScopeWithPrivates) => {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));

    function createNgTableParams<T>(initialParams?: ParamValuesPartial<T>, settings?: SettingsPartial<T>): NgTableParams<T>;
    function createNgTableParams<T>(settings?: SettingsPartial<T>): NgTableParams<T>;
    function createNgTableParams<T>(settings?: any): NgTableParams<T> {
        let initialParams: ParamValuesPartial<T> | undefined;
        if (arguments.length === 2) {
            initialParams = arguments[0];
            settings = arguments[1];
        }

        settings = ng1.extend({}, settings);
        settings.filterOptions = ng1.extend({}, {
            filterDelay: 0
        }, settings.filterOptions);
        const tableParams = new NgTableParams(initialParams, settings);
        spyOn(tableParams.settings(), 'getData').and.callThrough();
        return tableParams;
    }

    it('NgTableParams should be defined', () => {
        expect(NgTableParams).toBeDefined();
    });

    describe('generatePagesArray', () => {
        it('should generate pages array using arguments supplied', () => {
            //crap
            const params = new NgTableParams<any>({});
            expect(params.generatePagesArray(1, 30, 10)).toEqual([
                { type: 'prev', number: 1, active: false },
                { type: 'first', number: 1, active: false, current: true },
                { type: 'page', number: 2, active: true, current: false },
                { type: 'last', number: 3, active: true, current: false },
                { type: 'next', number: 2, active: true }
            ] as PageButton[]);
            expect(params.generatePagesArray(2, 30, 10)).toEqual([
                { type: 'prev', number: 1, active: true },
                { type: 'first', number: 1, active: true, current: false },
                { type: 'page', number: 2, active: false, current: true },
                { type: 'last', number: 3, active: true, current: false },
                { type: 'next', number: 3, active: true }
            ] as PageButton[]);
            expect(params.generatePagesArray(2, 100, 10)).toEqual([
                { type: 'prev', number: 1, active: true },
                { type: 'first', number: 1, active: true, current: false },
                { type: 'page', number: 2, active: false, current: true },
                { type: 'page', number: 3, active: true, current: false },
                { type: 'page', number: 4, active: true, current: false },
                { type: 'page', number: 5, active: true, current: false },
                { type: 'page', number: 6, active: true, current: false },
                { type: 'page', number: 7, active: true, current: false },
                { type: 'more', active: false },
                { type: 'last', number: 10, active: true, current: false },
                { type: 'next', number: 3, active: true }
            ] as PageButton[]);
        });

        it('should use own parameter values to generate pages when no arguments supplied', () => {
            const params = new NgTableParams({ page: 2, count: 10 }, { total: 30 });

            expect(params.generatePagesArray()).toEqual([
                { type: 'prev', number: 1, active: true },
                { type: 'first', number: 1, active: true, current: false },
                { type: 'page', number: 2, active: false, current: true },
                { type: 'last', number: 3, active: true, current: false },
                { type: 'next', number: 3, active: true }
            ] as PageButton[]);

        });
    });

    it('NgTableParams `page` parameter', () => {
        let params = new NgTableParams({});

        expect(params.page()).toBe(1);
        expect(params.page(2)).toEqual(params);
        expect(params.page()).toBe(2);

        params = new NgTableParams({
            page: 3
        });
        expect(params.page()).toBe(3);
    });

    it('NgTableParams return url parameters', () => {
        const params = new NgTableParams({
            'sorting[name]': 'asc',
            'sorting[age]': 'desc',
            'filter[name]': 'test',
            'filter[age]': '20',
            'group[name]': 'asc',
            'group[age]': 'desc',
            'group[surname]': ''
        } as any);
        expect(params.url()).toEqual({
            'page': '1',
            'count': '10',
            'filter[name]': 'test',
            'filter[age]': '20',
            'sorting[age]': 'desc',  // sorting only by one column - todo: remove restriction
            'group[name]': 'asc',
            'group[age]': 'desc',
            'group[surname]': ''
        });
        expect(params.url(true)).toEqual([
            'page=1',
            'count=10',
            'filter[name]=test',
            'filter[age]=20',
            'sorting[age]=desc',  // sorting only by one column - todo: remove restriction
            'group[name]=asc',
            'group[age]=desc',
            'group[surname]='
        ]);
    });

    it('orderBy', () => {
        const params = new NgTableParams({
            sorting: { name: 'asc' }
        });

        expect(params.orderBy()).toEqual(['+name']); // for angular sorting function

        params.sorting({ name: 'desc', age: 'asc' });

        expect(params.orderBy()).toEqual(['-name', '+age']);
    });

    describe('group', () => {
        it('one group', () => {
            const params = new NgTableParams({
                group: 'role'
            }, {
                    groupOptions: { defaultSort: 'desc' }
                });

            expect(params.hasGroup()).toBe(true);
            expect(params.hasGroup('role')).toBe(true);
            expect(params.hasGroup('role', 'desc')).toBe(true);
            expect(params.group()).toEqual({ role: 'desc' });

            params.group('age');
            expect(params.hasGroup('age', 'desc')).toBe(true);
            expect(params.group()).toEqual({ age: 'desc' });

            params.group('age', 'asc');
            expect(params.hasGroup('age', 'asc')).toBe(true);
            expect(params.group()).toEqual({ age: 'asc' });
        });

        it('one group (nested property)', () => {
            const params = new NgTableParams({
                group: 'details.personal.age'
            }, {
                    groupOptions: { defaultSort: 'desc' }
                });

            expect(params.hasGroup()).toBe(true);
            expect(params.hasGroup('details.personal.age')).toBe(true);
            expect(params.hasGroup('details.personal.age', 'desc')).toBe(true);
            expect(params.group()).toEqual({ 'details.personal.age': 'desc' });

            params.group('details.country');
            expect(params.hasGroup('details.country', 'desc')).toBe(true);
            expect(params.group()).toEqual({ 'details.country': 'desc' });

            params.group('details.country', 'asc');
            expect(params.hasGroup('details.country', 'asc')).toBe(true);
            expect(params.group()).toEqual({ 'details.country': 'asc' });
        });

        it('one group function', () => {
            const params = new NgTableParams({
                group: ng1.identity
            });

            expect(params.hasGroup()).toBe(true);
            expect(params.hasGroup(ng1.identity)).toBe(true);
            expect(params.hasGroup(ng1.identity, params.settings().groupOptions.defaultSort)).toBe(true);
            expect(params.group()).toEqual(ng1.identity);


            const fn: GroupingFunc<any> = () => '';
            fn.sortDirection = 'desc';
            params.group(fn);
            expect(params.hasGroup(fn)).toBe(true);
            expect(params.hasGroup(fn, 'desc')).toBe(true);
            expect(params.group()).toEqual(fn);
        });

        it('can clear group', () => {
            const params = new NgTableParams({
                group: 'role'
            });

            expect(params.hasGroup()).toBe(true); // checking assumptions

            params.group({});
            expect(params.hasGroup()).toBe(false);
            expect(params.group()).toEqual({});
        });

        it('multiple groups', () => {
            const params = new NgTableParams({
                group: 'role'
            }, {
                    groupOptions: { defaultSort: 'desc' }
                });

            const newGroups = _.extend<GroupValues>({}, params.group(), { age: 'desc' });
            params.group(newGroups);
            expect(params.hasGroup()).toBe(true);
            expect(params.hasGroup('role')).toBe(true);
            expect(params.hasGroup('role', 'desc')).toBe(true);
            expect(params.hasGroup('age')).toBe(true);
            expect(params.hasGroup('age', 'desc')).toBe(true);
            expect(params.group()).toEqual({ role: 'desc', age: 'desc' });

            params.group({ role: 'asc', age: 'asc' });
            expect(params.hasGroup('age', 'desc')).toBe(false);
            expect(params.hasGroup('age', 'asc')).toBe(true);
            expect(params.group()).toEqual({ role: 'asc', age: 'asc' });
        });

        it('should apply current defaultSort from groupOptions', () => {
            const params = new NgTableParams({
                group: 'role'
            }, {
                    groupOptions: { defaultSort: 'desc' }
                });

            params.settings({ groupOptions: { defaultSort: 'asc' } });

            params.group('age');
            expect(params.group()).toEqual({ age: 'asc' });
        });

        it('should not apply defaultSort from groupOptions when explicitly set to empty string', () => {
            const params = new NgTableParams({
                group: 'role'
            }, {
                    groupOptions: { defaultSort: 'desc' }
                });
            expect(params.group()).toEqual({ role: 'desc' }); // checking assumptions

            params.group({ role: '' });
            expect(params.group()).toEqual({ role: '' });

            params.group({ age: undefined });
            expect(params.group()).toEqual({ age: 'desc' });

            params.group({ role: undefined });
            expect(params.group()).toEqual({ role: 'desc' });
        });
    });

    describe('settings', () => {

        it('changing settings().dataset should reset page to 1', () => {
            // given
            const tableParams = createNgTableParams({ count: 1, page: 2 }, { dataset: [1, 2, 3] });
            tableParams.reload();
            scope.$digest();
            expect(tableParams.page()).toBe(2); // checking assumptions

            // when
            tableParams.settings({ dataset: [1, 2, 3, 4] });

            // then
            expect(tableParams.page()).toBe(1);
        });
    });

    describe('reload', () => {

        it('should call getData to retrieve data', () => {
            const tp = createNgTableParams();
            tp.reload();
            scope.$digest();
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should add the results returned by getData to the data field', () => {
            const tp = createNgTableParams({ getData: () => [1, 2, 3] });
            tp.reload();
            scope.$digest();
            expect(tp.data).toEqual([1, 2, 3]);
        });

        it('should use ngTableDefaultGetData function when NgTableParams not supplied a getData function', inject((ngTableDefaultGetData: jasmine.Spy) => {
            // given
            const tp = createNgTableParams();

            // when
            tp.reload();
            scope.$digest();

            // then
            expect(ngTableDefaultGetData).toHaveBeenCalled();
        }));

        it('should propagate rejection reason from getData', inject(($q: IQService) => {
            // given
            const tp = createNgTableParams({ getData: () => $q.reject('bad response') });

            // when
            let actualRejection = '';
            tp.reload().catch(reason => {
                actualRejection = reason;
            });
            scope.$digest();

            // then
            expect(actualRejection).toBe('bad response');
        }));
    });

    describe('getGroups', () => {

        interface Employee {
            name: string;
            role: string;
        }

        let dataset: Employee[];
        beforeEach(() => {
            dataset = [
                { 'name': 'Hanson', 'role': 'Accounting' },
                { 'name': 'Eaton', 'role': 'Customer Service' },
                { 'name': 'Perry', 'role': 'Customer Service' },
                { 'name': 'George', 'role': 'Accounting' },
                { 'name': 'Jennings', 'role': 'Asset Management' },
                { 'name': 'Whitney', 'role': 'Accounting' },
                { 'name': 'Weaver', 'role': 'Payroll' },
                { 'name': 'Gibson', 'role': 'Payroll' },
                { 'name': 'Wells', 'role': 'Media Relations' },
                { 'name': 'Willis', 'role': 'Finances' },
                { 'name': 'Donovan', 'role': 'Customer Relations' },
                { 'name': 'Mcdonald', 'role': 'Finances' },
                { 'name': 'Young', 'role': 'Asset Management' }
            ];
        });


        it('should group data then apply paging to groups', () => {
            const tp = createNgTableParams({ count: 2, group: { role: '' } }, { dataset: dataset });

            let actualRoleGroups: DataRowGroup<Employee>[] | undefined;
            tp.reload<DataRowGroup<Employee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            const expectedRoleGroups: DataRowGroup<Employee>[] = [
                {
                    $hideRows: false,
                    value: 'Accounting',
                    data: [
                        { "name": 'Hanson', "role": 'Accounting' },
                        { "name": 'George', "role": 'Accounting' },
                        { "name": 'Whitney', "role": 'Accounting' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Customer Service',
                    data: [
                        { "name": 'Eaton', "role": 'Customer Service' },
                        { "name": 'Perry', "role": 'Customer Service' }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });

        it('should sort data, then group, then page groups', () => {
            const tp = createNgTableParams({
                count: 2,
                sorting: { name: 'desc' },
                group: { role: '' }
            }, { dataset: dataset });

            let actualRoleGroups: DataRowGroup<Employee>[] | undefined;
            tp.reload<DataRowGroup<Employee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            expect(actualRoleGroups).toEqual([
                {
                    $hideRows: false,
                    value: 'Asset Management',
                    data: [
                        { "name": 'Young', "role": 'Asset Management' },
                        { "name": 'Jennings', "role": 'Asset Management' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Finances',
                    data: [
                        { "name": 'Willis', "role": 'Finances' },
                        { "name": 'Mcdonald', "role": 'Finances' }
                    ]
                }
            ]);
        });

        it('should use group function to group data', () => {
            const grouper: GroupingFunc<Employee> = (item) => item.name[0];
            grouper.sortDirection = '';
            const tp = createNgTableParams({
                count: 2,
                sorting: { name: 'desc' },
                group: grouper
            }, { dataset: dataset });

            let actualRoleGroups: DataRowGroup<Employee>[] | undefined;
            tp.reload<DataRowGroup<Employee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            expect(actualRoleGroups).toEqual([
                {
                    $hideRows: false,
                    value: 'Y',
                    data: [
                        { "name": "Young", "role": "Asset Management" }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'W',
                    data: [
                        { "name": "Willis", "role": "Finances" },
                        { "name": "Whitney", "role": "Accounting" },
                        { "name": "Wells", "role": "Media Relations" },
                        { "name": "Weaver", "role": "Payroll" }
                    ]
                }
            ]);
        });

        it('should filter and sort data, then group, then page groups', () => {
            const tp = createNgTableParams({
                count: 2,
                sorting: { name: 'desc' },
                filter: { name: 'e' },
                group: { role: '' }
            }, {
                    dataset: dataset
                });

            let actualRoleGroups: DataRowGroup<Employee>[] | undefined;
            tp.reload<DataRowGroup<Employee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            expect(actualRoleGroups).toEqual([
                {
                    $hideRows: false,
                    value: 'Accounting',
                    data: [
                        { 'name': 'Whitney', 'role': 'Accounting' },
                        { 'name': 'George', 'role': 'Accounting' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Media Relations',
                    data: [
                        { 'name': 'Wells', 'role': 'Media Relations' }
                    ]
                }
            ]);
        });

        it('should filter and sort data, then group, then apply group sortDirection, and finally page groups', () => {
            const tp = createNgTableParams({
                count: 3,
                sorting: { name: 'desc' },
                filter: { name: 'e' },
                group: { role: 'desc' }
            }, {
                    dataset: dataset,
                    groupOptions: {
                        // this value will be overridden by group: { role: 'desc' }
                        defaultSort: undefined
                    }
                });

            let actualRoleGroups: DataRowGroup<Employee>[] | undefined;
            tp.reload<DataRowGroup<Employee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            expect(actualRoleGroups).toEqual([
                {
                    $hideRows: false,
                    value: 'Payroll',
                    data: [
                        { 'name': 'Weaver', 'role': 'Payroll' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Media Relations',
                    data: [
                        { 'name': 'Wells', 'role': 'Media Relations' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Customer Service',
                    data: [
                        { 'name': 'Perry', 'role': 'Customer Service' },
                        { 'name': 'Eaton', 'role': 'Customer Service' }
                    ]
                }
            ]);
        });

        it('should use sortDirection defined on group function to sort groups', () => {
            const groupFn: GroupingFunc<Employee> = item => item.role;
            groupFn.sortDirection = 'desc';
            const tp = createNgTableParams({
                count: 3,
                sorting: { name: 'desc' },
                filter: { name: 'e' },
                group: groupFn
            }, {
                    dataset: dataset,
                    groupOptions: {
                        // this value will be overridden by groupFn.sortDirection
                        defaultSort: undefined
                    }
                });

            let actualRoleGroups: DataRowGroup<Employee>[] | undefined;
            tp.reload<DataRowGroup<Employee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            expect(actualRoleGroups).toEqual([
                {
                    $hideRows: false,
                    value: 'Payroll',
                    data: [
                        { 'name': 'Weaver', 'role': 'Payroll' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Media Relations',
                    data: [
                        { 'name': 'Wells', 'role': 'Media Relations' }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Customer Service',
                    data: [
                        { 'name': 'Perry', 'role': 'Customer Service' },
                        { 'name': 'Eaton', 'role': 'Customer Service' }
                    ]
                }
            ]);
        });
    });

    describe('getGroups with nested property', () => {

        interface ComplexEmployee {
            details: { name: string, role: string };
        }

        let dataset: ComplexEmployee[];
        beforeEach(() => {
            dataset = [
                { 'details': { 'name': 'Hanson', 'role': 'Accounting' } },
                { 'details': { 'name': 'Eaton', 'role': 'Customer Service' } },
                { 'details': { 'name': 'Perry', 'role': 'Customer Service' } },
                { 'details': { 'name': 'George', 'role': 'Accounting' } },
                { 'details': { 'name': 'Jennings', 'role': 'Asset Management' } },
                { 'details': { 'name': 'Whitney', 'role': 'Accounting' } },
                { 'details': { 'name': 'Weaver', 'role': 'Payroll' } },
                { 'details': { 'name': 'Gibson', 'role': 'Payroll' } },
                { 'details': { 'name': 'Wells', 'role': 'Media Relations' } },
                { 'details': { 'name': 'Willis', 'role': 'Finances' } },
                { 'details': { 'name': 'Donovan', 'role': 'Customer Relations' } },
                { 'details': { 'name': 'Mcdonald', 'role': 'Finances' } },
                { 'details': { 'name': 'Young', 'role': 'Asset Management' } }
            ];
        });


        it('should group data then apply paging to groups', () => {
            const tp = createNgTableParams({ count: 2, group: { 'details.role': '' } }, { dataset: dataset });

            let actualRoleGroups: DataRowGroup<ComplexEmployee>[] | undefined;
            tp.reload<DataRowGroup<ComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: DataRowGroup<ComplexEmployee>[] = [
                {
                    $hideRows: false,
                    value: 'Accounting',
                    data: [
                        { 'details': { 'name': 'Hanson', 'role': 'Accounting' } },
                        { 'details': { 'name': 'George', 'role': 'Accounting' } },
                        { 'details': { 'name': 'Whitney', 'role': 'Accounting' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Customer Service',
                    data: [
                        { 'details': { 'name': 'Eaton', 'role': 'Customer Service' } },
                        { 'details': { 'name': 'Perry', 'role': 'Customer Service' } }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });

        it('should sort data, then group, then page groups', () => {
            const tp = createNgTableParams({
                count: 2,
                sorting: { 'details.name': 'desc' },
                group: { 'details.role': '' }
            }, { dataset: dataset });

            let actualRoleGroups: DataRowGroup<ComplexEmployee>[] | undefined;
            tp.reload<DataRowGroup<ComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: DataRowGroup<ComplexEmployee>[] = [
                {
                    $hideRows: false,
                    value: 'Asset Management',
                    data: [
                        { 'details': { 'name': 'Young', 'role': 'Asset Management' } },
                        { 'details': { 'name': 'Jennings', 'role': 'Asset Management' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Finances',
                    data: [
                        { 'details': { 'name': 'Willis', 'role': 'Finances' } },
                        { 'details': { 'name': 'Mcdonald', 'role': 'Finances' } }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });

        it('should use group function to group data', () => {
            const grouper: GroupingFunc<ComplexEmployee> = item => item.details.name[0];
            grouper.sortDirection = '';
            const tp = createNgTableParams({
                count: 2,
                sorting: { 'details.name': 'desc' },
                group: grouper
            }, { dataset: dataset });

            let actualRoleGroups: DataRowGroup<ComplexEmployee>[] | undefined;
            tp.reload<DataRowGroup<ComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: DataRowGroup<ComplexEmployee>[] = [
                {
                    $hideRows: false,
                    value: 'Y',
                    data: [
                        { 'details': { 'name': 'Young', 'role': 'Asset Management' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'W',
                    data: [
                        { 'details': { 'name': 'Willis', 'role': 'Finances' } },
                        { 'details': { 'name': 'Whitney', 'role': 'Accounting' } },
                        { 'details': { 'name': 'Wells', 'role': 'Media Relations' } },
                        { 'details': { 'name': 'Weaver', 'role': 'Payroll' } }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });

        it('should filter and sort data, then group, then page groups', () => {
            const tp = createNgTableParams({
                count: 2,
                sorting: { 'details.name': 'desc' },
                filter: { 'details.name': 'e' },
                group: { 'details.role': '' }
            }, {
                    dataset: dataset
                });

            let actualRoleGroups: DataRowGroup<ComplexEmployee>[] | undefined;
            tp.reload<DataRowGroup<ComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: DataRowGroup<ComplexEmployee>[] = [
                {
                    $hideRows: false,
                    value: 'Accounting',
                    data: [
                        { 'details': { 'name': 'Whitney', 'role': 'Accounting' } },
                        { 'details': { 'name': 'George', 'role': 'Accounting' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Media Relations',
                    data: [
                        { 'details': { 'name': 'Wells', 'role': 'Media Relations' } }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });

        it('should filter and sort data, then group, then apply group sortDirection, and finally page groups', () => {
            const tp = createNgTableParams({
                count: 3,
                sorting: { 'details.name': 'desc' },
                filter: { 'details.name': 'e' },
                group: { 'details.role': 'desc' }
            }, {
                    dataset: dataset,
                    groupOptions: {
                        // this value will be overridden by group: { role: 'desc' }
                        defaultSort: undefined
                    }
                });

            let actualRoleGroups: DataRowGroup<ComplexEmployee>[] | undefined;
            tp.reload<DataRowGroup<ComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: DataRowGroup<ComplexEmployee>[] = [
                {
                    $hideRows: false,
                    value: 'Payroll',
                    data: [
                        { 'details': { 'name': 'Weaver', 'role': 'Payroll' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Media Relations',
                    data: [
                        { 'details': { 'name': 'Wells', 'role': 'Media Relations' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Customer Service',
                    data: [
                        { 'details': { 'name': 'Perry', 'role': 'Customer Service' } },
                        { 'details': { 'name': 'Eaton', 'role': 'Customer Service' } }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });

        it('should use sortDirection defined on group function to sort groups', () => {
            const groupFn: GroupingFunc<ComplexEmployee> = item => item.details.role;
            groupFn.sortDirection = 'desc';
            const tp = createNgTableParams({
                count: 3,
                sorting: { 'details.name': 'desc' },
                filter: { 'details.name': 'e' },
                group: groupFn
            }, {
                    dataset: dataset,
                    groupOptions: {
                        // this value will be overridden by groupFn.sortDirection
                        defaultSort: undefined
                    }
                });

            let actualRoleGroups: DataRowGroup<ComplexEmployee>[] | undefined;
            tp.reload<DataRowGroup<ComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: DataRowGroup<ComplexEmployee>[] = [
                {
                    $hideRows: false,
                    value: 'Payroll',
                    data: [
                        { 'details': { 'name': 'Weaver', 'role': 'Payroll' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Media Relations',
                    data: [
                        { 'details': { 'name': 'Wells', 'role': 'Media Relations' } }
                    ]
                },
                {
                    $hideRows: false,
                    value: 'Customer Service',
                    data: [
                        { 'details': { 'name': 'Perry', 'role': 'Customer Service' } },
                        { 'details': { 'name': 'Eaton', 'role': 'Customer Service' } }
                    ]
                }
            ];
            expect(actualRoleGroups).toEqual(expectedRoleGroups);
        });
    });

    describe('parameters', () => {
        let tp: NgTableParams<any>;
        let defaultParamValues: ParamValues<any>;

        beforeEach(() => {
            defaultParamValues = {
                count: 10,
                filter: {},
                page: 1,
                sorting: {},
                group: {}
            };
        });

        it('should be assigned default values when not supplied', () => {
            tp = new NgTableParams();
            expect(tp.parameters()).toEqualPlainObject(defaultParamValues);
        });

        it('missing values should be assigned default values', () => {
            tp = new NgTableParams();
            expect(tp.parameters()).toEqualPlainObject(defaultParamValues);
        });

        it('ngTableDefaults should override default values', inject((ngTableDefaults: Defaults) => {
            try {
                ngTableDefaults.params = { filter: { age: 10 }};
                tp = new NgTableParams();

                const expected = defaultParamValues;
                expected.filter = ngTableDefaults.params.filter!;

                expect(tp.parameters()).toEqualPlainObject(expected);
            } finally {
                // reset
                ngTableDefaults.params = {};
            }
        }));

        it('should replace existing filter with new filter supplied', () => {
            // given
            tp = new NgTableParams({
                filter: {
                    name: 'stuff'
                }
            });
            const newParams = {
                filter: {
                    age: 20
                }
            };

            // when
            tp.parameters(newParams);

            // then
            const expected = new ParamValues();
            expected.filter = newParams.filter;
            const actual = tp.parameters();
            expect(actual).toEqualPlainObject(expected);

            // note: below we're testing the existing behaviour which is actually not a good one
            // instead of assigning a reference params.filter we should be taking a copy
            expect(actual.filter).toBe(newParams.filter);
        });

        it('should replace existing group with new group supplied', () => {
            // given
            tp = new NgTableParams({
                group: {
                    name: 'asc'
                }
            });
            const newParams: ParamValuesPartial<any> = {
                group: {
                    age: 'asc'
                }
            };

            // when
            tp.parameters(newParams);

            // then
            const expected = new ParamValues();
            expected.group = newParams.group as GroupValues;
            const actual = tp.parameters();
            expect(actual).toEqualPlainObject(expected);

            // note: below we're testing the existing behaviour which is actually not a good one
            // instead of assigning a reference params.group we should be taking a copy
            expect(actual.group).toBe(newParams.group);
        });

        it('should replace existing sorting with new sorting supplied', () => {
            // given
            tp = new NgTableParams({
                sorting: {
                    name: 'asc'
                }
            });
            const newParams: ParamValuesPartial<any> = {
                sorting: {
                    age: 'asc'
                }
            };

            // when
            tp.parameters(newParams);

            // then
            const expected = new ParamValues();
            expected.sorting = newParams.sorting!;
            const actual = tp.parameters();
            expect(actual).toEqualPlainObject(expected);

            // note: below we're testing the existing behaviour which is actually not a good one
            // instead of assigning a reference params.sorting we should be taking a copy
            expect(actual.sorting).toBe(newParams.sorting);
        });

        it('undefined values in new params should be ignored', () => {
            const newParams = _.mapValues(defaultParamValues, _.constant(undefined));
            tp = new NgTableParams();

            tp.parameters(newParams);

            const actual = tp.parameters();
            expect(actual).toEqualPlainObject(defaultParamValues);
        });

        it('undefined values in ngTableDefaults should by ignored', inject((ngTableDefaults: Defaults) => {
            try {
                ngTableDefaults.params = _.mapValues(defaultParamValues, _.constant(undefined));
                tp = new NgTableParams();

                expect(tp.parameters()).toEqualPlainObject(defaultParamValues);
            } finally {
                // reset
                ngTableDefaults.params = {};
            }
        }));

        it('should parse from url like parameters', () => {
            const tp = new NgTableParams({
                'sorting[name]': 'asc',
                'sorting[age]': 'desc',
                'filter[name]': 'test',
                'filter[age]': '20',
                'group[name]': 'asc',
                'group[age]': 'desc',
                'group[surname]': undefined
            } as any);

            const expected = defaultParamValues;
            expected.filter = { 'name': 'test', 'age': 20 };
            // sorting only by one column - todo: remove restriction
            expected.sorting = { 'age': 'desc' };
            // we're having to trick the compiler with 'any' to get around bug
            // todo: fix required to be consistent with how an undefined group value will be assigned the default
            expected.group = { 'name': 'asc', 'age': 'desc', 'surname': undefined } as any;

            expect(tp.parameters()).toEqualPlainObject(defaultParamValues);
        });

        it('url like parameters are merged with existing values (badly!)', () => {

            // note: this test is here to show what the current behaviour IS
            // and NOT what is necessarily correct
            // There are at least 2 problems:
            // 1. for consistency existing filtering, sorting, grouping should be replaced, not merged
            // 2. there are bugs (see expected result below)

            // given
            const tp = new NgTableParams({
                filter: {
                    name: 'test'
                },
                sorting: {
                    name: 'asc'
                }
            });
            const newParams = {
                'filter[age]': '20',
                'sorting[age]': 'desc'
            };

            // when
            tp.parameters(newParams);

            // then
            const expected = defaultParamValues;
            // this is buggy - age is not being included in the filter, sorting object
            expected.filter = { name: 'test' };
            expected.sorting = { name: 'asc' };
            expected['filter[age]'] = 20;
            expected['sorting[age]'] = 'desc';
            expect(tp.parameters()).toEqualPlainObject(defaultParamValues);
        });
    });

    describe('hasFilter', () => {
        let tp: NgTableParams<any>;

        beforeEach(inject(() => {
            tp = new NgTableParams({}, {});
        }));

        it('should return false for an empty filter object', () => {
            tp.filter({});
            expect(tp.hasFilter()).toBe(false);
        });

        it('should return true for when filter has a field with a significant value', () => {
            tp.filter({ a: 'b' });
            expect(tp.hasFilter()).toBe(true);

            tp.filter({ a: 0 });
            expect(tp.hasFilter()).toBe(true);
        });

        it('should return false when filter only has insignificant field values', () => {
            tp.filter({ a: '' });
            expect(tp.hasFilter()).toBe(false);

            tp.filter({ a: null });
            expect(tp.hasFilter()).toBe(false);

            tp.filter({ a: undefined });
            expect(tp.hasFilter()).toBe(false);

            tp.filter({ a: undefined, b: '', c: undefined });
            expect(tp.hasFilter()).toBe(false);

            //tp.filter({ a: NaN });
            //expect(tp.hasFilter()).toBe(false);
        });
    });


    describe('isDataReloadRequired', () => {
        let tp: NgTableParams<{}>;

        beforeEach(inject(() => {
            tp = createNgTableParams();
        }));

        it('should return true after construction', () => {
            expect(tp.isDataReloadRequired()).toBe(true);
        });

        it('should return false once reload called after construction', () => {
            tp.reload();
            // note: we don't have to wait for the getData promise to be resolved before considering reload
            // to be unnecessary - that's why we're not having to run a $digest
            expect(tp.isDataReloadRequired()).toBe(false);
        });

        it('should return false when getData fails', inject(($q: IQService) => {
            tp.settings({ getData: () => $q.reject('bad response') });
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false);
        }));

        it('should detect direct changes to parameters', inject(($q: IQService) => {
            // given
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false); // checking assumptions

            // when
            tp.filter()['newField'] = 99;
            expect(tp.isDataReloadRequired()).toBe(true);
        }));

        it('should return true until changed parameters have been reloaded', () => {
            // given
            tp.reload();
            scope.$digest();

            // when, then...
            verifyIsDataReloadRequired(() => {
                tp.filter({ age: 1 });
            });
            verifyIsDataReloadRequired(() => {
                tp.page(55);
            });
            verifyIsDataReloadRequired(() => {
                tp.sorting({ age: 'desc' });
            });
            verifyIsDataReloadRequired(() => {
                tp.count(100);
            });
        });

        it('should return true when `$` field on `filter` changes', () => {
            // given
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false); // checking assumptions

            // when
            tp.filter()['$'] = 'cc';
            expect(tp.isDataReloadRequired()).toBe(true);
        });

        it('should return true when group function sort direction changes', () => {
            // given
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false); // checking assumptions

            // when, then...

            const grouper: GroupingFunc<any> = () => '';
            tp.group(grouper);
            expect(tp.isDataReloadRequired()).toBe(true);

            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false);

            grouper.sortDirection = 'desc';
            expect(tp.isDataReloadRequired()).toBe(true);
        });

        it('should return false when parameters "touched" but not modified', () => {
            // given
            tp.filter({ age: 1 });
            tp.reload();
            scope.$digest();

            // when, then...
            tp.filter({ age: 1 });
            expect(tp.isDataReloadRequired()).toBe(false);
        });

        it('should return true when new settings dataset array supplied', () => {
            // given
            tp.reload();
            scope.$digest();

            verifyIsDataReloadRequired(() => {
                tp.settings({ dataset: [11, 22, 33] });
            });
        });

        it('should return true when existing settings dataset array is unset', () => {
            // given
            tp = createNgTableParams({ dataset: [1, 2, 3] });
            tp.reload();
            scope.$digest();

            verifyIsDataReloadRequired(() => {
                tp.settings({ dataset: undefined });
            });
        });

        it('status should not change when settings called without a dataset array', () => {
            // given
            tp = createNgTableParams({ dataset: [1, 2, 3] });
            tp.reload();
            scope.$digest();

            // when, then...
            tp.settings({ total: 100 });
            expect(tp.isDataReloadRequired()).toBe(false);
        });


        function verifyIsDataReloadRequired(modifer: Function) {
            modifer();
            expect(tp.isDataReloadRequired()).toBe(true);
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false);
        }
    });

    describe('hasFilterChanges', () => {
        let tp: NgTableParams<{}>;

        beforeEach(inject(() => {
            tp = createNgTableParams();
        }));

        it('should return true after construction', () => {
            expect(tp.hasFilterChanges()).toBe(true);
        });

        it('should return false once reload called after construction', () => {
            tp.reload();
            // note: we don't have to wait for the getData promise to be resolved before considering reload
            // to be unnecessary - that's why we're not having to run a $digest
            expect(tp.hasFilterChanges()).toBe(false);
        });

        it('should return true when getData fails', inject(($q: IQService) => {
            tp.settings({ getData: () => $q.reject('bad response') });
            tp.reload();
            scope.$digest();
            expect(tp.hasFilterChanges()).toBe(false);
        }));

        it('should detect direct changes to filters', inject(($q: IQService) => {
            // given
            tp.reload();
            scope.$digest();
            expect(tp.hasFilterChanges()).toBe(false); // checking assumptions

            // when
            tp.filter()['newField'] = 99;
            expect(tp.hasFilterChanges()).toBe(true);
        }));

        it('should return true when `$` field on `filter` changes', () => {
            // given
            tp.reload();
            scope.$digest();
            expect(tp.hasFilterChanges()).toBe(false); // checking assumptions

            // when
            tp.filter()['$'] = 'cc';
            expect(tp.hasFilterChanges()).toBe(true);
        });

        it('should return true until changed filters have been reloaded', () => {
            // given
            tp.reload();
            scope.$digest();

            // when, then...
            tp.filter({ age: 1 });
            expect(tp.hasFilterChanges()).toBe(true);
            tp.reload();
            scope.$digest();
            expect(tp.hasFilterChanges()).toBe(false);
        });

        it('should return false when filters "touched" but not modified', () => {
            // given
            tp.filter({ age: 1 });
            tp.reload();
            scope.$digest();

            // when, then...
            tp.filter({ age: 1 });
            expect(tp.hasFilterChanges()).toBe(false);
        });

        it('status should not change just because new settings dataset array supplied', () => {
            // given
            tp.reload();
            scope.$digest();

            // when, then...
            tp.settings({ dataset: [11, 22, 33] });
            expect(tp.hasFilterChanges()).toBe(false);
        });

    });

    describe('hasErrorState', () => {
        let tp: NgTableParams<{}>;

        it('should return false until reload fails', inject(($q: IQService) => {
            // given
            tp = createNgTableParams({
                getData: () => {
                    if ((tp.settings().getData as jasmine.Spy).calls.count() > 2) {
                        return $q.reject('bad response');
                    }
                    return $q.when([1, 2]);
                }
            });

            // when, then
            tp.reload();
            scope.$digest();
            expect(tp.hasErrorState()).toBe(false);
            tp.reload();
            scope.$digest();
            expect(tp.hasErrorState()).toBe(false);
            tp.reload();
            scope.$digest();
            expect(tp.hasErrorState()).toBe(true);
        }));

        it('should return false once parameter values change', inject(($q: IQService) => {
            // given
            tp = createNgTableParams({ getData: () => $q.reject('bad response') });

            // when, then
            tp.reload();
            scope.$digest();
            expect(tp.hasErrorState()).toBe(true);
            tp.filter({ age: 598 });
            expect(tp.hasErrorState()).toBe(false);
        }));
    });

    describe('interceptors', () => {

        it('can register interceptor', () => {
            const interceptor = { response: ng1.identity };
            const tp = createNgTableParams({ interceptors: [interceptor] });
            expect(tp.settings().interceptors).toEqual([interceptor]);
        });

        it('can register multiple interceptor', () => {
            const interceptors = [{ response: ng1.identity }, { response: ng1.identity }];
            const tp = createNgTableParams({ interceptors: interceptors });
            expect(tp.settings().interceptors).toEqual(interceptors);
        });

        it('can register interceptors after NgTableParams created', () => {
            const interceptor = { response: ng1.identity };
            const interceptor2 = { response: ng1.identity };
            const tp = createNgTableParams({ interceptors: [interceptor] });
            const interceptors = tp.settings().interceptors.concat([interceptor2]);
            tp.settings({ interceptors: interceptors });
            expect(tp.settings().interceptors).toEqual(interceptors);
        });

        describe('one response interceptor', () => {

            it('should receive response from call to getData', () => {
                // given
                const interceptor = {
                    hasRun: false,
                    response: function (data: number[]/*,params*/) {
                        this.hasRun = true;
                        return data;
                    }
                };
                const tp = createNgTableParams({ interceptors: [interceptor] });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptor.hasRun).toBeTruthy();
            });

            it('should be able to modify data returned by getData', () => {
                type Row = { modified: boolean };
                // given
                const interceptor = {
                    response: (data: Row[]/*, params*/) => {
                        data.forEach(item => {
                            item.modified = true;
                        });
                        return data;
                    }
                };
                const tp = createNgTableParams<Row>({ interceptors: [interceptor], getData: () => [{}, {}] });


                // when
                let actualData: Row[] | undefined;
                tp.reload<Row>().then(data => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual([{ modified: true }, { modified: true }]);
            });

            it('should be able to replace data returned by getData', () => {
                // given
                const interceptor = {
                    response: (data: number[]/*, params*/) => data.map(item => item * 2)
                };
                const tp = createNgTableParams({ interceptors: [interceptor], getData: () => [2, 3] });

                // when
                let actualData: number[] | undefined;
                tp.reload<number>().then(data => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual([4, 6]);
            });

            it('should be able to access tableParams supplied to getData', () => {
                type QueryResult = { total: number, results: number[] };
                // given
                const interceptor = {
                    response: (data: QueryResult, params: NgTableParams<number>) => {
                        params.total(data.total);
                        return data.results;
                    }
                };
                const tp = createNgTableParams({}, {
                    interceptors: [interceptor], getData: () => {
                        return { results: [1, 2, 3], total: 3 };
                    }
                });

                // when
                let actualData: number[] | undefined;
                tp.reload<number>().then(data => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual([1, 2, 3]);
                expect(tp.total()).toEqual(3);
            });
        });

        describe('one responseError interceptor', () => {

            it('should receive rejections from getData', inject(($q: IQService) => {
                // given
                const interceptor = {
                    actualReason: '',
                    responseError: function (reason: string/*, params*/) {
                        this.actualReason = reason;
                    }
                };
                const tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => $q.reject('BANG!')
                });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptor.actualReason).toBe('BANG!');
            }));

            it('should NOT receive errors from getData', () => {
                // given
                const interceptor = {
                    hasRun: false,
                    responseError: function (/*reason, params*/) {
                        this.hasRun = true;
                    }
                };
                const tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => {
                        throw new Error('BANG!');
                    }
                });

                // when, then
                expect(tp.reload).toThrow();
                expect(interceptor.hasRun).toBeFalsy();
            });

            it('should be able to modify reason returned by getData', inject(($q: IQService) => {
                interface ResponseError {
                    description: string;
                    code?: number;
                }

                // given
                const interceptor = {
                    responseError: (reason: ResponseError/*, params*/) => {
                        reason.code = 400;
                        return $q.reject(reason);
                    }
                };
                const tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => $q.reject({ description: 'crappy data' })
                });

                // when
                let actualReason: ResponseError | undefined;
                tp.reload().catch(reason => {
                    actualReason = reason;
                });
                scope.$digest();

                // then
                expect(actualReason!.code).toBe(400);
                expect(actualReason!.description).toBe('crappy data');
            }));

            it('should be able to replace reason returned by getData', inject(($q: IQService) => {
                // given
                const interceptor = {
                    responseError: (/*reason, params*/) => $q.reject('Cancelled by user')
                };
                const tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => $q.reject('BANG!')
                });

                // when
                let actualReason = '';
                tp.reload().catch(reason => {
                    actualReason = reason;
                });
                scope.$digest();

                // then
                expect(actualReason).toBe('Cancelled by user');
            }));

            it('should be able to access tableParams supplied to getData', () => {
                // given
                const interceptor = {
                    actualParams: null as any as NgTableParams<number>,
                    response: function (data: number[], params: NgTableParams<number>) {
                        this.actualParams = params;
                    }
                };
                const tp = createNgTableParams({ interceptors: [interceptor] });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptor.actualParams).toBe(tp);
            });
        });

        describe('one response plus responseError interceptor', () => {

            it('should NOT call responseError on same interceptor whose response method fails', inject(($q: IQService) => {
                // given
                const interceptor = {
                    hasRun: false,
                    response: (/*data, params*/) => $q.reject('BANG!'),
                    responseError: function (reason: any/*, params*/) {
                        this.hasRun = true;
                    }
                };
                const tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => [1, 2, 3]
                });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptor.hasRun).toBeFalsy();
            }));
        });

        describe('multiple response interceptors', () => {

            it('should run interceptors in the order they were registered', () => {
                // given
                let callCount = 0;
                const interceptor = {
                    sequence: 0,
                    response: function (/*data, params*/) {
                        this.sequence = callCount;
                        callCount++;
                    }
                };
                const interceptors = [interceptor, ng1.copy(interceptor)];
                const tp = createNgTableParams({ interceptors: interceptors });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptors[0].sequence).toBe(0);
                expect(interceptors[1].sequence).toBe(1);
            });

            it('results of one interceptor should be piped to the next validator', () => {
                // given
                const interceptor = {
                    response: (data: number[]/*, params*/) => data.map(item => item * 2)
                };
                const interceptor2 = {
                    response: (data: number[]/*, params*/) => data.map(item => item.toString() + '0')
                };
                const tp = createNgTableParams({ interceptors: [interceptor, interceptor2], getData: () => [2, 3] });

                // when
                let actualData: string[] | undefined;
                tp.reload().then((data: any) => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual(['40', '60']);
            });
        });

        describe('multiple response and responseError interceptors', () => {

            it('responseError of next interceptor should receive failures from previous interceptor', inject(($q: IQService) => {
                // given
                const badInterceptor = {
                    response: (/*data, params*/) => $q.reject('BANG!')
                };
                const nextInterceptor = {
                    hasRun: false,
                    responseError: function (/*reason, params*/) {
                        this.hasRun = true;
                    }
                };
                const tp = createNgTableParams({ interceptors: [badInterceptor, nextInterceptor] });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(nextInterceptor.hasRun).toBe(true);
            }));

            it('should call next response interceptor when previous interceptor recovers from failure', inject(($q: IQService) => {
                // given
                const badInterceptor = {
                    response: (/*data, params*/) => $q.reject('BANG!')
                };
                const recoveringInterceptor = {
                    responseError: (/*reason, params*/) => [8894, 58]
                };
                let recoveredData: number[] | undefined;
                const nextInterceptor = {
                    hasRun: false,
                    response: function (data: number[]/*, params*/) {
                        this.hasRun = true;
                        recoveredData = data;
                    }
                };
                const tp = createNgTableParams({ interceptors: [badInterceptor, recoveringInterceptor, nextInterceptor] });

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(nextInterceptor.hasRun).toBe(true);
                expect(recoveredData).toEqual([8894, 58]);
            }));
        });
    });

    describe('events', () => {

        let actualEventArgs: any[] | undefined,
            actualPublisher: NgTableParams<any> | undefined,
            fakeTableParams: InternalTableParams<any>,
            ngTableEventsChannel: NgTableEventsChannel & { [name: string]: Function };

        beforeEach(inject((_ngTableEventsChannel_: NgTableEventsChannel & { [name: string]: Function }) => {
            ngTableEventsChannel = _ngTableEventsChannel_;
            fakeTableParams = {} as any;
            actualPublisher = undefined;
            actualEventArgs = undefined;
        }));

        function getSubscriberCount() {
            const allEventNames = Object.keys($rootScope.$$listenerCount);
            const ngTableEvents = allEventNames.filter(event => event.indexOf('ngTable:') === 0);
            return ngTableEvents.reduce((result, event) => {
                result += $rootScope.$$listenerCount[event];
                return result;
            }, 0);
        }

        describe('general pub/sub mechanics', () => {

            const supportedEvents = ['DatasetChanged', 'AfterReloadData', 'PagesChanged', 'AfterCreated', 'AfterDataFiltered', 'AfterDataSorted'];

            it('should be safe to publish event when no subscribers', () => {

                function test(event: string) {
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                }

                supportedEvents.forEach(test);
            });

            it('publishing event should notify registered subscribers (one)', () => {

                function test(event: string) {
                    // given
                    let cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('publishing event should notify registered subscribers (multiple)', () => {

                function test(event: string) {
                    // given
                    let cb1Count = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cb1Count++;
                    });
                    let cb2Count = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cb2Count++;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(cb1Count).toBe(1);
                    expect(cb2Count).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('subscriber should be able to unregister their callback', () => {

                function test(event: string) {
                    // given
                    let cbCount = 0;
                    let subscription = ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    });
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                    expect(cbCount).toBe(1); // checking assumptions
                    expect(getSubscriberCount()).toBe(1); // checking assumptions
                    cbCount = 0; // reset

                    // when
                    subscription(); // unsubscribe
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(cbCount).toBe(0);
                    expect(getSubscriberCount()).toBe(0);
                }

                supportedEvents.forEach(test);
            });

            it('subscriber should be able specify the scope to receive events', () => {

                // this is useful as it allows all subscriptions to be removed by calling $destroy on that scope

                function test(event: string) {
                    // given
                    const childScope = $rootScope.$new();
                    let cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    }, childScope);

                    // when, then
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                    expect(cbCount).toBe(1);

                    cbCount = 0; // reset

                    // when, then
                    childScope.$destroy();
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(cbCount).toBe(0);
                }

                supportedEvents.forEach(test);
            });

            it('should not notify subscribers who have filter out the publisher', () => {

                function test(event: string) {
                    // given
                    let cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    }, function (publisher: {}) {
                        return publisher === fakeTableParams;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                    const anoParams = {};
                    ngTableEventsChannel['publish' + event](anoParams);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('should not notify subscribers who have filter not to receive event based on arg values', () => {

                function test(event: string) {
                    // given
                    let cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    }, (publisher: {}, arg1: any) => {
                        return arg1 === 1;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams, 'cc');
                    ngTableEventsChannel['publish' + event](fakeTableParams, 1);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('should support a shorthand for subscribers to receive events from specific NgTableParams instance', () => {

                function test(event: string) {
                    // given
                    let cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    }, fakeTableParams);

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                    const anoParams = {};
                    ngTableEventsChannel['publish' + event](anoParams);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('publisher should be supplied to subscriber callback', () => {

                function test(event: string) {
                    // given
                    ngTableEventsChannel['on' + event](function (params: NgTableParams<any>) {
                        actualPublisher = params;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(actualPublisher).toBe(fakeTableParams);
                }

                supportedEvents.forEach(test);
            });

            it('remaining event args should be supplied to subscriber callback', () => {

                function test(event: string) {
                    // given
                    ngTableEventsChannel['on' + event](function (params: NgTableParams<any>, ...args: any[]) {
                        actualPublisher = params;
                        actualEventArgs = args;
                    });

                    // when
                    const arg1 = [1, 2];
                    const arg2 = [1];
                    ngTableEventsChannel['publish' + event](fakeTableParams, arg1, arg2);

                    // then
                    expect(actualEventArgs).toEqual([arg1, arg2]);
                }

                supportedEvents.forEach(test);
            });

            it('subscribers should never receive events from null instance of tableParams', () => {

                function test(event: string) {
                    // given
                    let cbCount = 0;
                    ngTableEventsChannel['on' + event](function (params: {}/*, ...args*/) {
                        cbCount++;
                    });

                    // when
                    fakeTableParams.isNullInstance = true;
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(cbCount).toEqual(0);
                }

                supportedEvents.forEach(test);
            });

        });

        describe('afterCreated', () => {

            it('should fire when a new NgTableParams has been constructed', () => {
                // given
                ngTableEventsChannel.onAfterCreated(params => {
                    actualPublisher = params;
                });

                // when
                const params = createNgTableParams();

                // then
                expect(actualPublisher).toBe(params);
            });
        });

        describe('afterReloadData', () => {

            it('should fire when a reload completes', () => {
                // given
                ngTableEventsChannel.onAfterReloadData((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                const newDatapage = [1, 5, 6];
                const params = createNgTableParams({ getData: () => newDatapage });

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDatapage, []]);
            });

            it('should fire on reload even if datapage remains the same array', () => {
                // given
                let callCount = 0;
                ngTableEventsChannel.onAfterReloadData((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                const dataPage = [1, 2, 3];
                const params = createNgTableParams({ getData: () => dataPage });

                // when
                params.reload();
                scope.$digest();
                params.reload();
                scope.$digest();

                // then
                expect(callCount).toBe(2);
            });

            it('should fire after afterCreated event', () => {
                // given
                const events: string[] = [];
                ngTableEventsChannel.onAfterReloadData((/*params, newVal, oldVal*/) => {
                    events.push('afterReloadData');
                });
                ngTableEventsChannel.onAfterCreated((/*params*/) => {
                    events.push('afterCreated');
                });

                // when
                const params = createNgTableParams({}, { dataset: [1, 2, 3, 4, 5, 6] });
                params.reload();
                scope.$digest();

                // then
                expect(events[0]).toEqual('afterCreated');
                expect(events[1]).toEqual('afterReloadData');
            });

        });

        describe('pagesChanged', () => {

            it('should fire when a reload completes', () => {
                // given
                ngTableEventsChannel.onPagesChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                const params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: [1, 2, 3, 4, 5, 6] });

                // when
                params.reload();
                scope.$digest();

                // then
                const expectedPages = params.generatePagesArray(params.page(), params.total(), params.count());
                expect(expectedPages.length).toBeGreaterThan(0); // checking assumptions
                expect(actualEventArgs).toEqual([expectedPages, undefined]);
            });

            it('should fire when a reload completes - no data', () => {
                // given
                ngTableEventsChannel.onPagesChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                const params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: [] });

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualEventArgs).toEqual([[], undefined]);
            });

            it('should fire when a reload completes (multiple)', () => {
                // given
                let callCount = 0;
                ngTableEventsChannel.onPagesChanged((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                const params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: [1, 2, 3, 4, 5, 6] });

                // when
                params.reload();
                scope.$digest();
                params.page(2); // trigger a change to pages data structure
                params.reload();
                scope.$digest();

                // then
                expect(callCount).toBe(2);
            });

            it('should not fire on reload when pages remain the same', () => {
                // given
                let callCount = 0;
                ngTableEventsChannel.onPagesChanged((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                const params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: [1, 2, 3, 4, 5, 6] });
                params.reload();
                scope.$digest();

                // when
                params.reload();
                scope.$digest();

                // then
                expect(callCount).toBe(1);
            });

            it('should fire after afterCreated event', () => {
                // given
                const events: string[] = [];
                ngTableEventsChannel.onPagesChanged((/*params, newVal, oldVal*/) => {
                    events.push('pagesChanged');
                });
                ngTableEventsChannel.onAfterCreated((/*params*/) => {
                    events.push('afterCreated');
                });

                // when
                const params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: [1, 2, 3, 4, 5, 6] });
                params.reload();
                scope.$digest();

                // then
                expect(events[0]).toEqual('afterCreated');
                expect(events[1]).toEqual('pagesChanged');
            });
        });

        describe('datasetChanged', () => {

            it('should fire when a initial dataset is supplied as a settings value', () => {
                // given
                ngTableEventsChannel.onDatasetChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });

                // when
                const initialDs = [5, 10];
                const params = createNgTableParams({ dataset: initialDs });

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([initialDs, undefined]);
            });

            it('should fire when a new dataset is supplied as a settings value', () => {
                // given
                const initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                const params = createNgTableParams({ dataset: initialDs });

                // when
                const newDs = [5, 10];
                params.settings({ dataset: newDs });

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDs, initialDs]);
            });

            it('should fire when a dataset is removed from settings value', () => {
                // given
                const initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                const params = createNgTableParams({ dataset: initialDs });

                // when
                const newDs: number[] | undefined = undefined;
                params.settings({ dataset: newDs });

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDs, initialDs]);
            });

            it('should NOT fire when the same dataset array is supplied as a new settings value', () => {
                // given
                let callCount = 0;
                const initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                const params = createNgTableParams({ dataset: initialDs });

                // when
                params.settings({ dataset: initialDs });

                // then
                expect(callCount).toBe(1);
            });

            it('settings().dataset on publisher should reference the new dataset', () => {
                const initialDs = [1, 2];
                const newDs = [1, 2, 3];
                const params = createNgTableParams({ dataset: initialDs });
                ngTableEventsChannel.onDatasetChanged((params, newVal/*, oldVal*/) => {
                    expect(params.settings().dataset).toBe(newVal);
                });
                params.settings({ dataset: newDs });
            });

            it('should fire after afterCreated event', () => {
                // given
                const events: string[] = [];
                const initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((/*params, newVal, oldVal*/) => {
                    events.push('datasetChanged');
                });
                ngTableEventsChannel.onAfterCreated((/*params*/) => {
                    events.push('afterCreated');
                });

                // when
                createNgTableParams({ dataset: initialDs });

                // then
                expect(events[0]).toEqual('afterCreated');
                expect(events[1]).toEqual('datasetChanged');
            });
        });

        describe('afterDataFiltered', () => {
            it('should fire when a reload completes - no filter', () => {
                // given
                ngTableEventsChannel.onAfterDataFiltered((params, newVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal];
                });
                var data = [1, 2, 3];
                var params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: data });

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([data]);
            });

            it('should fire when a reload completes and the data is filtered', () => {
                // given
                ngTableEventsChannel.onAfterDataFiltered((params, newVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal];
                });

                var initialDs = [10, 10, 101, 5];
                var expectedDs = [10, 10, 101];  // when filtered with "10"
                var params = createNgTableParams({ dataset: initialDs });
                params.filter({ $: "10" });

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([expectedDs]);
            });
        });

        describe('afterDataSorted', () => {
            it('should fire when a reload completes - no order', () => {
                // given
                ngTableEventsChannel.onAfterDataSorted((params, newVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal];
                });
                var data = [1, 2, 3];
                var params = createNgTableParams({ count: 5 }, { counts: [5, 10], dataset: data });

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([data]);
            });

            it('should fire when a reload completes and the data is filtered', () => {
                // given
                ngTableEventsChannel.onAfterDataSorted((params, newVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal];
                });

                var initialDs = [10, 10, 101, 5];
                var expectedDs = [10, 10, 101];  // when filtered with "10"
                var params = createNgTableParams({ dataset: initialDs });
                params.filter({ $: "10" });

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([expectedDs]);
            });
        });
    })
});