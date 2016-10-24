Table + AngularJS
=================
[![Build Status](https://travis-ci.org/esvit/ng-table.svg)](https://travis-ci.org/esvit/ng-table) [![Coverage Status](https://coveralls.io/repos/esvit/ng-table/badge.png)](https://coveralls.io/r/esvit/ng-table)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Code licensed under New BSD License.

This directive enhances your HTML tables. It support sorting, filtering and pagination.
Header row with titles and filters automatic generated.


## Installing

**NPM**

Install the current stable release:
```
npm install ng-table --save
```
Or install the latest beta release:
```
npm install ng-table@next --save
```

**CDN**

You can download the distribution files directly from [unpkg](https://unpkg.com/ng-table/bundles/)


## Getting started

Please follow the getting started steps [here](http://ng-table.com/)


## Examples

* [Demo site](http://ng-table.com/)
* Sample apps:
    * [ES5](demo-apps/es5/readme.md)
    * [ES2015 + SystemJS](demo-apps/es6-systemjs/readme.md)
    * [ES2015 + Webpack](demo-apps/es6-webpack/readme.md)
    * [Typescript + Webpack](demo-apps/ts-webpack/readme.md)
* Codepen examples (**Tip**: fork these to create your own examples);
    * [`ngTable`: inmemory list](http://codepen.io/christianacca/pen/VLqVeo?editors=101)
    * [`ngTable`: server-side list](http://codepen.io/christianacca/pen/VLqqjP?editors=101)
    * [`ngTableDynamic`: inmemory list](http://codepen.io/christianacca/pen/jPxgzY?editors=101)
    * [`ngTableDynamic`: server-side list](http://codepen.io/christianacca/pen/JdwwrR/?editors=101)


## Using Typescript?

As of v2.0.0 ngTable is written in typescript and so you do NOT have to install external type declarations for this library.

By installing the [ng-table package from npm](https://www.npmjs.com/package/ng-table), you will get typescript intellisense for all ng-table exported types.

**WARNING:**. The type definitions on [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/ng-table) are depreciated.


## Upgrading from an earlier version?

### Upgrade from 0.8.3

It's recommended to upgrade in two jumps:

1. Upgrade to version 1.0.0-beta.9, making any changes to your application code neccessary to work with this version
    * EG: `bower install ng-table#1.0.0-beta.9 --save`
2. Refactor your application to remove any code that depended on depreciated behaviours that where removed in the 1.0.0 release
3. Install 1.0.0 (should now be a drop in replacement for 1.0.0-beta.9)
    * Bower: `bower install ng-table#1.0.0 --save`
    * NPM: `npm i ng-table@1.0.0 --save`


### Upgrade from version earlier than 0.8.3

It's recommended to upgrade in three jumps:

1. Upgrade to version 0.8.3, making any changes to your application code neccessary to work with this version
    * EG: `bower install ng-table#0.8.3 --save`
3. Follow the guide above to upgrade from 0.8.3 -> 1.0.0-beta.9 -> 1.0.0

**Tips**
* Read the notes in [github releases](https://github.com/esvit/ng-table/releases). Each release details the breaking changes and migration guidance


## Compatibility

For work in IE < 9 need jQuery, just add:
```html
<!--[if lt IE 9]>
  <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<![endif]-->
```


## Building from sources

1. Clone: `git clone https://github.com/esvit/ng-table.git`
2. Install: `npm install` 
3. Build: `npm run tsc && npm run build:full`

* To locally build and serve docs site: `npm run doc && npm run serve:docs-site`
* To locally serve the demo: `npm run serve:demo`


## Want to contribute?

See the [contributing](CONTRIBUTING.md) guidelines.

---

This project is part of [Bazalt CMS](http://bazalt-cms.com/).
