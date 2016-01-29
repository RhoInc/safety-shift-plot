import { set } from 'd3';
import { dataOps } from 'webcharts';
import addBoxplot from './addBoxplot';

export default function onResize(){
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
}