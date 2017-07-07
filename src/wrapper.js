import './util/objectAssign';

import defaultSettings, { syncSettings, controlInputs, syncControlInputs } from './defaultSettings';

import { createControls, createChart } from 'webcharts';
import onInit from './onInit';
import onLayout from './onLayout';
import onPreprocess from './onPreprocess';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';

export default function safetyShiftPlot(element, settings) {
    //Merge user's settings with default settings.
    const mergedSettings = Object.assign({}, defaultSettings, settings);

    //Sync properties within merged settings, e.g. data mappings.
    const syncedSettings = syncSettings(mergedSettings);

    //Sync control inputs with merged settings.
    const syncedControlInputs = syncControlInputs(controlInputs, syncedSettings);
    const controls = createControls(element, { location: 'top', inputs: syncedControlInputs });

    //Create chart.
    const chart = createChart(element, syncedSettings, controls);
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
