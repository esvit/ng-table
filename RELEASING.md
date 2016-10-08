RELEASING
============

## NPM package

This library uses [semantic-release](https://github.com/semantic-release/semantic-release) 
to fully automate publishing library updates to npm.

All you need to do is ensure you follow the [contributing](CONTRIBUTING.md) guidelines.

## Documentation

To publish updates to the library documentation site:

1. `npm run doc`
    * this will re-generate the api-Docs
2. `npm run doc-deploy`
    * this will prublish the content of demo-site directory from this repo into the gh-pages branch