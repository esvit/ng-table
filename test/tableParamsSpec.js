describe('NgTableParams', function () {
    var scope, ctrl, data = [
        {name: "Moroni", age: 50, role: 'Administrator'},
        {name: "Tiancum", age: 43, role: 'Administrator'},
        {name: "Jacob", age: 27, role: 'Administrator'},
        {name: "Nephi", age: 29, role: 'Moderator'},
        {name: "Enos", age: 34, role: 'User'},
        {name: "Tiancum", age: 43, role: 'User'},
        {name: "Jacob", age: 27, role: 'User'},
        {name: "Nephi", age: 29, role: 'Moderator'},
        {name: "Enos", age: 34, role: 'User'},
        {name: "Tiancum", age: 43, role: 'Moderator'},
        {name: "Jacob", age: 27, role: 'User'},
        {name: "Nephi", age: 29, role: 'User'},
        {name: "Enos", age: 34, role: 'Moderator'},
        {name: "Tiancum", age: 43, role: 'User'},
        {name: "Jacob", age: 27, role: 'User'},
        {name: "Nephi", age: 29, role: 'User'},
        {name: "Enos", age: 34, role: 'User'}
    ];
    beforeEach(module('ngTable'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
    }));

    it('NgTableParams should be defined', inject(function (NgTableParams) {
        var params = new NgTableParams();
        expect(NgTableParams).toBeDefined();
    }));

    it('NgTableParams test generatePagesArray', inject(function (NgTableParams) {
        var params = new NgTableParams();
        expect(params.generatePagesArray(1, 30, 10)).toEqual([
            { type: 'prev', number: 1, active: false },
            { type: 'first', number: 1, active: false, current: true },
            { type: 'page', number: 2, active: true, current: false },
            { type: 'last', number: 3, active: true, current: false },
            { type: 'next', number: 2, active: true }
        ]);
        expect(params.generatePagesArray(2, 30, 10)).toEqual([
            { type: 'prev', number: 1, active: true },
            { type: 'first', number: 1, active: true, current: false },
            { type: 'page', number: 2, active: false, current: true },
            { type: 'last', number: 3, active: true, current: false },
            { type: 'next', number: 3, active: true }
        ]);
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
        ]);
    }));

    it('NgTableParams `page` parameter', inject(function (NgTableParams) {
        var params = new NgTableParams();

        expect(params.page()).toBe(1);
        expect(params.page(2)).toEqual(params);
        expect(params.page()).toBe(2);

        params = new NgTableParams({
            page: 3
        });
        expect(params.page()).toBe(3);
    }));

    it('NgTableParams parse url parameters', inject(function (NgTableParams) {
        var params = new NgTableParams({
            'sorting[name]': 'asc',
            'sorting[age]': 'desc',
            'filter[name]': 'test',
            'filter[age]': 20
        });

        expect(params.filter()).toEqual({ 'name': 'test', 'age': 20 });
        expect(params.filter({})).toEqual(params);

        expect(params.sorting()).toEqual({ 'age': 'desc' }); // sorting only by one column
        expect(params.sorting({})).toEqual(params);
    }));

    it('NgTableParams return url parameters', inject(function (NgTableParams) {
        var params = new NgTableParams({
            'sorting[name]': 'asc',
            'sorting[age]': 'desc',
            'filter[name]': 'test',
            'filter[age]': 20
        });
        expect(params.url()).toEqual({
            'page': '1',
            'count': '1',
            'filter[name]': 'test',
            'filter[age]': 20,
            'sorting[age]': 'desc'
        });
        expect(params.url(true)).toEqual([
            'page=1',
            'count=1',
            'filter[name]=test',
            'filter[age]=20',
            'sorting[age]=desc'
        ]);
    }));

    it('NgTableParams test orderBy', inject(function (NgTableParams) {
        var params = new NgTableParams({
            'sorting[name]': 'asc'
        });

        expect(params.orderBy()).toEqual([ '+name' ]); // for angular sorting function

        params.sorting({ name: 'desc', age: 'asc' });

        expect(params.orderBy()).toEqual([ '-name', '+age' ]);
    }));

    it('NgTableParams test settings', inject(function (NgTableParams) {
        var params = new NgTableParams();

        expect(params.settings()).toEqual({
            $scope: null,
            $loading: false,
            data: null,
            total: 0,
            defaultSort : 'desc',
            counts: [10, 25, 50, 100],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator : 'span',
            getData: params.getData,
            getGroups: params.getGroups,
            filterDelay: 750
        });

        params = new NgTableParams({}, { total: 100 });

        expect(params.settings()).toEqual({
            $scope: null,
            $loading: false,
            data: null,
            total: 100,
            defaultSort : 'desc',
            counts: [10, 25, 50, 100],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator : 'span',
            getData: params.getData,
            getGroups: params.getGroups,
            filterDelay: 750
        });
    }));

    it('NgTableParams test getData', inject(function ($q, NgTableParams) {
        var params = new NgTableParams();
        $defer = $q.defer();
        $defer.promise.then(function(data) {
            expect(data).toEqual([]);
        });
        params.getData($defer);
    }));

    it('NgTableParams test grouping', inject(function ($q, NgTableParams) {
        var params = new NgTableParams();
        params.getData = function ($defer) {
            $defer.resolve(data);
        };

        $defer = $q.defer();
        $defer.promise.then(function (data) {

            expect(data).toEqual([
                {
                    value: 'Administrator',
                    data: [
                        {name: "Moroni", age: 50, role: 'Administrator'},
                        {name: "Tiancum", age: 43, role: 'Administrator'},
                        {name: "Jacob", age: 27, role: 'Administrator'}
                    ]
                },
                {
                    value: 'Moderator',
                    data: [
                        {name: "Nephi", age: 29, role: 'Moderator'},
                        {name: "Nephi", age: 29, role: 'Moderator'},
                        {name: "Tiancum", age: 43, role: 'Moderator'},
                        {name: "Enos", age: 34, role: 'Moderator'}
                    ]
                },
                {
                    value: 'User',
                    data: [
                        {name: "Enos", age: 34, role: 'User'},
                        {name: "Tiancum", age: 43, role: 'User'},
                        {name: "Jacob", age: 27, role: 'User'},
                        {name: "Enos", age: 34, role: 'User'},
                        {name: "Jacob", age: 27, role: 'User'},
                        {name: "Nephi", age: 29, role: 'User'},
                        {name: "Tiancum", age: 43, role: 'User'},
                        {name: "Jacob", age: 27, role: 'User'},
                        {name: "Nephi", age: 29, role: 'User'},
                        {name: "Enos", age: 34, role: 'User'}
                    ]
                }
            ]);
        });
        params.getGroups($defer, 'role');

        $defer = $q.defer();
        $defer.promise.then(function (data) {
            expect(data).toEqual([
                {
                    value: 50,
                    data: [
                        {name: "Moroni", age: 50, role: 'Administrator'}
                    ]
                },
                {
                    value: 43,
                    data: [
                        {name: "Tiancum", age: 43, role: 'Administrator'},
                        {name: "Tiancum", age: 43, role: 'User'},
                        {name: "Tiancum", age: 43, role: 'Moderator'},
                        {name: "Tiancum", age: 43, role: 'User'}
                    ]
                },
                {
                    value: 27,
                    data: [
                        {name: "Jacob", age: 27, role: 'Administrator'},
                        {name: "Jacob", age: 27, role: 'User'},
                        {name: "Jacob", age: 27, role: 'User'},
                        {name: "Jacob", age: 27, role: 'User'}
                    ]
                },
                {
                    value: 29,
                    data: [
                        {name: "Nephi", age: 29, role: 'Moderator'},
                        {name: "Nephi", age: 29, role: 'Moderator'},
                        {name: "Nephi", age: 29, role: 'User'},
                        {name: "Nephi", age: 29, role: 'User'}
                    ]
                },
                {
                    value: 34,
                    data: [
                        {name: "Enos", age: 34, role: 'User'},
                        {name: "Enos", age: 34, role: 'User'},
                        {name: "Enos", age: 34, role: 'Moderator'},
                        {name: "Enos", age: 34, role: 'User'}
                    ]
                }
            ]);
        });
        params.getGroups($defer, 'age');
    }));

    it('ngTableParams test defaults', inject(function ($q, ngTableParams, ngTableDefaults) {
        ngTableDefaults.params = {
            count: 2
        };
        ngTableDefaults.settings = {
            counts: []
        };
        var params = new ngTableParams();

        expect(params.count()).toEqual(2);
        expect(params.page()).toEqual(1);

        var settings = params.settings()
        expect(settings.counts.length).toEqual(0);
        expect(settings.filterDelay).toEqual(750);
    }));

    describe('hasFilter', function(){
        var tableParams;

        beforeEach(inject(function(NgTableParams){
            tableParams = new NgTableParams({}, {});
        }));

        it('should return false for an empty filter object', function(){
            tableParams.filter({});
            expect(tableParams.hasFilter()).toBeFalsy();
        });

        it('should return true for when filter has a field with a significant value', function(){
            tableParams.filter({ a: 'b' });
            expect(tableParams.hasFilter()).toBeTruthy();

            tableParams.filter({ a: 0 });
            expect(tableParams.hasFilter()).toBeTruthy();
        });

        it('should return false when filter only has insignificant field values', function(){
            tableParams.filter({ a: '' });
            expect(tableParams.hasFilter()).toBeFalsy();

            tableParams.filter({ a: null });
            expect(tableParams.hasFilter()).toBeFalsy();

            tableParams.filter({ a: undefined });
            expect(tableParams.hasFilter()).toBeFalsy();

            tableParams.filter({ a: undefined, b: '', c: undefined });
            expect(tableParams.hasFilter()).toBeFalsy();

            //tableParams.filter({ a: NaN });
            //expect(tableParams.hasFilter()).toBeFalsy();
        });
    });
});
