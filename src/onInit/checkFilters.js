import { set } from 'd3';

export default function checkFilters() {
    if (this.config.filters)
        this.config.filters = this.config.filters.filter(filter => {
            const variableExists = this.raw_data[0].hasOwnProperty(filter.value_col);
            const nLevels = set(this.raw_data.map(d => d[filter.value_col])).values().length;

            if (!variableExists)
                console.warn(
                    ` The [ ${filter.label} ] filter has been removed because the variable does not exist.`
                );
            else if (nLevels < 2)
                console.warn(
                    `The [ ${filter.label} ] filter has been removed because the variable has only one level.`
                );

            return variableExists && nLevels > 1;
        });
}
