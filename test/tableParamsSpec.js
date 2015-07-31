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
    var NgTableParams,
        $rootScope;

    beforeEach(module('ngTable'));

    beforeEach(inject(function ($controller, _$rootScope_, _NgTableParams_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        NgTableParams = _NgTableParams_;
    }));

    function createNgTableParams(settings) {
        var initialParams;
        if (arguments.length === 2){
            initialParams = arguments[0];
            settings = arguments[1];
        }

        settings = angular.extend({}, {
            filterDelay: 0,
            getData: function (params) {
                if (!params.hasOwnProperty('getDataCallCount')){
                    params.getDataCallCount = 0;
                }
                params.getDataCallCount++;
            }
        }, settings);
        return new NgTableParams(initialParams, settings);
    }

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

    describe('reload', function(){

        it('should call getData to retrieve data', function(){
            var params = createNgTableParams();
            params.reload();
            expect(params.getDataCallCount).toBe(1);
        });

        it('should add the results returned by getData to the data field', function(){
            var params = createNgTableParams({ getData: function(){
                return [1,2,3];
            }});
            params.reload();
            scope.$digest();
            expect(params.data).toEqual([1,2,3]);
        });

        it('should use ngTableDefaultGetData function when NgTableParams not supplied a getData function', function(){
            // given
            var settings = {
                data: [{age: 1}, {age: 11}, {age: 110}, {age: 5}]
            };
            var paramValues = {count: 2, filter: {age: 1}, sorting: { age: 'desc'}};
            var params = new NgTableParams(paramValues, settings);

            // when
            params.reload();
            scope.$digest();

            // then
            expect(params.data).toEqual([{age: 110}, {age: 11}]);
            expect(params.total()).toEqual(3);
        });
    });

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
            scope.$digest();

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
            var tableParams = createNgTableParams({ getData: originalGetDataFn});

            // when
            var dataFetched = tableParams.reload();

            // then
            var actualData;
            dataFetched.then(function(data){
                actualData = data;
            });
            scope.$digest();
            expect(actualData).toEqual([1,2,3]);

            function originalGetDataFn($defer, params){
                params.total(3);
                $defer.resolve([1,2,3]);
            }
        });

        it('shim should NOT be applied when getData has new signature', function(){
            // given
            var tableParams = createNgTableParams({ getData: newGetDataFn});

            // when
            var dataFetched = tableParams.reload();

            // then
            var actualData;
            dataFetched.then(function(data){
                actualData = data;
            });
            scope.$digest();
            expect(actualData).toEqual([1,2,3]);

            function newGetDataFn(params){
                params.total(3);
                return [1,2,3];
            }
        });
    });

    describe('interceptors', function(){

        it('can register interceptor', function(){
            var interceptor = { response: angular.identity };
            var tableParams = createNgTableParams({ interceptors: [interceptor]});
            expect(tableParams.settings().interceptors).toEqual([interceptor]);
        });

        it('can register multiple interceptor', function(){
            var interceptors = [{ response: angular.identity }, { response: angular.identity }];
            var tableParams = createNgTableParams({ interceptors: interceptors});
            expect(tableParams.settings().interceptors).toEqual(interceptors);
        });

        it('can register interceptors after NgTableParams created', function(){
            var interceptor = { response: angular.identity };
            var interceptor2 = { response: angular.identity };
            var tableParams = createNgTableParams({ interceptors: [interceptor]});
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
                var tableParams = createNgTableParams({ interceptors: [interceptor]});

                // when
                tableParams.reload();
                scope.$digest();

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
                var tableParams = createNgTableParams({ interceptors: [interceptor], getData: function(){
                    return [{}, {}];
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                scope.$digest();

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
                var tableParams = createNgTableParams({ interceptors: [interceptor], getData: function(){
                    return [2, 3];
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                scope.$digest();

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
                var tableParams = createNgTableParams({ interceptors: [interceptor], getData: function(){
                    return { results: [1,2,3], total: 3};
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                scope.$digest();

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
                var tableParams = createNgTableParams({ interceptors: interceptors});

                // when
                tableParams.reload();
                scope.$digest();

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
                var tableParams = createNgTableParams({ interceptors: [interceptor, interceptor2], getData: function(){
                    return [2, 3];
                }});

                // when
                var actualData;
                tableParams.reload().then(function(data){
                    actualData = data;
                });
                scope.$digest();

                // then
                expect(actualData).toEqual(['40', '60']);
            });
        });
    });

    describe('events', function(){

        var actualEventArgs,
            actualPublisher,
            fakeTableParams,
            ngTableEventsChannel;

        beforeEach(inject(function(_ngTableEventsChannel_){
            ngTableEventsChannel = _ngTableEventsChannel_;
            fakeTableParams = {};
            actualPublisher = undefined;
            actualEventArgs = undefined;
        }));

        function getSubscriberCount(){
            var allEventNames = Object.keys($rootScope.$$listenerCount);
            var ngTableEvents = allEventNames.filter(function(event){
                return event.indexOf('ngTable:') === 0;
            });
            return ngTableEvents.reduce(function(result, event){
                result += $rootScope.$$listenerCount[event];
                return result;
            }, 0);
        }

        describe('general pub/sub mechanics', function(){

            var supportedEvents = ['DatasetChanged', 'AfterReloadData', 'PagesChanged', 'AfterCreated'];

            it('should be safe to publish event when no subscribers', function () {

                function test(event) {
                    ngTableEventsChannel['publish' + event](fakeTableParams);
                }

                supportedEvents.forEach(test);
            });

            it('publishing event should notify registered subscribers (one)', function(){

                function test(event){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(){
                        cbCount++;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(cbCount).toBe(1);
                }

                supportedEvents.forEach(test);
            });

            it('publishing event should notify registered subscribers (multiple)', function(){

                function test(event){
                    // given
                    var cb1Count = 0;
                    ngTableEventsChannel['on' + event](function(){
                        cb1Count++;
                    });
                    var cb2Count = 0;
                    ngTableEventsChannel['on' + event](function(){
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

            it('subscriber should be able to unregister their callback', function(){

                function test(event){
                    // given
                    var cbCount = 0;
                    var subscription = ngTableEventsChannel['on' + event](function(){
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

            it('subscriber should be able specify the scope to receive events', function(){

                // this is useful as it allows all subscriptions to be removed by calling $destroy on that scope

                function test(event){
                    // given
                    var childScope = $rootScope.$new();
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(){
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

            it('should not notify subscribers who have filter out the publisher', function(){

                function test(event){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(){
                        cbCount++;
                    }, function(publisher){
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

            it('should not notify subscribers who have filter not to receive event based on arg values', function(){

                function test(event){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(){
                        cbCount++;
                    }, function(publisher, arg1){
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

            it('should support a shorthand for subscribers to receive events from specific NgTableParams instance', function () {

                function test(event) {
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function () {
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

            it('publisher should be supplied to subscriber callback', function(){

                function test(event){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(params){
                        actualPublisher = params;
                    });

                    // when
                    ngTableEventsChannel['publish' + event](fakeTableParams);

                    // then
                    expect(actualPublisher).toBe(fakeTableParams);
                }

                supportedEvents.forEach(test);
            });

            it('remaining event args should be supplied to subscriber callback', function(){

                function test(event){
                    // given
                    ngTableEventsChannel['on' + event](function(params/*, ...args*/){
                        actualPublisher = params;
                        actualEventArgs = _.rest(arguments);
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

            it('subscribers should never receive events from null instance of tableParams', function(){

                function test(event){
                    // given
                    var cbCount = 0;
                    ngTableEventsChannel['on' + event](function(params/*, ...args*/){
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

        describe('afterCreated', function(){

            it('should fire when a new NgTableParams has been constructed', function(){
                // given
                ngTableEventsChannel.onAfterCreated(function(params){
                    actualPublisher = params;
                });

                // when
                var params = createNgTableParams();

                // then
                expect(actualPublisher).toBe(params);
            });
        });

        describe('afterReloadData', function(){

            it('should fire when a reload completes', function(){
                // given
                ngTableEventsChannel.onAfterReloadData(function(params, newVal, oldVal){
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                var newDatapage = [1, 5, 6];
                var params = createNgTableParams({ getData: function(){
                    return newDatapage;
                }});

                // when
                params.reload();
                scope.$digest();

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDatapage, []]);
            });

            it('should fire on reload even if datapage remains the same array', function(){
                // given
                var callCount = 0;
                ngTableEventsChannel.onAfterReloadData(function(/*params, newVal, oldVal*/){
                    callCount++;
                });
                var dataPage = [1,2,3];
                var params = createNgTableParams({ getData: function(){
                    return dataPage;
                }});

                // when
                params.reload();
                scope.$digest();
                params.reload();
                scope.$digest();

                // then
                expect(callCount).toBe(2);
            });
        });

        describe('pagesChanged', function(){

            it('should fire when a reload completes', function(){
                // given
                ngTableEventsChannel.onPagesChanged(function(params, newVal, oldVal){
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], data: [1,2,3,4,5,6]});

                // when
                params.reload();
                scope.$digest();

                // then
                var expectedPages = params.generatePagesArray(params.page(), params.total(), params.count());
                expect(expectedPages.length).toBeGreaterThan(0); // checking assumptions
                expect(actualEventArgs).toEqual([expectedPages, undefined]);
            });

            it('should fire when a reload completes (multiple)', function(){
                // given
                var callCount = 0;
                ngTableEventsChannel.onPagesChanged(function(/*params, newVal, oldVal*/){
                    callCount++;
                });
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], data: [1,2,3,4,5,6]});

                // when
                params.reload();
                scope.$digest();
                params.page(2); // trigger a change to pages data structure
                params.reload();
                scope.$digest();

                // then
                expect(callCount).toBe(2);
            });

            it('should not fire on reload when pages remain the same', function(){
                // given
                var callCount = 0;
                ngTableEventsChannel.onPagesChanged(function(/*params, newVal, oldVal*/){
                    callCount++;
                });
                var params = createNgTableParams({ count: 5 }, { counts: [5,10], data: [1,2,3,4,5,6]});
                params.reload();
                scope.$digest();

                // when
                params.reload();
                scope.$digest();

                // then
                expect(callCount).toBe(1);
            });
        });

        describe('datasetChanged', function(){

            it('should fire when a initial dataset is supplied as a settings value', function(){
                // given
                ngTableEventsChannel.onDatasetChanged(function(params, newVal, oldVal){
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });

                // when
                var initialDs = [5, 10];
                var params = createNgTableParams({ data: initialDs});

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([initialDs, null]);
            });

            it('should fire when a new dataset is supplied as a settings value', function(){
                // given
                var initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged(function(params, newVal, oldVal){
                    actualPublisher = params;
                    actualEventArgs = [newVal, oldVal];
                });
                var params = createNgTableParams({ data: initialDs});

                // when
                var newDs = [5, 10];
                params.settings({ data: newDs});

                // then
                expect(actualPublisher).toBe(params);
                expect(actualEventArgs).toEqual([newDs, initialDs]);
            });

            it('should NOT fire when the same data array is supplied as a new settings value', function(){
                // given
                var callCount = 0;
                var initialDs = [1, 2];
                ngTableEventsChannel.onDatasetChanged(function(/*params, newVal, oldVal*/){
                    callCount++;
                });
                var params = createNgTableParams({ data: initialDs});

                // when
                params.settings({ data: initialDs});

                // then
                expect(callCount).toBe(1);
            });
        });
    })
});
