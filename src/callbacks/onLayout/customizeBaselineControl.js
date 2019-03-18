import preprocessData from '../../util/preprocessData';
import { extent } from 'd3';

export default function customizeBaselineControl() {
    const baselineSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'x_params_visits')
        .select('select');
    baselineSelect
        .selectAll('option')
        .filter(f => this.config.x_params.visits.indexOf(f) > -1)
        .attr('selected', 'selected');
    baselineSelect.on('change', () => {
        this.config.x_params.visits = baselineSelect.selectAll('option:checked').data();

        //Redefine preprocessed measure data and x-domain.
        this.raw_data = preprocessData.call(this, this.measureData);
        this.config.x.domain = extent(this.raw_data.map(d => d.shiftx));

        //Preprocess filtered data and redraw chart.
        if (this.config.filters) {
            const filteredPreprocessedData = preprocessData.call(this, this.filteredData);
            this.draw(filteredPreprocessedData);
        } else this.draw(this.raw_data);
    });
}
