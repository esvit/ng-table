import { DemoNgTablePage } from './demo-ng-table.po';

describe('async/await', () => {
    
    it('should be supported in tests', async () => {
        const demoPage = new DemoNgTablePage('es5/index.html');
        demoPage.open();

        if (await demoPage.dataRows.count() === 0){
            expect(true).toBe(false);
        }
    });
});