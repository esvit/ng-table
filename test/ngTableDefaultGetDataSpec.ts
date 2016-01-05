describe('ngTableDefaultGetData', () => {

    interface IPerson {
        age: number;
    }

    describe('provider', () => {
        let ngTableDefaultGetDataProvider: NgTable.Data.IDefaultGetDataProvider;

        beforeEach(angular.mock.module("ngTable"));
        beforeEach(() => {
            angular.mock.module((_ngTableDefaultGetDataProvider_: NgTable.Data.IDefaultGetDataProvider) => {
                ngTableDefaultGetDataProvider=_ngTableDefaultGetDataProvider_;
            });
        });
        beforeEach(inject());

        it('should be configured to use built-in angular filters', () => {
            expect(ngTableDefaultGetDataProvider.filterFilterName).toBe('filter');
            expect(ngTableDefaultGetDataProvider.sortingFilterName).toBe('orderBy');
        });
    });

    describe('service', () => {
        let ngTableDefaultGetData : NgTable.Data.IDefaultGetData<any>,
            tableParams: NgTableParams<any>;

        beforeEach(angular.mock.module('ngTable'));

        beforeEach(inject((
            _ngTableDefaultGetData_: NgTable.Data.IDefaultGetData<any>, 
            NgTableParams: NgTable.ITableParamsConstructor<any>) => {
            ngTableDefaultGetData = _ngTableDefaultGetData_;
            tableParams = new NgTableParams({ count: 10 }, {counts: [10]});
        }));

        describe('sorting', () => {
            it('empty sorting', () => {
                // given
                tableParams.sorting();
                // when
                var actualResults = ngTableDefaultGetData([{age: 1}, {age: 2}, {age: 3}], tableParams);
                // then
                expect(actualResults).toEqual([{age: 1}, {age: 2}, {age: 3}]);
            });

            it('single property sort ascending', () => {
                // given
                tableParams.sorting({age: 'asc'});
                // when
                var actualResults = ngTableDefaultGetData([{age: 1}, {age: 3}, {age: 2}], tableParams);
                // then
                expect(actualResults).toEqual([{age: 1}, {age: 2}, {age: 3}]);
            });

            it('single property sort descending', () => {
                // given
                tableParams.sorting({age: 'desc'});
                // when
                var actualResults = ngTableDefaultGetData([{age: 1}, {age: 3}, {age: 2}], tableParams);
                // then
                expect(actualResults).toEqual([{age: 3}, {age: 2}, {age: 1}]);
            });

            it('multiple property sort ascending', () => {
                // given
                tableParams.sorting({age: 'asc', name: 'asc'});
                // when
                var data = [
                    {age: 1, name: 'b'}, {age: 3, name: 'a'}, {age: 2, name: 'a'}, {age: 1, name: 'a'}
                ];
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                var expectedData = [
                    {age: 1, name: 'a'}, {age: 1, name: 'b'}, {age: 2, name: 'a'}, {age: 3, name: 'a'}
                ];
                expect(actualResults).toEqual(expectedData);
            });

        });

        describe('filters', () => {
            it('empty filter', () => {
                // given
                tableParams.filter({});
                // when
                var actualResults = ngTableDefaultGetData([{age: 1}, {age: 2}, {age: 3}], tableParams);
                // then
                expect(actualResults).toEqual([{age: 1}, {age: 2}, {age: 3}]);
            });

            it('empty filter - simple values', () => {
                // given
                tableParams.filter({});
                // when
                var actualResults = ngTableDefaultGetData([1, 2, 3], tableParams);
                // then
                expect(actualResults).toEqual([1, 2, 3]);
            });

            it('single property filter', () => {
                // given
                tableParams.filter({age: 1});
                // when
                var actualResults = ngTableDefaultGetData([{age: 1}, {age: 2}, {age: 3}], tableParams);
                // then
                expect(actualResults).toEqual([{age: 1}]);
            });

            it('multiple property filter', () => {
                // given
                var data = [{age: 1, name: 'A'}, {age: 2, name: 'B'}, {age: 3, name: 'B'}];
                tableParams.filter({age: 2, name: 'B'});
                // when
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                expect(actualResults).toEqual([{age: 2, name: 'B'}]);
            });

            it('should remove null and undefined values before applying', () => {
                // given
                var data = [{age: 1, name: 'A'}, {age: 2, name: 'B'}, {age: 3, name: 'B'}];
                tableParams.filter({age: null, name: 'B'});
                // when
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                expect(actualResults).toEqual([{age: 2, name: 'B'}, {age: 3, name: 'B'}]);
            });

            it('should remove empty string value before applying', () => {
                // given
                var data = [{age: 1, name: 'A'}, {age: 2, name: 'B'}, {age: 3, name: 'B'}];
                tableParams.filter({age: 2, name: ''});
                // when
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                expect(actualResults).toEqual([{age: 2, name: 'B'}]);
            });

            it('single nested property, one level deep', () => {
                // given
                tableParams.filter({'details.age': 1});
                // when
                var data = [{
                    details: {age: 1}
                }, {
                    details: {age: 2}
                }, {
                    details: {age: 3}
                }, {
                    age: 1
                }];
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                expect(actualResults).toEqual([{details: {age: 1}}]);
            });

            it('single nested property, two levels deep', () => {
                // given
                tableParams.filter({'details.personal.age': 1});
                // when
                var data = [{
                    details: {personal: {age: 1}}
                }, {
                    details: {personal: {age: 2}}
                }, {
                    details: {personal: {age: 3}}
                }, {
                    age: 1
                }];
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                expect(actualResults).toEqual([{details: {personal: {age: 1}}}]);
            });

            it('multiple nested property, two levels deep', () => {
                // given
                tableParams.filter({'details.personal.age': 1, 'job.money': 100});
                // when
                var data = [{
                    details: {personal: {age: 1}},
                    job: {money: 200}
                }, {
                    details: {personal: {age: 1}},
                    job: {money: 100}
                }, {
                    details: {personal: {age: 3}},
                    job: {money: 100}
                }];
                var actualResults = ngTableDefaultGetData(data, tableParams);
                // then
                var expected = [{
                    details: {personal: {age: 1}},
                    job: {money: 100}
                }];
                expect(actualResults).toEqual(expected);
            });

            describe('filterComparator', () => {

                it('function', () => {
                    // given
                    var comparer = (actual: any, expected: any) => angular.equals(actual, expected);
                    tableParams.settings({ filterOptions: { filterComparator: comparer }});
                    tableParams.filter({age: 1});
                    // when
                    var actualResults = ngTableDefaultGetData([{age: 10}, {age: 1}, {age: 101}, {age: 2}], tableParams);
                    // then
                    expect(actualResults).toEqual([{age: 1}]);
                });

                it('"true"', () => {
                    // given
                    tableParams.settings({ filterOptions: { filterComparator: true }});
                    tableParams.filter({age: 1});
                    // when
                    var actualResults = ngTableDefaultGetData([{age: 10}, {age: 1}, {age: 101}, {age: 2}], tableParams);
                    // then
                    expect(actualResults).toEqual([{age: 1}]);
                });

                it('"false"', () => {
                    // given
                    tableParams.settings({ filterOptions: { filterComparator: false }});
                    tableParams.filter({age: 1});
                    // when
                    var actualResults = ngTableDefaultGetData([{age: 10}, {age: 1}, {age: 101}, {age: 2}], tableParams);
                    // then
                    expect(actualResults).toEqual([{age: 10}, {age: 1}, {age: 101}]);
                });

                it('"undefined" (the default)', () => {
                    // given
                    tableParams.settings({ filterOptions: { filterComparator: undefined }});
                    tableParams.filter({age: 1});
                    // when
                    var actualResults = ngTableDefaultGetData([{age: 10}, {age: 1}, {age: 101}, {age: 2}], tableParams);
                    // then
                    expect(actualResults).toEqual([{age: 10}, {age: 1}, {age: 101}]);
                });
            })
        });
    });

    describe('service, custom filters', () => {
        var ngTableDefaultGetData: NgTable.Data.IDefaultGetData<IPerson>, 
            tableParams: NgTableParams<IPerson>;
            
        type PersonCriteria = { ages: number[]};

        beforeEach(() => {
            // add a custom filter available to our tests
            angular.mock.module('ngTable', ($provide: ng.auto.IProvideService) => {
                $provide.factory('myCustomFilterFilter', myCustomFilter)
            });

            myCustomFilter.$inject = [];
            function myCustomFilter() {

                return jasmine.createSpy('myCustomFilterSpy',filter).and.callThrough();

                function filter(people: IPerson[], criteriaObj: PersonCriteria/*, comparator*/) {
                    return people.filter(p => criteriaObj.ages.indexOf(p.age) !== -1);
                }
            }
        });

        beforeEach(inject((
            _ngTableDefaultGetData_: NgTable.Data.IDefaultGetData<IPerson>, 
            NgTableParams: NgTable.ITableParamsConstructor<IPerson>) => {
            ngTableDefaultGetData = _ngTableDefaultGetData_;
            tableParams = new NgTableParams({count: 10}, {counts: [10]});
        }));

        it('filterFilterName override', () => {
            // given
            tableParams.settings({ filterOptions: {filterFilterName: 'myCustomFilter'}});
            tableParams.filter({ages: [1, 2]});
            // when
            var actualResults = ngTableDefaultGetData([{age: 1}, {age: 2}, {age: 3}], tableParams);
            // then
            expect(actualResults).toEqual([{age: 1}, {age: 2}]);
        });

        it('`this` context of custom filter should be set to the NgTableParams instance', inject((myCustomFilterFilter: jasmine.Spy) => {
            // given
            tableParams.settings({ filterOptions: {filterFilterName: 'myCustomFilter'}});
            tableParams.filter({ages: [1, 2]});
            // when
            ngTableDefaultGetData([{age: 1}, {age: 2}, {age: 3}], tableParams);
            // then
            expect(myCustomFilterFilter.calls.mostRecent().object).toBe(tableParams);
        }));

        it('custom filter function', () => {
            // given
            var filterFn = (data: IPerson[], criteriaObj: PersonCriteria/*, comparator*/) => {
                return data.filter(p => criteriaObj.ages.indexOf(p.age) !== -1);
            };
            tableParams.settings({ filterOptions: { filterFn: filterFn }});
            tableParams.filter({ages: [1, 2]});
            // when
            var actualResults = ngTableDefaultGetData([{age: 1}, {age: 2}, {age: 3}], tableParams);
            // then
            expect(actualResults).toEqual([{age: 1}, {age: 2}]);
        });

        it('`this` context of custom filter function should be set to the NgTableParams instance', () => {
            // given
            var filterFnSpy = jasmine.createSpy('filterFn', angular.identity).and.callThrough();
            tableParams.settings({ filterOptions: { filterFn: filterFnSpy }});
            tableParams.filter({age: 1});
            // when
            var actualResults = ngTableDefaultGetData([{age: 1}], tableParams);
            // then
            expect(filterFnSpy.calls.mostRecent().object).toBe(tableParams);
        });
    });
});
