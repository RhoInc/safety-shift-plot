import babel from 'rollup-plugin-babel';

module.exports = {
  moduleName: 'safetyShiftPlot',
  entry: './src/wrapper.js',
  dest: './build/safetyShiftPlot.js',
  format: 'umd',
  globals: {
    d3: 'd3',
    webcharts: 'webCharts'
  },
  external: (function() {
    var dependencies = require('./package.json').dependencies;

    return Object.keys(dependencies);
  }()),
  plugins: [
    babel(
      {
        "presets": [
          [
            "es2015",
            {
              "modules": false
            }
          ]
        ],
        "plugins": [
          "external-helpers"
        ],
        "exclude": "node_modules/**"
      })
  ]
};
