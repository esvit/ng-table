import { IAugmentedJQuery, ICompileService, IQService, IPromise, IScope, ITimeoutService } from 'angular';
import * as ng1 from 'angular';
import { ngTableModule } from '../../index';
import { NgTableParams, ParamValuesPartial, SettingsPartial, SortingValues } from '../../src/core';
import { ColumnDef, FilterTemplateDef, FilterTemplateDefMap, SelectOption } from '../../src/browser'

describe('ng-table', () => {
    interface Person {
        id?: number;
        name?: string;
        age: number;
        money?: number;
    }

    interface INgTableChildScope extends IScope {
        params: NgTableParams<any>;
        $columns: ColumnDef[];
    }

    interface CustomizedScope extends IScope {
        $$childHead: INgTableChildScope;
        model: {
            exportedCols?: ColumnDef[];
        };
        ageFilter: FilterTemplateDefMap;
        ageExpandedFilter: { [name: string]: FilterTemplateDef };
        ageTitle: string | { (): string };
        captureColumn: ($columnDef: ColumnDef) => any;
        getCustomClass($column: ColumnDef): string;
        getFilter($column: ColumnDef): FilterTemplateDefMap;
        isAgeVisible: boolean;
        nameTitle(): string;
        money: () => IPromise<SelectOption[]>;
        moneyTitle(): string;
        showAge: boolean;
        showFilterRow: boolean;
        showMoney: boolean;
        showName: boolean;
        tableParams: NgTableParams<Person>;
        usernameFilter: FilterTemplateDefMap;
        usernameExpandedFilter: { [name: string]: FilterTemplateDef };
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

    function createNgTableParams<T>(initialParams?: ParamValuesPartial<T>, settings?: SettingsPartial<T> | null): NgTableParams<T>;
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

    function createTable(htmlTemplate: string, params?: NgTableParams<Person>) {
        params = params || createNgTableParams<Person>();

        const tableElm = ng1.element(htmlTemplate);
        $compile(tableElm)(scope);
        scope.$digest();

        scope.tableParams = params;
        scope.$digest();

        return { params, tableElm };
    }

    describe('basics', () => {
        let tableElm: IAugmentedJQuery;
        beforeEach(inject(($q: IQService) => {
            const html = `<div>
              <table ng-table="tableParams">
                <tr ng-repeat="user in $data">
                  <td data-header-title="'Sort by Name'" data-title="nameTitle()" filter="{ 'name': 'text' }" sortable="'name'" 
                      data-header-class="getCustomClass($column)" ng-if="showName">
                    {{user.name}}
                  </td>
                  <td x-data-header-title="'Sort by Age'" x-data-title="ageTitle()" sortable="'age'" 
                      x-data-header-class="getCustomClass($column)" ng-if="showAge">
                    {{user.age}}
                  </td>
                  <td header-title="'Sort by Money'" title="moneyTitle()" filter="{ 'action': 'select' }" filter-data="money($column)" 
                      header-class="getCustomClass($column)" ng-if="showMoney">
                    {{user.money}}
                  </td>
                </tr>
              </table>
            </div>`;

            scope.nameTitle = () => 'Name of person';
            scope.ageTitle = () => 'Age';
            scope.moneyTitle = () => 'Money';

            scope.showName = true;
            scope.showAge = true;
            scope.showMoney = true;

            scope.ageTitle = () => 'Age';
            scope.moneyTitle = () => 'Money';

            scope.getCustomClass = ($column) => {
                if ($column.title().indexOf('Money') !== -1) {
                    return 'moneyHeaderClass';
                } else {
                    return 'customClass';
                }
            };

            scope.money = (/*$column*/) => {
                let selectOptions = [{
                    'id': 10,
                    'title': '10'
                }];
                return $q.when(selectOptions);
            };

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

        it('should create table header classes', () => {

            const thead = tableElm.find('thead');
            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');

            expect(ng1.element(titles[0]).hasClass('header')).toBe(true);
            expect(ng1.element(titles[1]).hasClass('header')).toBe(true);
            expect(ng1.element(titles[2]).hasClass('header')).toBe(true);

            expect(ng1.element(titles[0]).hasClass('sortable')).toBe(true);
            expect(ng1.element(titles[1]).hasClass('sortable')).toBe(true);
            expect(ng1.element(titles[2]).hasClass('sortable')).toBe(false);

            expect(ng1.element(titles[0]).hasClass('customClass')).toBe(true);
            expect(ng1.element(titles[1]).hasClass('customClass')).toBe(true);
            expect(ng1.element(titles[2]).hasClass('moneyHeaderClass')).toBe(true);


            const filterCells = ng1.element(rows[1]).find('th');

            expect(ng1.element(filterCells[0]).hasClass('filter')).toBe(true);
            expect(ng1.element(filterCells[1]).hasClass('filter')).toBe(true);
            expect(ng1.element(filterCells[2]).hasClass('filter')).toBe(true);

            expect(ng1.element(filterCells[0]).hasClass('customClass')).toBe(true);
            expect(ng1.element(filterCells[1]).hasClass('customClass')).toBe(true);
            expect(ng1.element(filterCells[2]).hasClass('moneyHeaderClass')).toBe(true);
        });

        it('should create table header titles', () => {

            const thead = tableElm.find('thead');
            const rows = thead.find('tr');
            const titles = ng1.element(rows[0]).find('th');

            expect(ng1.element(titles[0]).attr('title').trim()).toBe('Sort by Name');
            expect(ng1.element(titles[1]).attr('title').trim()).toBe('Sort by Age');
            expect(ng1.element(titles[2]).attr('title').trim()).toBe('Sort by Money');
        });


        it('should show scope data', () => {
            const tbody = tableElm.find('tbody');
            expect(tbody.length).toBe(1);

            let rows = tbody.find('tr');
            expect(rows.length).toBe(0);

            const params = new NgTableParams({
                count: 10 // count per page
            }, {
                    dataset: dataset
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
        });

        it('should show data-title-text', () => {
            const tbody = tableElm.find('tbody');

            const params = new NgTableParams({}, {
                dataset: dataset
            });
            scope.tableParams = params;
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

            scope.tableParams = new NgTableParams({}, {
                dataset: dataset
            });
            scope.$digest();

            const headerRow = ng1.element(tableElm.find('thead').find('tr')[0]);
            expect(headerRow.find('th').length).toBe(3);

            const filterRow = ng1.element(tableElm.find('thead').find('tr')[1]);
            expect(filterRow.find('th').length).toBe(3);

            const dataRow = ng1.element(tableElm.find('tbody').find('tr')[0]);
            expect(dataRow.find('td').length).toBe(3);

            scope.showName = false;
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

    describe('title-alt', () => {

        let tableElm: IAugmentedJQuery;
        beforeEach(() => {
            const html =
                `<table ng-table="tableParams">
                    <tr ng-repeat="user in $data">
                        <td title="'Name of person'" title-alt="'Name'">{{user.name}}</td>
                        <td title="'Age of person'" data-title-alt="'Age'">{{user.age}}</td>
                        <td title="'Money earned'" x-data-title-alt="'£'">{{user.money}}</td>
                    </tr>
                </table>`;
            const params = new NgTableParams({}, {
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

    describe('sorting', () => {

        const tableWithSortableAgeColumnTpl =
            `<table ng-table="tableParams">
                <tr ng-repeat="user in $data">
                    <td title="'Age'" sortable="'age'">{{user.age}}</td>
                </tr>
            </table>`

        it('should add $column definition to context of sortable expression', () => {
            let columnDef: ColumnDef | undefined;
            scope.captureColumn = function ($column) {
                columnDef = $column;
                return 'age'
            };
            const html =
                `<table ng-table="tableParams">
                    <tr ng-repeat="user in $data">
                        <td title="'Age'" sortable="captureColumn($column)">{{user.age}}</td>
                    </tr>
                </table>)`;
            createTable(html);

            expect(columnDef).toBeDefined();
        });

        it('should apply initial sort', () => {

            let actualSort: SortingValues = {};
            let params = createNgTableParams<Person>({
                sorting: { age: 'desc' }
            }, {
                    getData: function (params) {
                        actualSort = params.sorting();
                        let results: Person[] = [];
                        return results;
                    }
                });
            createTable(tableWithSortableAgeColumnTpl, params);

            expect(actualSort['age']).toBe('desc');
        });

        it('when sorting changes should trigger reload of table', () => {
            const { params } = createTable(tableWithSortableAgeColumnTpl);

            (params.settings().getData as jasmine.Spy).calls.reset();

            params.sorting()['age'] = 'desc';
            scope.$digest();
            expect((params.settings().getData as jasmine.Spy).calls.count()).toBe(1);

            params.sorting()['age'] = 'asc';
            scope.$digest();
            expect((params.settings().getData as jasmine.Spy).calls.count()).toBe(2);

            // setting the same sort order should not trigger reload
            params.sorting({ age: 'asc' });
            scope.$digest();
            expect((params.settings().getData as jasmine.Spy).calls.count()).toBe(2);
        });

        it('when tapping column header should sort table by that column', () => {
            // given
            const { params, tableElm } = createTable(tableWithSortableAgeColumnTpl);
            (params.settings().getData as jasmine.Spy).calls.reset();
            const columnHeader =
                tableElm[0].querySelector('.ng-table-sort-header > th') as HTMLTableHeaderCellElement;

            // when
            columnHeader.click();
            columnHeader.click();

            // then
            expect((params.settings().getData as jasmine.Spy).calls.count()).toBe(2);
        });
    });

    describe('paging', () => {

        let tableElm: IAugmentedJQuery;

        beforeEach(() => {
            const html =
                `<table ng-table="tableParams">
                    <tr ng-repeat="user in $data">
                        <td title="'Age'">{{user.age}}</td>
                    </tr>
                </table>`;
            ({ tableElm } = createTable(html));
        });

        function verifyPageWas(expectedPage: number) {
            let getDataFunc = scope.tableParams.settings().getData as jasmine.Spy;
            expect(getDataFunc.calls.argsFor(0)[0].page()).toBe(expectedPage);
        }

        it('should use initial NgTableParams constructor value', () => {
            const params = createNgTableParams<Person>({ page: 2 }, null);
            scope.tableParams = params;
            scope.$digest();
            verifyPageWas(2);
            expect((params.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should use initial NgTableParams constructor value combined with filter', () => {
            const params = createNgTableParams<Person>({ page: 2, filter: { age: 5 } }, null);
            scope.tableParams = params;
            scope.$digest();
            verifyPageWas(2);
            expect((params.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('changing page # should trigger reload of data', () => {
            const params = createNgTableParams<Person>({ page: 3 }, null);
            scope.tableParams = params;
            scope.$digest();
            verifyPageWas(3);
            (params.settings().getData as jasmine.Spy).calls.reset();

            scope.tableParams.page(5);
            scope.$digest();
            verifyPageWas(5);
        });
    });

    describe('filters', () => {

        let $capturedColumn: ColumnDef;
        beforeEach(inject(() => {
            // stash a reference to $column definition so that its available in asserts
            scope.captureColumn = function ($column) {
                $capturedColumn = $column;
            };
        }));

        describe('filter specified as alias', () => {

            let tableElm: IAugmentedJQuery,
                tp: NgTableParams<Person>;
            beforeEach(() => {
                // 'text' is a shortcut alias for the template ng-table/filters/text
                scope.usernameFilter = { username: 'text' };
                const params = createNgTableParams<Person>({ filterOptions: { filterDelay: 10 } });

                const html = `<div>
                    <table ng-table="tableParams">
                        <tr ng-repeat="user in $data">
                            <td header-class="captureColumn($column)" title="'Name'" filter="usernameFilter">
                                {{user.name}}
                            </td>
                        </tr>
                    </table>
                </div>`;
                ({ params: tp, tableElm } = createTable(html, params));
            });

            it('should render named filter template', () => {
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

            it('should make filter def available on $column', () => {
                expect($capturedColumn).toBeDefined();
                expect($capturedColumn.filter).toBeDefined();
                expect($capturedColumn.filter()['username']).toBe('text');
            });

            it('when filter changes should trigger reload of table', inject(function ($timeout: ITimeoutService) {
                (tp.settings().getData as jasmine.Spy).calls.reset();

                tp.filter()['username'] = 'new value';
                scope.$digest();
                $timeout.flush();  // trigger delayed filter
                tp.filter()['username'] = 'another value';
                scope.$digest();
                $timeout.flush();  // trigger delayed filter
                expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(2);

                // same value - should not trigger reload
                tp.filter()['username'] = 'another value';
                scope.$digest();
                try {
                    $timeout.flush();  // trigger delayed filter
                } catch (ex) {

                }
                expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(2);
            }));

            it('when filter changes should reset page number to 1', inject(function ($timeout: ITimeoutService) {
                // trigger initial load of data so that subsequent changes to filter will trigger reset of page #
                tp.filter()['username'] = 'initial value';
                scope.$digest();
                $timeout.flush();  // trigger delayed filter

                // set page to something other than 1
                tp.page(5);
                expect(tp.page()).toBe(5); // checking assumptions

                // when
                tp.filter()['username'] = 'new value';
                scope.$digest();
                $timeout.flush();  // trigger delayed filter

                expect(tp.page()).toBe(1);
            }));
        });

        describe('filter specified with url', () => {

            let tableElm: IAugmentedJQuery;
            beforeEach(() => {
                const html = `<div>
                    <script type="text/ng-template" id="ng-table/filters/customNum.html">
                        <input type="number" id="{{name}}"/>
                    </script>
                    <table ng-table="tableParams">
                        <tr ng-repeat="user in $data">
                            <td header-class="captureColumn($column)" title="'Age'"
                                filter="{ 'age': 'ng-table/filters/customNum.html' }">{{user.age}}</td>
                        </tr>
                    </table>
                </div>`;
                ({ tableElm } = createTable(html));
            });

            it('should render filter template specified by url', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.length).toBe(1);

                expect(inputs.eq(0).attr('type')).toBe('number');
                expect(inputs.eq(0).attr('id')).toBe('age');
            });
        });

        describe('multiple filter inputs', () => {

            let tableElm: IAugmentedJQuery;
            beforeEach(() => {
                const html = `<div>
                    <table ng-table="tableParams">
                        <tr ng-repeat="user in $data">
                            <td header-class="captureColumn($column)" title="'Name'" 
                                filter="{ 'name': 'text', 'age': 'text' }">
                                {{user.name}}
                            </td>
                        </tr>
                    </table>
                </div>`;
                ({ tableElm } = createTable(html));
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

            it('should make filter def available on $column', () => {
                expect($capturedColumn).toBeDefined();
                expect($capturedColumn.filter).toBeDefined();
                expect($capturedColumn.filter()['name']).toBe('text');
                expect($capturedColumn.filter()['age']).toBe('text');
            });
        });
        describe('dynamic filter', () => {

            let tableElm: IAugmentedJQuery,
                ageFilter: FilterTemplateDefMap;
            beforeEach(() => {

                ageFilter = { age: 'text' };
                scope.getFilter = function (colDef) {
                    if (colDef.id === 0) {
                        return { username: 'text' };
                    } else if (colDef.id === 1) {
                        return ageFilter;
                    } else {
                        return {};
                    }
                };
                const html = `<div>
                    <script type="text/ng-template" id="ng-table/filters/number.html">
                        <input type="number" name="{{name}}"/>
                    </script>
                    <table ng-table="tableParams">
                        <tr ng-repeat="user in $data">
                            <td title="'Name'" filter="getFilter($column)">{{user.name}}</td>
                            <td title="'Age'" filter="getFilter($column)">{{user.age}}</td>
                        </tr>
                    </table>
                </div>`;
                ({ tableElm } = createTable(html));
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
                ageFilter['age'] = 'number';
                scope.$digest();

                const ageInput = tableElm.find('thead').find('tr').eq(1).find('th').eq(1).find('input');
                expect(ageInput.attr('type')).toBe('number');
                expect(ageInput.attr('name')).toBe('age');
            });
        });

        describe('filter with placeholder value and alias', () => {

            let tableElm: IAugmentedJQuery,
                tp: NgTableParams<Person>;
            beforeEach(() => {
                const html = `<div>
                    <table ng-table="tableParams">
                        <tr ng-repeat="user in $data">
                            <td header-class="captureColumn($column)" title="'Name'" filter="usernameExpandedFilter">
                                {{user.name}}
                            </td>
                        </tr>
                    </table>
                </div>`;
                // 'text' is a shortcut alias for the template ng-table/filters/text
                scope.usernameExpandedFilter = {
                    username: { id: 'text', placeholder: 'User name' }
                };
                ({ params: tp, tableElm } = createTable(html));
            });

            it('should render named filter template with placeholder value', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.length).toBe(1);
                expect(inputs.eq(0).attr('type')).toBe('text');
                expect(inputs.eq(0).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(0).attr('name')).toBe('username');
                expect(inputs.eq(0).attr('placeholder')).toBe('User name');
            });

            it('should databind placeholder value to filter input', () => {
                scope.usernameExpandedFilter['username'].placeholder = 'Name of user';
                scope.$digest();

                const input = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(input.attr('placeholder')).toBe('Name of user');
            });

            it('should make filter def available on $column', () => {
                expect($capturedColumn).toBeDefined();
                expect($capturedColumn.filter).toBeDefined();
                expect($capturedColumn.filter()).toBe(scope.usernameExpandedFilter);
            });
        });

        describe('filter with placeholder value and url', () => {

            let tableElm: IAugmentedJQuery,
                tp: NgTableParams<Person>;
            beforeEach(() => {
                const html = `<div>
                    <table ng-table="tableParams">
                        <tr ng-repeat="user in $data">
                            <td header-class="captureColumn($column)" title="'Age'"
                                filter="ageExpandedFilter">{{user.age}}</td>
                        </tr>
                    </table>
                </div>`;
                scope.ageExpandedFilter = {
                    age: { id: 'ng-table/filters/number.html', placeholder: 'User age' }
                };
                ({ params: tp, tableElm } = createTable(html));
            });

            it('should render named filter template with placeholder value', () => {
                const inputs = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(inputs.length).toBe(1);
                expect(inputs.eq(0).attr('type')).toBe('number');
                expect(inputs.eq(0).attr('ng-model')).not.toBeUndefined();
                expect(inputs.eq(0).attr('name')).toBe('age');
                expect(inputs.eq(0).attr('placeholder')).toBe('User age');
            });

            it('should databind placeholder value to filter input', () => {
                scope.ageExpandedFilter['age'].placeholder = 'Age of user';
                scope.$digest();

                const input = tableElm.find('thead').find('tr').eq(1).find('th').find('input');
                expect(input.attr('placeholder')).toBe('Age of user');
            });

            it('should make filter def available on $column', () => {
                expect($capturedColumn).toBeDefined();
                expect($capturedColumn.filter).toBeDefined();
                expect($capturedColumn.filter()).toBe(scope.ageExpandedFilter);
            });
        });
    });

    describe('show-filter', () => {
        let tableElm: IAugmentedJQuery;
        beforeEach(() => {
            const html = `<div>
                <table ng-table="tableParams" show-filter="showFilterRow">
                    <tr ng-repeat="user in $data">
                        <td title="'Age'" filter="{ age: 'number'}">{{user.age}}</td>
                    </tr>
                </table>
            </div>`;
            scope.showFilterRow = true;
            ({ tableElm } = createTable(html));
        });

        it('when true, should display filter row', () => {
            const filterRow = tableElm.find('thead').find('tr').eq(1);
            expect(filterRow.hasClass('ng-table-filters')).toBe(true);
            expect(filterRow.hasClass('ng-hide')).toBe(false);
        });

        it('when false, should hide filter row', () => {
            // given
            scope.showFilterRow = false;

            // when
            scope.$digest();

            // then
            const filterRow = tableElm.find('thead').find('tr').eq(1);
            expect(filterRow.hasClass('ng-table-filters')).toBe(true);
            expect(filterRow.hasClass('ng-hide')).toBe(true);
        });
    });

    describe('$columns', () => {
        let tableElm: IAugmentedJQuery,
            params: NgTableParams<Person>;
        beforeEach(() => {
            const html = `<div>
                <table ng-table="tableParams" ng-table-columns-binding="model.exportedCols">
                    <tr ng-repeat="user in $data">
                        <td title="ageTitle" ng-if="isAgeVisible" filter="ageFilter">{{user.age}}</td>
                        <td title="'Name'" groupable="'name'" sortable="'name'">{{user.name}}</td>
                    </tr>
                </table>
            </div>`;
            scope.ageFilter = {
                age: 'text'
            };
            scope.isAgeVisible = true;
            scope.ageTitle = 'Age';
            ({ params, tableElm } = createTable(html));
        });

        it('should make $columns available on the scope created for ng-table', () => {
            // check that the scope is indeed the one created for out NgTableParams
            expect(scope.$$childHead.params).toBe(params);

            expect(scope.$$childHead.$columns).toBeDefined();
        });

        it('should NOT polute the outer scope with a reference to $columns ', () => {
            expect(scope['$columns']).toBeUndefined();
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
            expect(ageCol.filter()).toBe(scope.ageFilter);
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
            expect(scope.ageTitle).toBe('Age of person');

            ageCol.show.assign(scope.$$childHead, false);
            expect(ageCol.show()).toBe(false);
            expect(scope.isAgeVisible).toBe(false);

            const newFilter: FilterTemplateDefMap = { age: 'select' };
            ageCol.filter.assign(scope.$$childHead, newFilter);
            expect(ageCol.filter()).toBe(newFilter);
            expect(scope.ageFilter).toBe(newFilter);

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
            expect(scope.ageTitle).toBe('Age of person');

            ageCol.show(false);
            expect(ageCol.show()).toBe(false);
            expect(scope.isAgeVisible).toBe(false);

            const newFilter: FilterTemplateDefMap = { age: 'select' };
            ageCol.filter(newFilter);
            expect(ageCol.filter()).toBe(newFilter);
            expect(scope.ageFilter).toBe(newFilter);

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


    describe('groups', () => {

        let $capturedColumn: ColumnDef;
        beforeEach(inject(() => {
            // stash a reference to $column definition so that its available in asserts
            scope.captureColumn = function ($column) {
                $capturedColumn = $column;
            };
        }));

        describe('two groupable columns', () => {

            let tableElm: IAugmentedJQuery,
                thead: HTMLElement,
                tp: NgTableParams<Person>;
            beforeEach(() => {
                const html = `<div>
                    <table ng-table="tableParams">
                        <tr class="ng-table-group" ng-repeat-start="group in $groups"></tr>
                        <tr ng-repeat-end="user in group.data">
                            <td title="'Name'" groupable="'name'">{{user.name}}</td>
                            <td title="'Age'" groupable="'age'">{{user.age}}</td>
                            <td title="'Money'">{{user.money}}</td>
                        </tr>
                    </table>
                </div>`;
                ({ params: tp, tableElm: tableElm } = createTable(html));
                thead = tableElm.find('thead')[0];
            });

            it('should not render group row until group assigned', () => {
                const groupRow = thead.querySelector('.ng-table-group-header');
                expect(groupRow).toBeNull();
            });

            it('should render group row once group assigned', () => {
                tp.group('name');
                scope.$digest();
                const groupRow = thead.querySelector('.ng-table-group-header');
                expect(groupRow).not.toBeNull();
            });

            describe('with group assigned', () => {
                let groupRow: Element;
                beforeEach(() => {
                    tp.group('name');
                    scope.$digest();
                    groupRow = thead.querySelector('.ng-table-group-header')!;
                });

                it('group row should span the width of the visible columns', () => {
                    expect(groupRow.querySelector('th')!.getAttribute('colspan')).toBe('2');
                });

                it('should display column name of assigned group', () => {
                    expect(groupRow.querySelector('a > strong')!.textContent).toBe('Name');
                });

                it('clicking on group row should open group list selector', () => {
                    // when
                    groupRow.querySelector('a')!.click();

                    // then
                    const groupSelectorList = groupRow.querySelector('.list-group');
                    expect(groupSelectorList).not.toBeNull();
                });

                it('group list selector should include an item for each groupable column', () => {
                    // when
                    groupRow.querySelector('a')!.click();

                    // then
                    const items = groupRow.querySelector('.list-group')!.querySelectorAll('a');
                    expect(items.length).toBe(2);
                    expect(items.item(0).querySelector('strong')!.textContent).toBe('Name');
                    expect(items.item(1).querySelector('strong')!.textContent).toBe('Age');
                });

                it('assigned group should be marked as selected', () => {
                    // when
                    groupRow.querySelector('a')!.click();

                    // then
                    const nameGroup = groupRow.querySelector('.list-group')!.querySelector('a')!;
                    expect(nameGroup).not.toBeNull();
                    expect(nameGroup.querySelector('.sort-indicator')).not.toBeNull();
                });

                it('changing assigned group should be be updated in group row', () => {
                    // when
                    tp.group('age');
                    scope.$digest();

                    // then
                    expect(groupRow.querySelector('a > strong')!.textContent).toBe('Age');
                });

                it('tapping item in group list selector should change assigned group', () => {
                    // when
                    groupRow.querySelector('a')!.click();
                    groupRow.querySelector('.list-group')!.querySelectorAll('a')[1].click();

                    // then
                    const assignedGroup = tp.group();
                    expect(Object.keys(assignedGroup)).toEqual(['age']);
                });

                it('tapping existing selected item should change group sort order', () => {
                    // check assumptions
                    expect(tp.group()['name']).toBe('asc');

                    // when
                    groupRow.querySelector('a')!.click();
                    groupRow.querySelector('.list-group')!.querySelectorAll('a')[0].click();

                    // then
                    const assignedGroup = tp.group();
                    expect(assignedGroup['name']).toBe('desc');
                });

                it('tapping close button should hide the group row', () => {
                    // when
                    groupRow.querySelector('a')!.querySelector('button')!.click();

                    // then
                    expect(groupRow.classList.contains('ng-hide')).toBe(true);
                });

                describe('tapping close button', () => {
                    let toggleButton: HTMLButtonElement;
                    beforeEach(() => {
                        toggleButton = groupRow.querySelector('a')!.querySelectorAll('button')[1];
                    });

                    it('should toggle isExpanded group option', () => {
                        toggleButton.click();
                        expect(tp.settings().groupOptions.isExpanded).toBe(false);
                        toggleButton.click();
                        expect(tp.settings().groupOptions.isExpanded).toBe(true);
                    });

                    it('should trigger table reload', () => {
                        (tp.settings().getData as jasmine.Spy).calls.reset();

                        toggleButton.click();

                        expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
                    });
                });
            });
        });
    });

    describe('internals', () => {

        let tableElm: IAugmentedJQuery,
            $timeout: ITimeoutService;

        beforeEach(inject((_$timeout_: ITimeoutService) => {
            $timeout = _$timeout_;
            const html =
                `<table ng-table="tableParams">
                    <tr ng-repeat="user in $data">
                        <td title="\'Age\'">{{user.age}}</td>
                    </tr>
                </table>`;
            ({ tableElm } = createTable(html));
        }));

        it('should reload when binding a new tableParams to scope', () => {
            const tp = createNgTableParams<Person>();
            scope.tableParams = tp;
            scope.$digest();

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload 1 time when binding a new tableParams that has an initial settings dataset field', () => {
            const tp = createNgTableParams({ dataset: [{ age: 1 }] });
            scope.tableParams = tp;
            scope.$digest();

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload 1 time when binding a new tableParams with initial filter that has an initial settings dataset field', () => {
            const tp = createNgTableParams({ filter: { age: 1 } }, { dataset: [{ age: 1 }] });
            scope.tableParams = tp;
            scope.$digest();

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload when binding a new tableParams to scope multiple times', () => {
            const tp1 = createNgTableParams<Person>();
            scope.tableParams = tp1;
            scope.$digest();

            expect((tp1.settings().getData as jasmine.Spy).calls.count()).toBe(1);

            const tp2 = createNgTableParams<Person>();
            scope.tableParams = tp2;
            scope.$digest();

            expect((tp2.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload 1 time when binding a new settings dataset value and changing the filter', () => {
            // given
            const tp = createNgTableParams({ filterOptions: { filterDelay: 100 }, dataset: [{ age: 1 }, { age: 2 }] });
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 1 });
            tp.settings({ dataset: [{ age: 1 }, { age: 11 }, { age: 22 }] });
            scope.$digest();
            $timeout.flush(); // trigger the delayed reload

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload 1 time when multiple filter changes are debounced', () => {
            // given
            const tp = createNgTableParams({ filterOptions: { filterDelay: 100 }, dataset: [{ age: 1 }, { age: 2 }] });
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 1 });
            scope.$digest();
            tp.filter({ age: 2 });
            scope.$digest();
            $timeout.flush(); // trigger the delayed reload

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload 1 time when initial load fails', inject(function ($q: IQService) {
            // given
            const tp = createNgTableParams<Person>({
                getData: () => {
                    return $q.reject('BANG!');
                }
            });

            // when
            scope.tableParams = tp;
            scope.$digest();

            // then
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        }));

        it('should reload 1 time with page reset to 1 when binding a new settings dataset value and changing the filter', () => {
            const settings = {
                counts: [1],
                dataset: [{ age: 1 }, { age: 2 }],
                filterOptions: { filterDelay: 100 }
            };
            const tp = createNgTableParams({ count: 1, page: 2 }, settings);
            scope.tableParams = tp;
            scope.$digest();
            expect(tp.page()).toBe(2); // checking assumptions
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 1 });
            tp.settings({ dataset: [{ age: 1 }, { age: 11 }, { age: 22 }] });
            scope.$digest();
            $timeout.flush(); // trigger the delayed reload

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
            expect(tp.page()).toBe(1);
        });

        it('changing filter, orderBy, or page and then calling reload should not invoke getData twice', () => {
            const tp = createNgTableParams<Person>();
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 5 });
            tp.reload();
            scope.$digest();

            // then
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('change to filter that fails to load should not cause infinite reload loop', inject(function ($q: IQService) {
            const tp = createNgTableParams({
                getData: function (): IPromise<any> | Person[] {
                    if ((tp.settings().getData as jasmine.Spy).calls.count() > 1) {
                        return $q.reject('BANG!');
                    }
                    return [{ age: 1 }]
                }
            });
            scope.tableParams = tp;
            scope.$digest();
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1); // checking assumptions
            expect(tp.isDataReloadRequired()).toBe(false); // checking assumptions

            // when
            tp.filter({ age: 5 });
            expect(tp.isDataReloadRequired()).toBe(true); // checking assumptions
            scope.$digest();

            // then
            expect(tp.isDataReloadRequired()).toBe(false);
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(2);
        }));

        it('changing filter, orderBy, or page in a callback to reload should re-invoke getData 1 time only', () => {
            const tp = createNgTableParams<Person>();
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 5 });
            tp.reload().then(() => {
                tp.sorting({ age: 'desc' });
                // note: better to call tp.reload() here rather than rely on a watch firing later to do it for us
                // that way the second reload is chained to the first and returned as a single promise
            });
            scope.$digest();

            // then
            // ie calls.count() === (1 x reload) + (1 x sorting)
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(2);
        });

        it('changing filter, orderBy, or page then reload in a callback to reload should re-invoke getData 1 time only', () => {

            // todo: refactor the watches in ngTableController to handle this case

            const tp = createNgTableParams<Person>();
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 5 });
            tp.reload().then(() => {
                tp.sorting({ age: 'desc' });
                return tp.reload();
            });
            scope.$digest();

            // then
            // ie calls.count() === (1 x reload) + (1 x sorting)
            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(2);
        });

        it('should not reload when filter value is assigned the same value', () => {
            // given
            const tp = createNgTableParams<Person>({ filter: { age: 10 } }, {});
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 10 });
            scope.$digest();

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(0);
        });

        it('should reload when filter value changes', () => {
            // given
            const tp = createNgTableParams<Person>({ filter: { age: 10 } }, {});
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.filter({ age: 12 });
            scope.$digest();

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });

        it('should reload when new dataset supplied', () => {
            // given
            const initialDataset = [
                { age: 1 },
                { age: 2 }
            ];
            const tp = createNgTableParams<Person>();
            scope.tableParams = tp;
            scope.$digest();
            (tp.settings().getData as jasmine.Spy).calls.reset();

            // when
            tp.settings({ dataset: [{ age: 10 }, { age: 11 }, { age: 12 }] });
            scope.$digest();

            expect((tp.settings().getData as jasmine.Spy).calls.count()).toBe(1);
        });
    });
});