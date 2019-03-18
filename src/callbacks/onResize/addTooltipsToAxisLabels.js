export default function addTooltipsToAxisLabels() {
    this.svg
        .selectAll('.x.axis .axis-title')
        .append('title')
        .html(
            'Baseline visit(s):<br>&nbsp;&nbsp;&nbsp;&nbsp;' +
                this.config.x_params.visits.join('<br>&nbsp;&nbsp;&nbsp;&nbsp;')
        );
    this.svg
        .selectAll('.y.axis .axis-title')
        .append('title')
        .html(
            'Comparison visit(s):<br>&nbsp;&nbsp;&nbsp;&nbsp;' +
                this.config.y_params.visits.join('<br>&nbsp;&nbsp;&nbsp;&nbsp;')
        );
}
