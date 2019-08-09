import { svg, scale, format } from 'd3';
import brushing from './addBrush/brushing';
import brushEnd from './addBrush/brushEnd';

export default function addBrush() {
    var chart = this;
    chart.brush = svg
        .brush()
        .x(scale.identity().domain(this.x.range()))
        .y(scale.identity().domain(this.y.range()))
        .on('brush', brushing.bind(this))
        .on('brushend', brushEnd.bind(this));

    this.svg.call(chart.brush);

    this.svg.select('rect.extent').attr({
        'shape-rendering': 'crispEdges',
        'stroke-width': 1,
        stroke: '#ccc',
        'fill-opacity': 0.1
    });
}
