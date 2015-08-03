(function () {
    angular.module('ngTableDemoFakeBackend', ['ngTable', 'ngMockE2E']);

    angular.module('ngTableDemoFakeBackend').service("demoDataGenerator", demoDataGenerator);

    function demoDataGenerator() {

        var template = {
            "installationAt": "Philadelphia, PA",
            "adminEmail": "ksm@pobox.com",
            "poweredBy": "Cofax",
            "poweredByIcon": "/images/cofax.gif"
        };

        this.generateData = generateData;

        function generateData(number) {
            return _.range(number).map(function (n) {
                var clone = _.mapValues(template, function (val) {
                    return val + Number(_.uniqueId());
                });
                _.extend(clone, {
                    id: n
                });
                return clone;
            })
        }
    }
})();
(function() {
    angular.module('ngTableDemoFakeBackend').run(function($httpBackend, $filter, $log, NgTableParams, ngTableDefaultGetData, demoDataGenerator) {
        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
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
                    var params = key.split(/\[(.*)\]/),
                        value = requestParams[key],
                        lastKey = '';

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

            data = demoDataGenerator.generateData(100);

            var params = new NgTableParams(requestParams);
            var results = ngTableDefaultGetData(data, params);

            return [200, {
                results: results,
                inlineCount: params.total()
            }];
        });
        $httpBackend.whenGET(/.*/).passThrough();
    });
})();