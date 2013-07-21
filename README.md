Table + AngularJS
=================
Code licensed under New BSD License.

This directive allow to liven your tables. It support sorting, filtering and pagination.
Header row with titles and filters automatic generated on compilation step.

## Installing via Bower
```
bower install ng-table
```

## Examples (from simple to complex)

* [Pagination](http://esvit.github.io/ng-table/#!/demo1)
* [Sorting](http://esvit.github.io/ng-table/#!/demo3)
* [Filtering](http://esvit.github.io/ng-table/#!/demo4)
* [Cell template](http://esvit.github.io/ng-table/#!/demo8)
* [Row template](http://esvit.github.io/ng-table/#!/demo9)
* [Params in url](http://esvit.github.io/ng-table/#!/demo5)
* [Ajax](http://esvit.github.io/ng-table/#!/demo6)
* [Custom template(pagination)](http://esvit.github.io/ng-table/#!/demo2)
* [Custom filters](http://esvit.github.io/ng-table/#!/demo11)
* [Table with checkboxes](http://esvit.github.io/ng-table/#!/demo10)

## Usage
```html
<table ng-table="tableParams" show-filter="true">
<tr ng-repeat="user in users">
    <!-- IMPORTANT: String titles must be in single quotes -->
    <td data-title="'Name of person'" filter="{ 'name': 'text' }" sortable="name">
        {{user.name}}
    </td>
    <td data-title="'Age'" filter="{ 'action': 'button' }" sortable="age">
        {{user.age}}
    </td>
</tr>
</table>
```