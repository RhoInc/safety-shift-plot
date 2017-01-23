import { set } from 'd3';
import { dataOps } from 'webcharts';
import preprocessData from './preprocessData';

export default function onInit(){
    let config = this.config;

  //Define raw data.
    this.allData = this.raw_data
    this.allData.forEach(d => {
        d[config.measure_col] = d[config.measure_col].trim();
    });

  //Get list of numeric measures.
    this.config.measures = set(
            this.allData
                .map(d => d[config.measure_col]))
        .values()
        .filter(measure => {
            const measureValues = this.allData
                .filter(d => d[config.measure_col] === measure)
                .map(d => { return {value: d[config.value_col]}; });

            return dataOps.getValType(measureValues, 'value') === 'continuous';
        });
    this.config.measure = this.config.measure || this.config.measures[0];

  //Get list of visits.
    this.config.visits = set(
            this.allData
                .map(d => d[config.time_col]))
        .values()
        .sort(dataOps.naturalSorter);
    this.config.x_params.visits = this.config.x_params.visits || [this.config.visits[0]]; // set baseline visit(s)
    this.config.y_params.visits = this.config.y_params.visits || this.config.visits.slice(1); // set comparison visit(s)

  //Define initial shift plot data.
    this.measureData = this.allData
        .filter(d => d[this.config.measure_col] === this.config.measure); // raw data for a specific measure
    this.filterdData = this.measureData; // filtered data for a specific measure data
    this.raw_data = preprocessData.call(this, this.measureData); // preprocessed measure data
    this.config.x.domain = d3.extent(this.raw_data.map(d => d.shiftx));
    this.config.y.domain = d3.extent(this.raw_data.map(d => d.shifty));
};
