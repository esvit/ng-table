Table + AngularJS
=================
[![Build Status](https://travis-ci.org/esvit/ng-table.svg)](https://travis-ci.org/esvit/ng-table) [![Coverage Status](https://coveralls.io/repos/esvit/ng-table/badge.png)](https://coveralls.io/r/esvit/ng-table)

Code licensed under New BSD License.

This directive allow to liven your tables. It support sorting, filtering and pagination.
Header row with titles and filters automatic generated on compilation step.

## Deprecation notice

The following behaviours are deprecated and will be removed before the 1.0.0 release.

The 1.0.0 release is expected to land in 2-3 weeks.

### 1. `ngTableAfterReloadData` event will be removed

Eventing no longer uses *direct* calls $scope.$emit. Instead a strongly typed pub/sub service (`ngTableEventsChannel`) is used.

**To migrate**

*Previously:*

```js
    $scope.$on('ngTableAfterReloadData', yourHandler)
```

*Now:*

```js
    ngTableEventsChannel.onAfterReloadData(yourHandler, $scope)
```

### 2. `$scope` removed from `NgTableParams`

Because of 1. above, `NgTableParams` no longer requires a reference to `$scope`. 

A reference to `$scope` was largely an internal requirement so there should be no code change required on your part.

### 3. `getData` signature change

The `$defer` paramater supplied to your `getData` method has been removed. Instead your `getData` method should return an array or a promise that resolves to an array.

**To migrate**

*Previously:*

```js
    var tp = new NgTableParams({}, { getData: getData });
    
    function getData($defer, params){
        // snip
        $defer.resolve(yourDataArray);
    }
```

*Now:*

```js
    var tp = new NgTableParams({}, { getData: getData });
    
    function getData(params){
        // snip
        return yourDataArrayOrPromise;
    }
```

### 4. `ngTableParams` renamed to `NgTableParams`

**To migrate**

*Previously:*

```js
    var tp = new ngTableParams();
```

*Now:*

```js
    var tp = new NgTableParams();
```


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


## Updates

See CHANGELOG.md

## Submitting an issue

Please be responsible, the open source community is not there to guess your problem or to do your job. When submitting an issue try as much as possible to:

1. search in the already existing issues or on [stackoverflow](http://stackoverflow.com/questions/tagged/ngtable?sort=newest&pageSize=30) if your issue has not been raised before.

2. give a precise description mentionning angular version, ng-table version.

3. give a way to reproduce your issue, the best would be with a <strong>running example</strong>, you can use [plunkr](http://plnkr.co/), or [codepen](http://codepen.io/). **Tip:** See below for a list of base codepen's you can fork

4. isolate your code sample on the probable issue to avoid pollution and noise.

5. Close your issue when a solution has been found (and share it with the community)

Note that 80% of the open issues are actually not issues but "problem" due to developpers laziness or lack of investigation. These "issues" are a waste of time for us and especially if we have to setup a sample to reproduce the issue which those developpers could have done. Any open issue which does not fulfill this contract will be closed without investigation.


## Examples

* [Demo site](http://ng-table.com/)
* Codepen examples (**Tip**: fork these to create your own examples);
    * [`ngTable`: inmemory list](http://codepen.io/christianacca/pen/VLqVeo?editors=101)
    * [`ngTable`: server-side list](http://codepen.io/christianacca/pen/VLqqjP?editors=101)
    * [`ngTableDynamic`: inmemory list](http://codepen.io/christianacca/pen/jPxgzY?editors=101)
    * [`ngTableDynamic`: server-side list](http://codepen.io/christianacca/pen/JdwwrR/?editors=101)

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
