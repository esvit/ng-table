import * as ng1 from 'angular';
import * as _ from 'lodash';

function asPlainObjectDeep<T>(origianl: T) {
    const removePrototype = (srcVal: any, objVal: any) => {
        if (ng1.isObject(objVal) && !ng1.isArray(objVal)) {
            return _.toPlainObject(objVal);
        } else {
            return objVal;
        }
    };
    return _.mergeWith<T>(Object.create(null), origianl, removePrototype);
}

const customMatchers = {
    toEqualPlainObject: function (util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[]) {
        return {
            compare: function (actual: any, expected: any) {
                if (actual === undefined && expected === undefined) return { pass: true };

                if (actual == null || expected == null) return { pass: false };
                
                // we need to clone to remove type information (ie prototype) from objects before comparison
                return {
                    pass: util.equals(asPlainObjectDeep(actual), asPlainObjectDeep(expected), customEqualityTesters)
                };
            }
        };
    }
};

function areFunctionsEqual(first: any, second: any): boolean | undefined {
    if (typeof first === "function" && typeof second === "function") {
        return first.toString() === second.toString();
    }
    return undefined;
}

function areFunctions(first: any, second: any): boolean | undefined {
    if (typeof first === "function" && typeof second === "function") {
        return true;
    }
    return undefined;
}

beforeAll(() => {
    jasmine.addCustomEqualityTester(areFunctions);
    jasmine.addMatchers(customMatchers);
});



export { areFunctions, areFunctionsEqual };