import preprocessData from '../util/preprocessData';
import { set } from 'd3';

export default function addFilters(chart) {
    chart.config.filters.forEach(filter => {
        //Capture distinct [filter.value_col] values.
        filter.values = set(chart.initial_data.map(d => d[filter.value_col])).values();
        filter.value = 'All';

        //Attach filter to the DOM.
        const controlGroup = chart.controls.wrap
            .append('div')
            .classed('control-group', true)
            .datum(filter);
        controlGroup
            .append('span')
            .classed('wc-control-label', true)
            .text(filter.label);
        const changer = controlGroup.append('select').classed('changer', true);

        //Attach distinct [filter.value_col] values as select options.
        changer
            .selectAll('option')
            .data(['All'].concat(filter.values))
            .enter()
            .append('option')
            .text(d => d);

        //Define dropdown event listener.
        changer.on('change', d => {
            //Set [filter.value] to dropdown selection.
            filter.value = changer.select('option:checked').property('text');

            //Filter raw measure data on all filter selections.
            chart.filteredData = chart.measureData.filter(di => {
                let filtered = false;
                chart.config.filters.forEach(
                    dii =>
                        (filtered =
                            filtered === false && dii.value !== 'All'
                                ? di[dii.value_col] !== dii.value
                                : filtered)
                );
                return !filtered;
            });

            //Preprocess filtered data and redraw chart.
            const preprocessedFilteredData = preprocessData.call(chart, chart.filteredData);
            chart.draw(preprocessedFilteredData);
        });
    });
}
