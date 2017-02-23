import { createTable } from 'webcharts';
import { tableSettings } from './default-settings';
import addFilters from './util/addFilters';
import preprocessData from './preprocessData';

export default function onLayout(){
  //Add header element in which to list visits at which measure is captured.
    this.wrap.append('p', 'svg').attr('class', 'possible-visits');
  //Designate chart container for brushing.
    this.wrap.classed('brushable', true)
  //Add footnote element.
    this.wrap.append('p').attr('class', 'record-note').text('Click and drag to select points');
  //Initialize detail table.
    this.detailTable = createTable(this.wrap.node(), tableSettings).init([]);

  //Update the dropdown options
    this.controls.config.inputs
        .filter(input => input.option === 'measure')[0].values = this.config.measures;
    this.controls.config.inputs
        .filter(input => input.option === 'x_params_visits')[0].values = this.config.visits;
    this.controls.config.inputs
        .filter(input => input.option === 'y_params_visits')[0].values = this.config.visits;
  //Force controls to be redrawn.
    this.controls.layout();

  //Customize measure control.
    const measureSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'measure')
        .select('select');
    measureSelect.on('change', () => {
        this.config.measure = measureSelect
            .select('option:checked')
            .property('text');

      //Redefine raw and preprocessed measure data, x-domain, and y-domain.
        this.measureData = this.allData
            .filter(d => d[this.config.measure_col] === this.config.measure);
        this.raw_data = preprocessData.call(this, this.measureData);
        this.config.x.domain = d3.extent(this.raw_data.map(d => d.shiftx));
        this.config.y.domain = d3.extent(this.raw_data.map(d => d.shifty));

      //Redefine and preprocess filtered data and redraw chart.
        if (this.config.filters) {
            this.filteredData = this.measureData
                .filter(d => {
                    let filtered = false;
                    this.config.filters
                        .forEach(filter => filtered = filtered === false && filter.value !== 'All'
                            ? d[filter.value_col] !== filter.value
                            : filtered);
                    return !filtered;
                });
            const filteredPreprocessedData = preprocessData.call(this, this.filteredData);
            this.draw(filteredPreprocessedData);
        } else {
            this.filteredData = this.measureData;
            this.draw(this.raw_data);
        }
    });

  //Customize baseline control.
    const baselineSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'x_params_visits')
        .select('select');
    baselineSelect
        .selectAll('option')
        .filter(f => this.config.x_params.visits.indexOf(f) > -1)
        .attr('selected', 'selected');
    baselineSelect.on('change', () => {
        this.config.x_params.visits = baselineSelect
            .selectAll('option:checked')
            .data();

      //Redefine preprocessed measure data and x-domain.
        this.raw_data = preprocessData.call(this, this.measureData);
        this.config.x.domain = d3.extent(this.raw_data.map(d => d.shiftx));

      //Preprocess filtered data and redraw chart.
        if (this.config.filters) {
            const filteredPreprocessedData = preprocessData.call(this, this.filteredData);
            this.draw(filteredPreprocessedData);
        } else
            this.draw(this.raw_data);
    });

  //Customize comparison control.
    const comparisonSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'y_params_visits')
        .select('select');
    comparisonSelect
        .selectAll('option')
        .filter(f => this.config.y_params.visits.indexOf(f) > -1)
        .attr('selected','selected');
    comparisonSelect.on('change', () => {
        this.config.y_params.visits = comparisonSelect
            .selectAll('option:checked')
            .data();

      //Redefine preprocessed measure data and y-domain.
        this.raw_data = preprocessData.call(this, this.measureData);
        this.config.y.domain = d3.extent(this.raw_data.map(d => d.shifty));

      //Preprocess filtered data and redraw chart.
        if (this.config.filters) {
            const filteredPreprocessedData = preprocessData.call(this, this.filteredData);
            this.draw(filteredPreprocessedData);
        } else
            this.draw(this.raw_data);
    });

  //Create custom filters.
    if (this.config.filters)
        addFilters(this);

  //Add element for participant counts.
    this.controls.wrap
        .append('em')
        .classed('annote', true)
        .style('display', 'block');
}
