<a name="0.8.3"></a>
# 0.8.3 (2015-08-09)


## Bug Fixes

- **ngTableDefaultGetData:** should ignore null and undefined filter values
  ([64a33a85](https://github.com/esvit/ng-table/commit/64a33a8573e913ab38849534e7cbf85a286f245c))


## Features

- **NgTableParams:**
  - filter function option to remove insignificant values
  ([2f5f3016](https://github.com/esvit/ng-table/commit/2f5f30161a9cdd2628b3e713fae922faa85db911))
  - isSortBy direction parameter now optional
  ([b3e02b92](https://github.com/esvit/ng-table/commit/b3e02b922064a73e302ad08a2b6f90678dcc18dc))
  - add response error interception
  ([5613d1e0](https://github.com/esvit/ng-table/commit/5613d1e00cca6b8027686806a341a8b64e89a552))
- **number.html:** new filter template for numbers
  ([78b02bbf](https://github.com/esvit/ng-table/commit/78b02bbfe4e00c395df70d9bef64ac0b20d01e4d))


<a name="0.8.2"></a>
# 0.8.2 (2015-08-06)


## Bug Fixes

- **NgTableParams:** datasetChanged event fires too early
  ([9706a60b](https://github.com/esvit/ng-table/commit/9706a60bc77f787afb04f01e9769c896fc63c063))
- **select-filter:** select lists should not display an empty and '-' option
  ([1ee441be](https://github.com/esvit/ng-table/commit/1ee441bebf3e1f8fac260a38b8b82122714191d2))


## Features

- **NgTableParams:** generatePagesArray can be called without arguments
  ([25fc82bd](https://github.com/esvit/ng-table/commit/25fc82bd051b07ee9b49f105e453e7a64b462bfc))


<a name="0.8.1"></a>
# 0.8.1 (2015-08-02)


## Bug Fixes

- **ngTableController:**
  - table not reloaded when new NgTableParams bound to scope
  ([d8cbd771](https://github.com/esvit/ng-table/commit/d8cbd771d11beb53cdb16e060c32cf633095d466))
  - apply filter delay only when relevant
  ([1ed42168](https://github.com/esvit/ng-table/commit/1ed42168d59933881f11ba36047459ddfe1af442))


## Features

- **NgTableController:** optimize calls to reload
  ([e94ca5f7](https://github.com/esvit/ng-table/commit/e94ca5f7873673616e15a46ab8317595331ab6e1))
- **NgTableParams:**
  - allow getData to return an array of data
  ([ab9ffdfa](https://github.com/esvit/ng-table/commit/ab9ffdfa09c64a10b4f955db21ed4de0a0bf7a9d))
  - add hasFilter function
  ([1163e22c](https://github.com/esvit/ng-table/commit/1163e22c9115515f3e9854769aa179895edfa550))
  - add isDataReloadRequired and hasFilterChanges methods
  ([95b0f2ba](https://github.com/esvit/ng-table/commit/95b0f2ba9e5073b5866c7c332c9556debe76495c))
  - better default implementation of getData that filters and sorts
  ([8d912609](https://github.com/esvit/ng-table/commit/8d912609f156d3722bba79ea53d5232576282ae8))
  - extend getData with interceptor pipeline
  ([f94c6357](https://github.com/esvit/ng-table/commit/f94c63572782b2e8a808beaf0c58a463e3fe50a4))
- **ngTableController:** automatically reload table when settings data array changes
  ([4817c203](https://github.com/esvit/ng-table/commit/4817c20359ee571c73e0edba89bf759a4f3b5aa2))
- **ngTableDefaultGetData:** new service for applying NgTableParam filters (etc) to a data array
  ([bdf5d9ee](https://github.com/esvit/ng-table/commit/bdf5d9ee3a71a441aba667d12bc5e48153fe32dc))
- **ngTableEventsChannel:** publish strongly typed events using explicit service
  ([1f3e7e4c](https://github.com/esvit/ng-table/commit/1f3e7e4cd797d6b96bb57473786eea64f805ce81))
- **ngTableFilterConfig:** setConfig now merges with previous config values
  ([155ef620](https://github.com/esvit/ng-table/commit/155ef6203baf228976d201e6757adf69a669d5c0))


<a name="0.8.0"></a>
# 0.8.0 (2015-07-25)


## Bug Fixes

- **ngTableController:** don't trigger reload whilst a reload is already in-flight
  ([97d09ca4](https://github.com/esvit/ng-table/commit/97d09ca43501ea97a30e1afcd04f6ed81df4f97d))


## Features

- **ngTableFilterConfig:** allow template urls for filters to be customized
  ([032f6ff6](https://github.com/esvit/ng-table/commit/032f6ff6aec0fcad7c4d84976aee8dc317c67a6c))


## Breaking Changes

- **header.html:** due to [47460d67](https://github.com/esvit/ng-table/commit/47460d67acb518a402a42329e6108a4e86e436d6),


The sortBy function previously declared by `ngTableController` has been moved to the new controller
- `ngTableSorterRowController`.

- **ngTableController:** due to [97d09ca4](https://github.com/esvit/ng-table/commit/97d09ca43501ea97a30e1afcd04f6ed81df4f97d),


Calls to `NgTableParams.filter`, `NgTableParams.sorting` (etc) made in the `then` method of
the promise returned by `NgTableParams.reload` will NOT trigger a subsequent call to `NgTableParams.reload`;
the call to `NgTableParams.reload` must now be explicitly be made.

Previously:

```js
tableParams.reload().then(function(){
  if (!tableParams.total() && _.size(tableParams.filter()) > 0) {
        tableParams.filter({});
  }
});
```

Now:

```js
tableParams.reload().then(function(){
  if (!tableParams.total() && _.size(tableParams.filter()) > 0) {
        tableParams.filter({});
        return tableParams.reload();
  }
});
```


<a name="0.7.1"></a>
# 0.7.1 (2015-07-20)


## Features

- **ngTableController:** add function to parse the expression used to initialise ngTableDynamic
  ([e9333f98](https://github.com/esvit/ng-table/commit/e9333f980764e48685477b93bb5031575b0963cf))


<a name="0.7.0"></a>
# 0.7.0 (2015-07-13)


## Breaking Changes

- **ngTable+ngTableDynamic:** due to [b226dec9](https://github.com/esvit/ng-table/commit/b226dec9537769aaf355bf5a908f380622feba92),


* showing/hiding columns now uses ng-if;  **ng-show is no longer supported**

Previously:

````html
<tr>
  <td ng-show="showColExpr">
</tr>
````

Now:

````html
<tr>
  <td ng-if="showColExpr">
</tr>
````


<a name="0.6.0"></a>
# 0.6.0 (2015-07-12)


## Breaking Changes

- **header.html:** due to [6bb2aba8](https://github.com/esvit/ng-table/commit/6bb2aba8ce89a5afdf36f1fe42b7bd71efcf6b81),
  anyone who relied on a specific 'position' field to order table columns will now
need to change the order items's in the column array

 Previously:
 
````
 cols[1].position = 2;
 cols[2].position = 1;
````

 Now:
 
````
var swappedCol = cols[2];
cols[2] = cols[1];
cols[1] = swappedCol;
````


<a name="0.5.5"></a>
# 0.5.5 (2015-07-09)


## Bug Fixes

- **example:** updated code due to documentation total should be a number
  ([ce15e94a](https://github.com/esvit/ng-table/commit/ce15e94ae0f71b48078e8ece6e917a7c6d9359da))


## Features

- **header.html:** allow reordering of columns
  ([23236e6f](https://github.com/esvit/ng-table/commit/23236e6f6b78e18aab29e4926110d7ad5f26432b))
- **ngTableDynamic:** add a column on the fly
  ([01682774](https://github.com/esvit/ng-table/commit/016827745bd618aeafc16f4deaa855b29452626a))
- **pagination:** add setting paginationMaxBlocks now you can define the count of pagination blocks, minimum is 6
  ([bbdfaf38](https://github.com/esvit/ng-table/commit/bbdfaf387dd8e47719be54edf1e4d2b43350d274))


<a name="v0.5.4"></a>
# v0.5.4 (2015-02-26)


## Features

- **ngTable:** added setting sortingIndicator to show sorting indicator whether near header title or to the very right
  ([10cdf358](https://github.com/esvit/ng-table/commit/10cdf358cfcab2843fcade5de4d512f3b3ab9577))


<a name="v0.5.0"></a>
# v0.5.0 (2015-02-15)


## Bug Fixes

- **ngTableController:**
  - fix regression in recent rename of ngTableParmas to NgTableParams
  ([c7f2ac89](https://github.com/esvit/ng-table/commit/c7f2ac896b78eaad67a6095c057807217bf1e318))
  - prevent "stackoverflow" exception when data items are recursive data structures
  ([4a344db0](https://github.com/esvit/ng-table/commit/4a344db05954502e6679d33f6d8946952dddee10))


## Features

- **filters:**
  - filter expression now has access to scope
  ([c2f83b98](https://github.com/esvit/ng-table/commit/c2f83b9877b23b0124885b2cd9ab1fc705970f49))
  - specify the filter template url using the filter value rather than a separate templateUrl field
  ([7955f12b](https://github.com/esvit/ng-table/commit/7955f12ba96eb8a5f047484d83f3c53a2954f1db))
- **header:**
  - add data-title-text attribute to table cells
  ([43e5c4bf](https://github.com/esvit/ng-table/commit/43e5c4bf03bfca2d5dd71d6dcfeb3f318fcfd692))
  - title and sortable expression now has access to the column definition
  ([699b2a58](https://github.com/esvit/ng-table/commit/699b2a58aeb6a85ff2ad5a4cbc70728de2b7f2fe))
  - header-title
  ([502b717b](https://github.com/esvit/ng-table/commit/502b717be88d38b75ef3be7e29da5a5da71bf5eb))
  - header-class attribute is now a data binding expression
  ([60de2066](https://github.com/esvit/ng-table/commit/60de2066b9be1a33210767783354c11004d5e042))
- **ngTable:**
  - getter methods declared on $column no longer require a $scope to be supplied
  ([f9090b47](https://github.com/esvit/ng-table/commit/f9090b47981105bb59928cc6eeb8bc1499b6d5ab))
  - add title-alt for displaying an alternative header title for responsive tables
  ([afc14234](https://github.com/esvit/ng-table/commit/afc142345aadc940ef913763fe86dc798a80f750))
- **ngTableDynamic:** new directive that accepts dynamic array of columns
  ([03854d33](https://github.com/esvit/ng-table/commit/03854d333d35fb7ebae53847c937ec45f3f58eb7))


## Breaking Changes

- **column:** due to [7e8448dc](https://github.com/esvit/ng-table/commit/7e8448dc41c4e543c8b04d9836fdd81806846d06),
 

* Binding expressions used for generating `thead>th` attributes that reference the current column will need modifying

 Previously:
````html
 <td title="getTitle(column)">
````

 Now:
 ````html
  <td title="getTitle($column)">
 ````
- **directive:** due to [3113e340](https://github.com/esvit/ng-table/commit/3113e340ad6ee348f574762ddd2de78a1fad614d),
 

* Fields previously stored directly on a column object are now only available via the prototype chain

This will affect you only if you are enumerating / specifically checking for "own properties" of the column object.
- **filters:**
  - due to [c2f83b98](https://github.com/esvit/ng-table/commit/c2f83b9877b23b0124885b2cd9ab1fc705970f49),
 

**Custom** *header.html* templates will need to pass the current scope as a parameter to column.filter.

Previously:

````html
<!-- snip -->
<div ng-repeat="(name, filter) in column.filter">
<!-- snip -->
````
... now becomes:

````html
 <!-- snip -->
 <div ng-repeat="(name, filter) in column.filter(this)">
 <!-- snip -->
````
- **filters:**
  - due to [53ec5f93](https://github.com/esvit/ng-table/commit/53ec5f931ada71be763b98a3f8d7166bc59a383f),
 

* $$name field on filter definitions is not supported.

Previously:

````html
<td filter="{'username': 'text', $$name: 'username'}"</td>
````
... now becomes:

````html
<td filter="{'username': 'text'}"</td>
````

* column.filterName has been dropped as this is no longer applicable. **Custom** filter templates will need to change.

Previously:

````html
        <input type="text" name="{{column.filterName}}"
````
... now becomes:

````html
        <input type="text" name="{{name}}"
````

* Multiple filters defined by the *same* filter definition will now render each input with a seperate name.

- **filters:**
  - due to [7955f12b](https://github.com/esvit/ng-table/commit/7955f12ba96eb8a5f047484d83f3c53a2954f1db),
 

* column.filterTemplateURL has been dropped as this is no longer applicable. **Custom** *header.html*
templates will need to change.

Previously:

````html
        <tr class="ng-table-filters" ng-init="tableParams">
            <th ng-repeat="column in columns" ng-show="column.visible" class="filter">
                <div ng-repeat="(name, filter) in column.filter">
                    <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL">
                        <div ng-include="column.filterTemplateURL"></div>
                    </div>
                    <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL">
                        <div ng-include="'ng-table/filters/' + filter + '.html'"></div>
                    </div>
                </div>
            </th>
        </tr>
````
... now becomes:

````html
        <tr class="ng-table-filters" ng-init="tableParams">
            <th ng-repeat="column in columns" ng-show="column.visible" class="filter">
                <div ng-repeat="(name, filter) in column.filter">
                    <div ng-if="filter.indexOf('/') !== -1" ng-include="filter"></div>
                    <div ng-if="filter.indexOf('/') === -1" ng-include="'ng-table/filters/' + filter + '.html'"></div>
                </div>
            </th>
        </tr>
````

* Specifying the url to a filter template has changed.

Previously:

````html
<td filter="{ 'name': 'text', templateURL: 'path/to/textFilter.html'}"</td>
````

... now becomes:

````html
<td filter="{ 'name': 'path/to/textFilter.html'}"</td>
````

* Multiple filters defined by the *same* filter definition will now specify their own url.

Previously:

````html
<td filter="{
    'fname': 'text',
    'lname': 'text',
    templateURL: 'path/to/textFilter.html'}"</td>
````

... now becomes:

````html
<td filter="{
    'fname': 'path/to/textFilter.html',
    'lname': 'path/to/textFilter.html'}"</td>
````
- **header:**
  - due to [699b2a58](https://github.com/esvit/ng-table/commit/699b2a58aeb6a85ff2ad5a4cbc70728de2b7f2fe),
 

parse method on the ngTable scope has been removed as it's no longer required

- **header:**
  - due to [60de2066](https://github.com/esvit/ng-table/commit/60de2066b9be1a33210767783354c11004d5e042),
 

Previously, a css class was added to TH elements thusly:

````html
<tr ng-repeat="row in $data">
	<td header-class="myHeaderClass"></td>
</tr>
````

Now:

````html
<tr ng-repeat="row in $data">
	<td header-class="'myHeaderClass'"></td>
</tr>
````

### v0.3.2 (master)
- add pagination directive ngTablePagination [(see usage)](https://github.com/esvit/ng-table/blob/master/examples/demo28.html)
- rename filter.name to filter.$$name according to issue #196
- add debugMode setting
- add defaultSort setting
- add filterDelay setting
- add multisorting (click on header with Ctrl-key)
- add css classes (ng-table-pager, ng-table-pagination, ng-table-counts)

### v0.3.1
- add support of `header-class` attribute
- add fixes for compatibility with early versions of AngularJS
- add `data` field to ngTableParams
- Allow expressions in the sortable & filter attribute (Issue #93)

### v0.3.0
- I abandoned from CoffeeScript in favor of a javascript, fully agree with http://blog.ponyfoo.com/2013/09/28/we-dont-want-your-coffee & (rus) http://habrahabr.ru/post/195944/
- added examples of table with grouping
- fully rewrited interface of ngTableParams

### v0.2.2
In functions that return data for the filters were removed `.promise`
```javascript
$scope.names = function(column) {
    ...
    def.resolve(names);
    // return def.promise; - old code
    return def;
};
```
