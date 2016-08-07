import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class DemoNgTablePage {
    dataRows: ElementArrayFinder;
    table: ElementFinder;
    constructor(private url: string) {
        this.table = element(by.css('table[ng-table]'));
        this.dataRows = element.all(by.repeater('user in $data'));
    }
    open() {
        browser.get(this.url);
    }
}