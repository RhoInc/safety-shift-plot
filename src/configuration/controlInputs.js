export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            values: [],
            label: 'Measure',
            option: 'measure',
            require: true
        },
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
}
