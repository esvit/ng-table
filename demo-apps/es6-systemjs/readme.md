# ngTable ES6+SystemJS Demo App

## Overview

* Loads `ng-table` on to the page using SystemJS
* Application code written in ES2015

## Running sample App

1. cd demo-apps/es6-systemjs
2. `npm install`
3. `npm run setup:local`
    * runs the ng-table build to create the library distibutable code (including `ng-table.js`)
    * in this app's node_modules, creates a symlink reference to your local ng-table on disk
4. `npm start`
    * runs http-server to serve this app's index.html