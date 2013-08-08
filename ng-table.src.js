(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ngTable', ['jquery', 'angular'], function($, angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
"use strict";
/*
ngTable: Table + Angular JS

@author Vitalii Savchuk <esvit666@gmail.com>
@copyright 2013 Vitalii Savchuk <esvit666@gmail.com>
@version 0.2.1
@url https://github.com/esvit/ng-table/
@license New BSD License <http://creativecommons.org/licenses/BSD/>
*/

angular.module("ngTable", []).directive("ngTable", [
  "$compile", "$q", "$parse", "$http", "ngTableParams", function($compile, $q, $parse, $http, ngTableParams) {
    return {
      restrict: "A",
      priority: 1001,
      scope: true,
      controller: [
        "$scope", "$timeout", function($scope, $timeout) {
          var updateParams;
          $scope.params = $scope.params || {
            page: 1,
            count: 10
          };
          $scope.$watch('params.filter', (function(value) {
            if ($scope.params.$liveFiltering) {
              updateParams(value);
              return $scope.goToPage(1);
            }
          }), true);
          updateParams = function(newParams) {
            newParams = angular.extend($scope.params, newParams);
            $scope.paramsModel.assign($scope.$parent, new ngTableParams(newParams));
            return $scope.params = angular.copy(newParams);
          };
          $scope.goToPage = function(page) {
            if (page > 0 && $scope.params.page !== page && $scope.params.count * (page - 1) <= $scope.params.total) {
              return updateParams({
                page: page
              });
            }
          };
          $scope.changeCount = function(count) {
            return updateParams({
              page: 1,
              count: count
            });
          };
          $scope.doFilter = function() {
            return updateParams({
              page: 1
            });
          };
          return $scope.sortBy = function(column) {
            var sorting, sortingParams;
            if (!column.sortable) {
              return;
            }
            sorting = $scope.params.sorting && $scope.params.sorting[column.sortable] && ($scope.params.sorting[column.sortable] === "desc");
            sortingParams = {};
            sortingParams[column.sortable] = (sorting ? "asc" : "desc");
            return updateParams({
              sorting: sortingParams
            });
          };
        }
      ],
      compile: function(element, attrs) {
        var columns, i;
        i = 0;
        columns = [];
        angular.forEach(element.find("tr").eq(0).find("td"), function(item) {
          var el, filter, filterTemplateURL, headerTemplateURL, parsedTitle;
          el = $(item);
          if (el.attr("ignore-cell") && "true" === el.attr("ignore-cell")) {
            return;
          }
          parsedTitle = function(scope) {
            return $parse(el.attr("data-title"))(scope) || el.attr("data-title") || " ";
          };
          el.attr('data-title-text', parsedTitle());
          headerTemplateURL = el.attr("header") ? $parse(el.attr("header"))() : false;
          filter = el.attr("filter") ? $parse(el.attr("filter"))() : false;
          filterTemplateURL = false;
          if (filter && filter.templateURL) {
            filterTemplateURL = filter.templateURL;
            delete filter.templateURL;
          }
          return columns.push({
            id: i++,
            title: parsedTitle,
            sortable: (el.attr("sortable") ? el.attr("sortable") : false),
            filter: filter,
            filterTemplateURL: filterTemplateURL,
            headerTemplateURL: headerTemplateURL,
            filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
            show: (el.attr("ng-show") ? function(scope) {
              return $parse(el.attr("ng-show"))(scope);
            } : function() {
              return true;
            })
          });
        });
        return function(scope, element, attrs) {
          var generatePages, headerTemplate, paginationTemplate, tbody;
          scope.columns = columns;
          generatePages = function(currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = 11;
            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            if (numPages > 1) {
              pages.push({
                type: "prev",
                number: Math.max(1, currentPage - 1),
                active: currentPage > 1
              });
              pages.push({
                type: "first",
                number: 1,
                active: currentPage > 1
              });
              maxPivotPages = Math.round((maxBlocks - 5) / 2);
              minPage = Math.max(2, currentPage - maxPivotPages);
              maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
              minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
              i = minPage;
              while (i <= maxPage) {
                if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                  pages.push({
                    type: "more"
                  });
                } else {
                  pages.push({
                    type: "page",
                    number: i,
                    active: currentPage !== i
                  });
                }
                i++;
              }
              pages.push({
                type: "last",
                number: numPages,
                active: currentPage !== numPages
              });
              pages.push({
                type: "next",
                number: Math.min(numPages, currentPage + 1),
                active: currentPage < numPages
              });
            }
            return pages;
          };
          scope.$parent.$watch(attrs.ngTable, (function(params) {
            if (angular.isUndefined(params)) {
              return;
            }
            scope.paramsModel = $parse(attrs.ngTable);
            scope.pages = generatePages(params.page, params.total, params.count);
            return scope.params = angular.copy(params);
          }), true);
          scope.parse = function(text) {
            return text(scope);
          };
          if (attrs.showFilter) {
            scope.$parent.$watch(attrs.showFilter, function(value) {
              return scope.show_filter = value;
            });
          }
          angular.forEach(columns, function(column) {
            var promise;
            if (!column.filterData) {
              return;
            }
            promise = $parse(column.filterData)(scope, {
              $column: column
            });
            if (!(angular.isObject(promise) && angular.isFunction(promise.then))) {
              throw new Error("Function " + column.filterData + " must be promise");
            }
            delete column["filterData"];
            return promise.then(function(data) {
              if (!angular.isArray(data)) {
                data = [];
              }
              data.unshift({
                title: "-",
                id: ""
              });
              return column.data = data;
            });
          });
          if (!element.hasClass("ng-table")) {
            scope.templates = {
              header: (attrs.templateHeader ? attrs.templateHeader : "ng-table/header.html"),
              pagination: (attrs.templatePagination ? attrs.templatePagination : "ng-table/pager.html")
            };
            headerTemplate = $compile("<thead ng-include=\"templates.header\"></thead>")(scope);
            paginationTemplate = $compile("<div ng-include=\"templates.pagination\"></div>")(scope);
            element.filter("thead").remove();
            tbody = element.find('tbody');
            if (tbody[0]) {
              $(tbody[0]).before(headerTemplate);
            } else {
              element.prepend(headerTemplate);
            }
            element.addClass("ng-table");
            return element.after(paginationTemplate);
          }
        };
      }
    };
  }
]);

/*
//@ sourceMappingURL=directive.js.map
*/
var __hasProp = {}.hasOwnProperty;

angular.module("ngTable").factory("ngTableParams", function() {
  var isNumber, ngTableParams;
  isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  ngTableParams = function(data) {
    var ignoreFields, key, lastKey, name, params, v, value, _i, _len, _ref;
    ignoreFields = ["total", "counts", "$liveFiltering"];
    this.page = 1;
    this.count = 1;
    this.counts = [10, 25, 50, 100];
    this.filter = {};
    this.sorting = {};
    for (key in data) {
      value = data[key];
      if (key.indexOf("[") >= 0) {
        params = key.split(/\[(.*)\]/);
        lastKey = "";
        _ref = params.reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          if (name !== "") {
            v = value;
            value = {};
            value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
          }
        }
        if (lastKey === 'sorting') {
          this[lastKey] = {};
        }
        this[lastKey] = angular.extend(this[lastKey] || {}, value[lastKey]);
      } else {
        this[key] = (isNumber(data[key]) ? parseFloat(data[key]) : data[key]);
      }
    }
    this.orderBy = function() {
      var column, direction, sorting, _ref1;
      sorting = [];
      _ref1 = this.sorting;
      for (column in _ref1) {
        if (!__hasProp.call(_ref1, column)) continue;
        direction = _ref1[column];
        sorting.push((direction === "asc" ? "+" : "-") + column);
      }
      return sorting;
    };
    this.url = function(asString) {
      var item, pairs, pname, subkey;
      asString = asString || false;
      pairs = (asString ? [] : {});
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          if (ignoreFields.indexOf(key) >= 0) {
            continue;
          }
          item = this[key];
          name = encodeURIComponent(key);
          if (typeof item === "object") {
            for (subkey in item) {
              if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                pname = name + "[" + encodeURIComponent(subkey) + "]";
                if (asString) {
                  pairs.push(pname + "=" + encodeURIComponent(item[subkey]));
                } else {
                  pairs[pname] = encodeURIComponent(item[subkey]);
                }
              }
            }
          } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
            if (asString) {
              pairs.push(name + "=" + encodeURIComponent(item));
            } else {
              pairs[name] = encodeURIComponent(item);
            }
          }
        }
      }
      return pairs;
    };
    return this;
  };
  return ngTableParams;
});

/*
//@ sourceMappingURL=params.js.map
*/
angular.module('ngTable').run(['$templateCache', function ($templateCache) {
	$templateCache.put('ng-table/filters/button.html', '<button ng-click="doFilter()" ng-show="filter==\'button\'" class="btn btn-primary btn-block">Filter</button>');
	$templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in column.data" ng-model="params.filter[name]" ng-show="filter==\'select\'" class="filter filter-select"></select>');
	$templateCache.put('ng-table/filters/text.html', '<input type="text" ng-model="params.filter[name]" ng-show="filter==\'text\'" class="input-filter"/>');
	$templateCache.put('ng-table/header.html', '<tr><th ng-class="{sortable: column.sortable,\'sort-asc\': params.sorting[column.sortable]==\'asc\', \'sort-desc\': params.sorting[column.sortable]==\'desc\'}" ng-click="sortBy(column)" ng-repeat="column in columns" ng-show="column.show(this)" class="header"><div ng-hide="column.headerTemplateURL" ng-bind="parse(column.title)"></div><div ng-show="column.headerTemplateURL" ng-include="column.headerTemplateURL"></div></th></tr><tr ng-show="show_filter" class="ng-table-filters"><th ng-repeat="column in columns" ng-show="column.show(this)" data-title-text="{{column.title}}" class="filter"><form ng-submit="doFilter()"><input type="submit" tabindex="-1" style="position: absolute; left: -9999px; width: 1px; height: 1px;"/><div ng-repeat="(name, filter) in column.filter"><div ng-if="column.filterTemplateURL"><div ng-include="column.filterTemplateURL"></div></div><div ng-if="!column.filterTemplateURL"><div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div></div></div></form></th></tr>');
	$templateCache.put('ng-table/pager.html', '<div class="pagination ng-cloak"><ul class="pagination"><li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"><a ng-switch-when="prev" ng-click="goToPage(page.number)" href="">«</a><a ng-switch-when="first" ng-click="goToPage(page.number)" href="">{{page.number}}</a><a ng-switch-when="page" ng-click="goToPage(page.number)" href="">{{page.number}}</a><a ng-switch-when="more" ng-click="goToPage(page.number)" href="">…</a><a ng-switch-when="last" ng-click="goToPage(page.number)" href="">{{page.number}}</a><a ng-switch-when="next" ng-click="goToPage(page.number)" href="">»</a></li></ul><div ng-show="params.counts.length" class="btn-group pull-right"><button ng-repeat="count in params.counts" type="button" ng-class="{\'active\':params.count==count}" ng-click="changeCount(count)" class="btn btn-mini">{{count}}</button></div></div>');
}]);
    return angular.module('ngTable');
}));