export default function updateControlInputs() {
    this.controls.config.inputs.find(input => input.option === 'measure').values = this.measures;
    this.controls.config.inputs.find(
        input => input.option === 'x_params_visits'
    ).values = this.visits;
    this.controls.config.inputs.find(
        input => input.option === 'y_params_visits'
    ).values = this.visits;
}
