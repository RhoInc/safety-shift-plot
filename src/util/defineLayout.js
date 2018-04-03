import { select } from 'd3';

export default function defineLayout(element) {
    const container = select(element);
    container
        .append('div')
        .classed('ssp-component', true)
        .attr('id', 'ssp-controls');
    container
        .append('div')
        .classed('ssp-component', true)
        .attr('id', 'ssp-chart');
    container
        .append('div')
        .classed('ssp-component', true)
        .attr('id', 'ssp-listing');
}
