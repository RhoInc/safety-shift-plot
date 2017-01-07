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

  //Create custom filters.
    this.config.filters.forEach(filter => {
      //Capture distinct [filter.value_col] values.
        filter.values = d3.set(this.super_raw_data.map(d => d[filter.value_col])).values();
        filter.value = 'All';

      //Attach filter to the DOM.
        const controlGroup = this.controls.wrap
            .append('div')
            .classed('control-group', true)
            .datum(filter);
        controlGroup
            .append('span')
            .classed('control-label', true)
            .text(filter.label);
        const changer = controlGroup
            .append('select')
            .classed('changer', true);

      //Attach distinct [filter.value_col] values as select options.
        changer
            .selectAll('option')
            .data(['All'].concat(filter.values))
            .enter()
            .append('option')
            .text(d => d);

      //Define dropdown event listener.
        changer
            .on('change', d => {
              //Set [filter.value] to dropdown selection.
                filter.value = changer.select('option:checked').property('text');

              //Filter raw data on all filter selections.
                this.filteredData = this.super_raw_data
                    .filter(di => {
                        let filtered = false;
                        this.config.filters
                            .forEach(dii => {
                                filtered = filtered === false && dii.value !== 'All'
                                    ? di[dii.value_col] !== dii.value
                                    : filtered; });
                        return !filtered;
                    });

              //Derive chart data from filtered data.
                const nextRawData = transformData.call(this, this.filteredData);
                this.draw(nextRawData);
            });
    });

    //customize measure controls
    var measureSelect = this.controls.wrap.selectAll(".control-group")
        .filter(f => f.option === "measure")
        .select("select");

    measureSelect.on("change", d => {
        const value = measureSelect.select("option:checked").property('text');
        this.config.measure = value;
        const nextRawData = transformData.call(this, this.super_raw_data);
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
        this.draw(nextRawData);
    });

    //add p for possible visits
    this.wrap.insert('p', 'svg').attr('class', 'possible-visits');
    
    //add p for the note
    this.wrap.append('p').attr('class', 'record-note').text('Click and drag to select points');
    
    //create empty table
    this.detailTable = createTable(this.wrap.node(), tableSettings).init([]);
}
