angular.module("ngTable").factory "ngTableParams", ->
  isNumber = (n) ->
    not isNaN(parseFloat(n)) and isFinite(n)
  ngTableParams = (data) ->
    ignoreFields = ["total"]
    @page = 1
    @count = 1
    @filter = {}

    # parse url params
    for key, value of data
      if key.indexOf("[") >= 0
        params = key.split(/\[(.*)\]/)
        lastKey = ""
        for name in parms.reverse()
          unless name is ""
            v = value
            value = {}
            value[lastKey = name] = (if isNumber(v) then parseFloat(v) else v)

        this[lastKey] = angular.extend(this[lastKey] or {}, value[lastKey])
      else
        this[key] = (if isNumber(data[key]) then parseFloat(data[key]) else data[key])

    @orderBy = ->
      sorting = []
      for direction, column in @sorting
        sorting.push ((if direction is "asc" then "+" else "-")) + column

      return sorting

    @url = (asString) ->
      asString = asString or false
      pairs = (if asString then [] else {})
      for key of this
        if @hasOwnProperty(key)
          continue  if ignoreFields.indexOf(key) >= 0
          item = this[key]
          name = encodeURIComponent(key)
          if typeof item is "object"
            for subkey of item
              if not angular.isUndefined(item[subkey]) and item[subkey] isnt ""
                pname = name + "[" + encodeURIComponent(subkey) + "]"
                if asString
                  pairs.push pname + "=" + encodeURIComponent(item[subkey])
                else
                  pairs[pname] = encodeURIComponent(item[subkey])
          else if not angular.isFunction(item) and not angular.isUndefined(item) and item isnt ""
            if asString
              pairs.push name + "=" + encodeURIComponent(item)
            else
              pairs[name] = encodeURIComponent(item)
      return pairs
    return this
  return ngTableParams
