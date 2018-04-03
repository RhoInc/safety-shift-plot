import { set } from 'd3';

export default function listVisits() {
    var possibleVisits = set(
        this.initial_data
            .filter(f => f[this.config.measure_col] === this.config.measure)
            .map(d => d[this.config.visit_col])
    ).values();
    possibleVisits.sort((a, b) => this.visits.indexOf(a) - this.visits.indexOf(b));

    this.wrap
        .select('.possible-visits')
        .text(`${this.config.measure} is collected at these visits: ${possibleVisits.join(', ')}.`);
}
