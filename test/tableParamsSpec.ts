describe('NgTableParams', () => {
    interface IScopeWithPrivates extends ng.IScope {
        $$listenerCount: { [name: string]: number }
    }
    
    var scope: ng.IScope,
        NgTableParams: NgTable.ITableParamsConstructor<any>,
        $rootScope: IScopeWithPrivates;

    beforeEach(angular.mock.module("ngTable"));
    beforeEach(() => {
        angular.mock.module(($provide: ng.auto.IProvideService) => {
            $provide.decorator('ngTableDefaultGetData', createSpy);


            createSpy.$inject = ['$delegate'];
            function createSpy(ngTableDefaultGetData: NgTable.Data.IDefaultGetData<any>){
                return jasmine.createSpy('ngTableDefaultGetDataSpy',ngTableDefaultGetData).and.callThrough();
            }
        });
    });

    beforeEach(inject(($controller: ng.IControllerService, _$rootScope_: IScopeWithPrivates, _NgTableParams_: NgTable.ITableParamsConstructor<any>) => {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        NgTableParams = _NgTableParams_;
    }));

    function createNgTableParams<T>(initialParams?: NgTable.IParamValues<T>, settings?: NgTable.ISettings<T>) : NgTableParams<T>;
    function createNgTableParams<T>(settings?: NgTable.ISettings<T>) : NgTableParams<T>;
    function createNgTableParams<T>(settings?: any) : NgTableParams<T> {
        var initialParams: NgTable.IParamValues<T>;
        if (arguments.length === 2){
            initialParams = arguments[0];
            settings = arguments[1];
        }

        settings = angular.extend({}, settings);
        settings.filterOptions = angular.extend({}, {
            filterDelay: 0
        }, settings.filterOptions);
        var tableParams = new NgTableParams(initialParams, settings);
        spyOn(tableParams.settings(), 'getData').and.callThrough();
        return tableParams;
    }

    it('NgTableParams should be defined', () => {
        expect(NgTableParams).toBeDefined();
    });

    describe('generatePagesArray', () => {
        it('should generate pages array using arguments supplied', () => {
            //crap
            var params = new NgTableParams();
            expect(params.generatePagesArray(1, 30, 10)).toEqual([
                { type: 'prev', number: 1, active: false },
                { type: 'first', number: 1, active: false, current: true },
                { type: 'page', number: 2, active: true, current: false },
                { type: 'last', number: 3, active: true, current: false },
                { type: 'next', number: 2, active: true }
            ] as NgTable.IPageButton[]);
            expect(params.generatePagesArray(2, 30, 10)).toEqual([
                { type: 'prev', number: 1, active: true },
                { type: 'first', number: 1, active: true, current: false },
                { type: 'page', number: 2, active: false, current: true },
                { type: 'last', number: 3, active: true, current: false },
                { type: 'next', number: 3, active: true }
            ] as NgTable.IPageButton[]);
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
            ] as NgTable.IPageButton[]);
        });

        it('should use own parameter values to generate pages when no arguments supplied', () => {
            var params = new NgTableParams({ page: 2, count: 10 }, { total: 30 });

            expect(params.generatePagesArray()).toEqual([
                { type: 'prev', number: 1, active: true },
                { type: 'first', number: 1, active: true, current: false },
                { type: 'page', number: 2, active: false, current: true },
                { type: 'last', number: 3, active: true, current: false },
                { type: 'next', number: 3, active: true }
            ] as NgTable.IPageButton[]);

        });
    });

    it('NgTableParams `page` parameter', () => {
        var params = new NgTableParams();

        expect(params.page()).toBe(1);
        expect(params.page(2)).toEqual(params);
        expect(params.page()).toBe(2);

        params = new NgTableParams({
            page: 3
        });
        expect(params.page()).toBe(3);
    });

    it('NgTableParams parse url parameters', () => {
        var params = new NgTableParams({
            'sorting[name]': 'asc',
            'sorting[age]': 'desc',
            'filter[name]': 'test',
            'filter[age]': '20',
            'group[name]' : 'asc',
            'group[age]' : 'desc',
            'group[surname]' : undefined
        } as any);

        expect(params.filter()).toEqual({ 'name': 'test', 'age': 20 });
        expect(params.sorting()).toEqual({ 'age': 'desc' }); // sorting only by one column - todo: remove restriction
        expect(params.group()).toEqual({ 'name' : 'asc', 'age': 'desc', 'surname': undefined });
    });

    it('NgTableParams return url parameters', () => {
        var params = new NgTableParams({
            'sorting[name]': 'asc',
            'sorting[age]': 'desc',
            'filter[name]': 'test',
            'filter[age]': '20',
            'group[name]' : 'asc',
            'group[age]' : 'desc',
            'group[surname]' : ''
        } as any);
        expect(params.url()).toEqual({
            'page': '1',
            'count': '10',
            'filter[name]': 'test',
            'filter[age]': '20',
            'sorting[age]': 'desc',  // sorting only by one column - todo: remove restriction
            'group[name]' : 'asc',
            'group[age]' : 'desc',
            'group[surname]' : ''
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
        var params = new NgTableParams({
            sorting: { name: 'asc'}
        });

        expect(params.orderBy()).toEqual([ '+name' ]); // for angular sorting function

        params.sorting({ name: 'desc', age: 'asc' });

        expect(params.orderBy()).toEqual([ '-name', '+age' ]);
    });

    describe('group', () => {
        it('one group', () => {
            var params = new NgTableParams({
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
            var params = new NgTableParams({
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
            var params = new NgTableParams({
                group: angular.identity
            });

            expect(params.hasGroup()).toBe(true);
            expect(params.hasGroup(angular.identity)).toBe(true);
            expect(params.hasGroup(angular.identity, params.settings().groupOptions.defaultSort)).toBe(true);
            expect(params.group()).toEqual(angular.identity);


            var fn: NgTable.IGroupingFunc<any> = () => '';
            fn.sortDirection = 'desc';
            params.group(fn);
            expect(params.hasGroup(fn)).toBe(true);
            expect(params.hasGroup(fn, 'desc')).toBe(true);
            expect(params.group()).toEqual(fn);
        });

        it('can clear group', () => {
            var params = new NgTableParams({
                group: 'role'
            });

            expect(params.hasGroup()).toBe(true); // checking assumptions

            params.group({});
            expect(params.hasGroup()).toBe(false);
            expect(params.group()).toEqual({});
        });

        it('multiple groups', () => {
            var params = new NgTableParams({
                group: 'role'
            }, {
                groupOptions: { defaultSort: 'desc' }
            });

            var newGroups = _.extend<{}, NgTable.IGroupValues>({}, params.group(), { age: 'desc'});
            params.group(newGroups);
            expect(params.hasGroup()).toBe(true);
            expect(params.hasGroup('role')).toBe(true);
            expect(params.hasGroup('role', 'desc')).toBe(true);
            expect(params.hasGroup('age')).toBe(true);
            expect(params.hasGroup('age', 'desc')).toBe(true);
            expect(params.group()).toEqual({ role: 'desc', age: 'desc' });

            params.group({ role: 'asc', age: 'asc'});
            expect(params.hasGroup('age', 'desc')).toBe(false);
            expect(params.hasGroup('age', 'asc')).toBe(true);
            expect(params.group()).toEqual({ role: 'asc', age: 'asc' });
        });

        it('should apply current defaultSort from groupOptions', () => {
            var params = new NgTableParams({
                group: 'role'
            }, {
                groupOptions: { defaultSort: 'desc' }
            });

            params.settings({ groupOptions: { defaultSort: 'asc' }});

            params.group('age');
            expect(params.group()).toEqual({ age: 'asc' });
        });

        it('should not apply defaultSort from groupOptions when explicitly set to empty string', () => {
            var params = new NgTableParams({
                group: 'role'
            }, {
                groupOptions: { defaultSort: 'desc' }
            });
            expect(params.group()).toEqual({ role: 'desc' }); // checking assumptions

            params.group({ role: ''});
            expect(params.group()).toEqual({ role: '' });

            params.group({ age: undefined});
            expect(params.group()).toEqual({ age: 'desc' });

            params.group({ role: null});
            expect(params.group()).toEqual({ role: 'desc' });
        });
    });

    describe('settings', () => {

        it('defaults', () => {
            var params = new NgTableParams();

            var expectedSettings: NgTable.ISettings<any> = {
                $loading: false,
                dataset: null,
                total: 0,
                defaultSort: 'desc',
                counts: [10, 25, 50, 100],
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
                groupOptions: { defaultSort: 'asc', isExpanded: true }
            };
            expect(params.settings()).toEqual(jasmine.objectContaining(expectedSettings));
            expect(params.settings().getData).toEqual(jasmine.any(Function));
            expect(params.settings().getGroups).toEqual(jasmine.any(Function));

            params = new NgTableParams({}, {
                total: 100,
                counts: [1,2],
                groupOptions: { isExpanded: false } });

            expectedSettings.total = 100;
            expectedSettings.counts = [1,2];
            expectedSettings.groupOptions = { defaultSort: 'asc', isExpanded: false };
            expect(params.settings()).toEqual(jasmine.objectContaining(expectedSettings));
        });

        it('changing settings().dataset should reset page to 1', () => {
            // given
            var tableParams = createNgTableParams({ count: 1, page: 2 }, { dataset: [1,2,3]});
            tableParams.reload();
            scope.$digest();
            expect(tableParams.page()).toBe(2); // checking assumptions

            // when
            tableParams.settings({ dataset: [1,2,3, 4]});

            // then
            expect(tableParams.page()).toBe(1);
        });

        it('should not set filterDelay when working with synchronous dataset', () => {
            // given
            var tableParams = new NgTableParams({}, { dataset: [1,2,3]});
            expect(tableParams.settings().filterOptions.filterDelay).toBe(0);
        });

        it('should not set filterDelay when working with synchronous dataset (empty dataset)', () => {
            // given
            var tableParams = new NgTableParams({}, { dataset: []});
            expect(tableParams.settings().filterOptions.filterDelay).toBe(0);
        });

        it('should set filterDelay when not certain working with synchronous dataset', () => {
            // given
            var tableParams = new NgTableParams({}, { dataset: [1,2], getData: () => {
                // am I sync or async?
                return [1];
            }});
            expect(tableParams.settings().filterOptions.filterDelay).toBe(500);
        });

        it('should set filterDelay when dataset exceeds filterDelayThreshold', () => {
            // given
            var tableParams = new NgTableParams({}, { filterOptions: { filterDelayThreshold: 5 }, dataset: [,2,3,4,5,6] });
            expect(tableParams.settings().filterOptions.filterDelay).toBe(500);
        });

        it('should allow filterDelay to be set explicitly', () => {
            // given
            var tableParams = new NgTableParams({}, { filterOptions: { filterDelay: 100}, dataset: [1,2] });
            expect(tableParams.settings().filterOptions.filterDelay).toBe(100);
        });
    });

    describe('reload', () => {

        it('should call getData to retrieve data', () => {
            var tp = createNgTableParams();
            tp.reload();
            scope.$digest();
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should add the results returned by getData to the data field', () => {
            var tp = createNgTableParams({ getData: () => [1,2,3] });
            tp.reload();
            scope.$digest();
            expect(tp.data).toEqual([1,2,3]);
        });

        it('should use ngTableDefaultGetData function when NgTableParams not supplied a getData function', inject((ngTableDefaultGetData: jasmine.Spy) => {
            // given
            var tp = createNgTableParams();

            // when
            tp.reload();
            scope.$digest();

            // then
            expect(ngTableDefaultGetData).toHaveBeenCalled();
        }));

        it('should propagate rejection reason from getData', inject(($q: ng.IQService) => {
            // given
            var tp = createNgTableParams({ getData: () => $q.reject('bad response')});

            // when
            var actualRejection: string;
            tp.reload().catch(reason => {
                actualRejection = reason;
            });
            scope.$digest();

            // then
            expect(actualRejection).toBe('bad response');
        }));
    });

    describe('getGroups', () => {

        interface IEmployee {
            name: string;
            role: string;
        }

        var dataset: IEmployee[];
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
            var tp = createNgTableParams({ count: 2, group: { role: '' } }, { dataset: dataset });

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            var expectedRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[] = [
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
            var tp = createNgTableParams({
                count: 2,
                sorting: { name: 'desc'},
                group: { role: '' }
            }, { dataset: dataset });

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IEmployee>>().then(groups => {
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
            var grouper: NgTable.IGroupingFunc<IEmployee> = (item) => item.name[0];
            grouper.sortDirection = '';
            var tp = createNgTableParams({
                count: 2,
                sorting: {name: 'desc'},
                group: grouper
            }, {dataset: dataset});

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IEmployee>>().then(groups => {
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
            var tp = createNgTableParams({
                count: 2,
                sorting: { name: 'desc' },
                filter: { name: 'e' },
                group: { role: '' }
            }, {
                dataset: dataset
            });

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IEmployee>>().then(groups => {
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
            var tp = createNgTableParams({
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

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IEmployee>>().then(groups => {
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
            var groupFn: NgTable.IGroupingFunc<IEmployee> = item => item.role;
            groupFn.sortDirection = 'desc';
            var tp = createNgTableParams({
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

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IEmployee>>().then(groups => {
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

        interface IComplexEmployee {
            details: { name: string, role: string };
        }

        var dataset: IComplexEmployee[];
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
            var tp = createNgTableParams({ count: 2, group: { 'details.role': '' } }, { dataset: dataset });

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[] = [
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
            var tp = createNgTableParams({
                count: 2,
                sorting: { 'details.name': 'desc'},
                group: { 'details.role': '' }
            }, { dataset: dataset });

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[] = [
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
            var grouper: NgTable.IGroupingFunc<IComplexEmployee> = item => item.details.name[0];
            grouper.sortDirection = '';
            var tp = createNgTableParams({
                count: 2,
                sorting: {'details.name': 'desc'},
                group: grouper
            }, {dataset: dataset});

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[] = [
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
            var tp = createNgTableParams({
                count: 2,
                sorting: { 'details.name': 'desc' },
                filter: { 'details.name': 'e' },
                group: { 'details.role': '' }
            }, {
                dataset: dataset
            });

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[] = [
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
            var tp = createNgTableParams({
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

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();
            
            let expectedRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[] = [
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
            var groupFn: NgTable.IGroupingFunc<IComplexEmployee> = item => item.details.role;
            groupFn.sortDirection = 'desc';
            var tp = createNgTableParams({
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

            var actualRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[];
            tp.reload<NgTable.Data.IDataRowGroup<IComplexEmployee>>().then(groups => {
                actualRoleGroups = groups;
            });
            $rootScope.$digest();

            let expectedRoleGroups: NgTable.Data.IDataRowGroup<IComplexEmployee>[] = [
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

    it('ngTableParams test defaults', inject(($q: ng.IQService, ngTableDefaults: NgTable.IDefaults) => {
        ngTableDefaults.params.count = 2;
        ngTableDefaults.settings.counts = [];
        var tp = new NgTableParams();

        expect(tp.count()).toEqual(2);
        expect(tp.page()).toEqual(1);

        var settings = tp.settings();
        expect(settings.counts.length).toEqual(0);
        expect(settings.interceptors.length).toEqual(0);
        expect(settings.filterOptions.filterDelay).toEqual(500);

        ngTableDefaults.settings.interceptors = [ { response: angular.identity }];
        tp = new NgTableParams();
        expect(tp.settings().interceptors.length).toEqual(1);
    }));

    describe('hasFilter', () => {
        var tp: NgTableParams<any>;

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
        var tp: NgTableParams<{}>;

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

        it('should return false when getData fails', inject(($q: ng.IQService) => {
            tp.settings({ getData: () => $q.reject('bad response')});
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false);
        }));

        it('should detect direct changes to parameters', inject(($q: ng.IQService) => {
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
                tp.filter({ age: 1});
            });
            verifyIsDataReloadRequired(() => {
                tp.page(55);
            });
            verifyIsDataReloadRequired(() => {
                tp.sorting({ age: 'desc'});
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

            var grouper: NgTable.IGroupingFunc<any> = () => '';
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
            tp.filter({ age: 1});
            tp.reload();
            scope.$digest();

            // when, then...
            tp.filter({ age: 1});
            expect(tp.isDataReloadRequired()).toBe(false);
        });

        it('should return true when new settings dataset array supplied', () => {
            // given
            tp.reload();
            scope.$digest();

            verifyIsDataReloadRequired(() => {
                tp.settings({ dataset: [11,22,33]});
            });
        });

        it('should return true when existing settings dataset array is unset', () => {
            // given
            tp = createNgTableParams({ dataset: [1,2,3]});
            tp.reload();
            scope.$digest();

            verifyIsDataReloadRequired(() => {
                tp.settings({ dataset: null});
            });
        });

        it('status should not change when settings called without a dataset array', () => {
            // given
            tp = createNgTableParams({ dataset: [1,2,3]});
            tp.reload();
            scope.$digest();

            // when, then...
            tp.settings({ total : 100 });
            expect(tp.isDataReloadRequired()).toBe(false);
        });


        function verifyIsDataReloadRequired(modifer: Function){
            modifer();
            expect(tp.isDataReloadRequired()).toBe(true);
            tp.reload();
            scope.$digest();
            expect(tp.isDataReloadRequired()).toBe(false);
        }
    });

    describe('hasFilterChanges', () => {
        var tp: NgTableParams<{}>;

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

        it('should return true when getData fails', inject(($q: ng.IQService) => {
            tp.settings({ getData: () => $q.reject('bad response')});
            tp.reload();
            scope.$digest();
            expect(tp.hasFilterChanges()).toBe(false);
        }));

        it('should detect direct changes to filters', inject(($q: ng.IQService) => {
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
            tp.filter({ age: 1});
            expect(tp.hasFilterChanges()).toBe(true);
            tp.reload();
            scope.$digest();
            expect(tp.hasFilterChanges()).toBe(false);
        });

        it('should return false when filters "touched" but not modified', () => {
            // given
            tp.filter({ age: 1});
            tp.reload();
            scope.$digest();

            // when, then...
            tp.filter({ age: 1});
            expect(tp.hasFilterChanges()).toBe(false);
        });

        it('status should not change just because new settings dataset array supplied', () => {
            // given
            tp.reload();
            scope.$digest();

            // when, then...
            tp.settings({ dataset: [11,22,33]});
            expect(tp.hasFilterChanges()).toBe(false);
        });

    });

    describe('hasErrorState', () => {
        var tp: NgTableParams<{}>;

        it('should return false until reload fails', inject(($q: ng.IQService) => {
            // given
            tp = createNgTableParams({ getData: () => {
                if ((tp.settings().getData as jasmine.Spy).calls.count() > 2){
                    return $q.reject('bad response');
                }
                return $q.when([1,2]);
            }});

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

        it('should return false once parameter values change', inject(($q: ng.IQService) => {
            // given
            tp = createNgTableParams({ getData: () => $q.reject('bad response')});

            // when, then
            tp.reload();
            scope.$digest();
            expect(tp.hasErrorState()).toBe(true);
            tp.filter({ age: 598});
            expect(tp.hasErrorState()).toBe(false);
        }));
    });

    describe('interceptors', () => {

        it('can register interceptor', () => {
            var interceptor = { response: angular.identity };
            var tp = createNgTableParams({ interceptors: [interceptor]});
            expect(tp.settings().interceptors).toEqual([interceptor]);
        });

        it('can register multiple interceptor', () => {
            var interceptors = [{ response: angular.identity }, { response: angular.identity }];
            var tp = createNgTableParams({ interceptors: interceptors});
            expect(tp.settings().interceptors).toEqual(interceptors);
        });

        it('can register interceptors after NgTableParams created', () => {
            var interceptor = { response: angular.identity };
            var interceptor2 = { response: angular.identity };
            var tp = createNgTableParams({ interceptors: [interceptor]});
            var interceptors = tp.settings().interceptors.concat([interceptor2]);
            tp.settings({ interceptors: interceptors});
            expect(tp.settings().interceptors).toEqual(interceptors);
        });

        describe('one response interceptor', () => {

            it('should receive response from call to getData', () => {
                // given
                var interceptor = {
                    hasRun: false,
                    response: function(data: number[]/*,params*/) {
                        this.hasRun = true;
                        return data;
                    }
                };
                var tp = createNgTableParams({ interceptors: [interceptor]});

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptor.hasRun).toBeTruthy();
            });

            it('should be able to modify data returned by getData', () => {
                type Row = {modified: boolean};
                // given
                var interceptor = {
                    response: (data: Row[]/*, params*/) => {
                        data.forEach(item => {
                            item.modified = true;
                        });
                        return data;
                    }
                };
                var tp = createNgTableParams<Row>({ interceptors: [interceptor], getData: () => [{}, {}]});
                

                // when
                var actualData: Row[];
                tp.reload<Row>().then(data => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual([{ modified: true }, { modified: true }]);
            });

            it('should be able to replace data returned by getData', () => {
                // given
                var interceptor = {
                    response: (data: number[]/*, params*/) => data.map(item => item * 2)
                };
                var tp = createNgTableParams({ interceptors: [interceptor], getData: () => [2, 3]});

                // when
                var actualData: number[];
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
                var interceptor = {
                    response: (data: QueryResult, params: NgTableParams<number>) => {
                        params.total(data.total);
                        return data.results;
                    }
                };
                var tp = createNgTableParams({}, { interceptors: [interceptor], getData: () => {
                    return { results: [1,2,3], total: 3}; 
                }});

                // when
                var actualData: number[];
                tp.reload<number>().then(data => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual([1,2,3]);
                expect(tp.total()).toEqual(3);
            });
        });

        describe('one responseError interceptor', () => {

            it('should receive rejections from getData', inject(($q: ng.IQService) => {
                // given
                var interceptor = {
                    actualReason: '',
                    responseError: function(reason: string/*, params*/) {
                        this.actualReason = reason;
                    }
                };
                var tp = createNgTableParams({
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
                var interceptor = {
                    hasRun: false,
                    responseError: function(/*reason, params*/) {
                        this.hasRun = true;
                    }
                };
                var tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => {
                        throw new Error('BANG!');
                    }
                });

                // when, then
                expect(tp.reload).toThrow();
                expect(interceptor.hasRun).toBeFalsy();
            });

            it('should be able to modify reason returned by getData', inject(($q: ng.IQService) => {
                interface IResponseError {
                    description: string;
                    code?: number;
                }
                
                // given
                var interceptor = {
                    responseError: (reason: IResponseError/*, params*/) => {
                        reason.code = 400;
                        return $q.reject(reason);
                    }
                };
                var tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => $q.reject({ description: 'crappy data'})
                });

                // when
                var actualReason: IResponseError;
                tp.reload().catch(reason => {
                    actualReason = reason;
                });
                scope.$digest();

                // then
                expect(actualReason.code).toBe(400);
                expect(actualReason.description).toBe('crappy data');
            }));

            it('should be able to replace reason returned by getData', inject(($q: ng.IQService) => {
                // given
                var interceptor = {
                    responseError: (/*reason, params*/) => $q.reject('Cancelled by user')
                };
                var tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => $q.reject('BANG!')
                });

                // when
                var actualReason: string;
                tp.reload().catch(reason => {
                    actualReason = reason;
                });
                scope.$digest();

                // then
                expect(actualReason).toBe('Cancelled by user');
            }));

            it('should be able to access tableParams supplied to getData', () => {
                // given
                var interceptor = {
                    actualParams: null as NgTableParams<number>,
                    response: function (data: number[], params: NgTableParams<number>) {
                        this.actualParams = params;
                    }
                };
                var tp = createNgTableParams({ interceptors: [interceptor]});

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptor.actualParams).toBe(tp);
            });
        });

        describe('one response plus responseError interceptor', () => {

            it('should NOT call responseError on same interceptor whose response method fails', inject(($q: ng.IQService) => {
                // given
                var interceptor = {
                    hasRun: false,
                    response: (/*data, params*/) => $q.reject('BANG!'),
                    responseError: function(reason: any/*, params*/) {
                        this.hasRun = true;
                    }
                };
                var tp = createNgTableParams({
                    interceptors: [interceptor],
                    getData: (/*params*/) => [1,2,3]
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
                var callCount = 0;
                var interceptor = {
                    sequence: 0,
                    response: function(/*data, params*/) {
                        this.sequence = callCount;
                        callCount++;
                    }
                };
                var interceptors = [interceptor, angular.copy(interceptor)];
                var tp = createNgTableParams({ interceptors: interceptors});

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(interceptors[0].sequence).toBe(0);
                expect(interceptors[1].sequence).toBe(1);
            });

            it('results of one interceptor should be piped to the next validator', () => {
                // given
                var interceptor = {
                    response: (data: number[]/*, params*/) => data.map(item => item * 2)
                };
                var interceptor2 = {
                    response: (data: number[]/*, params*/) => data.map(item => item.toString() + '0')
                };
                var tp = createNgTableParams({ interceptors: [interceptor, interceptor2], getData: () => [2, 3]});

                // when
                var actualData: string[];
                tp.reload().then((data: any) => {
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual(['40', '60']);
            });
        });

        describe('multiple response and responseError interceptors', () => {

            it('responseError of next interceptor should receive failures from previous interceptor', inject(($q: ng.IQService) => {
                // given
                var badInterceptor = {
                    response: (/*data, params*/) => $q.reject('BANG!')
                };
                var nextInterceptor = {
                    hasRun: false,
                    responseError: function(/*reason, params*/) {
                        this.hasRun = true;
                    }
                };
                var tp = createNgTableParams({ interceptors: [badInterceptor, nextInterceptor]});

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(nextInterceptor.hasRun).toBe(true);
            }));

            it('should call next response interceptor when previous interceptor recovers from failure', inject(($q: ng.IQService) => {
                // given
                var badInterceptor = {
                    response: (/*data, params*/) => $q.reject('BANG!')
                };
                var recoveringInterceptor = {
                    responseError: (/*reason, params*/) => [8894,58]
                };
                var recoveredData: number[];
                var nextInterceptor = {
                    hasRun: false,
                    response: function (data: number[]/*, params*/) {
                        this.hasRun = true;
                        recoveredData = data;
                    }
                };
                var tp = createNgTableParams({ interceptors: [badInterceptor, recoveringInterceptor, nextInterceptor]});

                // when
                tp.reload();
                scope.$digest();

                // then
                expect(nextInterceptor.hasRun).toBe(true);
                expect(recoveredData).toEqual([8894,58]);
            }));
        });
    });

    describe('events', () => {

        var actualEventArgs: any[],
            actualPublisher: NgTableParams<any>,
            fakeTableParams: NgTable.InternalTableParams<any>,
            ngTableEventsChannel: NgTable.Events.IEventsChannel & {[name: string] : Function};

        beforeEach(inject((_ngTableEventsChannel_: NgTable.Events.IEventsChannel & {[name: string] : Function}) => {
            ngTableEventsChannel = _ngTableEventsChannel_;
            fakeTableParams = {} as any;
            actualPublisher = undefined;
            actualEventArgs = undefined;
        }));

        function getSubscriberCount(){
            var allEventNames = Object.keys($rootScope.$$listenerCount);
            var ngTableEvents = allEventNames.filter(event => event.indexOf('ngTable:') === 0);
            return ngTableEvents.reduce((result, event) => {
                result += $rootScope.$$listenerCount[event];
                return result;
            }, 0);
        }

        describe('general pub/sub mechanics', () => {

            var supportedEvents = ['DatasetChanged', 'AfterReloadData', 'PagesChanged', 'AfterCreated'];

            it('should be safe to publish event when no subscribers', () => {

                function test(event: string) {
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                }

                supportedEvents.forEach(test);
            });

            it('publishing event should notify registered subscribers (one)', () => {

                function test(event: string){
                    // given
                    var cbCount = 0;
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

                function test(event: string){
                    // given
                    var cb1Count = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cb1Count++;
                    });
                    var cb2Count = 0;
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

                function test(event: string){
                    // given
                    var cbCount = 0;
                    var subscription = ngTableEventsChannel['on' + event](() => {
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

                function test(event: string){
                    // given
                    var childScope = $rootScope.$new();
                    var cbCount = 0;
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

                function test(event: string){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    }, function(publisher: {}){
                        return publisher === fakeTableParams;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                    var anoParams = {};
                    ngTableEventsChannel['publish' + event](anoParams);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('should not notify subscribers who have filter not to receive event based on arg values', () => {

                function test(event: string){
                    // given
                    var cbCount = 0;
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
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](() => {
                        cbCount++;
                    }, fakeTableParams);

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                    var anoParams = {};
                    ngTableEventsChannel['publish' + event](anoParams);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('publisher should be supplied to subscriber callback', () => {

                function test(event: string){
                    // given
                    ngTableEventsChannel['on' + event](function(params: NgTableParams<any>){
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

                function test(event: string){
                    // given
                    ngTableEventsChannel['on' + event](function(params: NgTableParams<any>, ...args: any[]){
                        actualPublisher = params;
                        actualEventArgs = args;
                    });

                    // when
                    var arg1 = [1, 2];
                    var arg2 = [1];
                    ngTableEventsChannel['publish' + event](fakeTableParams, arg1, arg2);

                    // then
                    expect(actualEventArgs).toEqual([arg1, arg2]);
                }

                supportedEvents.forEach(test);
            });

            it('subscribers should never receive events from null instance of tableParams', () => {

                function test(event: string){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(params: {}/*, ...args*/){
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
                var params = createNgTableParams();

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
                var newDatapage = [1, 5, 6];
                var params = createNgTableParams({ getData: () => newDatapage});

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDatapage, []]);
            });

            it('should fire on reload even if datapage remains the same array', () => {
                // given
                var callCount = 0;
                ngTableEventsChannel.onAfterReloadData((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                var dataPage = [1,2,3];
                var params = createNgTableParams({ getData: () => dataPage});

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
                var events: string[] = [];
                ngTableEventsChannel.onAfterReloadData((/*params, newVal, oldVal*/) => {
                    events.push('afterReloadData');
                });
                ngTableEventsChannel.onAfterCreated((/*params*/) => {
                    events.push('afterCreated');
                });

                // when
                var params = createNgTableParams({}, {dataset: [1,2,3,4,5,6]});
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
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], dataset: [1,2,3,4,5,6]});

                // when
                params.reload();
                scope.$digest();

                // then
                var expectedPages = params.generatePagesArray(params.page(), params.total(), params.count());
                expect(expectedPages.length).toBeGreaterThan(0); // checking assumptions
                expect(actualEventArgs).toEqual([expectedPages, undefined]);
            });

            it('should fire when a reload completes - no data', () => {
                // given
                ngTableEventsChannel.onPagesChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], dataset: []});

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualEventArgs).toEqual([[], undefined]);
            });

            it('should fire when a reload completes (multiple)', () => {
                // given
                var callCount = 0;
                ngTableEventsChannel.onPagesChanged((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], dataset: [1,2,3,4,5,6]});

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
                var callCount = 0;
                ngTableEventsChannel.onPagesChanged((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], dataset: [1,2,3,4,5,6]});
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
                var events: string[] = [];
                ngTableEventsChannel.onPagesChanged((/*params, newVal, oldVal*/) => {
                    events.push('pagesChanged');
                });
                ngTableEventsChannel.onAfterCreated((/*params*/) => {
                    events.push('afterCreated');
                });

                // when
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], dataset: [1,2,3,4,5,6]});
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
                var initialDs = [5, 10];
                var params = createNgTableParams({ dataset: initialDs});

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([initialDs, null]);
            });

            it('should fire when a new dataset is supplied as a settings value', () => {
                // given
                var initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                var params = createNgTableParams({ dataset: initialDs});

                // when
                var newDs = [5, 10];
                params.settings({ dataset: newDs});

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDs, initialDs]);
            });

            it('should fire when a dataset is removed from settings value', () => {
                // given
                var initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((params, newVal, oldVal) => {
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                var params = createNgTableParams({ dataset: initialDs});

                // when
                var newDs: number[] = null;
                params.settings({ dataset: newDs});

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDs, initialDs]);
            });

            it('should NOT fire when the same dataset array is supplied as a new settings value', () => {
                // given
                var callCount = 0;
                var initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((/*params, newVal, oldVal*/) => {
                    callCount++;
                });
                var params = createNgTableParams({ dataset: initialDs});

                // when
                params.settings({ dataset: initialDs});

                // then
                expect(callCount).toBe(1);
            });

            it('settings().dataset on publisher should reference the new dataset', () => {
                var initialDs = [1, 2];
                var newDs = [1, 2, 3];
                var params = createNgTableParams({ dataset: initialDs});
                ngTableEventsChannel.onDatasetChanged((params, newVal/*, oldVal*/) => {
                    expect(params.settings().dataset).toBe(newVal);
                });
                params.settings({ dataset: newDs});
            });

            it('should fire after afterCreated event', () => {
                // given
                var events: string[] = [];
                var initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged((/*params, newVal, oldVal*/) => {
                    events.push('datasetChanged');
                });
                ngTableEventsChannel.onAfterCreated((/*params*/) => {
                    events.push('afterCreated');
                });

                // when
                createNgTableParams({ dataset: initialDs});

                // then
                expect(events[0]).toEqual('afterCreated');
                expect(events[1]).toEqual('datasetChanged');
            });
        });
    })
});
