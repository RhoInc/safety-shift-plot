import { set } from 'd3';

export default function getMeasures() {
    this.measures = set(this.initial_data.map(d => d[this.config.measure_col]))
        .values()
        .sort();
}
