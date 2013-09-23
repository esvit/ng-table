(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-18454333-4', 'esvit.github.io');
ga('send', 'pageview');

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

define('main', [
    'app',
    
    'directives/prettyprint',
    'directives/loadingContainer',

    'controllers/IndexCtrl',
    'controllers/Demo1Ctrl',
    'controllers/Demo2Ctrl',
    'controllers/Demo3Ctrl',
    'controllers/Demo4Ctrl',
    'controllers/Demo5Ctrl',
    'controllers/Demo6Ctrl',
    'controllers/Demo7Ctrl',
    'controllers/Demo8Ctrl',
    'controllers/Demo9Ctrl',
    'controllers/Demo10Ctrl',
    'controllers/Demo11Ctrl'
], function (app) {

    app.run(['$httpBackend', '$filter', '$log', 'ngTableParams', function($httpBackend, $filter, $log, ngTableParams) {
                // emulation of api server
                $httpBackend.whenGET(/data.*/).respond(function(method, url, data, headers) {
                    var query = url.split('?')[1],
                        requestParams = {};

                    $log.log('Ajax request: ', url);

                    var vars = query.split('&');
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split('=');
                        requestParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                    }
                    // parse url params
                    for (var key in requestParams) {
                        if (key.indexOf('[') >= 0) {
                            var params = key.split(/\[(.*)\]/), value = requestParams[key], lastKey = '';

                            angular.forEach(params.reverse(), function(name) {
                                if (name != '') {
                                    var v = value;
                                    value = {};
                                    value[lastKey = name] = isNumber(v) ? parseFloat(v) : v;
                                }
                            });
                            requestParams[lastKey] = angular.extend(requestParams[lastKey] || {}, value[lastKey]);
                        } else {
                            requestParams[key] = isNumber(requestParams[key]) ? parseFloat(requestParams[key]) : requestParams[key];
                        }
                    }

                    data = [{name: "Moroni", age: 50},
                            {name: "Tiancum", age: 43},
                            {name: "Jacob", age: 27},
                            {name: "Nephi", age: 29},
                            {name: "Enos", age: 34},
                            {name: "Tiancum", age: 43},
                            {name: "Jacob", age: 27},
                            {name: "Nephi", age: 29},
                            {name: "Enos", age: 34},
                            {name: "Tiancum", age: 43},
                            {name: "Jacob", age: 27},
                            {name: "Nephi", age: 29},
                            {name: "Enos", age: 34},
                            {name: "Tiancum", age: 43},
                            {name: "Jacob", age: 27},
                            {name: "Nephi", age: 29},
                            {name: "Enos", age: 34}];

                    var params = new ngTableParams(requestParams);
                    data = params.filter ? $filter('filter')(data, params.filter) : data;
                    data = params.sorting ? $filter('orderBy')(data, params.orderBy()) : data;

                    var total = data.length;
                    data = data.slice((params.page - 1) * params.count, params.page * params.count);

                    return [200, {
                        result: data,
                        total: total
                    }];
                });
                $httpBackend.whenGET(/.*/).passThrough();
                $httpBackend.whenJSONP(/.*/).passThrough();
            }]).
            config(['$interpolateProvider', '$routeProvider', '$locationProvider', '$provide', function($interpolateProvider, $routeProvider, $locationProvider, $provide){

                $locationProvider.html5Mode(false).hashPrefix('!');
                $routeProvider
                    .when('/',      { showHeader: true, templateUrl: 'views/get_started.html' })
                    .when('/demo1', { templateUrl: 'views/demo1.html', controller: 'Demo1Ctrl' })
                    .when('/demo2', { templateUrl: 'views/demo2.html', controller: 'Demo2Ctrl' })
                    .when('/demo3', { templateUrl: 'views/demo3.html', controller: 'Demo3Ctrl' })
                    .when('/demo4', { templateUrl: 'views/demo4.html', controller: 'Demo4Ctrl' })
                    .when('/demo5', { templateUrl: 'views/demo5.html', controller: 'Demo5Ctrl' })
                    .when('/demo6', { templateUrl: 'views/demo6.html', controller: 'Demo6Ctrl' })
                    .when('/demo7', { templateUrl: 'views/demo7.html', controller: 'Demo7Ctrl' })
                    .when('/demo8', { templateUrl: 'views/demo8.html', controller: 'Demo8Ctrl' })
                    .when('/demo9', { templateUrl: 'views/demo9.html', controller: 'Demo9Ctrl' })
                    .when('/demo10', { templateUrl: 'views/demo10.html', controller: 'Demo10Ctrl' })
                    .when('/demo11', { templateUrl: 'views/demo11.html', controller: 'Demo11Ctrl' })
                    .otherwise({ redirectTo: '/' })
                ;

                var pulseElements = $(),
                    pulseColor = {r:0xE6, g:0xF0, b: 0xFF},
                    baseColor = {r:0x99, g:0xc2, b: 0xFF},
                    pulseDuration = 1000,
                    pulseDelay = 15000;

                function hex(number) {
                  return ('0' + Number(number).toString(16)).slice(-2);
                }

                jQuery.fn.pulse = function () {
                  pulseElements = pulseElements.add(this);
                };
                var lastPulse;

                function tick() {
                  var duration = new Date().getTime() - lastPulse,
                      index = duration * Math.PI / pulseDuration ,
                      level = Math.pow(Math.sin(index), 10),
                      color = {
                        r: Math.round(pulseColor.r * level + baseColor.r * (1 - level)),
                        g: Math.round(pulseColor.g * level + baseColor.g * (1 - level)),
                        b: Math.round(pulseColor.b * level + baseColor.b * (1 - level))
                      },
                      style = '#' + hex(color.r) + hex(color.g) + hex(color.b);

                  pulseElements.css('backgroundColor', style);
                  if (duration > pulseDuration) {
                    setTimeout(function() {
                      lastPulse = new Date().getTime();
                      tick();
                    }, pulseDelay);
                  } else {
                    setTimeout(tick, 50);
                  }
                }

                $provide.value('startPulse', function() {
                   setTimeout(function() {
                     lastPulse = new Date().getTime();
                     tick();
                   }, 2000);
                });
            }]);

    angular.bootstrap(document.documentElement, [app.name]);
});