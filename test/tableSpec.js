describe('ng-table', function () {
    var elm, scope, data = [
        {id: 1, name: "Moroni", age: 50, money: -10},
        {id: 2, name: "Tiancum", age: 43, money: 120},
        {id: 3, name: "Jacob", age: 27, money: 5.5},
        {id: 4, name: "Nephi", age: 29, money: -54},
        {id: 5, name: "Enos", age: 34, money: 110},
        {id: 6, name: "Tiancum", age: 43, money: 1000},
        {id: 7, name: "Jacob", age: 27, money: -201},
        {id: 8, name: "Nephi", age: 29, money: 100},
        {id: 9, name: "Enos", age: 34, money: -52.5},
        {id: 10, name: "Tiancum", age: 43, money: 52.1},
        {id: 11, name: "Jacob", age: 27, money: 110},
        {id: 12, name: "Nephi", age: 29, money: -55},
        {id: 13, name: "Enos", age: 34, money: 551},
        {id: 14, name: "Tiancum", age: 43, money: -1410},
        {id: 15, name: "Jacob", age: 27, money: 410},
        {id: 16, name: "Nephi", age: 29, money: 100},
        {id: 17, name: "Enos", age: 34, money: -100}
    ];

    beforeEach(module('ngTable'));

    beforeEach(inject(function ($rootScope, $compile, $q) {
        elm = angular.element(
            '<div>' +
                '<script type="text/ng-template" id="ng-table/filters/money.html"></script>' +
                '<table ng-table="tableParams" show-filter="true">' +
                '<tr ng-repeat="user in users">' +
                '<td data-title="\'Name of person\'" filter="{ \'name\': \'text\' }" sortable="name">' +
                '{{user.name}}' +
                '</td>' +
                '<td x-data-title="\'Age\'" filter="{ \'action\': \'button\' }" sortable="age">' +
                '{{user.age}}' +
                '</td>' +
                '<td title="\'Money\'" filter="{ \'action\': \'money\' }" filter-data="money($column)">' +
                '{{user.money}}' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>');

        scope = $rootScope.$new(true);

        scope.money = function() {
            var def = $q.defer();

            def.resolve([{
                'id': 10,
                'title': '10'
            }]);
            return def;
        };

        $compile(elm)(scope);
        scope.$digest();
    }));

    it('should create table header', inject(function ($compile, $rootScope) {
        var thead = elm.find('table thead');
        expect(thead.length).toBe(1);

        var rows = thead.find('tr');
        expect(rows.length).toBe(2);

        var titles = rows.eq(0).find('th');

        expect(titles.length).toBe(3);
        expect(titles.eq(0).text()).toBe('Name of person');
        expect(titles.eq(1).text()).toBe('Age');
        expect(titles.eq(2).text()).toBe('Money');

        var filters = rows.eq(1).find('th');
        expect(filters.length).toBe(3);
    }));

    it('should show scope data', inject(function ($compile, $rootScope, ngTableParams) {
        scope.users = data;

        scope.$digest();

        var tbody = elm.find('table tbody');
        expect(tbody.length).toBe(1);

        var rows = tbody.find('tr');
        expect(rows.length).toBe(scope.users.length);

        var params = new ngTableParams({
            page: 1,            // show first page
            total: data.length, // length of data
            count: 10           // count per page
        });
        scope.tableParams = params;
        scope.$watch('tableParams', function(params) {
            scope.users = data.slice((params.page - 1) * params.count, params.page * params.count);
        }, true);
        scope.$digest();

        rows = tbody.find('tr');
        expect(rows.length).toBe(10);

        scope.tableParams.page = 2;
        scope.$digest();
        
        rows = tbody.find('tr');
        expect(rows.length).toBe(7);
    }));

});

describe('ngTableParams', function () {
    var scope, ctrl;

    beforeEach(module('ngTable'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
    }));

    it('ngTableParams should be defined', inject(function (ngTableParams) {
        var params = new ngTableParams();
        expect(ngTableParams).toBeDefined();
    }));

    it('ngTableParams `page` parameter', inject(function (ngTableParams) {
        var params = new ngTableParams();

        expect(params.page).toBe(1);
        params.page = 2;
        expect(params.page).toBe(2);

        params = new ngTableParams({
            page: 3
        });
        expect(params.page).toBe(3);

        var callCount = 0;
        scope.tableParams = params;
        scope.$watch('tableParams', function (innerParams) {
            callCount++;
            expect(innerParams.page).toBe(4);
        });
        params.page = 4;
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

        expect(params.filter).toEqual({ 'name': 'test', 'age': 20 });
        expect(params.sorting).toEqual({ 'age': 'desc' }); // sorting only by one column

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
            'filter[age]': '20',
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

        params.sorting.name = 'desc';
        params.sorting.age = 'asc';

        expect(params.orderBy()).toEqual([ '-name', '+age' ]);
    }));

});