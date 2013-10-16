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
                '<tr ng-repeat="user in $data">' +
                '<td data-title="\'Name of person\'" filter="{ \'name\': \'text\' }" sortable="name">' +
                '{{user.name}}' +
                '</td>' +
                '<td x-data-title="\'Age\'" sortable="age">' +
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
        var thead = elm.find('thead');
        expect(thead.length).toBe(1);

        var rows = thead.find('tr');
        expect(rows.length).toBe(2);

        var titles = angular.element(rows[0]).find('th');

        expect(titles.length).toBe(3);
        expect(angular.element(titles[0]).text().trim()).toBe('Name of person');
        expect(angular.element(titles[1]).text().trim()).toBe('Age');
        expect(angular.element(titles[2]).text().trim()).toBe('Money');

        var filters = angular.element(rows[1]).find('th');
        expect(filters.length).toBe(3);
    }));

    it('should show scope data', inject(function ($compile, $rootScope, ngTableParams) {
        debugger;
        var tbody = elm.find('tbody');
        expect(tbody.length).toBe(1);

        var rows = tbody.find('tr');
        expect(rows.length).toBe(0);

        var params = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        scope.tableParams = params;
        scope.$digest();

        rows = tbody.find('tr');
        expect(rows.length).toBe(10);

        scope.tableParams.page(2);
        scope.$digest();
        
        rows = tbody.find('tr');
        expect(rows.length).toBe(7);

        params.total(20);
        scope.$digest();

        rows = tbody.find('tr');
        expect(rows.length).toBe(7);
    }));

});
