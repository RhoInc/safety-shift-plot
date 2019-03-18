export default function rendererSettings() {
    return {
        id_col: 'USUBJID',
        time_col: 'VISITN',
        visit_col: 'VISIT',
        visit_order_col: 'VISITNUM',
        measure_col: 'TEST',
        value_col: 'STRESN',
        start_value: null,
        x_params: { visits: null, stat: 'mean' },
        y_params: { visits: null, stat: 'mean' },
        filters: null
    };
}
