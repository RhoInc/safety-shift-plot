import customizeMeasureControl from './onLayout/customizeMeasureControl';
import customizeBaselineControl from './onLayout/customizeBaselineControl';
import customizeComparisonControl from './onLayout/customizeComparisonControl';
import addFilters from './onLayout/addFilters';

export default function onLayout() {
    //Add footnote element.
    this.wrap
        .insert('p', ':first-child')
        .attr('class', 'record-note')
        .style('text-align', 'center')
        .style('font-weight', 'bold')
        .text('Click and drag to select points.');

    //Add header element in which to list visits at which measure is captured.
    this.wrap.append('p', 'svg').attr('class', 'possible-visits');

    //Designate chart container for brushing.
    this.wrap.classed('brushable', true);

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
