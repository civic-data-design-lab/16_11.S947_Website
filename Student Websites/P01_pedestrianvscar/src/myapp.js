window.jQuery = window.$ =  require("../js/jquery");

window.d3 = require("../js/d3.v3.min");
window.topojson = require("../js/topojson.min");
window.queue = require("../js/queue.min");
require("../js/bootstrap.min");
require("../js/jquery.easing.min");
require("../js/jquery.fittext");
require("../js/wow.min");

$(function(){


    var prince_abdul = [46.69, 24.699]
    var al_futah = [46.715, 24.647]
    var kingdom_center = [46.675, 24.712]
    var king_saud = [46.624, 24.724]
    var jabal_park = [46.747, 24.684]
    var faisal_stadium = [46.739, 24.663]
    var ad_dirah = [46.717, 24.63]

    var width = window.innerWidth;
        height = window.innerHeight;

    var projection = d3.geo.mercator()
        .scale( 120000 )
        .rotate( [-46.7166,0] )
        .center( [0, 24.6333] )
        .translate( [width/2,height/2] );

    queue()
      .defer(d3.json, 'data/topojson/riyadh_edges_congestion_s.json')
      .defer(d3.json, 'data/topojson/kernel_am.json')
      .defer(d3.json, 'data/topojson/kernel_md.json')
      .defer(d3.json, 'data/topojson/kernel_pm.json')
      .defer(d3.json, 'data/topojson/kernel_rd.json')
      .defer(d3.json, 'data/topojson/td_am.json')
      .defer(d3.json, 'data/topojson/td_md.json')
      .defer(d3.json, 'data/topojson/td_pm.json')
      .defer(d3.json, 'data/topojson/td_rd.json')
      .defer(d3.json, 'data/topojson/t_am_s.json')
      .await(makeMyMap);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("body").append("svg")
        .append("g");


    var g = svg.append("g");

    var geoPath = d3.geo.path()
        .projection( projection )
        .pointRadius(function(d) { return .25; });

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    var zoom = d3.behavior.zoom()
	    .size([width, height])
	    .on("zoom", zoomed);

    function zoomed() {
      g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    svg
        .call(zoom)
        .call(zoom.event);

    function makeMyMap(error, edges_cong_json, kernel_am, kernel_md, kernel_pm, kernel_rd, tweet_am, tweet_md, tweet_pm, tweet_rd, t_am) {


    var am_add = edges_cong_json.objects.riyadh_edges_congestion.geometries;
    var new_array = [];

    var arrayLength = am_add.length;
        for (var i = 0; i < arrayLength; i++) {
          new_array.push(am_add[i].properties.am_TTI);
    };

    var scale = d3.scale.quantile()
       .domain(new_array)
       .range([0, .1, .2, .4, .8, 1.6]);

	var scale,
	    translate,
	    visibleArea, // minimum area threshold for points inside viewport
	    invisibleArea; // minimum area threshold for points outside viewport

	var simplify = d3.geo.transform({
	  point: function(x, y, z) {
	    if (z < visibleArea) return;
	    x = x * scale + translate[0];
	    y = y * scale + translate[1];
	    if (x >= -10 && x <= width + 10 && y >= -10 && y <= height + 10 || z >= invisibleArea) this.stream.point(x, y);
	  }
	});


//plot twitter density am
  g.selectAll( "path1" )
      .data(topojson.feature(tweet_am, tweet_am.objects.td_am).features)
      .enter()
      .append( "path" )
      .attr('class','tweet_fade am')
      .style( "fill", "#007acc")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "visible");

//plot twitter density md
  g.selectAll( "path2" )
      .data( topojson.feature(tweet_md, tweet_md.objects.td_md).features )
      .enter()
      .append( "path" )
      .attr('class','tweet_fade md')
      .style( "fill", "#007acc")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "hidden");

//plot twitter density pm 
  g.selectAll( "path3" )
      .data( topojson.feature(tweet_pm, tweet_pm.objects.td_pm).features )
      .enter()
      .append( "path" )
      .attr('class','tweet_fade pm')
      .style( "fill", "#007acc")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "hidden");

//plot twitter density rd
  g.selectAll( "path4" )
      .data( topojson.feature(tweet_rd, tweet_rd.objects.td_rd).features )
      .enter()
      .append( "path" )
      .attr('class','tweet_fade rd')
      .style( "fill", "#007acc")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "hidden");

//plot congestions density am
  g.selectAll( "path5" )
      .data( topojson.feature(kernel_am, kernel_am.objects.kernel_am).features )
      .enter()
      .append( "path" )
      .attr('class', 'cong_fade am')
      .style( "fill", "red")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "visible");

//plot congestions density md
  g.selectAll( "path6" )
      .data( topojson.feature(kernel_md, kernel_md.objects.kernel_md).features )
      .enter()
      .append( "path" )
      .attr('class', 'cong_fade md')
      .style( "fill", "red")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "hidden");

  //plot congestions density pm
  g.selectAll( "path7" )
      .data( topojson.feature(kernel_pm, kernel_pm.objects.kernel_pm).features )
      .enter()
      .append( "path" )
      .attr('class', 'cong_fade pm')
      .style( "fill", "red")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "hidden");

  //plot congestions density rd
  g.selectAll( "path8" )
      .data( topojson.feature(kernel_rd, kernel_rd.objects.kernel_rd).features )
      .enter()
      .append( "path" )
      .attr('class', 'cong_fade rd')
      .style( "fill", "red")
      .attr( "d", geoPath )
      .style( "fill-opacity", function(d){
          return d.properties.GRIDCODE / 8;
      })
      .style( "opacity", 1)
      .attr("visibility", "hidden");

// plot street grid congestion
  g.selectAll( "path9" )
      .data( topojson.feature(edges_cong_json, edges_cong_json.objects.riyadh_edges_congestion).features  )
      .enter()
      .append( "path" )
      .attr('class','incident')
      .style( "fill", "transparent" )
      .style( "stroke", "#fff")
      .attr( "d", geoPath )
      .style( "stroke-linecap", "round")
      .style( "stroke-width", function(d){
          return Math.log(d.properties.am_TTI * 1.2);
      });

// plot tweet points am
  g.selectAll( "path10" )
      .data( topojson.feature(t_am, t_am.objects.t_am).features )
      .enter()
      .append( "path" )
      .attr('class','incident2 am')
      .style( "fill", "transparent" )
      .style( "stroke-width", "0")
      .attr( "d", geoPath );





  d3.select(self.frameElement).style("height", height + "px");

//fade in/out for congestion density
  ui_map = d3.map()
  ui_map.set('toggled', 'false');
  d3.select("#cmn-toggle-1").on("click", function() {
    if (ui_map.get('toggled') == 'false') {
      var selected = d3.selectAll(".cong_fade");

      var duration = 250

      levels = [1,2,3,4,5,6,7,8,9,10];
      levels.forEach(function(each){
        var filtered = selected.filter(function(d){
          return d.properties.GRIDCODE == each;
        })
        filtered.transition()
          .duration(each * duration)
          .style("opacity", function(d){
            return 0;
        })
      })
      ui_map.set('toggled', 'true')
      } 
    else {
      var selected = d3.selectAll(".cong_fade");

      var duration = 30

      levels = [1,2,3,4,5,6,7,8,9,10]
      levels.forEach(function(each){
        var filtered = selected.filter(function(d){
          return d.properties.GRIDCODE == each;
        })
        filtered.transition()
          .duration((11 - each) * duration * (11 - each))
          .style("opacity", function(d){
            return 1;
        })
      })
      ui_map.set('toggled', 'false')
      } 
  });

// fade in/out for twitter density
  ui_map2 = d3.map()
  ui_map2.set('toggled', 'false');
  d3.select("#cmn-toggle-2").on("click", function() {
    if (ui_map2.get('toggled') == 'false') {
      var selected2 = d3.selectAll(".tweet_fade");

      var duration2 = 250

      levels2 = [1,2,3,4,5,6,7,8,9,10]
      levels2.forEach(function(each2){
        var filtered2 = selected2.filter(function(d){
          return d.properties.GRIDCODE == each2;
        })
        filtered2.transition()
          .duration(each2 * duration2)
          .style("opacity", function(d){
            return 0;
        })
      })
      ui_map2.set('toggled', 'true')
      } 
    else {
      var selected2 = d3.selectAll(".tweet_fade");

      var duration2 = 30

      levels2 = [1,2,3,4,5,6,7,8,9,10]
      levels2.forEach(function(each2){
        var filtered2 = selected2.filter(function(d){
          return d.properties.GRIDCODE == each2;
        })
        filtered2.transition()
          .duration((11 - each2) * duration2 * (11 - each2))
          .style("opacity", function(d){
            return 1;
        })
      })
      ui_map2.set('toggled', 'false')
      } 
  });

  // fade in/out for street grid
  ui_map3 = d3.map()
  ui_map3.set('toggled', 'false');
  d3.select("#cmn-toggle-3").on("click", function() {
    if (ui_map3.get('toggled') == 'false') {
      var selected3 = d3.selectAll(".incident");
      selected3.transition()
          .duration(0)
          .style("stroke", function(d){
            return "#black";
          })
      ui_map3.set('toggled', 'true')
      } 
    else {
      var selected3 = d3.selectAll(".incident");
      selected3.transition()
          .duration(0)
          .style("stroke", function(d){
            return "#fff";
          })
      ui_map3.set('toggled', 'false')
      } 
  });

  // fade in/out for street grid
  ui_map4 = d3.map()
  ui_map4.set('toggled', 'false');
  d3.select("#cmn-toggle-4").on("click", function() {
    if (ui_map4.get('toggled') == 'false') {
      var selected4 = d3.selectAll(".incident2");
      selected4.transition()
          .duration(0)
          .style("fill", function(d){
            return "black";
          })
      ui_map4.set('toggled', 'true')
      } 
    else {
      var selected4 = d3.selectAll(".incident2");
      selected4.transition()
          .duration(0)
          .style("fill", function(d){
            return "transparent";
          })
      ui_map4.set('toggled', 'false')
      } 
  });

    var inputValue = null;
    var month = ["7am - 10am","10am - 4pm","4pm - 7pm","7pm - 7am"];

    // when the input range changes update the value 
    d3.select("#timeslide").on("input", function() {
        update(+this.value);
    });

    // update the fill of each SVG of class "incident" with value
    function update(value) {
        document.getElementById("range").innerHTML=month[value];
        inputValue = month[value];
        d3.selectAll(".incident").each(function(each){
            d3.select(this).style("stroke-width", function(d){
            if (inputValue == "7am - 10am") {
                return Math.log(d.properties.am_TTI * 1.2);
            }
            else if (inputValue == "10am - 4pm") {
                return Math.log(d.properties.md_TTI * 1.2);
            }
            else if (inputValue == "4pm - 7pm") {
                return Math.log(d.properties.pm_TTI * 1.2);
            }
            else {
                return Math.log(d.properties.rd_TTI *1.2);
            };
        });
        })
        d3.selectAll(".am").each(function(each2){
            d3.select(this).attr("visibility", function(d){
            if (inputValue == "7am - 10am") {
                return "visible";
            }
            else if (inputValue == "10am - 4pm") {
                return "hidden";
            }
            else if (inputValue == "4pm - 7pm") {
                return "hidden";
            }
            else {
                return "hidden";
            };
        });
        })
        d3.selectAll(".md").each(function(each3){
            d3.select(this).attr("visibility", function(d){
            if (inputValue == "7am - 10am") {
                return "hidden";
            }
            else if (inputValue == "10am - 4pm") {
                return "visible";
            }
            else if (inputValue == "4pm - 7pm") {
                return "hidden";
            }
            else {
                return "hidden";
            };
        });
        })
        d3.selectAll(".pm").each(function(each3){
            d3.select(this).attr("visibility", function(d){
            if (inputValue == "7am - 10am") {
                return "hidden";
            }
            else if (inputValue == "10am - 4pm") {
                return "hidden";
            }
            else if (inputValue == "4pm - 7pm") {
                return "visible";
            }
            else {
                return "hidden";
            };
        });
        })
        d3.selectAll(".rd").each(function(each3){
            d3.select(this).attr("visibility", function(d){
            if (inputValue == "7am - 10am") {
                return "hidden";
            }
            else if (inputValue == "10am - 4pm") {
                return "hidden";
            }
            else if (inputValue == "4pm - 7pm") {
                return "hidden";
            }
            else {
                return "visible";
            };
        });
        })
    }



    }


	function resize(d){
        var width = window.innerWidth;
      	var	height = window.innerHeight;
      	var node = document.getElementById("map-controls-id");
      	var map_node = document.getElementById("map-id");
      	var rect = map_node.getBoundingClientRect();
      	node.style.position="absolute";
      	node.style.left="0px";
      	node.style.top = height - 100 + "px";
      	node.style.display = "block";
    };


	function zoomTo(location, scale) {
	  var point = projection(location);
	  return zoom
	      .translate([width / 2 - point[0] * scale, height / 2 - point[1] * scale])
	      .scale(scale);
	}



	function location1(){
	  	var t = d3.select("svg");
	  	t.transition()
	    	.call(zoomTo(prince_abdul, 10).event)
	    	.duration(60 * 2000 / 89 * 2);
	};

	function location2(){
	  var t = d3.select("svg");
	  t.transition()
	    .call(zoomTo(al_futah, 12).event)
	    .duration(60 * 2000 / 89 * 2);
	};

	function location3(){
	  var t = d3.select("svg");
	  t.transition()
	    .call(zoomTo(kingdom_center, 14).event)
	    .duration(60 * 2000 / 89 * 2);
	};

	function location4(){
	  var t = d3.select("svg");
	  t.transition()
	    .call(zoomTo(king_saud, 8).event)
	    .duration(60 * 2000 / 89 * 2);
	};

	function location5(){
	  var t = d3.select("svg");
	  t.transition()
	    .call(zoomTo(jabal_park, 14).event)
	    .duration(60 * 2000 / 89 * 2);
	};

	function location6(){
	  var t = d3.select("svg");
	  t.transition()
	    .call(zoomTo(faisal_stadium, 14).event)
	    .duration(60 * 2000 / 89 * 2);
	};

	function location7(){
	  var t = d3.select("svg");
	  t.transition()
	    .call(zoomTo(ad_dirah, 14).event)
	    .duration(60 * 2000 / 89 * 2);
	};


    $("#loc1").click(function(){
        location1();
    });
    $("#loc2").click(function(){
        location2();
    });
    $("#loc3").click(function(){
        location3();
    });
    $("#loc4").click(function(){
        location4();
    });
    $("#loc5").click(function(){
        location5();
    });
    $("#loc6").click(function(){
        location6();
    });
    $("#loc7").click(function(){
        location7();
    });



    resize();
    $( window ).resize(function() {
        resize();
    });
});

