(function(angular, factory) {
    'use strict';

    if (angular==null && typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
    'use strict';