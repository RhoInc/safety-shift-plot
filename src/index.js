import { createChart, createControls, createTable } from 'webcharts';
import {  controlInputs, tableSettings } from './default-settings'
import config from './default-settings';
import onInit from './onInit';
import onLayout from './onLayout';
import transformData from './preprocessData';
import onDraw from './onDraw';
import onResize from './onResize';

export default function shiftPlot(element, settings){
	//merge user's settings with defaults
	let mergedSettings = Object.assign({}, config, settings);
	mergedSettings.measure = mergedSettings.start_value;
	//create controls now
	let controls = createControls(element, {location: 'top', inputs: controlInputs});
	//create chart
	let chart = createChart(element, mergedSettings, controls);
	chart.on('init', onInit);
	chart.on('layout', onLayout);
	chart.on('draw', onDraw);
	chart.on('resize', onResize);

	return chart;
}