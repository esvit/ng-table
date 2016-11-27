/**
 * Definition of the buttons rendered by the data row pager directive
 */
export interface IPageButton {
    type: string;
    number?: number;
    active: boolean;
    current?: boolean;
}