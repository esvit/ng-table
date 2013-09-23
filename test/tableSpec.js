describe('ng-table', function() {
  var elm, scope;

  beforeEach(module('ngTable'));

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element(
        '<div>' +
            '<table ng-table="tableParams" show-filter="true">' +
            '<tr ng-repeat="user in users">' +
                '<td data-title="\'Name of person\'" filter="{ \'name\': \'text\' }" sortable="name">' +
                    '{{user.name}}' +
                '</td>' +
                '<td data-title="\'Age\'" filter="{ \'action\': \'button\' }" sortable="age">' +
                    '{{user.age}}' +
                '</td>' +
            '</tr>' +
            '</table>' +
        '</div>');

    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
  }));

  it('should create table header', inject(function($compile, $rootScope) {
    var thead = elm.find('table thead');
    expect(thead.length).toBe(1);
    
    var rows = thead.find('tr');
    expect(rows.length).toBe(2);

    var titles = rows.eq(0).find('th');

    expect(titles.length).toBe(2);
    expect(titles.eq(0).text()).toBe('Name of person');
    expect(titles.eq(1).text()).toBe('Age');

    var filters = rows.eq(1).find('th');
    expect(filters.length).toBe(2);
  }));

});

describe('ngTableParams', function() {
  var scope, ctrl;
  
  beforeEach(module('ngTable'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
  }));
  
  it('ngTableParams should be defined', inject(function(ngTableParams) {
    var params = new ngTableParams();
    expect(ngTableParams).toBeDefined();
  }));
  
  it('ngTableParams `page` parameter', inject(function(ngTableParams) {
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
    scope.$watch('tableParams', function(innerParams) {
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
  it('ngTableParams parse url parameters', inject(function(ngTableParams) {
    var params = new ngTableParams({
        'sorting[name]': 'asc',
        'sorting[age]': 'desc',
        'filter[name]': 'test',
        'filter[age]': 20
    });

    expect(params.filter).toEqual({ 'name': 'test', 'age': 20 });
    expect(params.sorting).toEqual({ 'age': 'desc' }); // sorting only by one column
  }));
  it('ngTableParams test orderBy', inject(function(ngTableParams) {
    var params = new ngTableParams({
        'sorting[name]': 'asc'
    });

    expect(params.orderBy()).toEqual([ '+name' ]); // for angular sorting function
  }));
  
});