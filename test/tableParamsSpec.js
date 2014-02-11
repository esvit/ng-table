describe('ngTableParams', function () {
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

    it('ngTableParams should be defined', inject(function (ngTableParams) {
        var params = new ngTableParams();
        expect(ngTableParams).toBeDefined();
    }));

    it('ngTableParams test generatePagesArray', inject(function (ngTableParams) {
        var params = new ngTableParams();
        expect(params.generatePagesArray(1, 30, 10)).toEqual([
            { type: 'prev', number: 1, active: false },
            { type: 'first', number: 1, active: false },
            { type: 'page', number: 2, active: true },
            { type: 'last', number: 3, active: true },
            { type: 'next', number: 2, active: true }
        ]);
        expect(params.generatePagesArray(2, 30, 10)).toEqual([
            { type: 'prev', number: 1, active: true },
            { type: 'first', number: 1, active: true },
            { type: 'page', number: 2, active: false },
            { type: 'last', number: 3, active: true },
            { type: 'next', number: 3, active: true }
        ]);
        expect(params.generatePagesArray(2, 100, 10)).toEqual([
            { type: 'prev', number: 1, active: true },
            { type: 'first', number: 1, active: true },
            { type: 'page', number: 2, active: false },
            { type: 'page', number: 3, active: true },
            { type: 'page', number: 4, active: true },
            { type: 'page', number: 5, active: true },
            { type: 'page', number: 6, active: true },
            { type: 'page', number: 7, active: true },
            { type: 'more', active: false },
            { type: 'last', number: 10, active: true },
            { type: 'next', number: 3, active: true }
        ]);
    }));

    it('ngTableParams `page` parameter', inject(function (ngTableParams) {
        var params = new ngTableParams();

        expect(params.page()).toBe(1);
        expect(params.page(2)).toEqual(params);
        expect(params.page()).toBe(2);

        params = new ngTableParams({
            page: 3
        });
        expect(params.page()).toBe(3);

        var callCount = 0;
        scope.tableParams = params;
        scope.$watch('tableParams', function (innerParams) {
            callCount++;
            expect(innerParams.page()).toBe(4);
        });
        params.page(4);
        scope.$apply();
        expect(callCount).toBe(1);
        // repeat call
        scope.$apply();
        expect(callCount).toBe(1);
    }));

    it('ngTableParams parse url parameters', inject(function (ngTableParams) {
        var params = new ngTableParams({
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

    it('ngTableParams return url parameters', inject(function (ngTableParams) {
        var params = new ngTableParams({
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

    it('ngTableParams test orderBy', inject(function (ngTableParams) {
        var params = new ngTableParams({
            'sorting[name]': 'asc'
        });

        expect(params.orderBy()).toEqual([ '+name' ]); // for angular sorting function

        params.sorting({ name: 'desc', age: 'asc' });

        expect(params.orderBy()).toEqual([ '-name', '+age' ]);
    }));

    it('ngTableParams test settings', inject(function (ngTableParams) {
        var params = new ngTableParams();

        expect(params.settings()).toEqual({
            $scope: null,
            $loading: false,
            data: null,
            total: 0,
            defaultSort : 'desc',
            counts: [10, 25, 50, 100],
            getData: params.getData,
            getGroups: params.getGroups,
            filterDelay: 750
        });

        params = new ngTableParams({}, { total: 100 });

        expect(params.settings()).toEqual({
            $scope: null,
            $loading: false,
            data: null,
            total: 100,
            defaultSort : 'desc',
            counts: [10, 25, 50, 100],
            getData: params.getData,
            getGroups: params.getGroups,
            filterDelay: 750
        });
    }));

    it('ngTableParams test getData', inject(function ($q, ngTableParams) {
        var params = new ngTableParams();
        $defer = $q.defer();
        $defer.promise.then(function(data) {
            expect(data).toEqual([]);
        });
        params.getData($defer);
    }));

    it('ngTableParams test grouping', inject(function ($q, ngTableParams) {
        var params = new ngTableParams();
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
});
