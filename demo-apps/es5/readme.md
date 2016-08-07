# ngTable ES5 Demo App

## Overview

* Loads `ng-table` on to the page using a global script tag
* Application code written in ECMAScript 5

## Running sample App

1. cd demo-apps/es5
2. `npm install`
3. `npm run setup:local`
    * runs the ng-table build to create the library distibutable code (including `ng-table.js`)
    * in this app's node_modules, creates a symlink reference to the library distibutable code
4. `npm start`
    * runs http-server to serve this app's index.html