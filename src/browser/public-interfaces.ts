import * as ng1 from 'angular';

export type ColumnFieldContext = ng.IScope & {
    $column?: IColumnDef;
    $columns: IColumnDef[];
}

export interface IColumnField<T> {
    (context?: ColumnFieldContext): T;
    assign($scope: ng.IScope, value: T): void;
}

export interface ITableController {
    buildColumns(columns: Array<IColumnDef | IDynamicTableColDef>): IColumnDef[];
    compileDirectiveTemplates(): void;
    loadFilterData($columns: IColumnDef[]): ng1.IPromise<SelectData> | SelectData;
    parseNgTableDynamicExpr(expr: string): {
        tableParams: string;
        columns: string;
    }
    setupBindingsToInternalScope(tableParamsExpr?: string): void;
}

/**
 * The definition of the column within a ngTable.
 * When using `ng-table` directive a column definition will be parsed from each `td` tag found in the
 * `tr` data row tag.
 *
 * @example
 * <tr>
 *  <td data-title="'Name of User'" filter="{ username: 'text'}" sortable="'username'" />
 *  <td data-title="'Age of User'" filter="{ age: 'number'}" sortable="'age'" />
 * </tr>
 */
export interface IColumnDef {
    /**
     * Custom CSS class that should be added to the `th` tag(s) of this column in the table header
     *
     * To set this on the `td` tag of a html table use the attribute `header-class` or `data-header-class`
     */
    class: IColumnField<string>;
    /**
     * The `ISelectOption`s that can be used in a html filter template for this colums.
     */
    data?: SelectData;
    /**
     * The index position of this column within the `$columns` container array
     */
    id: number;
    /**
     * The definition of 0 or more html filter templates that should be rendered for this column in
     * the table header
     */
    filter: IColumnField<IFilterTemplateDefMap>;
    /**
     * Supplies the `ISelectOption`s that can be used in a html filter template for this colums.
     * At the creation of the `NgTableParams` this field will be called and the result then assigned
     * to the `data` field of this column.
     */
    filterData: IColumnField<ng.IPromise<SelectData> | SelectData>;
    /**
     * The name of the data row field that will be used to group on, or false when this column
     * does not support grouping
     */
    groupable: IColumnField<string | boolean>;
    /**
     * The url of a custom html template that should be used to render a table header for this column
     *
     * To set this on the `td` tag for a html table use the attribute `header` or `data-header`
     */
    headerTemplateURL: IColumnField<string | boolean>;
    /**
     * The text that should be used as a tooltip for this column in the table header
     */
    headerTitle: IColumnField<string>;
    /**
     * Determines whether this column should be displayed in the table
     *
     * To set this on the `td` tag for a html table use the attribute `ng-if`
     */
    show: IColumnField<boolean>;
    /**
     * The name of the data row field that will be used to sort on, or false when this column
     * does not support sorting
     */
    sortable: IColumnField<string | boolean>;
    /**
     * The title of this column that should be displayed in the table header
     */
    title: IColumnField<string>;
    /**
     * An alternate column title. Typically this can be used for responsive table layouts
     * where the titleAlt should be used for small screen sizes
     */
    titleAlt: IColumnField<string>;
}

export type DynamicTableColField<T> = IDynamicTableColFieldFunc<T> | T;

export interface IDynamicTableColFieldFunc<T> {
    (context: ColumnFieldContext): T;
}

/**
 * The definition of the column supplied to a ngTableDynamic directive.
 */
export interface IDynamicTableColDef {
    /**
     * Custom CSS class that should be added to the `th` tag(s) of this column in the table header
     */
    class?: DynamicTableColField<string>;
    /**
     * The definition of 0 or more html filter templates that should be rendered for this column in
     * the table header
     */
    filter?: DynamicTableColField<IFilterTemplateDefMap>;
    /**
     * Supplies the `ISelectOption`s that can be used in a html filter template for this colums.
     * At the creation of the `NgTableParams` this field will be called and the result then assigned
     * to the `data` field of this column.
     */
    filterData?: DynamicTableColField<ng.IPromise<SelectData> | SelectData>;
    /**
     * The name of the data row field that will be used to group on, or false when this column
     * does not support grouping
     */
    groupable?: DynamicTableColField<string | boolean>;
    /**
     * The url of a custom html template that should be used to render a table header for this column
     */
    headerTemplateURL?: DynamicTableColField<string | boolean>;
    /**
     * The text that should be used as a tooltip for this column in the table header
     */
    headerTitle?: DynamicTableColField<string>;
    /**
     * Determines whether this column should be displayed in the table
     */
    show?: DynamicTableColField<boolean>;
    /**
     * The name of the data row field that will be used to sort on, or false when this column
     * does not support sorting
     */
    sortable?: DynamicTableColField<string | boolean>;
    /**
     * The title of this column that should be displayed in the table header
     */
    title?: DynamicTableColField<string>;
    /**
     * An alternate column title. Typically this can be used for responsive table layouts
     * where the titleAlt should be used for small screen sizes
     */
    titleAlt?: DynamicTableColField<string>;
}

/**
 * Configuration values that determine the behaviour of the `ngTableFilterConfig` service
 */
export interface IFilterConfigValues {
    /**
     * The default base url to use when deriving the url for a filter template given just an alias name
     * Defaults to 'ng-table/filters/'
     */
    defaultBaseUrl?: string;
    /**
     * The extension to use when deriving the url of a filter template when given just an alias name
     */
    defaultExt?: string;
    /**
     * A map of alias names and their corrosponding urls. A lookup against this map will be used
     * to find the url matching an alias name.
     * If no match is found then a url will be derived using the following pattern `${defaultBaseUrl}${aliasName}.${defaultExt}`
     */
    aliasUrls?: { [name: string]: string };
}

/**
 * The angular provider used to configure the behaviour of the `ngTableFilterConfig` service
 */
export interface IFilterConfigProvider {
    $get: IFilterConfig;
    /**
     * Reset back to factory defaults the config values that `ngTableFilterConfig` service will use
     */
    resetConfigs(): void;
    /**
     * Set the config values used by `ngTableFilterConfig` service
     */
    setConfig(customConfig: IFilterConfigValues): void;
}

/**
 * A key value-pair map where the key is the name of a field in a data row and the value is the definition
 * for the template used to render a filter cell in the header of a html table.
 * Where the value is supplied as a string this should either be url to a html template or an alias to a url registered
 * using the `ngTableFilterConfigProvider`
 * @example
 * vm.ageFilter = { "age": "number" }
 * @example
 * vm.ageFilter = { "age": "my/custom/ageTemplate.html" }
 * @example
 * vm.ageFilter = { "age": { id: "number", placeholder: "Age of person"} }
 */
export interface IFilterTemplateDefMap {
    [name: string]: string | IFilterTemplateDef
}

/**
 * A fully qualified template definition for a single filter
 */
export interface IFilterTemplateDef {
    /**
     * A url to a html template of an alias to a url registered using the `ngTableFilterConfigProvider`
     */
    id: string,
    /**
     * The text that should be rendered as a prompt to assist the user when entering a filter value
     */
    placeholder: string
}

/**
 * Exposes configuration values and methods used to return the location of the html
 * templates used to render the filter row of an ng-table directive
 */
export interface IFilterConfig {
    /**
     * Readonly copy of the final values used to configure the service.
     */
    config: IFilterConfigValues,
    /**
     * Return the url of the html filter template for the supplied definition and key.
     * For more information see the documentation for `IFilterTemplateMap`
     */
    getTemplateUrl(filterDef: string | IFilterTemplateDef, filterKey?: string): string,
    /**
     * Return the url of the html filter template registered with the alias supplied
     */
    getUrlForAlias(aliasName: string, filterKey?: string): string
}

export type SelectData = ISelectOption[] | ISelectDataFunc

export interface ISelectOption {
    id: string | number;
    title: string;
}

export interface ISelectDataFunc {
    (): ISelectOption[] | ng.IPromise<ISelectOption[]>
}