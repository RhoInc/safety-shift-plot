The most straightforward way to customize the Safety Shift Plot is by using a configuration object whose properties describe the behavior and appearance of the chart. Since the Safety Shift Plot is a Webcharts `chart` object, many default Webcharts settings are defined in the [chartSettings.js file](https://github.com/RhoInc/safety-shift-plot/blob/master/src/configuration/chartSettings.js) as [described below](#webcharts-settings). Refer to the [Webcharts documentation](https://github.com/RhoInc/Webcharts/wiki/Chart-Configuration) for more details on these settings.

In addition to the standard Webcharts settings several custom settings not available in the base Webcharts library have been added to the Safety Shift Plot to facilitate data mapping and other custom functionality. These custom settings are described in detail below. All defaults can be overwritten by users.

# Renderer-specific settings
The sections below describe each safety-shift-plot setting as of version 2.1.2.

## settings.id_col
`string`

unique identifier variable name

**default:** `"USUBJID"`



## settings.visit_col
`string`

visit variable name

**default:** `"VISIT"`



## settings.visit_order_col
`string`

visit order variable name

**default:** `"VISITNUM"`



## settings.measure_col
`string`

measure variable name

**default:** `"TEST"`



## settings.unit_col
`string`

measure unit variable name

**default:** `"STRESU"`



## settings.value_col
`string`

result variable name

**default:** `"STRESN"`



## settings.start_value
`string`

value of measure to display initially

**default:** none



## settings.x_params
`object`

an object that defines the baseline value

### settings.x_params.visits
`array`

an array of visit values with which to define the baseline value

**default:** none

### settings.x_params.stat
`string`

the mathematical function with which to aggregate the baseline visit(s)

**default:** `"mean"`



## settings.y_params
`object`

an object that defines the comparison (or post-baseline) value

### settings.y_params.visits
`array`

an array of visit values with which to define the comparison value

**default:** none

### settings.y_params.stat
`string`

the mathematical function with which to aggregate the comparison visit(s)

**default:** `"mean"`



## settings.filters
`array`

an array of filter variables and associated metadata

**default:** none

### settings.filters[].value_col
`string`

Variable name

**default:** none

### settings.filters[].label
`string`

Variable label

**default:** none




# Webcharts settings
The objects below contain Webcharts settings for each display as of version 2.1.2 of the Safety Shift Plot.

## Chart
```
{
    "x": {
        "column": "shiftx",
        "type": "linear",
        "label": "Baseline Value",
        "format": "0.2f"
    },
    "y": {
        "column": "shifty",
        "type": "linear",
        "label": "Comparison Value",
        "behavior": "flex",
        "format": "0.2f"
    },
    "marks": [
        {
            "type": "circle",
            "per": [
                "key"
            ],
            "radius": 4,
            "attributes": {
                "stroke-width": 0.5,
                "fill-opacity": 0.8
            },
            "tooltip": "Subject ID: [key]\nBaseline: [shiftx]\nComparison: [shifty]\nChange: [chg]\nPercent Change: [pchg]"
        }
    ],
    "gridlines": "xy",
    "resizable": false,
    "margin": {
        "right": 25,
        "top": 25
    },
    "aspect": 1
}
```

## Listing
```
{
    "cols": [
        "key",
        "shiftx",
        "shifty",
        "chg",
        "pchg"
    ],
    "headers": [
        "Participant ID",
        "Baseline",
        "Comparison",
        "Change",
        "Percent Change"
    ],
    "searchable": false,
    "sortable": true,
    "pagination": false,
    "exportable": true
}
```