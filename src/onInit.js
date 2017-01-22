import { set } from 'd3';
import { dataOps } from 'webcharts';
import preprocessData from './preprocessData';

export default function onInit(){
    const rawData = this.raw_data.slice();
    var config = this.config;
    
    rawData.forEach(function(d){
        d[config.measure_col] = d[config.measure_col].trim()
    });
    //prep for brushing
    this.wrap.classed("brushable", true)

    //get list of numeric measures
    var measures = set( rawData.map(function(d){return d[config.measure_col]}))
        .values()
        .filter(function(measure){
            var measureVals = rawData
                .filter(function(d){return d[config.measure_col] === measure})
                .map(function(d){return {val: d[config.value_col] } })

            return dataOps.getValType(measureVals, "val") === "continuous"
        });
    this.config.measures = measures;
    this.config.measure = this.config.measure || measures[0];
    //get list of visits
    var visits = set(
        rawData.map(function(d){ return d[config.time_col] })
    )
    .values()
    .sort(dataOps.naturalSorter);
    this.config.visits = visits;

    this.config.x_params.visits = this.config.x_params.visits || [visits[0]]; //set baseline visit
    this.config.y_params.visits = this.config.y_params.visits || visits.slice(1); //set last visit
    //create initial shift plot data
    this.super_raw_data = rawData;
    this.raw_data = preprocessData.call(this, rawData);
    this.config.x.domain = d3.extent(this.raw_data.map(d => d.shiftx));
    this.config.y.domain = d3.extent(this.raw_data.map(d => d.shifty));
};
