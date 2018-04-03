import cleanData from './onInit/cleanData';
import addVariables from './onInit/addVariables';
import checkFilters from './onInit/checkFilters';
import getMeasures from './onInit/getMeasures';
import getVisits from './onInit/getVisits';
import updateControlInputs from './onInit/updateControlInputs';
import preprocessData from './util/preprocessData';
import { extent } from 'd3';

export default function onInit() {
    // 1. Remove invalid data.
    cleanData.call(this);

    // 2. Add/edit variables.
    addVariables.call(this);

    // 3a Check filters against data.
    checkFilters.call(this);

    // 3b Get list of measures.
    getMeasures.call(this);

    // 3c Get list of visits.
    getVisits.call(this);

    // 4. Update control inputs.
    updateControlInputs.call(this);

    //Set initial measure.
    this.config.measure = this.config.measure || this.measures[0];

    //Set baseline and comparison visits.
    this.config.x_params.visits = this.config.x_params.visits || [this.visits[0]];
    this.config.y_params.visits = this.config.y_params.visits || this.visits.slice(1);

    //Filter raw data on initial measure and derive baseline/comparison data.
    this.measureData = this.initial_data.filter(
        d => d[this.config.measure_col] === this.config.measure
    );
    this.filteredData = this.measureData; // filtered data placeholder
    this.raw_data = preprocessData.call(this, this.measureData); // preprocessed measure data

    //Define initial domains.
    this.config.x.domain = extent(this.raw_data.map(d => d.shiftx));
    this.config.y.domain = extent(this.raw_data.map(d => d.shifty));
}
