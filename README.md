Table + Angular JS
======

```html
<table grid="update" pager="articles.pager">
    <tr ng-repeat="article in articles.data">
        <td width="20">
            <input type="checkbox" ng-model="article.checked" />
        </td>
        <td sortable="title" filter="{ 'title': 'text' }" title="Title">
            <a href="#!/news/edit{[article.id]}">{[article.title]}</a>
        </td>
        <td filter="{ 'user_id': 'select' }" filter-data="users" sortable="user_id" width="140" title="Author">
            {[article.user]}
        </td>
        <td filter="{ 'created_at': 'date' }" sortable="created_at" width="140" title="Date of creation" class="text-center">
            {[article.created_at|date:'yyyy-MM-dd']}<br/>
            {[article.created_at|date:'HH:mm:ss']}
        </td>
        <td sortable="publish" width="130" title="Published">
            <input type="checkbox" ng-model="article.publish">
        </td>
        <td filter="{ 'action': 'button' }" width="95" title="Anctions" class="text-center">
            <div class="btn-group">
                <button ng-click="delete(column)" class="btn btn-danger"><span class="glyphicon glyphicon-trash glyphicon glyphicon-white"></span></button>
            </div>
        </td>
    </tr>
</table>
```

# Sorting

Just add `sorting` attribute.
```html
<td sortable="title"></td>
```

# Filtering

```html
<td filter="{ 'title': 'text' }" filter-data="users"></td>
```

* `text` - Show text input for filtering
* `select` - Show selectbox for filtering, required `filter-data` attribute with name of function. This function must return `promise` for resolving data in select box
* `date` - simple date range
* `button` - show "Filter" button