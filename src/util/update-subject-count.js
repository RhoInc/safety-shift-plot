/*------------------------------------------------------------------------------------------------\
  Annotate number of participants based on current filters, number of participants in all, and
  the corresponding percentage.

  Inputs:

    chart - a webcharts chart object
    id_col - a column name in the raw data set (chart.raw_data) representing the observation of interest
    id_unit - a text string to label the units in the annotation (default = 'participants')
    selector - css selector for the annotation
\------------------------------------------------------------------------------------------------*/

export default function(chart, id_col, selector, id_unit) {
  //count the number of unique ids in the data set
    const totalObs = d3.set(chart.super_raw_data
        .map(d => d[id_col])).values().length;

  //count the number of unique ids in the current chart and calculate the percentage
    const currentObs = chart.filtered_data
        .filter(d =>
            chart.x.domain()[0] <= d.shiftx <= chart.x.domain()[1] &&
            chart.y.domain()[0] <= d.shifty <= chart.y.domain()[1])
        .length;

    const percentage = d3.format('0.1%')(currentObs / totalObs);

  //clear the annotation
    let annotation = d3.select(selector);
    annotation.selectAll('*').remove();

  //update the annotation
    const units = id_unit
        ? ' ' + id_unit
        : ' participant(s)';
    annotation
        .text(currentObs + ' of ' + totalObs + units +' shown (' + percentage + ')');
}
