export default {
    //Addition settings for this template
    id_col: 'USUBJID',
    time_col: 'VISITN',
    measure_col: 'TEST',
    value_col: 'STRESN',
    start_value: null,
    x_params: { visits: null, stat: 'mean' },
    y_params: { visits: null, stat: 'mean' },
    filters: null,
    measure: null, // set in syncSettings()

    //Standard webcharts settings
    x: {
        column: 'shiftx',
        type: 'linear',
        label: 'Baseline Value',
        format: '0.2f'
    },
    y: {
        column: 'shifty',
        type: 'linear',
        label: 'Comparison Value',
        behavior: 'flex',
        format: '0.2f'
    },
    marks: [
        {
            type: 'circle',
            per: ['key'],
            radius: 4,
            attributes: {
                'stroke-width': 0.5,
                'fill-opacity': 0.8
            },
            tooltip:
                'Subject ID: [key]\nBaseline: [shiftx]\nComparison: [shifty]\nChange: [chg]\nPercent Change: [pchg]'
        }
    ],
    gridlines: 'xy',
    resizable: false,
    margin: { right: 25, top: 25 },
    aspect: 1
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings) {
    settings.measure = settings.start_value;
    return settings;
}

// Default Control objects
export const controlInputs = [
    { type: 'dropdown', values: [], label: 'Measure', option: 'measure', require: true },
    {
        type: 'dropdown',
        values: [],
        label: 'Baseline visit(s)',
        option: 'x_params_visits',
        require: true,
        multiple: true
    },
    {
        type: 'dropdown',
        values: [],
        label: 'Comparison visit(s)',
        option: 'y_params_visits',
        require: true,
        multiple: true
    }
];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings) {
    //Define filter objects.
    if (Array.isArray(settings.filters) && settings.filters.length)
        settings.filters = settings.filters.map(filter => {
            const filterObject = {
                value_col: filter.value_col || filter
            };
            filterObject.label = filter.label || filterObject.value_col;
            filterObject.type = 'subsetter';

            if (filter instanceof Object) Object.assign(filterObject, filter);

            return filterObject;
        });
    else delete settings.filters;

    return controlInputs;
}

export const listingSettings = {
    cols: ['key', 'shiftx', 'shifty', 'chg', 'pchg'],
    headers: ['Participant ID', 'Baseline', 'Comparison', 'Change', 'Percent Change'],
    searchable: false,
    sortable: true,
    pagination: false,
    exportable: true,
};
