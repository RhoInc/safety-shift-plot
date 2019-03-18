export default function reset() {
    this.svg.selectAll('g.boxplot').remove();
    this.svg
        .selectAll('g.point')
        .classed('selected', false)
        .select('circle')
        .style('fill', this.config.colors[0]);
    this.wrap
        .select('.record-note')
        .style('text-align', 'center')
        .text('Click and drag to select points.');
    this.svg.select('line.identity').remove();
    this.listing.draw([]);
    this.listing.wrap.style('display', 'none');
}
