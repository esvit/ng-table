/// <reference path="ng-table.d.ts" />
function printPerson(p) {
    console.log('age: ' + p.age);
    console.log('name: ' + p.name);
}
// NgTableParams signature tests
var NgTableParamsTests;
(function (NgTableParamsTests) {
    var initialParams = {
        filter: { name: 'Christian' },
        sorting: { age: 'asc' }
    };
    var settings = {
        dataset: [{ age: 1, name: 'Christian' }, { age: 2, name: 'Lee' }, { age: 40, name: 'Christian' }],
        filterOptions: {
            filterComparator: true,
            filterDelay: 100
        },
        counts: [10, 20, 50]
    };
    NgTableParamsTests.tableParams = new NgTableParams(initialParams, settings);
    // modify parameters
    NgTableParamsTests.tableParams.filter({ name: 'Lee' });
    NgTableParamsTests.tableParams.sorting('age', 'desc');
    NgTableParamsTests.tableParams.count(10);
    NgTableParamsTests.tableParams.group(function (item) { return (item.age * 10).toString(); });
    // modify settings at runtime
    NgTableParamsTests.tableParams.settings({
        dataset: [{ age: 1, name: 'Brandon' }, { age: 2, name: 'Lee' }]
    });
    NgTableParamsTests.tableParams.reload().then(function (rows) {
        rows.forEach(printPerson);
    });
})(NgTableParamsTests || (NgTableParamsTests = {}));
// Dynamic table column signature tests
var ColumnTests;
(function (ColumnTests) {
    var dynamicCols;
    dynamicCols.push({
        class: function () { return 'table'; },
        field: 'age',
        filter: { age: 'number' },
        sortable: true,
        show: true,
        title: 'Age of Person',
        titleAlt: 'Age'
    });
})(ColumnTests || (ColumnTests = {}));
var EventsTests;
(function (EventsTests) {
    var unregistrationFuncs = [];
    var x;
    x = events.onAfterCreated(function (params) {
        // do stuff
    });
    unregistrationFuncs.push(x);
    x = events.onAfterReloadData(function (params, newData, oldData) {
        newData.forEach(function (row) {
            if (isDataGroup(row)) {
                row.data.forEach(printPerson);
            }
            else {
                printPerson(row);
            }
        });
    }, NgTableParamsTests.tableParams);
    unregistrationFuncs.push(x);
    x = events.onDatasetChanged(function (params, newDataset, oldDataset) {
        if (newDataset != null) {
            newDataset.forEach(printPerson);
        }
    }, NgTableParamsTests.tableParams);
    unregistrationFuncs.push(x);
    x = events.onPagesChanged(function (params, newButtons, oldButtons) {
        newButtons.forEach(printPageButton);
    }, NgTableParamsTests.tableParams);
    unregistrationFuncs.push(x);
    unregistrationFuncs.forEach(function (f) {
        f();
    });
    function printPageButton(btn) {
        console.log('type: ' + btn.type);
        console.log('number: ' + btn['number']);
        console.log('current: ' + btn.current);
        console.log('active: ' + btn.active);
    }
    function isDataGroup(row) {
        return ('$hideRows' in row);
    }
})(EventsTests || (EventsTests = {}));
