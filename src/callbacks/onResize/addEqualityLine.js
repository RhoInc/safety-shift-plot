import { min, max } from 'd3';

export default function addEqualityLine() {
    var overallMin = min([this.x.domain()[0], this.y.domain()[0]]);
    var overallMax = max([this.x.domain()[1], this.y.domain()[1]]);

    this.svg
        .append('line')
        .attr('x1', this.x(overallMin))
        .attr('x2', this.x(overallMax))
        .attr('y1', this.y(overallMin))
        .attr('y2', this.y(overallMax))
        .attr('stroke', 'black')
        .attr('clip-path', 'URL(#1)')
        .attr('class', 'identity');
}
