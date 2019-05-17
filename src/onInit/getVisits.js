import { set } from 'd3';

export default function getVisits() {
    if (
        this.config.visit_order_col &&
        this.initial_data[0].hasOwnProperty(this.config.visit_order_col)
    )
        this.visits = set(
            this.initial_data.map(
                d => d[this.config.visit_col] + '||' + d[this.config.visit_order_col]
            )
        )
            .values()
            .sort((a, b) => {
                const aSplit = a.split('||');
                const aVisit = aSplit[0];
                const aOrder = aSplit[1];
                const bSplit = b.split('||');
                const bVisit = bSplit[0];
                const bOrder = bSplit[1];
                const diff = aOrder - bOrder;
                return diff
                    ? diff
                    : aOrder < bOrder
                    ? -1
                    : aOrder > bOrder
                    ? 1
                    : aVisit < bVisit
                    ? -1
                    : 1;
            })
            .map(visit => visit.split('||')[0]);
    else
        this.visits = set(this.initial_data.map(d => d[this.config.visit_col]))
            .values()
            .sort();
}
