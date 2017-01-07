import { createTable } from 'webcharts';
import { tableSettings } from './default-settings';
import transformData from './preprocessData';

export default function onLayout(){
    //update the dropdown options
    this.controls.config.inputs.filter(f => f.option === "measure")[0].values = this.config.measures;

    var baselineFilter = this.controls.config.inputs.filter(f => f.option === "x_params_visits")[0];

    baselineFilter.values = this.config.visits;

    this.controls.config.inputs.filter(f => f.option === "y_params_visits")[0].values = this.config.visits;
    
    //force controls to be redrawn
    this.controls.layout();

    //customize measure controls
    var measureSelect = this.controls.wrap.selectAll(".control-group")
        .filter(f => f.option === "measure")
        .select("select");

    measureSelect.on("change", d => {
        const value = measureSelect.select("option:checked").property('text');
        this.config.measure = value;
        const nextRawData = transformData.call(this, this.super_raw_data);
        this.config.x.domain = d3.extent(nextRawData.map(d => d.shiftx));
        this.config.y.domain = d3.extent(nextRawData.map(d => d.shifty));
        this.draw(nextRawData);
    });

    //customize baseline control
    var baselineSelect = this.controls.wrap.selectAll(".control-group")
        .filter(f => f.option === "x_params_visits")
        .select("select");
    //set start values
    baselineSelect.selectAll("option")
        .filter(f => this.config.x_params.visits.indexOf(f) > -1)
        .attr("selected","selected");
    baselineSelect.on("change", d => {
        const values = baselineSelect.selectAll("option:checked").data();
        this.config.x_params.visits = values;
        const nextRawData = transformData.call(this, this.super_raw_data);
        this.config.x.domain = d3.extent(nextRawData.map(d => d.shiftx));
        this.config.y.domain = d3.extent(nextRawData.map(d => d.shifty));
        this.draw(nextRawData);
    });

    //customize comparison control
    var comparisonSelect = this.controls.wrap.selectAll(".control-group")
        .filter(f => f.option === "y_params_visits")
        .select("select");
    //set start values
    comparisonSelect.selectAll("option")
        .filter(f => this.config.y_params.visits.indexOf(f) > -1)
        .attr("selected","selected");

    comparisonSelect.on("change", d => {
        const values = comparisonSelect.selectAll("option:checked").data();
        this.config.y_params.visits = values;
        const nextRawData = transformData.call(this, this.super_raw_data);
        this.config.x.domain = d3.extent(nextRawData.map(d => d.shiftx));
        this.config.y.domain = d3.extent(nextRawData.map(d => d.shifty));
        this.draw(nextRawData);
    });

    //add p for possible visits
    this.wrap.insert('p', 'svg').attr('class', 'possible-visits');
    
    //add p for the note
    this.wrap.append('p').attr('class', 'record-note').text('Click and drag to select points');
    
    //create empty table
    this.detailTable = createTable(this.wrap.node(), tableSettings).init([]);
}
