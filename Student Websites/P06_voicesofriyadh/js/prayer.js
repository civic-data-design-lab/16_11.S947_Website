var width = 960,
    height = 600;
    
var inputValue = null;

var grabme = null;

var color = d3.scale.threshold()
    .domain([0.5, 1.5, 5.5, 10.5])
    .range(["none", "#a1d99b", "#74c476", "#31a354", "#006d2c"]);

var stroke = d3.scale.threshold()
    .domain([0.5])
    .range(["none", "black"]);


var albersProjection = d3.geo.albers()
    .scale( 100000 )
    .rotate([-46.67,0])
    .center( [.03,24.65] )
    .translate( [width/2,height/2] );


var path = d3.geo.path()
    .projection(albersProjection);

var svg = d3.select("#prayermap").append("svg")
    .attr("width", width)
    .attr("height", height);
    
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("font-family", "'Open Sans', sans-serif")
    .style("font-size", "12px")
    .style("z-index", "9999")
    .style("padding","5px")
    .style("border-radius", "5px")
    .style("text-transform","capitalize")
    .style("background-color", "rgba(255,255,255,.8")
    .style("visibility", "hidden");

queue()
    .defer(d3.json, "new_roads.json")
    .defer(d3.json, "hex_cat_wgs.json")
    .defer(d3.csv, "prayer_pivot.csv")
    .await(ready);

function ready(error, roads, hex, prayer) {
  if (error) throw error;

  
  var times = ["Mon at 12AM", "Mon at 01AM", "Mon at 02AM", "Mon at 03AM", "Mon at 04AM", "Mon at 05AM", "Mon at 06AM", "Mon at 07AM", "Mon at 08AM", "Mon at 09AM", "Mon at 10AM", "Mon at 11AM", "Mon at 12PM", "Mon at 01PM", "Mon at 02PM", "Mon at 03PM", "Mon at 04PM", "Mon at 05PM", "Mon at 06PM", "Mon at 07PM", "Mon at 08PM", "Mon at 09PM", "Mon at 10PM", "Mon at 11PM", "Tue at 12AM", "Tue at 01AM", "Tue at 02AM", "Tue at 03AM", "Tue at 04AM", "Tue at 05AM", "Tue at 06AM", "Tue at 07AM", "Tue at 08AM", "Tue at 09AM", "Tue at 10AM", "Tue at 11AM", "Tue at 12PM", "Tue at 01PM", "Tue at 02PM", "Tue at 03PM", "Tue at 04PM", "Tue at 05PM", "Tue at 06PM", "Tue at 07PM", "Tue at 08PM", "Tue at 09PM", "Tue at 10PM", "Tue at 11PM", "Wed at 12AM", "Wed at 01AM", "Wed at 02AM", "Wed at 03AM", "Wed at 04AM", "Wed at 05AM", "Wed at 06AM", "Wed at 07AM", "Wed at 08AM", "Wed at 09AM", "Wed at 10AM", "Wed at 11AM", "Wed at 12PM", "Wed at 01PM", "Wed at 02PM", "Wed at 03PM", "Wed at 04PM", "Wed at 05PM", "Wed at 06PM", "Wed at 07PM", "Wed at 08PM", "Wed at 09PM", "Wed at 10PM", "Wed at 11PM", "Thu at 12AM", "Thu at 01AM", "Thu at 02AM", "Thu at 03AM", "Thu at 04AM", "Thu at 05AM", "Thu at 06AM", "Thu at 07AM", "Thu at 08AM", "Thu at 09AM", "Thu at 10AM", "Thu at 11AM", "Thu at 12PM", "Thu at 01PM", "Thu at 02PM", "Thu at 03PM", "Thu at 04PM", "Thu at 05PM", "Thu at 06PM", "Thu at 07PM", "Thu at 08PM", "Thu at 09PM", "Thu at 10PM", "Thu at 11PM", "Fri at 12AM", "Fri at 01AM", "Fri at 02AM", "Fri at 03AM", "Fri at 04AM", "Fri at 05AM", "Fri at 06AM", "Fri at 07AM", "Fri at 08AM", "Fri at 09AM", "Fri at 10AM", "Fri at 11AM", "Fri at 12PM", "Fri at 01PM", "Fri at 02PM", "Fri at 03PM", "Fri at 04PM", "Fri at 05PM", "Fri at 06PM", "Fri at 07PM", "Fri at 08PM", "Fri at 09PM", "Fri at 10PM", "Fri at 11PM", "Sat at 12AM", "Sat at 01AM", "Sat at 02AM", "Sat at 03AM", "Sat at 04AM", "Sat at 05AM", "Sat at 06AM", "Sat at 07AM", "Sat at 08AM", "Sat at 09AM", "Sat at 10AM", "Sat at 11AM", "Sat at 12PM", "Sat at 01PM", "Sat at 02PM", "Sat at 03PM", "Sat at 04PM", "Sat at 05PM", "Sat at 06PM", "Sat at 07PM", "Sat at 08PM", "Sat at 09PM", "Sat at 10PM", "Sat at 11PM", "Sun at 12AM", "Sun at 01AM", "Sun at 02AM", "Sun at 03AM", "Sun at 04AM", "Sun at 05AM", "Sun at 06AM", "Sun at 07AM", "Sun at 08AM", "Sun at 09AM", "Sun at 10AM", "Sun at 11AM", "Sun at 12PM", "Sun at 01PM", "Sun at 02PM", "Sun at 03PM", "Sun at 04PM", "Sun at 05PM", "Sun at 06PM", "Sun at 07PM", "Sun at 08PM", "Sun at 09PM", "Sun at 10PM", "Sun at 11PM"];

    svg.append("g").selectAll( "path" )
        .data( topojson.feature(roads, roads.objects.new_roads).features)
        .enter()
        .append( "path" )
        .attr("class","roads")
        .attr( "stroke", "#ccc" )
        .attr("fill", "none")
        .attr( "d", path );
    
    svg.append("g")
        .selectAll("path")
          .data(topojson.feature(hex, hex.objects.hex_cat_wgs).features)
        .enter().append("path")
          .attr("d", path)
          .attr("class", "hexagon")
          .attr("stroke", function(d, i) { return stroke(prayer[i]["Mon at 12AM"]); })
          .attr("fill", function(d, i) { return color(prayer[i]["Mon at 12AM"]); })
          .attr("fill-opacity",.5)
          .attr("stroke-opacity", 1)
          .on("mouseover", function(d, i){
            tooltip.style("visibility", "visible").html("<strong>Prayer Tweets: </strong>" + prayer[i][inputValue]);
            d3.select(this).attr("fill-opacity",1).attr("stroke-width", 3);
            this.parentElement.appendChild(this);
            })
          .on("mouseout", function(d){
            tooltip.style("visibility","hidden");
            d3.select(this).attr("stroke-width", 1).attr("fill-opacity",.5);
            })
          .on("mousemove", function(d) {
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+20)+"px")
            });

    
    // when the input range changes update the value 
    d3.select("#timeslide").on("input", function() {
       update(+this.value);
    });
	
	grabme = prayer;
    
    /*
    // update the fill of each SVG of class "incident" with value
    function update(value) {
        document.getElementById("range").innerHTML=times[value];
        inputValue = times[value];
        d3.selectAll(".hexagon")
            .attr("fill", function(d, i) { return color(prayer[i][inputValue]); })
            .attr("stroke",function(d, i) { return stroke(prayer[i][inputValue]); });
    }
	*/


  
}