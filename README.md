# Shift Plot for Clinical Trials

![alt tag](https://user-images.githubusercontent.com/31038805/33946258-4d8cc192-dfef-11e7-8049-f63ff351d826.gif)


## Overview

Safety Shift Plot is a JavaScript library, built using Webcharts ([1](https://github.com/RhoInc/Webcharts), [2](https://github.com/RhoInc/webcharts-wrapper-boilerplate)), that allows users to compare lab and vital sign values between two time points. A typical chart created with Saftey Shift Plot looks like the above chart when it is first loaded. It also features a self updating data listing below the chart that shows meta data about the selected points as pictured below. 



![alt tag](https://user-images.githubusercontent.com/31038805/33946248-46a9933c-dfef-11e7-8ac3-7f9ed6bcddf6.gif)



The chart uses the AdAM data standards by default, but can be customized to use any data set that is one record per measurement. Full details about chart configuration are [here](Configuration).

Users can:
* See the shift plot to compare lab and vital sign values between two time points
* See the number and percentage of participants displayed in the current view (updates with each user interaction)
* Change the measure of interest, and see an updated chart
* Change the baseline visit(s) of interest, and see an updated chart
* Change the comparison visit(s) of interest, and see an updated chart
* Click and drag across data points to show a linked listing of the underlying data
* Filter the shift plot for selected criteria, and see an updated chart (optional)


## Typical Usage

In the simplest case, using a dataset matching all default requirements, the chart can be created with a single line of code.

```javascript
safetyShiftPlot('#chartLocation', {}).init(data);
```

The code to load a comma-delimited data set and initialize the customized chart, with filters and simple data mappings, looks like this: 

```javascript
const settings = {
   time_col: 'VISIT'
   start_value: 'Potassium'
   x_params: {visits: ['Screening'], stat: 'min'}
   y_params: {visits: ['End of Study'], stat: 'max'}
   filters:[
      {value_col: 'SITEID', label: 'Site ID'},
      {value_col: 'SEX', label: 'Sex'},
      {value_col: 'RACE', label: 'Race'}
   ]
};

d3.csv('../data/ADBDS.csv', function(data) {
   safetyShiftPlot('#chartLocation', settings).init(data);
});
```

## Links 

- [Interactive Example](https://rhoinc.github.io/viz-library/examples/0008-safetyExplorer-default/safety-shift-plot/)
- [Configuration](https://github.com/RhoInc/safety-shift-plot/wiki/Configuration) 
- [API](https://github.com/RhoInc/safety-shift-plot/wiki/API)
- [Technical Documentation](https://github.com/RhoInc/safety-shift-plot/wiki/Technical-Documentation) 
- [Data Guidelines](https://github.com/RhoInc/safety-shift-plot/wiki/Data-Guidelines)

