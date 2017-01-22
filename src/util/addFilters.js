import preprocessData from '../preprocessData';

export default function addFilters(chart) {
    chart.config.filters.forEach(filter => {
      //Capture distinct [filter.value_col] values.
        filter.values = d3.set(chart.super_raw_data.map(d => d[filter.value_col])).values();
        filter.value = 'All';

      //Attach filter to the DOM.
        const controlGroup = chart.controls.wrap
            .append('div')
            .classed('control-group', true)
            .datum(filter);
        controlGroup
            .append('span')
            .classed('control-label', true)
            .text(filter.label);
        const changer = controlGroup
            .append('select')
            .classed('changer', true);

      //Attach distinct [filter.value_col] values as select options.
        changer
            .selectAll('option')
            .data(['All'].concat(filter.values))
            .enter()
            .append('option')
            .text(d => d);

      //Define dropdown event listener.
        changer
            .on('change', d => {
              //Set [filter.value] to dropdown selection.
                filter.value = changer.select('option:checked').property('text');

              //Filter raw data on all filter selections.
                chart.filteredData = chart.super_raw_data
                    .filter(di => {
                        let filtered = false;
                        chart.config.filters
                            .forEach(dii => {
                                filtered = filtered === false && dii.value !== 'All'
                                    ? di[dii.value_col] !== dii.value
                                    : filtered; });
                        return !filtered;
                    });

              //Derive chart data from filtered data.
                const nextRawData = preprocessData.call(chart, chart.filteredData);
                chart.draw(nextRawData);
            });
    });
}
