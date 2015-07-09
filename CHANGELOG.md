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
