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
    var NgTableParams;

    beforeEach(module('ngTable'));

    beforeEach(inject(function ($controller, $rootScope, _NgTableParams_) {
        scope = $rootScope.$new();
        NgTableParams = _NgTableParams_;
    }));

    it('NgTableParams should be defined', function () {
        var params = new NgTableParams();
        expect(NgTableParams).toBeDefined();
    });

    it('NgTableParams test generatePagesArray', function () {
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
    });

    it('NgTableParams `page` parameter', function () {
        var params = new NgTableParams();

        expect(params.page()).toBe(1);
        expect(params.page(2)).toEqual(params);
        expect(params.page()).toBe(2);

        params = new NgTableParams({
            page: 3
        });
        expect(params.page()).toBe(3);
    });

    it('NgTableParams parse url parameters', function () {
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
    });

    it('NgTableParams return url parameters', function () {
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
    });

    it('NgTableParams test orderBy', function () {
        var params = new NgTableParams({
            'sorting[name]': 'asc'
        });

        expect(params.orderBy()).toEqual([ '+name' ]); // for angular sorting function

        params.sorting({ name: 'desc', age: 'asc' });

        expect(params.orderBy()).toEqual([ '-name', '+age' ]);
    });

    it('NgTableParams test settings', function () {
        var params = new NgTableParams();

        expect(params.settings()).toEqual(jasmine.objectContaining({
            $scope: null,
            $loading: false,
            data: null,
            total: 0,
            defaultSort : 'desc',
            counts: [10, 25, 50, 100],
            interceptors: [],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator : 'span',
            getData: params.getData,
            getGroups: params.getGroups,
            filterDelay: 750
        }));

        params = new NgTableParams({}, { total: 100, counts: [1,2] });

        expect(params.settings()).toEqual(jasmine.objectContaining({
            $scope: null,
            $loading: false,
            data: null,
            total: 100,
            defaultSort : 'desc',
            counts: [1,2],
            interceptors: [],
            paginationMaxBlocks: 11,
            paginationMinBlocks: 5,
            sortingIndicator : 'span',
            getData: params.getData,
            getGroups: params.getGroups,
            filterDelay: 750
        }));
    });

    it('NgTableParams test getData', inject(function ($q) {
        var params = new NgTableParams();
        var actualData = params.getData(params);
        expect(actualData).toEqual([]);
    }));

    it('NgTableParams test grouping', inject(function ($rootScope) {
        var params = new NgTableParams({}, { getData: function (/*params*/) {
            return data;
        }});

        var actualRoleGroups;
        params.getGroups('role'/*, params*/).then(function(groups){
            actualRoleGroups = groups;
        });
        $rootScope.$digest();

        expect(actualRoleGroups).toEqual([
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

        var actualAgeGroups;
        params.getGroups('age'/*, params*/).then(function(groups){
            actualAgeGroups = groups;
        });
        $rootScope.$digest();

        expect(actualAgeGroups).toEqual([
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
            },
            {
                value: 43,
                data: [
                    {name: "Tiancum", age: 43, role: 'Administrator'},
                    {name: "Tiancum", age: 43, role: 'User'},
                    {name: "Tiancum", age: 43, role: 'Moderator'},
                    {name: "Tiancum", age: 43, role: 'User'}
                ]
            },{
                value: 50,
                data: [
                    {name: "Moroni", age: 50, role: 'Administrator'}
                ]
            }
        ]);
    }));

    it('ngTableParams test defaults', inject(function ($q, ngTableDefaults) {
        ngTableDefaults.params = {
            count: 2
        };
        ngTableDefaults.settings = {
            counts: []
        };
        var params = new NgTableParams();

        expect(params.count()).toEqual(2);
        expect(params.page()).toEqual(1);

        var settings = params.settings();
        expect(settings.counts.length).toEqual(0);
        expect(settings.interceptors.length).toEqual(0);
        expect(settings.filterDelay).toEqual(750);

        ngTableDefaults.settings.interceptors = [ { response: angular.identity }];
        params = new NgTableParams();
        expect(params.settings().interceptors.length).toEqual(1);
    }));

    describe('hasFilter', function(){
        var tableParams;

        beforeEach(inject(function(){
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

    describe('backwards compatibility shim', function(){

        var $scope;
        beforeEach(inject(function($rootScope){
            $scope = $rootScope.$new();
        }));

        function createNgTable(settings){
            settings = angular.extend({}, { $scope: $scope, filterDelay: 0 }, settings);
            return new NgTableParams({}, settings);
        }

        it('shim should supply getData original arguments', inject(function(ngTableGetDataBcShim){
            // given
            var callCount = 0;
            var adaptedFn = ngTableGetDataBcShim(originalGetDataFn);

            // when
            var tableParams = new NgTableParams({}, {});
            adaptedFn(tableParams);

            // then
            expect(callCount).toBe(1);

            function originalGetDataFn($defer, params){
                callCount++;
                expect($defer).toBeDefined();
                expect($defer.resolve).toBeDefined();
                expect(params).toBeDefined();
                expect(params).toEqual(jasmine.any(NgTableParams));
            }

        }));

        it('shim should return the getData "$defer" promise', inject(function(ngTableGetDataBcShim){
            // given
            var callCount = 0;
            var adaptedFn = ngTableGetDataBcShim(originalGetDataFn);

            // when
            var tableParams = new NgTableParams({}, {});
            var results = adaptedFn(tableParams);

            // then
            expect(results).toBeDefined();
            expect(results.then).toBeDefined();
            results.then(function(data){
                expect(data.length).toBe(3);
            });
            $scope.$digest();

            function originalGetDataFn($defer/*, params*/){
                $defer.resolve([1,2,3]);
            }
        }));

        it('shim should return the data', inject(function(ngTableGetDataBcShim){
            // given
            var callCount = 0;
            var adaptedFn = ngTableGetDataBcShim(originalGetDataFn);

            // when
            var tableParams = new NgTableParams({}, {});
            var results = adaptedFn(tableParams);

            // then
            expect(results).toBeDefined();
            expect(results).toEqual([1,2,3]);

            function originalGetDataFn(/*$defer, params*/){
                return [1,2,3];
            }
        }));

        it('shim should be applied when getData function supplied has more than one parameter', function(){
            // given
            var tableParams = createNgTable({ getData: originalGetDataFn});

            // when
            var dataFetched = tableParams.reload();

            // then
            var actualData;
            dataFetched.then(function(data){
                actualData = data;
            });
            $scope.$digest();
            expect(actualData).toEqual([1,2,3]);

            function originalGetDataFn($defer, params){
                params.total(3);
                $defer.resolve([1,2,3]);
            }
        });

        it('shim should NOT be applied when getData has new signature', function(){
            // given
            var tableParams = createNgTable({ getData: newGetDataFn});

            // when
            var dataFetched = tableParams.reload();

            // then
            var actualData;
            dataFetched.then(function(data){
                actualData = data;
            });
            $scope.$digest();
            expect(actualData).toEqual([1,2,3]);

            function newGetDataFn(params){
                params.total(3);
                return [1,2,3];
            }
        });
    });

    describe('interceptors', function(){

        var $scope;
        beforeEach(inject(function($rootScope){
            $scope = $rootScope.$new();
        }));

        function getData(/*$defer, params*/){
            return [];
        }

        function createNgTable(settings){
            settings = angular.extend({}, { $scope: $scope, getData: getData, filterDelay: 0 }, settings);
            return new NgTableParams({}, settings);
        }

        it('can register interceptor', function(){
            var interceptor = { response: angular.identity };
            var tableParams = createNgTable({ interceptors: [interceptor]});
            expect(tableParams.settings().interceptors).toEqual([interceptor]);
        });

        it('can register multiple interceptor', function(){
            var interceptors = [{ response: angular.identity }, { response: angular.identity }];
            var tableParams = createNgTable({ interceptors: interceptors});
            expect(tableParams.settings().interceptors).toEqual(interceptors);
        });

        it('can register interceptors after NgTableParams created', function(){
            var interceptor = { response: angular.identity };
            var interceptor2 = { response: angular.identity };
            var tableParams = createNgTable({ interceptors: [interceptor]});
            var interceptors = tableParams.settings().interceptors.concat([interceptor2]);
            tableParams.settings({ interceptors: interceptors});
            expect(tableParams.settings().interceptors).toEqual(interceptors);
        });

        describe('one response interceptor', function(){

            it('should receive response from call to getData', function(){
                // given
                var interceptor = {
                    response: function(/*data, params*/){
                        this.hasRun = true;
                    }
                };
                var tableParams = createNgTable({ interceptors: [interceptor]});

                // when
                tableParams.reload();
                $scope.$digest();

                // then
                expect(interceptor.hasRun).toBeTruthy();
            });

            it('should be able to modify data returned by getData', function(){
                // given
                var interceptor = {
                    response: function(data/*, params*/){
                        data.forEach(function(item){
                            item.modified = true;
                        });
                        return data;
                    }
                };
                var tableParams = createNgTable({ interceptors: [interceptor], getData: function(){
                    return [{}, {}];
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                $scope.$digest();

                // then
                expect(actualData).toEqual([{ modified: true }, { modified: true }]);
            });

            it('should be able to replace data returned by getData', function(){
                // given
                var interceptor = {
                    response: function(data/*, params*/){
                        return data.map(function(item){
                            return item * 2;
                        });
                    }
                };
                var tableParams = createNgTable({ interceptors: [interceptor], getData: function(){
                    return [2, 3];
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                $scope.$digest();

                // then
                expect(actualData).toEqual([4, 6]);
            });

            it('should be able to access tableParams supplied to getData', function(){
                // given
                var interceptor = {
                    response: function(data, params){
                        params.total(data.total);
                        return data.results;
                    }
                };
                var tableParams = createNgTable({ interceptors: [interceptor], getData: function(){
                    return { results: [1,2,3], total: 3};
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                $scope.$digest();

                // then
                expect(actualData).toEqual([1,2,3]);
                expect(tableParams.total()).toEqual(3);
            });
        });

        describe('multiple response interceptors', function(){

            it('should run interceptors in the order they were registered', function(){
                // given
                var callCount = 0;
                var interceptor = {
                    response: function(/*data, params*/){
                        this.sequence = callCount;
                        callCount++;
                    }
                };
                var interceptors = [interceptor, angular.copy(interceptor)];
                var tableParams = createNgTable({ interceptors: interceptors});

                // when
                tableParams.reload();
                $scope.$digest();

                // then
                expect(interceptors[0].sequence).toBe(0);
                expect(interceptors[1].sequence).toBe(1);
            });

            it('results of one interceptor should be piped to the next validator', function(){
                // given
                var callCount = 0;
                var interceptor = {
                    response: function(data/*, params*/){
                        return data.map(function(item){
                            return item * 2;
                        });
                    }
                };
                var interceptor2 = {
                    response: function(data/*, params*/){
                        return data.map(function(item){
                            return item.toString() + '0';
                        });
                    }
                };
                var interceptors = [interceptor, interceptor2];
                var tableParams = createNgTable({ interceptors: [interceptor, interceptor2], getData: function(){
                    return [2, 3];
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                $scope.$digest();

                // then
                expect(actualData).toEqual(['40', '60']);
            });
        });
    });
});
