d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
    function(d) {
        return d;
    },
    function(data) {
        const ssp = safetyShiftPlot(
            '#container', // element
            {
              filters:"ARM"
            } // settings
        );
        ssp.init(data);
        //quick test of participantSelected event
        ssp.wrap.on("participantsSelected",function(){
          console.log("Participant Selected Event:")
          console.log(d3.event.data)
        })

    }
)
