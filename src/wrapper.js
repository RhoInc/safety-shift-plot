import { createChart, createControls, createTable } from 'webcharts';
import { controlInputs, syncControlInputs, syncSettings } from './default-settings'
import config from './default-settings';
import onInit from './onInit';
import onLayout from './onLayout';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';
import './util/objectAssign';

export default function safetyShiftPlot(element, settings){
  //Merge user's settings with default settings.
    let mergedSettings = Object.assign({}, config, settings);

  //Sync properties within merged settings, e.g. data mappings.
    mergedSettings = syncSettings(mergedSettings);

  //Sync control inputs with merged settings.
    const syncedControlInputs = syncControlInputs(controlInputs, mergedSettings);
    const controls = createControls(element, {location: 'top', inputs: syncedControlInputs});

  //Create chart.
    let chart = createChart(element, mergedSettings, controls);
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
