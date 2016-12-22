import { IAttributes, IPromise, IScope } from 'angular';

/**
 * The scope available to a table column getter
 */
export type ColumnFieldContext = IScope & {
    $column: ColumnDef;
    $columns: ColumnDef[];
}

export type ColumnFieldContextPartial = IScope & {
    $column?: ColumnDef;
    $columns: ColumnDef[];
}

/**
 * Signature of a getter/setter on a {@link IColumnDef} instance
 */
export interface ColumnField<T> {
    (context?: ColumnFieldContextPartial): T;
    (value: T): void;
    assign($scope: IScope, value: T): void;
}

/**
 * The definition of the column within a ngTable.
 * When using `ng-table` directive a column definition will be parsed from each `td` tag found in the
 * `tr` data row tag.
 *
 * @example
 * ```html
 * <tr>
 *  <td data-title="'Name of User'" filter="{ username: 'text'}" sortable="'username'" />
 *  <td data-title="'Age of User'" filter="{ age: 'number'}" sortable="'age'" />
 * </tr>
 * ```
 */
export interface ColumnDef {
    /**
     * Custom CSS class that should be added to the `th` tag(s) of this column in the table header
     *
     * To set this on the `td` tag of a html table use the attribute `header-class` or `data-header-class`
     */
    class: ColumnField<string>;
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
    filter: ColumnField<FilterTemplateDefMap>;
    /**
     * Supplies the `ISelectOption`s that can be used in a html filter template for this colums.
     * At the creation of the `NgTableParams` this field will be called and the result then assigned
     * to the `data` field of this column.
     */
    filterData: ColumnField<IPromise<SelectData> | SelectData>;
    /**
     * The name of the data row field that will be used to group on, or false when this column
     * does not support grouping
     */
    groupable: ColumnField<string | boolean>;
    /**
     * The url of a custom html template that should be used to render a table header for this column
     *
     * To set this on the `td` tag for a html table use the attribute `header` or `data-header`
     */
    headerTemplateURL: ColumnField<string | boolean>;
    /**
     * The text that should be used as a tooltip for this column in the table header
     */
    headerTitle: ColumnField<string>;
    /**
     * Determines whether this column should be displayed in the table
     *
     * To set this on the `td` tag for a html table use the attribute `ng-if`
     */
    show: ColumnField<boolean>;
    /**
     * The name of the data row field that will be used to sort on, or false when this column
     * does not support sorting
     */
    sortable: ColumnField<string | boolean>;
    /**
     * The title of this column that should be displayed in the table header
     */
    title: ColumnField<string>;
    /**
     * An alternate column title. Typically this can be used for responsive table layouts
     * where the titleAlt should be used for small screen sizes
     */
    titleAlt: ColumnField<string>;
}

export type ColumnDefPartial = Partial<ColumnDef>;

export type DynamicTableColField<T> = DynamicTableColFieldFunc<T> | T;


/**
 * Signature of a getter/setter on a {@link IDynamicTableColDef} instance
 */
export interface DynamicTableColFieldFunc<T> {
    (context: ColumnFieldContextPartial): T;
}

/**
 * The definition of the column supplied to a {@link ngTableDynamic} directive.
 */
export interface DynamicTableColDef {
    /**
     * Custom CSS class that should be added to the `th` tag(s) of this column in the table header
     */
    class?: DynamicTableColField<string>;
    /**
     * The definition of 0 or more html filter templates that should be rendered for this column in
     * the table header
     */
    filter?: DynamicTableColField<FilterTemplateDefMap>;
    /**
     * Supplies the `ISelectOption`s that can be used in a html filter template for this colums.
     * At the creation of the `NgTableParams` this field will be called and the result then assigned
     * to the `data` field of this column.
     */
    filterData?: DynamicTableColField<IPromise<SelectData> | SelectData>;
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
 * A key value-pair map where the key is the name of a field in a data row and the value is the definition
 * for the template used to render a filter cell in the header of a html table.
 * Where the value is supplied as a string this should either be url to a html template or an alias to a url registered
 * using the {@link ngTableFilterConfigProvider}
 * @example
 * ```js
 * vm.ageFilter = { "age": "number" }
 * ```
 * @example
 * ```js
 * vm.ageFilter = { "age": "my/custom/ageTemplate.html" }
 * ```
 * @example
 * ```js
 * vm.ageFilter = { "age": { id: "number", placeholder: "Age of person"} }
 * ```
 */
export interface FilterTemplateDefMap {
    [name: string]: string | FilterTemplateDef
}

/**
 * A fully qualified template definition for a single filter
 */
export interface FilterTemplateDef {
    /**
     * A url to a html template or an alias to a url registered using the {@link ngTableFilterConfigProvider}
     */
    id: string,
    /**
     * The text that should be rendered as a prompt to assist the user when entering a filter value
     */
    placeholder: string
}

export type SelectData = SelectOption[] | SelectDataFunc

/**
 * An object to be rendered as a html select option
 */
export interface SelectOption {
    id: string | number;
    title: string;
}

/**
 * Signature of a function that will return the options that will be rendered by a html select
 */
export interface SelectDataFunc {
    (): SelectOption[] | IPromise<SelectOption[]> | undefined
}

/**
 * The definition of the html attributes accepted by both the {@link ngTable ngTable} and {@link ngTableDynamic} directives
 */
export interface TableHtmlAttributes extends IAttributes {
    disableFilter?: string;
    showFilter?: string;
    showGroup?: string;
    templateHeader?: string;
    templatePagination?: string;
}

/**
 * The definition of the html attributes accepted by the {@link ngTable} directive
 */
export interface DeclarativeTableHtmlAttributes extends TableHtmlAttributes {
    ngTable: string;
}

/**
 * The definition of the html attributes accepted by the {@link ngTableDynamic} directive
 */
export interface DynamicTableHtmlAttributes extends TableHtmlAttributes {
    ngTableDynamic: string;
}