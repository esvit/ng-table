describe('ng-table', function() {
    var elm, scope, data = [
        {
            id: 1,
            name: "Moroni",
            age: 50,
            money: -10
        },
        {
            id: 2,
            name: "Tiancum",
            age: 43,
            money: 120
        },
        {
            id: 3,
            name: "Jacob",
            age: 27,
            money: 5.5
        },
        {
            id: 4,
            name: "Nephi",
            age: 29,
            money: -54
        },
        {
            id: 5,
            name: "Enos",
            age: 34,
            money: 110
        },
        {
            id: 6,
            name: "Tiancum",
            age: 43,
            money: 1000
        },
        {
            id: 7,
            name: "Jacob",
            age: 27,
            money: -201
        },
        {
            id: 8,
            name: "Nephi",
            age: 29,
            money: 100
        },
        {
            id: 9,
            name: "Enos",
            age: 34,
            money: -52.5
        },
        {
            id: 10,
            name: "Tiancum",
            age: 43,
            money: 52.1
        },
        {
            id: 11,
            name: "Jacob",
            age: 27,
            money: 110
        },
        {
            id: 12,
            name: "Nephi",
            age: 29,
            money: -55
        },
        {
            id: 13,
            name: "Enos",
            age: 34,
            money: 551
        },
        {
            id: 14,
            name: "Tiancum",
            age: 43,
            money: -1410
        },
        {
            id: 15,
            name: "Jacob",
            age: 27,
            money: 410
        },
        {
            id: 16,
            name: "Nephi",
            age: 29,
            money: 100
        },
        {
            id: 17,
            name: "Enos",
            age: 34,
            money: -100
        }
    ];

    beforeEach(module('ngTable'));

    beforeEach(inject(function($rootScope, $compile, $q) {
        elm = angular.element(
            '<div>' +
            '<script type="text/ng-template" id="ng-table/filters/money.html"></script>' +
            '<table ng-table="tableParams" show-filter="true">' +
            '<tr ng-repeat="user in $data">' +
            '<td data-header-title="\'Sort by Name\'" data-title="\'Name of person\'" filter="{ \'name\': \'text\' }" sortable="\'name\'" data-header-class="getCustomClass(column)">' +
            '{{user.name}}' +
            '</td>' +
            '<td x-data-header-title="\'Sort by Age\'" x-data-title="\'Age\'" sortable="\'age\'" x-data-header-class="getCustomClass(column)">' +
            '{{user.age}}' +
            '</td>' +
            '<td header-title="\'Sort by Money\'" title="\'Money\'" filter="{ \'action\': \'money\' }" filter-data="money($column)" header-class="getCustomClass(column)">' +
            '{{user.money}}' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</div>');

        scope = $rootScope.$new(true);

        scope.getCustomClass = function(column){
            if (column.title(scope).indexOf('Money') !== -1){
                return 'moneyHeaderClass';
            } else{
                return 'customClass';
            }
        };

        scope.money = function(/*$column*/) {

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

    it('should create table header', inject(function($compile, $rootScope) {
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

    it('should create table header classes', inject(function($compile, $rootScope) {

        var thead = elm.find('thead');
        var rows = thead.find('tr');
        var titles = angular.element(rows[0]).find('th');

        expect(angular.element(titles[0]).hasClass('header')).toBeTruthy();
        expect(angular.element(titles[1]).hasClass('header')).toBeTruthy();
        expect(angular.element(titles[2]).hasClass('header')).toBeTruthy();

        expect(angular.element(titles[0]).hasClass('sortable')).toBeTruthy();
        expect(angular.element(titles[1]).hasClass('sortable')).toBeTruthy();
        expect(angular.element(titles[2]).hasClass('sortable')).toBeFalsy();

        expect(angular.element(titles[0]).hasClass('customClass')).toBeTruthy();
        expect(angular.element(titles[1]).hasClass('customClass')).toBeTruthy();
        expect(angular.element(titles[2]).hasClass('moneyHeaderClass')).toBeTruthy();
    }));

    it('should create table header titles', inject(function($compile, $rootScope) {

        var thead = elm.find('thead');
        var rows = thead.find('tr');
        var titles = angular.element(rows[0]).find('th');

        expect(angular.element(titles[0]).attr('title').trim()).toBe('Sort by Name');
        expect(angular.element(titles[1]).attr('title').trim()).toBe('Sort by Age');
        expect(angular.element(titles[2]).attr('title').trim()).toBe('Sort by Money');
    }));


    it('should show scope data', inject(function($compile, $rootScope, NgTableParams) {
        var tbody = elm.find('tbody');
        expect(tbody.length).toBe(1);

        var rows = tbody.find('tr');
        expect(rows.length).toBe(0);

        var params = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
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

    it('should show data-title-text', inject(function($compile, $rootScope, NgTableParams) {
        var tbody = elm.find('tbody');

        var params = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        scope.tableParams = params;
        scope.$digest();

        var filterRow = angular.element(elm.find('thead').find('tr')[1]);
        var filterCells = filterRow.find('th');
        expect(angular.element(filterCells[0]).attr('data-title-text').trim()).toBe('Name of person');
        expect(angular.element(filterCells[1]).attr('data-title-text').trim()).toBe('Age');
        expect(angular.element(filterCells[2]).attr('data-title-text').trim()).toBe('Money');

        var dataRows = elm.find('tbody').find('tr');
        var row = angular.element(dataRows[0]);
        var cells = row.find('td');
        expect(angular.element(cells[0]).attr('data-title-text').trim()).toBe('Name of person');
        expect(angular.element(cells[1]).attr('data-title-text').trim()).toBe('Age');
        expect(angular.element(cells[2]).attr('data-title-text').trim()).toBe('Money');
    }));

});