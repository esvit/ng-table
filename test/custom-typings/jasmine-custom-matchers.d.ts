declare namespace jasmine {
    interface Matchers {
        toEqualPlainObject: (expected: any, expectationFailureOutput?: any) => boolean;
    }
}