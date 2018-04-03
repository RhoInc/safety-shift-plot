import { set } from 'd3';

export default function getVisits() {
    this.visits = set(this.initial_data.map(d => d[this.config.time_col]))
        .values()
        .sort();
}
