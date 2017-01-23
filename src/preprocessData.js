import { nest, sum, merge, min, max } from 'd3';

export default function preprocessData(rawData) {
    var config = this.config;

    var nested = nest()
        .key(function(d){return d[config.id_col]})
        .key(function(d){return d[config.time_col]})
        .key(function(d){return d[config.measure_col]})
        .rollup(function(r){
            var value = r[0][config.value_col]
            return {value: value, raw: r[0]}
        })
    .entries(rawData);

    function getMean(arr){ return sum(arr)/arr.length; };

    function setVal(e, params){
        var visits = e.values.filter(function(f){return params.visits.indexOf(f.key) !== -1});
        var measures = visits.length ? merge( 
            visits
            .map(function(m){return m.values.filter(function(f){return f.key === config.measure})
            .map(function(p){return +p.values.value}) }) 
            ) : [];

        var meas = null;
        var stat = measures && measures.length > 1 ? params.stat : "def";
        var something = {
            mean: getMean(measures),
            max: max(measures),
            min: min(measures),
            def: measures[0]
        };
        meas = something[stat]
        return meas;
    };

    function getXY(e){
        e.shiftx = +setVal(e, config.x_params);
        e.shifty = +setVal(e, config.y_params);
        e.chg = e.shifty - e.shiftx;
        e.pchg = d3.format('%')(e.chg/e.shiftx);
    };

    function getChange(e){
        e.shifty -= +e.shiftx;
    };

    //flatten out other columns specified for details
    function getOther(e){
        config.details.forEach(function(g){
            e[g.col] = e.values[0].values[0].values.raw[g.col]
        })
    }

    config.details = config.details && config.details.length ? config.details : [];

    if(config.color_by){
        var match = config.details.filter(function(f){return f.col === config.color_by});
        if(!match[0])
            config.details.push({col: config.color_by, label: config.color_by})
    }

    var test_data = nested;
    test_data.forEach(getXY);
    if(config.change)
        test_data.forEach(getChange)
    if(config.details.length)
        test_data.forEach(getOther)

    return test_data
}
