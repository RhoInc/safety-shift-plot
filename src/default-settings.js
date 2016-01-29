const settings = {
    //Addition settings for this template
    id_col: "USUBJID",
    time_col: "VISITN",
    measure_col: "TEST",
    value_col: "STRESN",
    measure: '',
    x_params: {visits: null, stat: "mean"},
    y_params: {visits: null, stat: "mean"},

    //Standard webcharts settings
    x:{
        column:"shiftx",
        type:"linear",
        // behavior:"flex",
        label:"Baseline Value",
        format:"0.2f"
    },
    y:{
        column:"shifty",
        type:"linear",
        label:"End of Study Value",
        behavior:"flex",
        format:"0.2f"
    },
    marks:[
        {
            type:"circle",
            per:["key"],
            radius:4,
            attributes:{
                'stroke-width': .5, 
                'fill-opacity':0.8
            },
            tooltip:"Baseline: [shiftx], Comparison: [shifty]"
        }
    ],
    gridlines: 'xy',
    resizable:false,
    width: 600,
    margin:{right:25, top: 25},
    aspect: 1
};

export const controlInputs = [
    {type: "dropdown", values: [], label: "Measure", option: "measure", require: true},
    {type: "dropdown", values: [], label: "Baseline visit(s)", option:"x_params_visits", require: true, multiple:true},
    {type: "dropdown", values: [], label: "Comparison visit(s)", option: "y_params_visits", require: true, multiple:true}
];

export const tableSettings = {
    cols: ["key","shiftx","shifty"],
    headers: ["ID","Start Value", "End Value"]
};

export default settings
