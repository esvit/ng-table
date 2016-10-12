CONTRIBUTING
============

1. Fork the repo.
2. `npm install && npm run setup`
3. Prove existing code before making changes:
    * Run the unit tests: `npm test`
    * Run the end-to-end tests:
        * In one terminal window: `npm run e2e-server`
        * In another terminal window: `npm run e2e`
4. Make changes in source folder (`src`)
5. Make the tests pass (see above)
6. Commit changes: `npm run commit`
    - why use **npm** and not **git** to commit? See "Conventional commit message" section below
7. Push your changes to your fork and submit a pull request


## Conventional commit message

This project uses the structure of the commit message to:

1. Generate release notes like you see in [this release](https://github.com/esvit/ng-table/releases/tag/v2.0.0)
2. Generate the next version number for the npm package using the rules of [semver](http://semver.org/) 
3. Trigger the publish a release of this library to npm using [semantic-release](https://github.com/semantic-release/semantic-release) 

These conventions are detailed here: [angular commit message conventions](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md)

### Commitizen command line tool

To help you to follow these conventions this project uses [Commitizen](https://github.com/commitizen/cz-cli). 

Commitizen provides a command line tool that will help you create a commit message that matches these conventions.

To lauch this tool, we use `npm run commit`.