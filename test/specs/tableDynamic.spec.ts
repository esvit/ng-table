import { IAugmentedJQuery, ICompileService, IQService, IScope } from 'angular';
import * as ng1 from 'angular';
import * as _ from 'lodash';
import { ngTableModule } from '../../index';
import { NgTableParams } from '../../src/core';
import { ColumnFieldContext, ColumnDef, DynamicTableColField, DynamicTableColDef, FilterTemplateDefMap, SelectOption } from '../../src/browser';

describe('ng-table-dynamic', () => {

    interface Person {
        id?: number;
        name?: string;
        age: number;
        money?: number;
    }

    interface NgTableChildScope extends IScope {
        params: NgTableParams<any>;
        $columns: ColumnDef[];
    }

    interface ExtendedDynamicTableColDef extends DynamicTableColDef {
        field: DynamicTableColField<string>
    }

    interface CustomizedScope extends IScope {
        $$childHead: NgTableChildScope;
        tableParams: NgTableParams<Person>;
        cols: ExtendedDynamicTableColDef[];
        model: {
            exportedCols?: ColumnDef[]
        };
    }

    function createTable(htmlTemplate: string, params?: NgTableParams<Person>) {
        params = params || new NgTableParams<Person>({});

        const tableElm = ng1.element(htmlTemplate);
        $compile(tableElm)(scope);
        scope.$digest();

        scope.tableParams = params;
        scope.$digest();

        return { params, tableElm };
    }

    const dataset = [
        { id: 1, name: "Moroni", age: 50, money: -10 },
        { id: 2, name: "Tiancum", age: 43, money: 120 },
        { id: 3, name: "Jacob", age: 27, money: 5.5 },
        { id: 4, name: "Nephi", age: 29, money: -54 },
        { id: 5, name: "Enos", age: 34, money: 110 },
        { id: 6, name: "Tiancum", age: 43, money: 1000 },
        { id: 7, name: "Jacob", age: 27, money: -201 },
        { id: 8, name: "Nephi", age: 29, money: 100 },
        { id: 9, name: "Enos", age: 34, money: -52.5 },
        { id: 10, name: "Tiancum", age: 43, money: 52.1 },
        { id: 11, name: "Jacob", age: 27, money: 110 },
        { id: 12, name: "Nephi", age: 29, money: -55 },
        { id: 13, name: "Enos", age: 34, money: 551 },
        { id: 14, name: "Tiancum", age: 43, money: -1410 },
        { id: 15, name: "Jacob", age: 27, money: 410 },
        { id: 16, name: "Nephi", age: 29, money: 100 },
        { id: 17, name: "Enos", age: 34, money: -100 }
    ];

    beforeAll(() => expect(ngTableModule).toBeDefined());
    beforeEach(ng1.mock.module('ngTable'));

    let scope: CustomizedScope;
    let $compile: ICompileService;
    beforeEach(inject(($rootScope: IScope, _$compile_: ICompileService) => {
        scope = $rootScope.$new(true) as CustomizedScope;
        $compile = _$compile_;
        scope.model = {};
    }));

    describe('basics', () => {
        let tableElm: IAugmentedJQuery;
        beforeEach(inject(($q: IQService) => {
            const html = `<div>
                <table ng-table-dynamic="tableParams with cols">
                    <tr ng-repeat="user in $data">
                        <td ng-repeat="col in $columns">{{user[col.field]}}</td>
                    </tr>
                </table>
            </div>`;

            function getCustomClass(context: ColumnFieldContext) {
                if (context.$column.title().indexOf('Money') !== -1) {
                    return 'moneyHeaderClass';
                } else {
                    return 'customClass';
                }
            }

            function money(context: ColumnFieldContext) {
                let selectOptions = [{
                    'id': 10,
                    'title': '10'
                }];
                return $q.when(selectOptions);
            }

            scope.cols = [
                {
                    'class': getCustomClass,
                    field: 'name',
                    filter: { ['name']: 'text' },
                    headerTitle: 'Sort by Name',
                    sortable: 'name',
                    show: true,
                    title: 'Name of person'
                },
                {
                    'class': getCustomClass,
                    field: 'age',
                    headerTitle: 'Sort by Age',
                    sortable: 'age',
                    show: true,
                    title: 'Age'
                },
                {
                    'class': getCustomClass,
                    field: 'money',
                    filter: { ['action']: 'select' },
                    headerTitle: 'Sort by Money',
                    filterData: money,
                    show: true,
                    title: 'Money'
                }
            ];

            ({ tableElm } = createTable(html));
        }));

        it('should create table header', () => {
            const thead = tableElm.find('thead');
            expect(thead.length).toBe(1);

            const rows = thead.find('tr');
            expect(rows.length).toBe(2);

            const titles = ng1.element(rows[0]).find('th');

            expect(titles.length).toBe(3);
            expect(ng1.element(titles[0]).text().trim()).toBe('Name of person');
            expect(ng1.element(titles[1]).text().trim()).toBe('Age');
            expect(ng1.element(titles[2]).text().trim()).toBe('Money');

            expect(ng1.element(rows[1]).hasClass('ng-table-filters')).toBeTruthy();
            const filters = ng1.element(rows[1]).find('th');
            expect(filters.length).toBe(3);
            expect(ng1.element(filters[0]).hasClass('filter')).toBeTruthy();
            expect(ng1.element(filters[1]).hasClass('filter')).toBeTruthy();
            expect(ng1.element(filters[2]).hasClass('filter')).toBeTruthy();
        });

        it('should create table header classes', inject(($rootScope: IScope) => {

            const thead = tableElm.find('thead');
            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');

            expect(ng1.element(titles[0]).hasClass('header')).toBeTruthy();
            expect(ng1.element(titles[1]).hasClass('header')).toBeTruthy();
            expect(ng1.element(titles[2]).hasClass('header')).toBeTruthy();

            expect(ng1.element(titles[0]).hasClass('sortable')).toBeTruthy();
            expect(ng1.element(titles[1]).hasClass('sortable')).toBeTruthy();
            expect(ng1.element(titles[2]).hasClass('sortable')).toBeFalsy();

            expect(ng1.element(titles[0]).hasClass('customClass')).toBeTruthy();
            expect(ng1.element(titles[1]).hasClass('customClass')).toBeTruthy();
            expect(ng1.element(titles[2]).hasClass('moneyHeaderClass')).toBeTruthy();
        }));

        it('should create table header titles', () => {

            const thead = tableElm.find('thead');
            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');

            expect(ng1.element(titles[0]).attr('title').trim()).toBe('Sort by Name');
            expect(ng1.element(titles[1]).attr('title').trim()).toBe('Sort by Age');
            expect(ng1.element(titles[2]).attr('title').trim()).toBe('Sort by Money');
        });

        it('should show data-title-text', () => {
            const tbody = tableElm.find('tbody');

            scope.tableParams = new NgTableParams({
                page: 1, // show first page
                count: 10 // count per page
            }, {
                    dataset: dataset
                });
            scope.$digest();

            const filterRow = ng1.element(tableElm.find('thead').find('tr')[1]);
            const filterCells = filterRow.find('th');
            expect(ng1.element(filterCells[0]).attr('data-title-text').trim()).toBe('Name of person');
            expect(ng1.element(filterCells[1]).attr('data-title-text').trim()).toBe('Age');
            expect(ng1.element(filterCells[2]).attr('data-title-text').trim()).toBe('Money');

            const dataRows = tableElm.find('tbody').find('tr');
            const dataCells = ng1.element(dataRows[0]).find('td');
            expect(ng1.element(dataCells[0]).attr('data-title-text').trim()).toBe('Name of person');
            expect(ng1.element(dataCells[1]).attr('data-title-text').trim()).toBe('Age');
            expect(ng1.element(dataCells[2]).attr('data-title-text').trim()).toBe('Money');
        });

        it('should show/hide columns', () => {
            const tbody = tableElm.find('tbody');

            scope.tableParams = new NgTableParams({
                page: 1, // show first page
                count: 10 // count per page
            }, {
                    dataset: dataset
                });
            scope.$digest();

            const headerRow = ng1.element(tableElm.find('thead').find('tr')[0]);
            expect(headerRow.find('th').length).toBe(3);

            const filterRow = ng1.element(tableElm.find('thead').find('tr')[1]);
            expect(filterRow.find('th').length).toBe(3);

            const dataRow = ng1.element(tableElm.find('tbody').find('tr')[0]);
            expect(dataRow.find('td').length).toBe(3);

            scope.cols[0].show = false;
            scope.$digest();
            expect(headerRow.find('th').length).toBe(2);
            expect(filterRow.find('th').length).toBe(2);
            expect(dataRow.find('td').length).toBe(2);
            expect(ng1.element(headerRow.find('th')[0]).text().trim()).toBe('Age');
            expect(ng1.element(headerRow.find('th')[1]).text().trim()).toBe('Money');
            expect(ng1.element(filterRow.find('th')[0]).find('input').length).toBe(0);
            expect(ng1.element(filterRow.find('th')[1]).find('select').length).toBe(1);
        });
    });

    describe('changing column list', () => {
        let tableElm: IAugmentedJQuery;
        beforeEach(inject(($q: IQService) => {
            const html = `<div>
                <table ng-table-dynamic="tableParams with cols">
                    <tr ng-repeat="user in $data">
                        <td ng-repeat="col in $columns">{{user[col.field]}}</td>
                    </tr>
                </table>
            </div>`;

            function getCustomClass(parmasScope: ColumnFieldContext) {
                if (parmasScope.$column.title().indexOf('Money') !== -1) {
                    return 'moneyHeaderClass';
                } else {
                    return 'customClass';
                }
            }

            function money(/*$column*/) {
                const def = $q.defer();
                def.resolve([{
                    'id': 10,
                    'title': '10'
                }]);
                return def;
            }

            scope.cols = [
                {
                    'class': getCustomClass,
                    field: 'name',
                    filter: { name: 'text' },
                    headerTitle: 'Sort by Name',
                    sortable: 'name',
                    show: true,
                    title: 'Name of person'
                },
                {
                    'class': getCustomClass,
                    field: 'age',
                    headerTitle: 'Sort by Age',
                    sortable: 'age',
                    show: true,
                    title: 'Age'
                }
            ];

            ({ tableElm } = createTable(html));
        }));

        it('adding new column should update table header', () => {
            const newCol: ExtendedDynamicTableColDef = {
                'class': 'moneyadd',
                field: 'money',
                filter: { action: 'select' },
                headerTitle: 'Sort by Money',
                show: true,
                title: 'Money'
            };
            scope.cols.push(newCol);
            scope.$digest();
            const thead = tableElm.find('thead');
            expect(thead.length).toBe(1);

            const rows = thead.find('tr');
            expect(rows.length).toBe(2);

            const titles = ng1.element(rows[0]).find('th');

            expect(titles.length).toBe(3);
            expect(ng1.element(titles[0]).text().trim()).toBe('Name of person');
            expect(ng1.element(titles[1]).text().trim()).toBe('Age');
            expect(ng1.element(titles[2]).text().trim()).toBe('Money');

            const filterRow = ng1.element(rows[1]);
            expect(filterRow.hasClass('ng-table-filters')).toBeTruthy();
            expect(filterRow.hasClass("ng-hide")).toBe(false);

            const filters = filterRow.find('th');
            expect(filters.length).toBe(3);
            expect(ng1.element(filters[0]).hasClass('filter')).toBeTruthy();
            expect(ng1.element(filters[1]).hasClass('filter')).toBeTruthy();
            expect(ng1.element(filters[2]).hasClass('filter')).toBeTruthy();

        });

        it('removing new column should update table header', () => {
            scope.cols.splice(0, 1);
            scope.$digest();
            const thead = tableElm.find('thead');
            expect(thead.length).toBe(1);

            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');
            expect(titles.length).toBe(1);
            expect(ng1.element(titles[0]).text().trim()).toBe('Age');

            const filterRow = ng1.element(rows[1]);
            expect(filterRow.hasClass("ng-hide")).toBe(true);
        });

        it('setting columns to null should remove all table columns from header', () => {
            // note: using 'any' to trick compiler into allowing null (don't do this in production code!)
            scope.cols = null as any;
            scope.$digest();
            const thead = tableElm.find('thead');
            expect(thead.length).toBe(1);

            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');
            expect(titles.length).toBe(0);

            const filterRow = ng1.element(rows[1]);
            expect(filterRow.hasClass("ng-hide")).toBe(true);

            expect(filterRow.find('th').length).toBe(0);
        });

    });
    describe('title-alt', () => {

        let tableElm: IAugmentedJQuery;
        beforeEach(() => {
            const html = `
            <table ng-table-dynamic="tableParams with cols">
                <tr ng-repeat="user in $data">
                    <td ng-repeat="col in $columns">{{user[col.field]}}</td>
                </tr>
            </table>`;

            scope.cols = [
                { field: 'name', title: 'Name of person', titleAlt: 'Name' },
                { field: 'age', title: 'Age', titleAlt: 'Age' },
                { field: 'money', title: 'Money', titleAlt: '£' }
            ];
            const params = new NgTableParams<Person>({
                page: 1, // show first page
                count: 10 // count per page
            }, {
                    dataset: dataset
                });

            ({ tableElm } = createTable(html, params));
        });

        it('should show as data-title-text', () => {
            const filterRow = ng1.element(tableElm.find('thead').find('tr')[1]);
            const filterCells = filterRow.find('th');

            expect(ng1.element(filterCells[0]).attr('data-title-text').trim()).toBe('Name');
            expect(ng1.element(filterCells[1]).attr('data-title-text').trim()).toBe('Age');
            expect(ng1.element(filterCells[2]).attr('data-title-text').trim()).toBe('£');

            const dataRows = tableElm.find('tbody').find('tr');
            const dataCells = ng1.element(dataRows[0]).find('td');
            expect(ng1.element(dataCells[0]).attr('data-title-text').trim()).toBe('Name');
            expect(ng1.element(dataCells[1]).attr('data-title-text').trim()).toBe('Age');
            expect(ng1.element(dataCells[2]).attr('data-title-text').trim()).toBe('£');
        });
    });

    describe('filters', () => {

        let tableElm: IAugmentedJQuery;
        const tableHtml = `
            <table ng-table-dynamic="tableParams with cols">
                <tr ng-repeat="user in $data">
                    <td ng-repeat="col in $columns">{{user[col.field]}}</td>
                </tr>
            </table>`;

        describe('filter specified as alias', () => {

            beforeEach(() => {
                scope.cols = [
                    { field: 'name', filter: { username: 'text' } }
                ];
                ({ tableElm } = createTable(tableHtml));
            });

            it('should render named filter template', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.length).toBe(1);
                expect(inputs.eq(0).attr('type')).toBe('text');
                expect(inputs.eq(0).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(0).attr('name')).toBe('username');
            });

            it('should render named filter template - select template', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.length).toBe(1);
                expect(inputs.eq(0).attr('type')).toBe('text');
                expect(inputs.eq(0).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(0).attr('name')).toBe('username');
            });

            it('should databind ngTableParams.filter to filter input', () => {
                scope.tableParams.filter()['username'] = 'my name is...';
                scope.$digest();

                const input = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(input.val()).toBe('my name is...');
            });
        });

        describe('select filter', () => {

            beforeEach(inject(($q: IQService) => {
                scope.cols = [{
                    field: 'name',
                    filter: { username: 'select' },
                    filterData: getNamesAsDefer
                }, {
                    field: 'names2',
                    filter: { username2: 'select' },
                    filterData: getNamesAsPromise
                }, {
                    field: 'names3',
                    filter: { username3: 'select' },
                    filterData: getNamesAsArray
                }];
                ({ tableElm } = createTable(tableHtml));

                function getNamesAsDefer(/*$column*/) {
                    return $q.when([{
                        'id': 10,
                        'title': 'Christian'
                    }, {
                        'id': 11,
                        'title': 'Simon'
                    }]);
                }

                function getNamesAsPromise(/*$column*/) {
                    return $q.when([{
                        'id': 20,
                        'title': 'Christian'
                    }, {
                        'id': 21,
                        'title': 'Simon'
                    }]);
                }

                function getNamesAsArray(/*$column*/) {
                    return [{
                        'id': 20,
                        'title': 'Christian'
                    }, {
                        'id': 21,
                        'title': 'Simon'
                    }];
                }

            }));

            it('should render select lists', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('select');
                expect(inputs.length).toBe(3);
                expect(inputs.eq(0).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(0).attr('name')).toBe('username');
                expect(inputs.eq(1).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(1).attr('name')).toBe('username2');
                expect(inputs.eq(2).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(2).attr('name')).toBe('username3');
            });

            it('should render select list return as a promise', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').eq(1).find('select');
                const select = inputs.eq(0) as IAugmentedJQuery;
                expect((select[0] as HTMLSelectElement).options.length).toBeGreaterThan(0);
                const $column = (select.scope() as ColumnFieldContext).$column;
                const plucker = _.partialRight(_.pick, ['id', 'title']);
                const actual = _.map($column.data as SelectOption[], plucker);
                expect(actual).toEqual([{
                    'id': '',
                    'title': ''
                }, {
                    'id': 20,
                    'title': 'Christian'
                }, {
                    'id': 21,
                    'title': 'Simon'
                }]);
            });

            it('should render select list return as an array', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').eq(2).find('select');
                const select = inputs.eq(0) as IAugmentedJQuery;
                expect((select[0] as HTMLSelectElement).options.length).toBeGreaterThan(0);
                const $column = (select.scope() as ColumnFieldContext).$column;
                const plucker = _.partialRight(_.pick, ['id', 'title']);
                const actual = _.map($column.data as SelectOption[], plucker);
                expect(actual).toEqual([{
                    'id': '',
                    'title': ''
                }, {
                    'id': 20,
                    'title': 'Christian'
                }, {
                    'id': 21,
                    'title': 'Simon'
                }]);
            });
        });

        describe('multiple filter inputs', () => {

            beforeEach(() => {
                scope.cols = [
                    { field: 'name', filter: { name: 'text', age: 'text' } }
                ];
                ({ tableElm } = createTable(tableHtml));
            });

            it('should render filter template for each key/value pair ordered by key', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.length).toBe(2);
                expect(inputs.eq(0).attr('type')).toBe('text');
                expect(inputs.eq(0).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(1).attr('type')).toBe('text');
                expect(inputs.eq(1).attr('ng-model')).not.toBeUndefined();
            });

            it('should databind ngTableParams.filter to filter inputs', () => {
                scope.tableParams.filter()['name'] = 'my name is...';
                scope.tableParams.filter()['age'] = '10';
                scope.$digest();

                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.eq(0).val()).toBe('my name is...');
                expect(inputs.eq(1).val()).toBe('10');
            });
        });

        describe('dynamic filter', () => {

            let ageFilter: FilterTemplateDefMap;
            beforeEach(() => {

                ageFilter = { age: 'text' };
                function getFilter(paramsScope: ColumnFieldContext): FilterTemplateDefMap {
                    if (paramsScope.$column.title() === 'Name of user') {
                        return { username: 'text' };
                    } else if (paramsScope.$column.title() === 'Age') {
                        return ageFilter;
                    } else {
                        return {};
                    }
                }

                scope.cols = [
                    { field: 'name', title: 'Name of user', filter: getFilter },
                    { field: 'age', title: 'Age', filter: getFilter }
                ];
                ({ tableElm } = createTable(tableHtml));
            });

            it('should render named filter template', () => {
                const usernameInput = tableElm.find('thead').find('tr').eq(1).find('th').eq(0).find('input');
                expect(usernameInput.attr('type')).toBe('text');
                expect(usernameInput.attr('name')).toBe('username');

                const ageInput = tableElm.find('thead').find('tr').eq(1).find('th').eq(1).find('input');
                expect(ageInput.attr('type')).toBe('text');
                expect(ageInput.attr('name')).toBe('age');
            });

            it('should databind ngTableParams.filter to filter input', () => {
                scope.tableParams.filter()['username'] = 'my name is...';
                scope.tableParams.filter()['age'] = '10';
                scope.$digest();

                const usernameInput = tableElm.find('thead').find('tr').eq(1).find('th').eq(0).find('input');
                expect(usernameInput.val()).toBe('my name is...');
                const ageInput = tableElm.find('thead').find('tr').eq(1).find('th').eq(1).find('input');
                expect(ageInput.val()).toBe('10');
            });

            it('should render new template as filter changes', () => {

                const scriptTemplate = ng1.element(
                    '<script type="text/ng-template" id="ng-table/filters/number.html"><input type="number" name="{{name}}"/></script>');
                $compile(scriptTemplate)(scope);

                ageFilter['age'] = 'number';
                scope.$digest();

                const ageInput = tableElm.find('thead').find('tr').eq(1).find('th').eq(1).find('input');
                expect(ageInput.attr('type')).toBe('number');
                expect(ageInput.attr('name')).toBe('age');
            });
        });
    });

    describe('$columns', () => {
        let tableElm: IAugmentedJQuery,
            params: NgTableParams<Person>;
        beforeEach(() => {
            const html = `
            <table ng-table-dynamic="tableParams with cols" ng-table-columns-binding="model.exportedCols">
                <tr ng-repeat="user in $data">
                    <td ng-repeat="col in $columns">{{user[col.field]}}</td>
                </tr>
            </table>`;

            scope.cols = [
                { field: 'age', title: 'Age', show: true, filter: { age: 'text' } },
                { field: 'name', title: 'Name', groupable: 'name', sortable: () => 'name' }
            ];

            ({ tableElm, params } = createTable(html));
        });

        it('ng-table-columns-binding should make $columns externally available', () => {
            expect(scope.model.exportedCols).toBeDefined();
        });

        it('$scolumns should contain a column definition for each `td` element', () => {
            expect(scope.model.exportedCols!.length).toBe(2);
        });

        it('each column definition should have getters for each column attribute', () => {
            const ageCol = scope.model.exportedCols![0];
            expect(ageCol.title()).toBe('Age');
            expect(ageCol.show()).toBe(true);
            expect(ageCol.filter()).toBe(scope.cols[0].filter);
            expect(ageCol.class()).toBe('');
            expect(ageCol.filterData).toBeUndefined();
            expect(ageCol.groupable()).toBe(false);
            expect(ageCol.headerTemplateURL()).toBe(false);
            expect(ageCol.headerTitle()).toBe('');
            expect(ageCol.sortable()).toBe(false);
            expect(ageCol.titleAlt()).toBe('');

            const nameCol = scope.model.exportedCols![1];
            expect(nameCol.title()).toBe('Name');
            expect(nameCol.show()).toBe(true);
            expect(nameCol.filter()).toBe(false);
            expect(nameCol.class()).toBe('');
            expect(nameCol.filterData).toBeUndefined();
            expect(nameCol.groupable()).toBe('name');
            expect(nameCol.headerTemplateURL()).toBe(false);
            expect(nameCol.headerTitle()).toBe('');
            expect(nameCol.sortable()).toBe('name');
            expect(nameCol.titleAlt()).toBe('');
        });

        it('each column attribute should be assignable', () => {
            const ageCol = scope.model.exportedCols![0];

            ageCol.title.assign(scope.$$childHead, 'Age of person');
            expect(ageCol.title()).toBe('Age of person');
            expect(scope.cols[0].title).toBe('Age of person');

            ageCol.show.assign(scope.$$childHead, false);
            expect(ageCol.show()).toBe(false);
            expect(scope.cols[0].show).toBe(false);

            const newFilter: FilterTemplateDefMap = { age: 'select' };
            ageCol.filter.assign(scope.$$childHead, newFilter);
            expect(ageCol.filter()).toBe(newFilter);
            expect(scope.cols[0].filter).toBe(newFilter);

            ageCol.class.assign(scope.$$childHead, 'amazing');
            expect(ageCol.class()).toBe('amazing');

            ageCol.groupable.assign(scope.$$childHead, 'age');
            expect(ageCol.groupable()).toBe('age');

            ageCol.headerTemplateURL.assign(scope.$$childHead, 'some.html');
            expect(ageCol.headerTemplateURL()).toBe('some.html');

            ageCol.headerTitle.assign(scope.$$childHead, 'wow');
            expect(ageCol.headerTitle()).toBe('wow');

            ageCol.sortable.assign(scope.$$childHead, 'incredible');
            expect(ageCol.sortable()).toBe('incredible');

            ageCol.titleAlt.assign(scope.$$childHead, 'really');
            expect(ageCol.titleAlt()).toBe('really');


            const nameCol = scope.model.exportedCols![1];

            nameCol.groupable.assign(scope.$$childHead, false);
            expect(nameCol.groupable()).toBe(false);

            nameCol.sortable.assign(scope.$$childHead, false);
            expect(nameCol.sortable()).toBe(false);
        });

        it('each column attribute should be settable', () => {
            const ageCol = scope.model.exportedCols![0];

            ageCol.title('Age of person');
            expect(ageCol.title()).toBe('Age of person');
            expect(scope.cols[0].title).toBe('Age of person');

            ageCol.show(false);
            expect(ageCol.show()).toBe(false);
            expect(scope.cols[0].show).toBe(false);

            const newFilter: FilterTemplateDefMap = { age: 'select' };
            ageCol.filter(newFilter);
            expect(ageCol.filter()).toBe(newFilter);
            expect(scope.cols[0].filter).toBe(newFilter);

            ageCol.class('amazing');
            expect(ageCol.class()).toBe('amazing');

            ageCol.groupable('age');
            expect(ageCol.groupable()).toBe('age');

            ageCol.headerTemplateURL('some.html');
            expect(ageCol.headerTemplateURL()).toBe('some.html');

            ageCol.headerTitle('wow');
            expect(ageCol.headerTitle()).toBe('wow');

            ageCol.sortable('incredible');
            expect(ageCol.sortable()).toBe('incredible');

            ageCol.titleAlt('really');
            expect(ageCol.titleAlt()).toBe('really');


            const nameCol = scope.model.exportedCols![1];

            nameCol.groupable(false);
            expect(nameCol.groupable()).toBe(false);

            nameCol.sortable(false);
            expect(nameCol.sortable()).toBe(false);
        });
    });

    describe('reorder columns', () => {
        let tableElm: IAugmentedJQuery;
        const getTitles = () => {
            const thead = tableElm.find('thead');
            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');

            return ng1.element(titles).text().trim().split(/\s+/g)
        };

        beforeEach(inject(($q: IQService) => {
            const html = `<div>
                <table ng-table-dynamic="tableParams with cols">
                    <tr ng-repeat="user in $data">
                        <td ng-repeat="col in $columns">{{user[col.field]}}</td>
                    </tr>
                </table>
            </div>`;

            scope.cols = [
                {
                    field: 'name',
                    title: 'Name'
                },
                {
                    field: 'age',
                    title: 'Age'
                },
                {
                    field: 'money',
                    title: 'Money'
                }
            ];

            ({ tableElm } = createTable(html));
        }));

        it('"in place" switch of columns within array should reorder html table columns', () => {
            expect(getTitles()).toEqual(['Name', 'Age', 'Money']);

            const colToSwap = scope.cols[2];
            scope.cols[2] = scope.cols[1];
            scope.cols[1] = colToSwap;
            scope.$digest();

            expect(getTitles()).toEqual(['Name', 'Money', 'Age']);
        });

        it('"in place" reverse of column array should reorder html table columns', () => {
            expect(getTitles()).toEqual(['Name', 'Age', 'Money']);

            scope.cols.reverse();
            scope.$digest();

            expect(getTitles()).toEqual(['Money', 'Age', 'Name']);
        });

        it('html table columns should reflect order of columns in replacement array', () => {
            expect(getTitles()).toEqual(['Name', 'Age', 'Money']);

            const newArray = scope.cols.map(ng1.identity);
            newArray.reverse();
            scope.cols = newArray;
            scope.$digest();

            expect(getTitles()).toEqual(['Money', 'Age', 'Name']);
        });
    });
});