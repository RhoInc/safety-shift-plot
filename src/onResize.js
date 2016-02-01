import { set, svg, scale, format } from 'd3';
import { dataOps } from 'webcharts';
import addBoxplot from './addBoxplot';

export default function onResize(){
    const decim = format(".2f");
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
    var possibleVisits = set( this.super_raw_data.filter(f => f[this.config.measure_col] === this.config.measure).map(d => d[this.config.time_col]) )
        .values()
        .sort(dataOps.naturalSorter);
    
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

    var brush = svg.brush()
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