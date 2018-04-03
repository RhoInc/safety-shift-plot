export default function defineStyles() {
    const styles = [
        '#safety-shift-plot {' + '    width: 100%;' + '    display: inline-block;' + '}',
        '.ssp-component {' +
            '    margin: 0;' +
            '    border: none;' +
            '    padding: 0;' +
            '    display: inline-block;' +
            '}',

        //controls
        '#ssp-controls {' + '    width: 25%;' + '    float: left;' + '}',
        '#ssp-controls .control-group {' +
            '    width: 98%;' +
            '    margin: 0 2% 5px 0;' +
            '    padding: 0;' +
            '}',
        '#ssp-controls .control-group > * {' + '    display: inline-block;' + '}',
        '#ssp-controls .changer {' + '    float: right;' + '    width: 50%;' + '}',
        '#ssp-controls .wc-control-label {' + '    text-align: right;' + '    width: 48%;' + '}',
        '#ssp-controls .annote {' + '    width: 98%;' + '    text-align: right;' + '}',

        //chart
        '#ssp-chart {' + '    width: 36%;' + '    margin: 0 2%;' + '}',

        //listing
        '#ssp-listing {' + '    width: 35%;' + '    float: right;' + '}',
        '#ssp-listing .wc-table table {' + '    width: 100%;' + '    display: table;' + '}',
        '#ssp-listing .wc-table th:not(:first-child),' +
            '#ssp-listing .wc-table td:not(:first-child) {' +
            '    text-align: right;' +
            '}'
    ];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles.join('\n');
    document.getElementsByTagName('head')[0].appendChild(style);
}
