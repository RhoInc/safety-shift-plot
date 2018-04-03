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

//layout and styles
import defineLayout from './util/defineLayout';
import defineStyles from './util/defineStyles';

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
    if (settings.time_col && !settings.visit_col) settings.visit_col = settings.time_col; // prevent breaking backwards compatibility
    const mergedSettings = Object.assign({}, clone(defaultSettings), clone(settings));
    const syncedSettings = syncSettings(clone(mergedSettings));
    const syncedControlInputs = syncControlInputs(clone(controlInputs), syncedSettings);

    //layout and styles
    defineLayout(element);
    defineStyles();

    //controls
    const controls = createControls(
        document.querySelector(element).querySelector('#ssp-controls'),
        {
            location: 'top',
            inputs: syncedControlInputs
        }
    );

    //chart
    const chart = createChart(
        document.querySelector(element).querySelector('#ssp-chart'),
        syncedSettings,
        controls
    );
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    //listing
    const listing = createTable(
        document.querySelector(element).querySelector('#ssp-listing'),
        listingSettings
    );
    listing.init([]);
    chart.listing = listing;

    return chart;
}
