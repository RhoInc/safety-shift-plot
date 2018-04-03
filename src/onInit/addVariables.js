export default function addVariables() {
    this.initial_data.forEach(d => {
        d[this.config.measure_col] = d[this.config.measure_col].trim();
    });
}
