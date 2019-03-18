import { svg, scale, format } from 'd3';

export default function addBrush() {
    const decim = format('.2f');

    function brushed() {
        var extent = brush.extent();
        var points = this.svg.selectAll('g.point').classed('selected', false);

        points.select('circle').attr('fill-opacity', 0);

        var selected_points = points
            .filter(d => {
                var cx = this.x(+d.values.x);
                var cy = this.y(+d.values.y);
                return (
                    extent[0][0] <= cx &&
                    cx <= extent[1][0] &&
                    extent[0][1] <= cy &&
                    cy <= extent[1][1]
                );
            })
            .classed('selected', true)
            .select('circle')
            .attr('fill-opacity', this.config.marks[0].attributes['fill-opacity']);

        //redraw the table with the new data
        var selected_data = selected_points.data().map(m => m.values.raw[0]);
        selected_data.forEach(d => {
            d.shiftx = decim(d.shiftx);
            d.shifty = decim(d.shifty);
            d.chg = decim(d.chg);
        });
        this.listing.draw(selected_data);
        if (selected_data.length === 0) this.listing.wrap.style('display', 'none');
        else this.listing.wrap.style('display', 'block');

        //footnote
        this.wrap
            .select('.record-note')
            .style('text-align', 'right')
            .text('Details of ' + selected_data.length + ' selected points:');
        if (brush.empty()) {
            this.wrap
                .select('.record-note')
                .style('text-align', 'center')
                .text('Click and drag to select points.');
            points
                .select('circle')
                .attr('fill-opacity', this.config.marks[0].attributes['fill-opacity']);
        }
    } //brushed

    var brush = svg
        .brush()
        .x(scale.identity().domain(this.x.range()))
        .y(scale.identity().domain(this.y.range()))
        .on('brush', brushed.bind(this));

    this.svg.call(brush);

    this.svg.select('rect.extent').attr({
        'shape-rendering': 'crispEdges',
        'stroke-width': 1,
        stroke: '#ccc',
        'fill-opacity': 0.1
    });
}
