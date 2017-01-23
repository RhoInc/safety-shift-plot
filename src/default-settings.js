const settings = {
  //Addition settings for this template
 	id_col: 'USUBJID',
    time_col: 'VISITN',
    measure_col: 'TEST',
    value_col: 'STRESN',
    start_value: null,
    measure: null, // set in syncSettings() 
    x_params: {visits: null, stat: 'mean'},
    y_params: {visits: null, stat: 'mean'},
    filters: null,

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
                'stroke-width': .5, 
                'fill-opacity': 0.8
            },
            tooltip: 'Subject ID: [key]\nBaseline: [shiftx]\nComparison: [shifty]\nChange: [chg]\nPercent Change: [pchg]'
        }
    ],
    gridlines: 'xy',
    resizable: false,
    margin: {right: 25, top: 25},
    aspect: 3
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings){
	settings.measure = settings.start_value;
    return settings;
}

// Default Control objects
export const controlInputs = [ 
  {type: 'dropdown', values: [], label: 'Measure', option: 'measure', require: true},
  {type: 'dropdown', values: [], label: 'Baseline visit(s)', option: 'x_params_visits', require: true, multiple: true},
  {type: 'dropdown', values: [], label: 'Comparison visit(s)', option: 'y_params_visits', require: true, multiple: true}
];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings) {
  //Define filter objects.
    if (settings.filters) {
        settings.filters
            .forEach((d, i) => {
                d.type = 'subsetter';
                d.value_col = d.value_col ? d.value_col : d;
                d.label = d.label ? d.label : d.value_col ? d.value_col : d;
            });
    }

    return controlInputs
}

// Default Settings for custom linked table
export const tableSettings = {
    cols:
        ['key'
        ,'shiftx'
        ,'shifty'
        ,'chg'
        ,'pchg'],
    headers:
        ['Subject ID'
        ,'Baseline Value'
        ,'Comparison Value'
        ,'Change'
        ,'Percent Change']
};

export default settings
