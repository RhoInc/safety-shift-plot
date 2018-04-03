import cleanData from './onInit/cleanData';
import checkFilters from './onInit/checkFilters';
import getMeasures from './onInit/getMeasures';
import getVisits from './onInit/getVisits';
import updateControlInputs from './onInit/updateControlInputs';
import preprocessData from './util/preprocessData';
import { extent } from 'd3';

export default function onInit() {
    // 1. Remove invalid data.
    cleanData.call(this);

    // 2a Check filters against data.
    checkFilters.call(this);

    // 2b Get list of measures.
    getMeasures.call(this);

    // 2c Get list of visits.
    getVisits.call(this);

    // 3. Update control inputs.
    updateControlInputs.call(this);

    let config = this.config;
    var chart = this;

    //Define raw data.
    this.initial_data = this.raw_data;
    this.initial_data.forEach(d => {
        d[config.measure_col] = d[config.measure_col].trim();
    });

    //Get list of numeric measures.
    this.config.measure = this.config.measure || this.measures[0];

    //Get list of visits.
    this.config.x_params.visits = this.config.x_params.visits || [this.visits[0]]; // set baseline visit(s)
    this.config.y_params.visits = this.config.y_params.visits || this.visits.slice(1); // set comparison visit(s)

    //Define initial shift plot data.
    this.measureData = this.initial_data.filter(d => d[this.config.measure_col] === this.config.measure); // raw data for a specific measure
    this.filteredData = this.measureData; // filtered data placeholder
    this.raw_data = preprocessData.call(this, this.measureData); // preprocessed measure data
    this.config.x.domain = extent(this.raw_data.map(d => d.shiftx));
    this.config.y.domain = extent(this.raw_data.map(d => d.shifty));
}
