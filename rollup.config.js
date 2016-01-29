module.exports = {
  entry: './src/index.js',
  format: 'iife',
  globals: {
    webcharts: 'webCharts',
    d3: 'd3'
  },
  dest: 'dist/bundle.js',
  moduleName: 'bundle'
}; 