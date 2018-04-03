import addBoxPlots from './onResize/addBoxPlots';
import listVisits from './onResize/listVisits';
import addBrush from './onResize/addBrush';
import addEqualityLine from './onResize/addEqualityLine';
import addTooltipsToAxisLabels from './onResize/addTooltipsToAxisLabels';

export default function onResize() {
    //Add univariate box plots to top and right margins.
    addBoxPlots.call(this);

    //Annotate list of visits at which measure has results.
    listVisits.call(this);

    //Expand the domains a bit so that points on the edge are brushable
    this.x_dom[0] = this.x_dom[0] < 0 ? this.x_dom[0] * 1.01 : this.x_dom[0] * 0.99;
    this.x_dom[1] = this.x_dom[1] < 0 ? this.x_dom[1] * 0.99 : this.x_dom[1] * 1.01;
    this.y_dom[0] = this.y_dom[0] < 0 ? this.y_dom[0] * 1.01 : this.y_dom[0] * 0.99;
    this.y_dom[1] = this.y_dom[1] < 0 ? this.y_dom[1] * 0.99 : this.y_dom[1] * 1.01;

    //Add brush functionality.
    addBrush.call(this);

    //add an equality line
    addEqualityLine.call(this);

    //Add tooltip to axis labels listing selected visits.
    addTooltipsToAxisLabels.call(this);
}
