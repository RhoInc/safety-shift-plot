export default function syncControlInputs(controlInputs, settings) {
    //Define filter objects.
    if (Array.isArray(settings.filters) && settings.filters.length)
        settings.filters = settings.filters.map(filter => {
            const filterObject = {
                value_col: filter.value_col || filter
            };
            filterObject.label = filter.label || filterObject.value_col;
            filterObject.type = 'subsetter';

            if (filter instanceof Object) Object.assign(filterObject, filter);

            return filterObject;
        });
    else delete settings.filters;

    return controlInputs;
}
