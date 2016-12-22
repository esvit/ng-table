declare namespace jasmine {
    
    // todo: remove once fixed (see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/12801)
    function addCustomEqualityTester(equalityTester: CustomEqualityTesterFixed): void;
    export interface CustomEqualityTesterFixed {
        (first: any, second: any): boolean | undefined;
    }
}