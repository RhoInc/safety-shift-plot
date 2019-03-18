The Safety Shift Plot accepts [JSON](https://en.wikipedia.org/wiki/JSON) data of the format returned by [`d3.csv()`](https://github.com/d3/d3-3.x-api-reference/blob/master/CSV.md). The renderer visualizes clinical medical signs data with **one row per participant per visit per medical sign** plus the required variables specified below.

## Data structure
one record per participant per visit per medical sign

## Data specification
required and optional variables:

| Setting | Default | Data Type | Description | Required? |
|:--------|:--------|:----------|:------------|:---------:|
|`id_col`|_USUBJID_|**character**|unique identifier variable name|**Yes**|
|`visit_col`|_VISIT_|**character**|visit variable name|**Yes**|
|`visit_order_col`|_VISITNUM_|**numeric**|visit order variable name||
|`measure_col`|_TEST_|**character**|measure variable name|**Yes**|
|`unit_col`|_STRESU_|**character**|measure unit variable name||
|`value_col`|_STRESN_|**numeric**|result variable name|**Yes**|
|`filters[]`||**either**|an array of filter variables and associated metadata||