var fs = require('fs');
var rollup = require('rollup');
var config = require('./rollup.config');

rollup.rollup({
	entry: './cf-wrapper/Renderer.js'
})
.then( function ( bundle ) {
	var result = bundle.generate({
	  format: 'iife',
	  globals: {
	    webcharts: 'webCharts',
	    d3: 'd3',
	    react: 'React'
	  },
	  moduleName: 'bundle'
	});
	console.log('bundled!')
	fs.writeFileSync( './dist/react-bundle.js', result.code );
})
.catch( function (error) {
	console.log(error);
});
