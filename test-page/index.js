d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
    function(d) {
        return d;
    },
    function(data) {
        const ssp = safetyShiftPlot(
            '#container', // element
            {
            } // settings
        );
        ssp.init(data);
    }
)
