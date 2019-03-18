import './util/polyfills';
import clone from './util/clone';
import deepMerge from './util/deepMerge';
import configuration from './configuration/index';
import defineLayout from './defineLayout';
import defineStyles from './defineStyles';
import { createControls, createChart, createTable } from 'webcharts';
import callbacks from './callbacks/index';

export default function safetyShiftPlot(element, settings) {
    //Merge user settings with default settings and sync.
    if (settings.time_col && !settings.visit_col) settings.visit_col = settings.time_col; // maintain backwards compatibility
    const mergedSettings = deepMerge(configuration.defaultSettings, settings, {
        arrayMerge: (destination, source) => source
    }); // merge user settings onto default settings
    const syncedSettings = configuration.syncSettings(mergedSettings); // sync properties within merged settings, e.g. data mappings.
    const syncedControlInputs = configuration.syncControlInputs(
        configuration.controlInputs(),
        syncedSettings
    ); //Sync merged settings with controls.

    //layout and styles
    defineLayout(element);
    defineStyles();

    //Define controls.
    const controls = createControls(
        document.querySelector(element).querySelector('#ssp-controls'),
        {
            location: 'top',
            inputs: syncedControlInputs
        }
    );

    //Define chart.
    const chart = createChart(
        document.querySelector(element).querySelector('#ssp-chart'),
        syncedSettings,
        controls
    );

    //Attach callbacks to chart.
    for (const callback in callbacks)
        chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);

    //Define listing.
    const listing = createTable(
        document.querySelector(element).querySelector('#ssp-listing'),
        configuration.listingSettings()
    );
    listing.init([]);
    chart.listing = listing;
    listing.chart = chart;

    return chart;
}
