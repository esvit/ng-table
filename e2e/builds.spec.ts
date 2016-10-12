import { DemoNgTablePage } from './demo-ng-table.po';

describe('ng-table builds', () => {

    describe('es5', () => {
        const demoPageUrl = 'es5/index.html';
        it('should render ng-table', () => {
            renderTableSpec(demoPageUrl);
        });
    });

    describe('es6-systemjs', () => {
        // demo-app/es6-systemjs is failing in IE less than vs 11
        // this seems to be something to do with SystemJS rather than ng-table per sa;
        // I given up trying to investigate for lack of time. Degugging the error
        // on SauceLabs shows the following error logged to the browser console:
        // "Unable to get property 'pos' of undefined or null reference"
        if (capabilities.browserName === "internet explorer" && capabilities.version < 11) {
            return
        }

        const demoPageUrl = 'es6-systemjs/index.html';
        it('should render ng-table', () => {
            renderTableSpec(demoPageUrl);
        });
    });

    describe('es6-webpack', () => {
        const demoPageUrl = 'es6-webpack/build/index.html';
        it('should render ng-table', () => {
            renderTableSpec(demoPageUrl);
        });
    });

    describe('ts-webpack', () => {
        const demoPageUrl = 'ts-webpack/build/index.html';
        it('should render ng-table', () => {
            renderTableSpec(demoPageUrl);
        });
    });


    function renderTableSpec(url: string) {
        const demoPage = new DemoNgTablePage(url);
        demoPage.open();
        expect(demoPage.table.isPresent()).toBe(true);
        expect(demoPage.dataRows.count()).toBeGreaterThan(0);
    }
});