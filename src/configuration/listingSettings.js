export default function listingSettings() {
    return {
        cols: ['key', 'shiftx', 'shifty', 'chg', 'pchg'],
        headers: ['Participant ID', 'Baseline', 'Comparison', 'Change', 'Percent Change'],
        searchable: false,
        sortable: true,
        pagination: false,
        exportable: true
    };
}
