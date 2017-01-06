RELEASING
============

## NPM package

This library uses [semantic-release](https://github.com/semantic-release/semantic-release) 
to fully automate publishing library updates to npm.

All you need to do is ensure you follow the [contributing](CONTRIBUTING.md) guidelines.

### NPM dist-tags

By default this new package version will be published with a [dist-tag](https://docs.npmjs.com/cli/dist-tag#purpose) of `next`

Implications:

* To install this version: `npm install ng-table@next --save`
* To make this version available via `npm install ng-table --save`, a dist-tag of `latest` must be manually added (see steps below)

#### Adding the `latest` dist-tag

1. Open a command line
2. Change directory: `cd path/to/ng-table`
3. Login: `npm adduser`
4. Add dist-tag: `npm dist-tag add ng-table@n.n.n latest`
    * where `n.n.n` is the version of the package that you now want to make the latest
5. Remove the pre-release tag from the github release of this version


## Documentation

To publish updates to the library documentation site:

1. `npm run doc`
    * this will re-generate the api-Docs
2. `npm run doc-deploy`
    * this will prublish the content of demo-site directory from this repo into the gh-pages branch
