import preprocessData from '../util/preprocessData';
import { extent } from 'd3';

export default function customizeComparisonControl() {
    const comparisonSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'y_params_visits')
        .select('select');
    comparisonSelect
        .selectAll('option')
        .filter(f => this.config.y_params.visits.indexOf(f) > -1)
        .attr('selected', 'selected');
    comparisonSelect.on('change', () => {
        this.config.y_params.visits = comparisonSelect.selectAll('option:checked').data();

        //Redefine preprocessed measure data and y-domain.
        this.raw_data = preprocessData.call(this, this.measureData);
        this.config.y.domain = extent(this.raw_data.map(d => d.shifty));

        //Preprocess filtered data and redraw chart.
        if (this.config.filters) {
            const filteredPreprocessedData = preprocessData.call(this, this.filteredData);
            this.draw(filteredPreprocessedData);
        } else this.draw(this.raw_data);
    });
}
