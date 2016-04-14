Table + AngularJS
=================
[![Build Status](https://travis-ci.org/esvit/ng-table.svg)](https://travis-ci.org/esvit/ng-table) [![Coverage Status](https://coveralls.io/repos/esvit/ng-table/badge.png)](https://coveralls.io/r/esvit/ng-table)

Code licensed under New BSD License.

This directive allow to liven your tables. It support sorting, filtering and pagination.
Header row with titles and filters automatic generated on compilation step.

## Installing via Bower
```
bower install ng-table
```

## Development
We use Karma to ensure the quality of the code. The easiest way to run these checks is to use grunt:

```sh
npm install -g grunt-cli
npm install && bower install
grunt
```

The karma task will try to open Firefox and Chrome as browser in which to run the tests. Make sure this is available or change the configuration in `karma.conf.js`


## Configuring ng-table
For a list of configuration options available, see [Configuring your table with NgTableParams](https://github.com/esvit/ng-table/wiki/Configuring-your-table-with-ngTableParams)

## Basic Usage

```html
<!-- View HTML -->
<table ng-table="tableParams">
  <tr ng-repeat="row in $data">
    <thead>
      <th>Col1</th>
      <th>Col2</th>
    </thead>
    <tbody>
      <td>{{row.col1}}</td>
      <td>{{row.col2}}</td>
    </tbody>
  </tr>
</table>
```
```js
// Controller JS
var Api = $resource('/data');
var params = {
  page: 1, // start on first page
  count: 10  // initial rows per page
};
var settings = {
  counts: [10, 50],  // rows per page options
  total: 100, // for accurate pagination, size of dataset
  data: [],  // initial dataset
  getData: function($defer, params) {
    Api.get({page: params.page()},
      function(res) {
        $defer.resolve(res);
      }
    );
  }
};
$scope.tableParams = new ngTableParams(params, settings);
```

## Examples

See [ng-table.com](http://ng-table.com). Note that these examples use the V1.0 alpha release.

## Automatic Paginating

**Config**

Paginating is handled automagically by ng-table and it based on params set in ngTableParams: `count`, `page`, and `total`. Pagination is not possible when the size of the dataset is not known. If you do not set `ngTableParams.total()`, ng-table will not attempt to paginate for you (though you can still manage pages programmatically with `ngTableParams.page()`.

**Hiding "rows per page" controls**

By default ng-table adds an input to allow users to choose between 10, 25, 50, or 100 rows per page. You can hide this by configuring a `new ngTableParams(params, settings);` where `var settings = {counts: []};`

## Automatic Headers
If you do not define a `<thead>` inside your ng-table, one will be created for you based on the contents of your table's `<td>` tags. Set a `<td title="'Title'">` attribute to customize your column title.

For tables where data is fetched asynchronously, ng-table will saturate your ng-repeat with a collection of `undefined` data so that can infer table headers from the DOM. This may cause unexpected behavior, so it is recommended that you define your own `<thead>` when fetching asynchronously.

## Updates

See CHANGELOG.md

## Submitting an issue

Please be responsible, the open source community is not there to guess your problem or to do your job. When submitting an issue try as much as possible to:

1. search in the already existing issues or on [stackoverflow](http://stackoverflow.com/questions/tagged/ngtable?sort=newest&pageSize=30) if your issue has not been raised before.

2. give a precise description mentionning angular version, ng-table version.

3. give a way to reproduce your issue, the best would be with a <strong>running example</strong>, you can use [plunkr](http://plnkr.co/), or [codepen](http://codepen.io/). **Tip:** See below for a list of base codepen's you can fork

4. isolate your code sample on the probable issue to avoid pollution and noise.

5. Close your issue when a solution has been found (and share it with the community)

## Compatibility

For work in IE < 9 need jQuery, just add:
```html
<!--[if lt IE 9]>
  <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<![endif]-->
```

## Plugins

* [Export to CSV](https://github.com/esvit/ng-table-export)

#### PS
Let me know if you are using **ng-table**. It will motivate me to work harder.
And if you like **ng-table**, just email me and add your website [here](http://bazalt-cms.com/ng-table/who-is-using)
Hope you like it, Thanks! :)

---

This project is part of [Bazalt CMS](http://bazalt-cms.com/).
