import customizeMeasureControl from './onLayout/customizeMeasureControl';
import customizeBaselineControl from './onLayout/customizeBaselineControl';
import customizeComparisonControl from './onLayout/customizeComparisonControl';
import addFilters from './onLayout/addFilters';

export default function onLayout() {
    //Add header element in which to list visits at which measure is captured.
    this.wrap.append('p', 'svg').attr('class', 'possible-visits');

    //Designate chart container for brushing.
    this.wrap.classed('brushable', true);

    //Add footnote element.
    this.wrap
        .append('p')
        .attr('class', 'record-note')
        .text('Click and drag to select points');

    //Update the dropdown options
    this.controls.config.inputs.filter(
        input => input.option === 'measure'
    )[0].values = this.config.measures;
    this.controls.config.inputs.filter(
        input => input.option === 'x_params_visits'
    )[0].values = this.config.visits;
    this.controls.config.inputs.filter(
        input => input.option === 'y_params_visits'
    )[0].values = this.config.visits;
    //Force controls to be redrawn.
    this.controls.layout();

    //Customize measure, baseline, and comparison controls.
    customizeMeasureControl.call(this);
    customizeBaselineControl.call(this);
    customizeComparisonControl.call(this);

    //Create custom filters.
    if (this.config.filters) addFilters(this);

    //Add element for participant counts.
    this.controls.wrap
        .append('em')
        .classed('annote', true)
        .style('display', 'block');
}
