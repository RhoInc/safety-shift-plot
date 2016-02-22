var bundle = (function (React,d3$1,webcharts) {
  'use strict';

  React = 'default' in React ? React['default'] : React;

  function stringAccessor(o, s, v) {
  	//adapted from http://jsfiddle.net/alnitak/hEsys/
      s = s.replace(/\[(\w+)\]/g, '.$1');
      s = s.replace(/^\./, '');           
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              if(i == n-1 && v !== undefined)
                  o[k] = v;
              o = o[k];
          } else {
              return;
          }
      }
      return o;
  }

  var binding = {
  	dataMappings : [
  		
  	],
  	chartProperties: [
  		{
  			source:"start_value",
  			target:"start_value"
  		}
  	]
  }

  const settings = {
      //Addition settings for this template
      id_col: "USUBJID",
      time_col: "VISITN",
      measure_col: "TEST",
      value_col: "STRESN",
      start_value: null,
      measure: '',
      x_params: {visits: null, stat: "mean"},
      y_params: {visits: null, stat: "mean"},
      //Standard webcharts settings
      x:{
          column:"shiftx",
          type:"linear",
          // behavior:"flex",
          label:"Baseline Value",
          format:"0.2f"
      },
      y:{
          column:"shifty",
          type:"linear",
          label:"End of Study Value",
          behavior:"flex",
          format:"0.2f"
      },
      marks:[
          {
              type:"circle",
              per:["key"],
              radius:4,
              attributes:{
                  'stroke-width': .5, 
                  'fill-opacity':0.8
              },
              tooltip:"Baseline: [shiftx], Comparison: [shifty]"
          }
      ],
      gridlines: 'xy',
      resizable:false,
      width: 600,
      margin:{right:25, top: 25},
      aspect: 1
  };

  const controlInputs = [
      {type: "dropdown", values: [], label: "Measure", option: "measure", require: true},
      {type: "dropdown", values: [], label: "Baseline visit(s)", option:"x_params_visits", require: true, multiple:true},
      {type: "dropdown", values: [], label: "Comparison visit(s)", option: "y_params_visits", require: true, multiple:true}
  ];

  const tableSettings = {
      cols: ["key","shiftx","shifty"],
      headers: ["ID","Start Value", "End Value"]
  };

  function preprocessData(rawData) {
  	var config = this.config;

      var nested = d3$1.nest()
          .key(function(d){return d[config.id_col]})
          .key(function(d){return d[config.time_col]})
          .key(function(d){return d[config.measure_col]})
          .rollup(function(r){
              var value = r[0][config.value_col]
              return {value: value, raw: r[0]}
          })
      .entries(rawData);

      function getMean(arr){ return d3$1.sum(arr)/arr.length; };

      function setVal(e, params){
          var visits = e.values.filter(function(f){return params.visits.indexOf(f.key) !== -1});
          var measures = visits.length ? d3$1.merge( 
              visits
              .map(function(m){return m.values.filter(function(f){return f.key === config.measure})
              .map(function(p){return +p.values.value}) }) 
              ) : [];

          var meas = null;
          var stat = measures && measures.length > 1 ? params.stat : "def";
          var something = {
              mean: getMean(measures),
              max: d3$1.max(measures),
              min: d3$1.min(measures),
              def: measures[0]
          };
          meas = something[stat]
          return meas;
      };

      function getXY(e){
          e.shiftx = +setVal(e, config.x_params);
          e.shifty = +setVal(e, config.y_params);
      };

      function getChange(e){
          e.shifty -= +e.shiftx;
      };

      //flatten out other columns specified for details
      function getOther(e){
          config.details.forEach(function(g){
              e[g.col] = e.values[0].values[0].values.raw[g.col]
          })
      }

      config.details = config.details && config.details.length ? config.details : [];

      if(config.color_by){
          var match = config.details.filter(function(f){return f.col === config.color_by});
          if(!match[0])
              config.details.push({col: config.color_by, label: config.color_by})
      }

      if(this.filters){
          this.filters.forEach(function(e){
              var match = config.details.filter(function(f){return f.col === e.col});
              if(!match[0])
                  config.details.push({col: e.col, label: e.col})
          })
      }

      var test_data = nested;
      test_data.forEach(getXY);
      if(config.change)
          test_data.forEach(getChange)
      if(config.details.length)
          test_data.forEach(getOther)

      return test_data
  }

  function onInit(){
      const rawData = this.raw_data.slice();
      var config = this.config;
      
      rawData.forEach(function(d){
          d[config.measure_col] = d[config.measure_col].trim()
      });
      //prep for brushing
      this.wrap.classed("brushable", true)

      //get list of numeric measures
      var measures = d3$1.set( rawData.map(function(d){return d[config.measure_col]}))
          .values()
          .filter(function(measure){
              var measureVals = rawData
                  .filter(function(d){return d[config.measure_col] === measure})
                  .map(function(d){return {val: d[config.value_col] } })

              return webcharts.dataOps.getValType(measureVals, "val") === "continuous"
          });
      this.config.measures = measures;
      this.config.measure = this.config.measure || measures[0];
      //get list of visits
      var visits = d3$1.set(
          rawData.map(function(d){ return +d[config.time_col] })
      )
      .values()
      .sort(webcharts.dataOps.naturalSorter);
      this.config.visits = visits;

      this.config.x_params.visits = this.config.x_params.visits || [visits[0]]; //set baseline visit
      this.config.y_params.visits = this.config.y_params.visits || visits.slice(1); //set last visit
      //create initial shift plot data
      this.super_raw_data = rawData;
      this.raw_data = preprocessData.call(this, rawData);

  };

  function onLayout(){
      //update the dropdown options
      this.controls.config.inputs.filter(f => f.option === "measure")[0].values = this.config.measures;

      var baselineFilter = this.controls.config.inputs.filter(f => f.option === "x_params_visits")[0];

      baselineFilter.values = this.config.visits;

      this.controls.config.inputs.filter(f => f.option === "y_params_visits")[0].values = this.config.visits;
      
      //force controls to be redrawn
      this.controls.layout();

      //customize measure controls
      var measureSelect = this.controls.wrap.selectAll(".control-group")
          .filter(f => f.option === "measure")
          .select("select");

      measureSelect.on("change", d => {
          const value = measureSelect.select("option:checked").property('text');
          this.config.measure = value;
          const nextRawData = preprocessData.call(this, this.super_raw_data);
          this.draw(nextRawData);
      });

      //customize baseline control
      var baselineSelect = this.controls.wrap.selectAll(".control-group")
          .filter(f => f.option === "x_params_visits")
          .select("select");
      //set start values
      baselineSelect.selectAll("option")
          .filter(f => this.config.x_params.visits.indexOf(f) > -1)
          .attr("selected","selected");
      baselineSelect.on("change", d => {
          const values = baselineSelect.selectAll("option:checked").data();
          this.config.x_params.visits = values;
          const nextRawData = preprocessData.call(this, this.super_raw_data);
          this.draw(nextRawData);
      });

      //customize comparison control
      var comparisonSelect = this.controls.wrap.selectAll(".control-group")
          .filter(f => f.option === "y_params_visits")
          .select("select");
      //set start values
      comparisonSelect.selectAll("option")
          .filter(f => this.config.y_params.visits.indexOf(f) > -1)
          .attr("selected","selected");

      comparisonSelect.on("change", d => {
          const values = comparisonSelect.selectAll("option:checked").data();
          this.config.y_params.visits = values;
          const nextRawData = preprocessData.call(this, this.super_raw_data);
          this.draw(nextRawData);
      });

      //add p for possible visits
      this.wrap.insert('p', 'svg').attr('class', 'possible-visits');
      
      //add p for the note
      this.wrap.append('p').attr('class', 'record-note').text('Click and drag to select points');
      
      //create empty table
      this.detailTable = webcharts.createTable(this.wrap.node(), tableSettings).init([]);
  }

  function onDraw(){

      
  }

  function addBoxplot(svg, results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor, format, horizontal){
      //set default orientation to "horizontal"
      var horizontal = horizontal==undefined ? true : horizontal 

      //make the results numeric and sort
      var results = results.map(function(d){return +d}).sort(d3.ascending)

      //set up scales
      var y = d3.scale.linear()
      .range([height, 0])

      var x = d3.scale.linear()
      .range([0, width])

      if(horizontal){
          y.domain(domain)
      }else{
          x.domain(domain)
      }

      var probs=[0.05,0.25,0.5,0.75,0.95];
      for(var i=0; i<probs.length; i++){
          probs[i]=d3.quantile(results, probs[i])
      }

      var boxplot = svg.append("g")
      .attr("class","boxplot")
      .datum({values:results, probs:probs})

      //set bar width variable
      var left=horizontal ? 0.5-boxPlotWidth/2 : null
      var right=horizontal ? 0.5+boxPlotWidth/2 : null
      var top = horizontal ? null : 0.5-boxPlotWidth/2 
      var bottom = horizontal ? null : 0.5+boxPlotWidth/2

      //draw rectangle from q1 to q3
      var box_x = horizontal ? x(0.5-boxPlotWidth/2) : x(probs[1])
      var box_width = horizontal ? x(0.5+boxPlotWidth/2)-x(0.5-boxPlotWidth/2) : x(probs[3])-x(probs[1])
      var box_y = horizontal ? y(probs[3]) : y(0.5+boxPlotWidth/2)
      var box_height = horizontal ? (-y(probs[3])+y(probs[1])) : y(0.5-boxPlotWidth/2)-y(0.5+boxPlotWidth/2)

      boxplot.append("rect")
      .attr("class", "boxplot fill")
      .attr("x", box_x)
      .attr("width", box_width)
      .attr("y", box_y)
      .attr("height", box_height)
      .style("fill", boxColor);

      //draw dividing lines at median, 95% and 5%
      var iS=[0,2,4];
      var iSclass=["","median",""];
      var iSColor=[boxColor, boxInsideColor, boxColor]
      for(var i=0; i<iS.length; i++){
          boxplot.append("line")
          .attr("class", "boxplot "+iSclass[i])
          .attr("x1", horizontal ? x(0.5-boxPlotWidth/2) : x(probs[iS[i]]))
          .attr("x2", horizontal ? x(0.5+boxPlotWidth/2) : x(probs[iS[i]]))
          .attr("y1", horizontal ? y(probs[iS[i]]) : y(0.5-boxPlotWidth/2))
          .attr("y2", horizontal ? y(probs[iS[i]]) : y(0.5+boxPlotWidth/2))
          .style("fill", iSColor[i])
          .style("stroke", iSColor[i])
      }

      //draw lines from 5% to 25% and from 75% to 95%
      var iS=[[0,1],[3,4]];
      for(var i=0; i<iS.length; i++){
          boxplot.append("line")
          .attr("class", "boxplot")
          .attr("x1", horizontal ? x(0.5) : x(probs[iS[i][0]]))
          .attr("x2", horizontal ? x(0.5) : x(probs[iS[i][1]]))
          .attr("y1", horizontal ? y(probs[iS[i][0]]) : y(0.5))
          .attr("y2", horizontal ? y(probs[iS[i][1]]) : y(0.5))
          .style("stroke", boxColor);
      }

      boxplot.append("circle")
      .attr("class", "boxplot mean")
      .attr("cx", horizontal ? x(0.5):x(d3.mean(results)))
      .attr("cy", horizontal ? y(d3.mean(results)):y(0.5))
      .attr("r", horizontal ? x(boxPlotWidth/3) : y(1-boxPlotWidth/3))
      .style("fill", boxInsideColor)
      .style("stroke", boxColor);

      boxplot.append("circle")
      .attr("class", "boxplot mean")
      .attr("cx", horizontal ? x(0.5):x(d3.mean(results)))
      .attr("cy", horizontal ? y(d3.mean(results)):y(0.5))
      .attr("r", horizontal ? x(boxPlotWidth/6) : y(1-boxPlotWidth/6))
      .style("fill", boxColor)
      .style("stroke", 'None');

      var formatx = format ? d3.format(format) : d3.format(".2f");

      boxplot.selectAll(".boxplot").append("title").text(function(d){
          return "N = "+d.values.length+"\n"+
          "Min = "+d3.min(d.values)+"\n"+
          "5th % = "+formatx(d3.quantile(d.values, 0.05))+"\n"+
          "Q1 = "+formatx(d3.quantile(d.values, 0.25))+"\n"+
          "Median = "+formatx(d3.median(d.values))+"\n"+
          "Q3 = "+formatx(d3.quantile(d.values, 0.75))+"\n"+
          "95th % = "+formatx(d3.quantile(d.values, 0.95))+"\n"+
          "Max = "+d3.max(d.values)+"\n"+
          "Mean = "+formatx(d3.mean(d.values))+"\n"+
          "StDev = "+formatx(d3.deviation(d.values));
      });
  }

  function onResize(){
      const decim = d3$1.format(".2f");
      // Draw box plots
      this.svg.selectAll("g.boxplot").remove()

      // Y-axis box plot
      var yValues = this.current_data.map(function(d){return d.values.y}) 
      var ybox = this.svg.append("g").attr("class","yMargin")
      addBoxplot(
          ybox,
          yValues, 
          this.plot_height, 
          1, 
          this.y_dom, 
          10, 
          "#bbb", 
          "white"
      )
      ybox.select("g.boxplot").attr("transform", "translate(" + (this.plot_width + this.config.margin.right/2) + ",0)")

      //X-axis box plot
      var xValues = this.current_data.map(function(d){return d.values.x}) 
      var xbox = this.svg.append("g").attr("class","xMargin")
      addBoxplot(
          xbox, //svg element
          xValues,  //values
          1, //height 
          this.plot_width, //width
          this.x_dom, //domain
          10, //box plot width 
          "#bbb", //box color
          "white", //detail color
          "0.2f", //format
          false // horizontal?
      )
      xbox.select("g.boxplot").attr("transform", "translate(0," + -(this.config.margin.top/2) + ")")
      
      //get list of visits
      var possibleVisits = d3$1.set( this.super_raw_data.filter(f => f[this.config.measure_col] === this.config.measure).map(d => d[this.config.time_col]) )
          .values()
          .sort(webcharts.dataOps.naturalSorter);
      
      this.wrap.select('.possible-visits').text(`This measure collected at visits ${possibleVisits.join(', ')}`);

      //Expand the domains a bit so that points on the edge are brushable
      this.x_dom[0] = this.x_dom[0] < 0 ?  this.x_dom[0]*1.01 : this.x_dom[0]*0.99; 
      this.x_dom[1] = this.x_dom[1] < 0 ?  this.x_dom[1]*0.99 : this.x_dom[1]*1.01; 
      this.y_dom[0] = this.y_dom[0] < 0 ?  this.y_dom[0]*1.01 : this.y_dom[0]*0.99; 
      this.y_dom[1] = this.y_dom[1] < 0 ?  this.y_dom[1]*0.99 : this.y_dom[1]*1.01;

      //reset view
      this.svg.selectAll("g.point").classed("selected",false)
          .select("circle").style("fill",this.config.colors[0]);


      //brushing
      function brushed(){
          var extent = brush.extent()
          var points = this.svg.selectAll("g.point").classed("selected",false);

          points.select("circle").attr("fill-opacity",0);

          var selected_points = points.filter(d => {
                  var cx = this.x(+d.values.x);
                  var cy = this.y(+d.values.y);
                  return extent[0][0] <= cx && cx <= extent[1][0]
                      && extent[0][1] <= cy && cy <= extent[1][1];
              })
              .classed("selected",true)
              .select("circle").attr("fill-opacity", this.config.marks[0].attributes['fill-opacity'] );

          //redraw the table with the new data
          var selected_data = selected_points.data().map(m => m.values.raw[0]);
          this.detailTable.draw(selected_data);

          //footnote
          this.wrap.select('.record-note').text("Details shown for " + selected_data.length + " selected points.")
          if(brush.empty()){
              this.wrap.select('.record-note').text("Click and drag to select points");
              points.select("circle").attr("fill-opacity", this.config.marks[0].attributes['fill-opacity'] );
          }
    
      };//brushed

      var brush = d3$1.svg.brush()
          .x(d3.scale.identity().domain(this.x.range()))
          .y(d3.scale.identity().domain(this.y.range()))
          .on("brush", brushed.bind(this));

      this.svg.call(brush);    

      this.svg.select("rect.extent")
          .attr({
              'shape-rendering': 'crispEdges',
              'stroke-width': 1,
              'stroke': '#ccc',
              'fill-opacity': 0.1
          }); 
  }

  function shiftPlot(element, settings$$){
  	//merge user's settings with defaults
  	let mergedSettings = Object.assign({}, settings, settings$$);
  	mergedSettings.measure = mergedSettings.start_value;
  	//create controls now
  	let controls = webcharts.createControls(element, {location: 'top', inputs: controlInputs});
  	//create chart
  	let chart = webcharts.createChart(element, mergedSettings, controls);
  	chart.on('init', onInit);
  	chart.on('layout', onLayout);
  	chart.on('draw', onDraw);
  	chart.on('resize', onResize);

  	return chart;
  }

  class ReactShiftPlot extends React.Component {
  	constructor(props) {
  		super(props);
  		this.state = {};
  	}
  	componentDidMount(prevProps, prevState){
  		if(this.props.data.length){
  			//manually clear div and redraw
  			d3$1.select(`.chart-div.id-${this.props.id}`).selectAll('*').remove();
  			let chart = shiftPlot(`.chart-div.id-${this.props.id}`, this.props.settings).init(this.props.data);
  		}
  	}
  	componentDidUpdate(prevProps, prevState){
  		if(this.props.data.length){
  			//manually clear div and redraw
  			d3$1.select(`.chart-div.id-${this.props.id}`).selectAll('*').remove();
  			let chart = shiftPlot(`.chart-div.id-${this.props.id}`, this.props.settings).init(this.props.data);
  		}
  	}
  	render(){
  		return (
  			React.createElement('div', {
  				key: this.props.id,
  				className: `chart-div id-${this.props.id} ${!(this.props.data.length) ? 'loading' : ''}`,
  				style: { minHeight: '1px', minWidth: '1px' }
  			})
  		);
  	}
  }

  ReactShiftPlot.defaultProps = {data: [], controlInputs: [], id: 'id'}

  function describeCode(props){
    var settings = this.createSettings(props);

    const code = `//uses d3 v.${d3$1.version}
//uses webcharts v.${webcharts.version}

var settings = ${JSON.stringify(settings, null, 2)};

var myChart = shiftPlot(dataElement, settings);

d3.csv(dataPath, function(error, csv) {
  myChart.init(data);
});
    `;
    return code;
  }

  class Renderer extends React.Component {
    constructor(props) {
      super(props);
      this.binding = binding;
      this.describeCode = describeCode.bind(this);
      this.state = {data: [], settings: {}, template: {}, loadMsg: 'Loading...'};
    }
    createSettings(props) {
      let shell = Object.assign({}, settings);

      binding.dataMappings.forEach(e => {
        let chartVal = stringAccessor(props.dataMappings, e.source);
        if(chartVal ){
          stringAccessor(shell, e.target, chartVal);
        }
        else{
          let defaultVal = stringAccessor(props.template.dataMappings, e.source+'.default');
          if(defaultVal && typeof defaultVal === 'string' && defaultVal.slice(0,3) === 'dm$'){
            var pointerVal = stringAccessor(props.dataMappings, defaultVal.slice(3)) || null;
            stringAccessor(shell, e.target, pointerVal);
          }
          else if(defaultVal){
            stringAccessor(shell, e.target, defaultVal);
          }
          else{
            stringAccessor(shell, e.target, null);
          }
        } 
      });
      binding.chartProperties.forEach(e => {
        let chartVal = stringAccessor(props.chartProperties, e.source);

        if(chartVal !== undefined){
          stringAccessor(shell, e.target, chartVal);
        }
        else{
          let defaultVal = stringAccessor(props.template.chartProperties, e.source+'.default');
          stringAccessor(shell, e.target, defaultVal);
        } 
      });

      return shell;
    }
    componentWillMount() {
      var settings = this.createSettings(this.props);
      this.setState({settings: settings});
    }
    componentWillReceiveProps(nextProps){
      var settings = this.createSettings(nextProps);
      this.setState({settings: settings});
    }
    render() {
      return (
        React.createElement(ReactShiftPlot, {
          id: this.props.id,
          settings: this.state.settings, 
          controlInputs: this.props.template.controls,
          data: this.props.data
        })
      );
    }
  }

  return Renderer;

}(React,d3,webCharts));