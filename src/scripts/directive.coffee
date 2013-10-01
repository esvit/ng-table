"use strict"

###
ngTable: Table + Angular JS

@author Vitalii Savchuk <esvit666@gmail.com>
@copyright 2013 Vitalii Savchuk <esvit666@gmail.com>
@version 0.2.1
@url https://github.com/esvit/ng-table/
@license New BSD License <http://creativecommons.org/licenses/BSD/>
###

angular.module("ngTable", []).directive("ngTable", ["$compile", "$q", "$parse", "$http", "ngTableParams", ($compile, $q, $parse, $http, ngTableParams) ->
  restrict: "A"
  priority: 1001
  scope: true
  controller: [ "$scope", "$timeout", ($scope, $timeout) ->
    $scope.params = $scope.params or
      page: 1
      count: 10

    # update result every time filter changes
    $scope.$watch('params.filter', ((value) ->
      if $scope.params.$liveFiltering
        updateParams filter: value
        $scope.goToPage 1
    ), true)

    $scope.$watch('params.sorting', ((value) ->
      updateParams sorting: value
    ), true)

    updateParams = (newParams) ->
      newParams = angular.extend($scope.params, newParams)

      # assign params in both scopes
      $scope.paramsModel.assign $scope.$parent, new ngTableParams(newParams) if $scope.paramsModel
      $scope.params = angular.copy(newParams)

    # goto page
    $scope.goToPage = (page) ->
      updateParams page: page  if page > 0 and $scope.params.page isnt page and $scope.params.count * (page - 1) <= $scope.params.total

    # change items per page
    $scope.changeCount = (count) ->
      updateParams
        page: 1
        count: count


    $scope.doFilter = ->
      updateParams page: 1

    $scope.sortBy = (column) ->
      parsedSortable = $scope.parse(column.sortable)
      return  unless parsedSortable
      sorting = $scope.params.sorting and $scope.params.sorting[parsedSortable] and ($scope.params.sorting[parsedSortable] is "desc")
      sortingParams = {}
      sortingParams[parsedSortable] = (if sorting then "asc" else "desc")
      updateParams sorting: sortingParams
  ]
  compile: (element, attrs) ->
    i = 0
    columns = []
    angular.forEach element.find("tr").eq(0).find("td"), (item) ->
      el = angular.element(item)
      if (el.attr("ignore-cell") && "true" == el.attr("ignore-cell"))
        return
      parsedAttribute = (attr, defaultValue) ->
        (scope) -> $parse(el.attr("x-data-#{attr}") or el.attr("data-#{attr}") or el.attr(attr))(scope, {$columns: columns}) or defaultValue

      headerTemplateURL = (scope) ->
        $parse(el.attr("x-data-header") or el.attr("data-header") or el.attr("header"))(scope, {$columns: columns}) or false

      filter = if el.attr("filter") then $parse(el.attr("filter"))() else false
      filterTemplateURL = false
      if filter && filter.templateURL
          filterTemplateURL = filter.templateURL
          delete filter.templateURL

      columns.push
        id: i++
        title: parsedAttribute("title", " ")
        sortable: parsedAttribute("sortable", false)
        filter: filter
        filterTemplateURL: filterTemplateURL
        headerTemplateURL: headerTemplateURL
        filterData: (if el.attr("filter-data") then el.attr("filter-data") else null)
        show: (if el.attr("ng-show") then (scope) -> $parse(el.attr("ng-show"))(scope) else () -> true)


    (scope, element, attrs) ->
      scope.columns = columns
      # generate array of pages
      generatePages = (currentPage, totalItems, pageSize) ->
        maxBlocks = 11
        pages = []
        numPages = Math.ceil(totalItems / pageSize)
        if numPages > 1
          pages.push
            type: "prev"
            number: Math.max(1, currentPage - 1)
            active: currentPage > 1

          pages.push
            type: "first"
            number: 1
            active: currentPage > 1

          maxPivotPages = Math.round((maxBlocks - 5) / 2)
          minPage = Math.max(2, currentPage - maxPivotPages)
          maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage))
          minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)))
          i = minPage

          while i <= maxPage
            if (i is minPage and i isnt 2) or (i is maxPage and i isnt numPages - 1)
              pages.push type: "more"
            else
              pages.push
                type: "page"
                number: i
                active: currentPage isnt i

            i++
          pages.push
            type: "last"
            number: numPages
            active: currentPage isnt numPages

          pages.push
            type: "next"
            number: Math.min(numPages, currentPage + 1)
            active: currentPage < numPages

        pages

      # update pagination where parameters changes
      scope.$parent.$watch attrs.ngTable, ((params) ->
        return  if angular.isUndefined(params)
        scope.paramsModel = $parse(attrs.ngTable)
        scope.pages = generatePages(params.page, params.total, params.count)
        scope.params = angular.copy(params)
      ), true

      scope.parse = (text) ->
        return text(scope)

      # show/hide filter row
      if attrs.showFilter
        scope.$parent.$watch attrs.showFilter, (value) ->
          scope.show_filter = value

      # get data from columns
      angular.forEach columns, (column) ->
        return  unless column.filterData
        def = $parse(column.filterData)(scope, $column: column)
        throw new Error("Function " + column.filterData + " must be instance of $q.defer()")  unless (angular.isObject(def) && angular.isObject(def.promise))
        delete column["filterData"]

        def.promise.then (data) ->
          data = []  unless angular.isArray(data)
          data.unshift title: "-", id: ""
          column.data = data

      # create table
      unless element.hasClass("ng-table")
        scope.templates =
          header: (if attrs.templateHeader then attrs.templateHeader else "ng-table/header.html")
          pagination: (if attrs.templatePagination then attrs.templatePagination else "ng-table/pager.html")

        headerTemplate = $compile("<thead ng-include=\"templates.header\"></thead>")(scope)
        paginationTemplate = $compile("<div ng-include=\"templates.pagination\"></div>")(scope)
        element.find("thead").remove()
        tbody = element.find('tbody')
        if (tbody[0]) then angular.element(tbody[0]).before headerTemplate else element.prepend headerTemplate
        element.addClass "ng-table"
        element.after paginationTemplate
])
