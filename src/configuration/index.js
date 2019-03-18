import rendererSettings from './rendererSettings';
import chartSettings from './chartSettings';
import listingSettings from './listingSettings';
import syncSettings from './syncSettings';
import controlInputs from './controlInputs';
import syncControlInputs from './syncControlInputs';

export default {
    rendererSettings,
    controlInputs,
    chartSettings,
    listingSettings,
    defaultSettings: Object.assign({}, rendererSettings(), chartSettings()),
    syncSettings,
    syncControlInputs
};
