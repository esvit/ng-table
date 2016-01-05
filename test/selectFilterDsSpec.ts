describe('ngTableSelectFilterDs directive', () => {
      
    interface IColumnScope extends ng.IScope {
        $column?: { data?: NgTable.SelectData };
        $selectData?: NgTable.ISelectOption[];
    }
    
    interface ITableScope extends ng.IScope {
        $new(): IColumnScope;
    }
    
    let $scope: IColumnScope,
        elem: string,
        $compile: ng.ICompileService;
    beforeEach(angular.mock.module('ngTable'));

    beforeEach(inject(($rootScope: ITableScope, _$compile_: ng.ICompileService) => {
        $scope = $rootScope.$new();
        $compile = _$compile_;
        elem = '<select ng-table-select-filter-ds="$column"></select>';
    }));

    describe('array datasource', () => {

        it('should add array to current scope', () =>{
            // given
            let data = [{id: 1, title: 'A'}];
            $scope.$column = {
                data: data
            };
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect($scope.$selectData).toBe(data);
        });

        it('should turn null/undefined array into empty array', () => {
            // given
            $scope.$column = {
                data: null
            };
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect($scope.$selectData).toEqual([]);
        });

        it('should keep the array on scope in sync with data array on $column', () => {
            // given
            $scope.$column = {
                data: null
            };
            $compile(elem)($scope);
            $scope.$digest();

            // when
            let newArray = [{id: 1, title: 'A'}];
            $scope.$column.data = newArray;
            $scope.$digest();

            // then
            expect($scope.$selectData).toBe(newArray);
        });

        it('should add empty option to array', () => {
            // note: modifying the array supplied is not great as this can cause unexpected side effects
            // however, it does mean that a consumer can update the array and have this reflected in the select list
            // and so therefore it increases the utility of this directive

            // given
            let data = [{id: 1, title: 'A'}];
            $scope.$column = {
                data: data
            };
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect(data).toEqual([{ id: '', title: ''}, {id: 1, title: 'A'}]);
        });

        it('should add empty option to empty array', () => {
            // this is useful as it allows for app to add items to array at a future date and still
            // allow for the user to select an empty select option thus removing column filter

            // given
            let data: NgTable.ISelectOption[] = [];
            $scope.$column = {
                data: data
            };
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect(data).toEqual([{ id: '', title: ''}]);
        });

        it('should not add empty option to array if already present', () => {

            // given
            let data = [{id: '', title: ''}, {id: 1, title: 'A'}];
            $scope.$column = {
                data: data
            };
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect(data).toEqual([{id: '', title: ''}, {id: 1, title: 'A'}]);
        });

        it('should add empty option to a new arriving array', () => {
            // given
            $scope.$column = {
                data: [{id: 1, title: 'A'}]
            };
            $compile(elem)($scope);
            $scope.$digest();

            // when
            $scope.$column.data = [{id: 1, title: 'B'}];
            $scope.$digest();

            // then
            expect($scope.$selectData).toEqual([{ id: '', title: ''}, {id: 1, title: 'B'}]);
        });

    });

    describe('function datasource', () => {

        let data: NgTable.ISelectOption[];
        beforeEach(() => {
            $scope.$column = {
                data: () => data
            };
        });

            it('should add array to current scope', () => {
            // given
            data = [{id: 1, title: 'A'}];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect($scope.$selectData).toBe(data);
        });

        it('should turn null/undefined array into empty array', () => {
            // given
            data = null;
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect($scope.$selectData).toEqual([]);
        });

        it('should keep the array on scope in sync with data array on $column', () => {
            // given
            data = [{id: 1, title: 'A'}];
            $compile(elem)($scope);
            $scope.$digest();

            // when
            let newArray = [{id: 1, title: 'A'}];
            $scope.$column.data = () => newArray;
            $scope.$digest();

            // then
            expect($scope.$selectData).toBe(newArray);
        });


        it('should add empty option to array', () => {
            // given
            data = [{id: 1, title: 'A'}];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect(data).toEqual([{ id: '', title: ''}, {id: 1, title: 'A'}]);
        });

        it('should add empty option to empty array', () => {
            // this is useful as it allows for app to add items to array at a future date and still
            // allow for the user to select an empty select option thus removing column filter

            // given
            data = [];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect(data).toEqual([{ id: '', title: ''}]);
        });

        it('should not add empty option to array if already present', () => {
            // given
            data = [{id: '', title: ''}, {id: 1, title: 'A'}];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            // then
            expect(data).toEqual([{id: '', title: ''}, {id: 1, title: 'A'}]);
        });

        it('should add empty option to a new arriving array', () => {
            // given
            data = [{id: 1, title: 'A'}];
            $compile(elem)($scope);
            $scope.$digest();

            // when
            $scope.$column.data = () => [{id: 1, title: 'B'}];
            $scope.$digest();

            // then
            expect($scope.$selectData).toEqual([{ id: '', title: ''}, {id: 1, title: 'B'}]);
        });
    });

    describe('asyn function datasource', () => {
        let data: NgTable.ISelectOption[];
        let $timeout: ng.ITimeoutService;
        beforeEach(inject((_$timeout_: ng.ITimeoutService) => {
            $timeout = _$timeout_;
            $scope.$column = {
                data: () => $timeout(() => data, 10)
            };
        }));

        it('should add array to current scope', () => {
            // given
            data = [{id: 1, title: 'A'}];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();
            // then
            expect($scope.$selectData).toBe(data);
        });

        it('should turn null/undefined array into empty array', () => {
            // given
            data = null;
            // when
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();
            // then
            expect($scope.$selectData).toEqual([]);
        });

        it('should keep the array on scope in sync with data array on $column', () => {
            // given
            data = [{id: 1, title: 'A'}];
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();

            // when
            let newArray = [{id: 1, title: 'A'}];
            $scope.$column.data = () => $timeout(() => newArray, 10);
            $scope.$digest();
            $timeout.flush();

            // then
            expect($scope.$selectData).toBe(newArray);
        });


        it('should add empty option to array', () => {
            // given
            data = [{id: 1, title: 'A'}];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();
            // then
            expect(data).toEqual([{ id: '', title: ''}, {id: 1, title: 'A'}]);
        });

        it('should add empty option to empty array', () => {
            // this is useful as it allows for app to add items to array at a future date and still
            // allow for the user to select an empty select option thus removing column filter

            // given
            data = [];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();
            // then
            expect(data).toEqual([{ id: '', title: ''}]);
        });

        it('should not add empty option to array if already present', () => {
            // given
            data = [{id: '', title: ''}, {id: 1, title: 'A'}];
            // when
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();
            // then
            expect(data).toEqual([{id: '', title: ''}, {id: 1, title: 'A'}]);
        });

        it('should add empty option to a new arriving array', () => {
            // given
            data = [{id: 1, title: 'A'}];
            $compile(elem)($scope);
            $scope.$digest();
            $timeout.flush();

            // when
            $scope.$column.data = () => $timeout(() => [{id: 1, title: 'B'}], 10);
            $scope.$digest();
            $timeout.flush();

            // then
            expect($scope.$selectData).toEqual([{ id: '', title: ''}, {id: 1, title: 'B'}]);
        });

    });
});
