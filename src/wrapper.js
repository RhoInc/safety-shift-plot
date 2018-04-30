//polyfills
import './polyfills/object-assign';
import './polyfills/array-find';
import './polyfills/array-findIndex';

//settings
import defaultSettings, {
    syncSettings,
    controlInputs,
    syncControlInputs,
    listingSettings
} from './defaultSettings';
import clone from './util/clone';

//webcharts
import { createControls, createChart, createTable } from 'webcharts';

//chart callbacks
import onInit from './onInit';
import onLayout from './onLayout';
import onPreprocess from './onPreprocess';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';

export default function safetyShiftPlot(element, settings) {
    //settings
    const mergedSettings = Object.assign({}, clone(defaultSettings), clone(settings));
    const syncedSettings = syncSettings(clone(mergedSettings));
    const syncedControlInputs = syncControlInputs(clone(controlInputs), syncedSettings);

    //controls
    const controls = createControls(element, { location: 'top', inputs: syncedControlInputs });

    //chart
    const chart = createChart(element, syncedSettings, controls);
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    //listing
    const listing = createTable(element, listingSettings);
    listing.init([]);
    chart.listing = listing;

    return chart;
}
