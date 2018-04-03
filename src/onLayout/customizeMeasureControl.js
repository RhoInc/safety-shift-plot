import preprocessData from '../util/preprocessData';
import { extent } from 'd3';

export default function custmoizeMeasureControl() {
    const measureSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'measure')
        .select('select');
    measureSelect.on('change', () => {
        this.config.measure = measureSelect.select('option:checked').property('text');

        //Redefine raw and preprocessed measure data, x-domain, and y-domain.
        this.measureData = this.allData.filter(
            d => d[this.config.measure_col] === this.config.measure
        );
        this.raw_data = preprocessData.call(this, this.measureData);
        this.config.x.domain = extent(this.raw_data.map(d => d.shiftx));
        this.config.y.domain = extent(this.raw_data.map(d => d.shifty));

        //Redefine and preprocess filtered data and redraw chart.
        if (this.config.filters) {
            this.filteredData = this.measureData.filter(d => {
                let filtered = false;
                this.config.filters.forEach(
                    filter =>
                        (filtered =
                            filtered === false && filter.value !== 'All'
                                ? d[filter.value_col] !== filter.value
                                : filtered)
                );
                return !filtered;
            });
            const filteredPreprocessedData = preprocessData.call(this, this.filteredData);
            this.draw(filteredPreprocessedData);
        } else {
            this.filteredData = this.measureData;
            this.draw(this.raw_data);
        }
    });
}
