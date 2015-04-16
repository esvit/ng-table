Table + AngularJS
=================
[![Build Status](https://travis-ci.org/esvit/ng-table.png)](https://travis-ci.org/esvit/ng-table) [![Coverage Status](https://coveralls.io/repos/esvit/ng-table/badge.png)](https://coveralls.io/r/esvit/ng-table)

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


## Updates

See CHANGELOG.md

## Submitting an issue

Please be responsible, the open source community is not there to guess your problem or to do your job. When submitting an issue try as much as possible to:

1. search in the already existing issues or on [stackoverflow](http://stackoverflow.com/questions/tagged/ngtable?sort=newest&pageSize=30) if your issue has not been raised before.

2. give a precise description mentionning angular version, ng-table version.

3. give a way to reproduce your issue, the best would be with a <strong>running example</strong>, you can use [plunkr](http://plnkr.co/). Note if you want to mimic ajax loading behaviour you can use [$timeout](https://docs.angularjs.org/api/ng/service/$timeout) angular service or [$httpBackend](https://docs.angularjs.org/api/ng/service/$httpBackend).

4. isolate your code sample on the probable issue to avoid pollution and noise.

5. Close your issue when a solution has been found (and share it with the community)

Note that 80% of the open issues are actually not issues but "problem" due to developpers laziness or lack of investigation. These "issues" are a waste of time for us and especially if we have to setup a sample to reproduce the issue which those developpers could have done. Any open issue which does not fulfill this contract will be closed without investigation.


## Examples (from simple to complex)

* [Pagination](http://bazalt-cms.com/ng-table/example/1)
* [Sorting](http://bazalt-cms.com/ng-table/example/3)
* [Filtering](http://bazalt-cms.com/ng-table/example/4)
* [Cell template](http://bazalt-cms.com/ng-table/example/8)
* [Row template](http://bazalt-cms.com/ng-table/example/9)
* [Params in url](http://bazalt-cms.com/ng-table/example/5)
* [Ajax](http://bazalt-cms.com/ng-table/example/6)
* [Table with hidden pagination](http://bazalt-cms.com/ng-table/example/7)
* [Custom template(pagination)](http://bazalt-cms.com/ng-table/example/2)
* [Custom filters](http://bazalt-cms.com/ng-table/example/11)
* [Table with checkboxes](http://bazalt-cms.com/ng-table/example/10)
* [Table with grouping](http://bazalt-cms.com/ng-table/example/12)
* [Table with grouping with callback](http://bazalt-cms.com/ng-table/example/13)
* [Table with external control of data](http://bazalt-cms.com/ng-table/example/14)
* [Export to CSV](http://bazalt-cms.com/ng-table/example/15)

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
