window.jQuery = window.$ = require("../js/jquery");

window.d3 = require("../js/d3.v3.min");
window.topojson = require("../js/topojson.min");
window.queue = require("../js/queue.min");
require("../js/bootstrap.min");

$(function () {

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };


    function updateMorning() {
        console.log("clicked - Morning");
        if (timep != 1) {
            d3.json("data/Morning/Morning_" + S_TAZ_id.toString() + ".json", UpdateArc);
            timep = 1
        }
    };

    function updateAfternoon() {
        console.log("clicked - Afternoon");
        if (timep != 2) {
            d3.json("data/Afternoon/Afternoon_" + S_TAZ_id.toString() + ".json", UpdateArc);
            timep = 2
        }
    };

    function updateEvening() {
        console.log("clicked - Evening");
        if (timep != 3) {
            d3.json("data/Evening/Evening_" + S_TAZ_id.toString() + ".json", UpdateArc);
            timep = 3
        }
    };

    function updateLateNight() {
        console.log("clicked - LateNight");
        if (timep != 4) {
            d3.json("data/LateNight/LateNight_" + S_TAZ_id.toString() + ".json", UpdateArc);
            timep = 4
        }
    };

    var widthM = window.innerWidth;
    var heightM = window.innerHeight;


    var width = 400;
    var height = 400;
    var S_TAZ_id = 687;
    var scale0 = (200 * (widthM) - 1) / 2 / Math.PI;
    var number_of_obs = d3.map();
    var temp_data = [];
    var timep = 1;

    var color = d3.scale.linear()
        .range(["#dae7f1", "#1d3549"])
        .domain([0.1, 1.0])
        .interpolate(d3.interpolateHcl);

    var color_percentage = d3.scale.linear()
        .range(["#dae7f1", "#1d3549"])
        .domain([0.0, 0.9])
        .interpolate(d3.interpolateHcl);

    var albersProjection = d3.geo.albers()
        .rotate([-46.190616, 0])
        .center([0.25, 24.716042])

    var zoom = d3.behavior.zoom()
        .translate([widthM / 2, heightM / 2])
        .scale(scale0)
        .scaleExtent([scale0, 8 * scale0])
        .on("zoom", zoomed);

    var geoPath = d3.geo.path()
        .projection(albersProjection);

    var svg = d3.select("#taz_map")
        .append("svg")
        .attr("width", widthM - 5)
        .attr("height", heightM - 5).append("g");

    var g = svg.append("g");

    svg.call(zoom)
        .call(zoom.event);

    queue()
        .defer(d3.json, "data/mikes_topo.json")
        .defer(d3.csv, "data/mikes.csv")
        .defer(d3.json, "data/lines.json")
        .await(ready);


    function zoomed() {
        console.log("zoomed gets triggerd")
        albersProjection
            .translate(zoom.translate())
            .scale(zoom.scale());
        g.selectAll("path")
            .attr("d", geoPath);
    }

    function ready(error, riyadh, migrant, riyadh_topo) {
        if (error) throw error;

        var rateById = {};

        migrant.forEach(function (d) {
            rateById[d.id] = +d.sergios_data_Perc_Cont;
        });

        topojson.feature(riyadh, riyadh.objects.collection).features.forEach(function (m) {
            if (+m.properties.sergios_data_Perc_Cont < 0.1) {
                var obs = number_of_obs.get('0.1');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.1', obs);
            }
            else if (+m.properties.sergios_data_Perc_Cont < 0.2) {
                var obs = number_of_obs.get('0.2');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.2', obs);
            } else if (+m.properties.sergios_data_Perc_Cont < 0.3) {
                var obs = number_of_obs.get('0.3');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.3', obs)
            } else if (+m.properties.sergios_data_Perc_Cont < 0.4) {
                var obs = number_of_obs.get('0.4');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.4', obs)
            } else if (+m.properties.sergios_data_Perc_Cont < 0.5) {
                var obs = number_of_obs.get('0.5');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.5', obs)
            } else if (+m.properties.sergios_data_Perc_Cont < 0.6) {
                var obs = number_of_obs.get('0.6');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.6', obs)
            } else if (+m.properties.sergios_data_Perc_Cont < 0.7) {
                var obs = number_of_obs.get('0.7');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.7', obs)
            } else if (+m.properties.sergios_data_Perc_Cont < 0.8) {
                var obs = number_of_obs.get('0.8');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.8', obs)
            } else if (+m.properties.sergios_data_Perc_Cont < 0.9) {
                var obs = number_of_obs.get('0.9');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('0.9', obs)
            } else if (+m.properties.sergios_data_Perc_Cont <= 1.0) {
                var obs = number_of_obs.get('1.0');
                if (obs == undefined) {
                    obs = 0;
                }
                obs = obs + 1;
                number_of_obs.set('1.0', obs)
            }
            temp_data.push(+m.properties.sergios_data_Perc_Cont);
            return
        })

        console.log("number_of_obs", number_of_obs)
        map = g.selectAll(".mappath")
            .data(topojson.feature(riyadh, riyadh.objects.collection).features)

        map_enter = map.enter()
            .append("path")
            .attr("d", geoPath)
            .attr('class', 'mappath')
            .attr("id", function (d) {
                return "TAZ_id_" + d.properties.TAZ;
            })
        map.attr("stroke-width", 5)
            .style("fill", function (d) {
                return color(d.properties.sergios_data_Perc_Cont);
            })

        d3.selectAll(".mappath")
            .on('click', function (d) {
                S_TAZ_id = d.properties.TAZ;
                // clear out everything
                d3.selectAll(".mappath").style("stroke", "none");
                // hightlight this one
                d3.select(this).style("stroke", "orange").style("stroke-width", "2px").moveToFront();


                if (timep == 1) {
                    d3.json("data/Morning/Morning_" + S_TAZ_id.toString() + ".json", UpdateArc);
                }
                if (timep == 2) {
                    d3.json("data/Afternoon/Afternoon_" + S_TAZ_id.toString() + ".json", UpdateArc);
                }
                if (timep == 3) {
                    d3.json("data/Evening/Evening_" + S_TAZ_id.toString() + ".json", UpdateArc);
                }
                if (timep == 4) {
                    d3.json("data/LateNight/LateNight_" + S_TAZ_id.toString() + ".json", UpdateArc);
                }
            });


        d3.select("#TAZ_id_" + S_TAZ_id).style("stroke", "orange").style("stroke-width", "2px").moveToFront();
        // map;  
        /////////////////
        /// METRO LINE //
        /////////////////

        g.selectAll(".lines").data(riyadh_topo.features)
            .enter().append("path").attr("class", "lines").attr("d", geoPath)

        var data = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]

        var margin = { top: 194, right: 40, bottom: 214, left: 50 },
            width = 400 - margin.left - margin.right,
            height = 420 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var brushY = d3.scale.linear().domain([0, 100])
            .range([height, 0]);

        var y = d3.random.normal(height / 10, height / 8);

        var brush = d3.svg.brush()
            .x(x)
            .extent([.0, 1])
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        var arc = d3.svg.arc()
            .outerRadius(height / 10)
            .startAngle(0)
            .endAngle(function (d, i) { return i ? -Math.PI : Math.PI; });

        var svg = d3.select("#taz_brush")
            .append("svg")
            .attr('z-index', 200)
            .attr('top', 400)
            .attr("width", 350)
            .attr("height", 100)
            .style("padding-left", 10)
            .append("g");

        var circle = svg.append("g")
            .attr("transform", "translate(0," + 3 * height + ")")
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d);
            })
            .attr("y", function (d) {
                if (number_of_obs.get(d)) {
                    var x2 = x(d);
                    return brushY(number_of_obs.get(d));
                }
                else {
                    return 0;
                }
            })
            .attr("width", function (d) {
                return width / 10
            })
            .attr("height", function (d) {
                if (number_of_obs.get(d)) {
                    return height - brushY(number_of_obs.get(d));
                }
                else return 0;
            }).attr("fill", function (d) {
                return color_percentage(d);
            });

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickFormat(function (d) {
                return d * 100 + "%";
            })
            .orient("bottom");


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + 4 * height + ")")
            .call(xAxis)
            .style("fill", "Grey");

        var textL = svg.append("text")
            .text("Migrant Population Ratio")
            .attr("transform", "translate(" + width / 2 + "," + 6.2 * height + ")")
            .style('font-size', 9)
            .style("fill", "grey")
            .style("opacity", .7)
            .style('font', "Arial")
            .style("text-anchor", "middle")


        var brushg = svg.append("g")
            .attr("transform", "translate(0," + 0.5 * height + ")")
            .attr("class", "brush")
            .call(brush);

        brushg.selectAll(".resize").append("path")
            .attr("transform", "translate(0," + height / 2 + ")")
            .attr("d", arc);

        brushg.selectAll("rect")
            .attr("height", 3 * height);

        d3.select(".brush").attr("transform", "translate(0,15)");

        brushstart();
        brushmove();

        function brushstart() {
            svg.classed("selecting", true);
        }


        var value1;

        var value2;

        function brushmove() {
            var s = brush.extent();

        }

        function brushend() {
            var s = brush.extent();
            circle.classed("selected", function (d) { return s[0] <= d && d <= s[1]; });
            value1 = s[0];
            value2 = s[1];
            update(value1, value2)
        }

        function update(val1, val2) {
            filterd = d3.selectAll('.mappath').filter(function (each) {
                return (+each.properties.sergios_data_Perc_Cont >= val1) && (+each.properties.sergios_data_Perc_Cont <= val2)
            })
                .style("fill", function (d) {
                    return color(d.properties.sergios_data_Perc_Cont);
                });
            var not_filtered
            not_filtered = d3.selectAll('.mappath').filter(function (each) {
                return (+each.properties.sergios_data_Perc_Cont < val1) || (+each.properties.sergios_data_Perc_Cont > val2)
            })
                .style("fill", "Lightgrey")
        };


    }

    d3.selectAll("path")
        .on('click', function (d) {
            // S_TAZ_id = d.properties.TAZ ; 
            console.log("clicked");
            // d3.json("data/ActualDataNewNew.json", UpdateArc);
        })

    /* GLOBALS */

    var width = 350;           // width of svg image
    var height = 350;           // height of svg image
    var margin = 20;            // amount of margin around plot area
    var pad = margin / 2;       // actual padding amount
    var radius = 5;             // fixed node radius
    var yfixed = height / 2;  // y position for all node
    var border = 1;
    var bordercolor = 'black';
    var S_index = 0;
    var maxc = 3000;

    /* HELPER FUNCTIONS */

    // Generates a tooltip for a SVG circle element based on its ID
    function addTooltip(circle) {
        var x = parseFloat(circle.attr("cx"));
        var y = parseFloat(circle.attr("cy"));
        var r = parseFloat(circle.attr("r"));
        var mc1 = circle.attr("TAZ_ID");
        var mc2 = circle.attr("ImmPer");

        var tooltip = d3.select("#plot")
            .append("text")
            .text("TAZ_id: " + mc1 + "; Imm_Per: " + (mc2 * 100).toFixed(2) + "%")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", -r * 2)
            .attr("id", "tooltip");

        var offset = tooltip.node().getBBox().width / 2;

        if ((x - offset) < 0) {
            tooltip.attr("text-anchor", "start");
            tooltip.attr("dx", -r);
        }
        else if ((x + offset) > (width - margin)) {
            tooltip.attr("text-anchor", "end");
            tooltip.attr("dx", r);
        }
        else {
            tooltip.attr("text-anchor", "middle");
            tooltip.attr("dx", 0);
        }
    }

    var colorCC = d3.scale.linear()
        .domain([150, maxc])
        .range(["#ffcc99", "darkred"])
        .interpolate(d3.interpolateLab);


    function UpdateArc(graph) {
        // create svg image

        d3.selectAll("#arclinks")
            .remove();

        // fix graph links to map to objects instead of indices
        graph.links.forEach(function (d, i) {
            d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
            d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
        });

        // must be done AFTER links are fixed
        linearLayout(graph.nodes);

        // draw nodes last
        drawNodes(graph.nodes);



        //console.log(graph.nodes[S_index]);

        setTimeout(function () { drawLinks(graph.links) }, 1500);

        d3.selectAll("#cc")
            .attr("TAZ_ID", graph.nodes[S_index].TAZ_id)
            .attr("ImmPer", graph.nodes[S_index].ImmPer)
            .style("stroke-width", 1)
            .style("opacity", 1)
            .on("mouseover", function (d, i) { addTooltip(d3.select(this)); })
            .on("mouseout", function (d, i) { d3.select("#tooltip").remove(); })
            .transition()
            .duration(1500)
            .attr("cx", graph.nodes[S_index].x)
            .attr("cy", graph.nodes[S_index].y)
            .style("fill", "rgb(211, 84, 0)");

        d3.selectAll("#text_per")
            .remove();

        setTimeout(function () {
            d3.selectAll("#plot")
                .append("text")
                .attr("id", "text_per")
                .text((graph.nodes[S_index].ImmPer * 100).toFixed(1) + "%")
                .attr("x", graph.nodes[S_index].x)
                .attr("y", (graph.nodes[S_index].y + radius + 8))
                .style("font-size", 10)
                .style("fill", "rgba(0,0,0,0.7)")
                .style("opacity", 1)
                .style("text-anchor", "middle")
                .style("font", "Arial");
        }, 1500);

        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };



    }

    // Draws an arc diagram for the provided undirected graph
    function arcDiagram(graph) {
        // create svg image

        var svg2 = d3.select("#arc_diagram")
            .append("svg")
            .attr("id", "arc")
            .attr("width", 350)
            .attr("height", 350);

        // create plot area within svg image
        var plot = svg2.append("g")
            .attr("id", "plot")
            .attr("transform", "translate(" + pad + ", " + pad + ")");

        var line = svg2.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yfixed)
            .attr("y2", yfixed)
            .style("opacity", .1)
            .style("stroke", "black")
            .attr("transform", "translate(" + pad + ", " + pad + ")");

        var text1 = svg2.append("text")
            .text("Out")
            .attr("x", pad)
            .attr('y', (yfixed + 7))
            .style('font-size', 10)
            .style("fill", "grey")
            .style("opacity", .65)
            .style('font', "Arial");

        var text2 = svg2.append("text")
            .text("In")
            .attr("x", pad)
            .attr('y', (yfixed + 18))
            .style('font-size', 10)
            .style("fill", "grey")
            .style("opacity", .65)
            .style('font', "Arial");

        var text3 = svg2.append("text")
            .text("Out")
            .attr("x", width)
            .attr('y', (yfixed + 7))
            .style('font-size', 10)
            .style("fill", "grey")
            .style("opacity", .65)
            .style('text-anchor', "end")
            .style('font', "Arial");

        var text4 = svg2.append("text")
            .text("In")
            .attr("x", width)
            .attr('y', (yfixed + 18))
            .style('font-size', 10)
            .style("fill", "grey")
            .style("opacity", .65)
            .style('text-anchor', "end")
            .style('font', "Arial");

        //  console.log(graph);


        // fix graph links to map to objects instead of indices
        graph.links.forEach(function (d, i) {
            d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
            d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
        });

        // must be done AFTER links are fixed
        linearLayout(graph.nodes);

        // draw nodes last
        drawNodes(graph.nodes);
        drawLinks(graph.links);
        //setTimeout(function(){     drawLinks(graph.links) }, 1000);

        var color = d3.scale.linear()
            .domain([40, maxc])
            .range(["rgba(211, 84, 0, .6)"])
            .interpolate(d3.interpolateLab);

        var circle = plot.append("circle")
            .attr("id", "cc")
            .attr("TAZ_ID", graph.nodes[S_index].TAZ_id)
            .attr("ImmPer", graph.nodes[S_index].ImmPer)
            .attr("cx", graph.nodes[S_index].x)
            .attr("cy", graph.nodes[S_index].y)
            .attr("r", radius)
            .style("fill", "rgb(211, 84, 0)")
            .style("stroke-width", 1)
            .style("opacity", 1)
            .on("mouseover", function (d, i) { addTooltip(d3.select(this)); })
            .on("mouseout", function (d, i) { d3.select("#tooltip").remove(); });

        var text5 = plot.append("text")
            .attr("id", "text_per")
            .text((graph.nodes[S_index].ImmPer * 100).toFixed(1) + "%")
            .attr("x", graph.nodes[S_index].x)
            .attr("y", (graph.nodes[S_index].y + radius + 8))
            .style("font-size", 10)
            .style("fill", "rgba(0,0,0,0.7)")
            .style("opacity", 1)
            .style("text-anchor", "middle")
            .style("font", "Arial")

    }

    // Layout nodes linearly, sorted by ImmPer
    function linearLayout(nodes) {
        // sort nodes by ImmPer
        nodes.sort(function (a, b) {
            return b.ImmPer - a.ImmPer;
        })

        // used to scale node index to x position
        var xscale = d3.scale.linear()
            .domain([0, nodes.length - 1])
            .range([radius, width - margin - radius]);

        // calculate pixel location for each node
        nodes.forEach(function (d, i) {
            d.x = xscale(i);
            d.y = yfixed;
        });
    }

    // Draws nodes on plot
    function drawNodes(nodes) {
        // used to assign nodes color by ImmPer

        // console.log(nodes)

        d3.select("#plot").selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("id", function (d, i) { if (d.TAZ_id == S_TAZ_id) { S_index = i; return d.TAZ_id; } })
            .remove();

        //console.log(S_index);

    }

    // Draws nice arcs for each link on plot
    function drawLinks(links) {

        // path generator for arcs (uses polar coordinates)
        var arclink = d3.svg.arc();

        d3.selection.prototype.moveToBack = function () {
            return this.each(function () {
                var firstChild = this.parentNode.firstChild;
                if (firstChild) {
                    this.parentNode.insertBefore(this, firstChild);
                }
            });
        };

        d3.selectAll("#arclinks")
            .moveToBack();
        // add links
        d3.select("#plot").selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "arc")
            .attr("id", "arclinks")
            .attr("transform", function (d, i) { //console.log(d);
                // arc will always be drawn around (0, 0)
                // shift so (0, 0) will be between source and target
                var xshift = d.source.x + (d.target.x - d.source.x) / 2;
                var yshift = yfixed;
                return "translate(" + xshift + ", " + yshift + ")";
            })
            .attr("d", function (d, i) {
                var xdist = Math.abs(d.source.x - d.target.x);
                var hd = d.value / 10;

                if (hd > 50) { hd = 50 };
                // set arc radius based on x distance


                arclink.innerRadius(xdist / 2 - 0.5);
                arclink.outerRadius(xdist / 2 + 0.5);

                // if the link is going in, the arc will be above
                if (d.target.TAZ_id == S_TAZ_id) {
                    arclink.startAngle(-Math.PI / 2);
                    arclink.endAngle(Math.PI / 2);
                }

                // if the link is going out, the arc will be below
                if (d.source.TAZ_id == S_TAZ_id) {
                    arclink.startAngle(Math.PI / 2);
                    arclink.endAngle(3 * Math.PI / 2);
                }

                // want to generate 1/3 as many points per pixel in x direction
                var points = d3.range(0, Math.ceil(xdist / 3));

                // set radian scale domain
                // radians.domain([0, points.length - 1]);

                // return path for arc
                return arclink(points);
                //}
            })
            .attr("opacity", function (d) {
                var xdist = Math.abs(d.source.x - d.target.x);
                var hd = d.value / 10;
                if (hd > 5) { hd = 5 };
                hd = hd / 5;

                return hd;

            })

            .moveToBack()
            .on("mouseover", function (d) {
                if (d.source.TAZ_id == S_TAZ_id) {
                    d3.select("#TAZ_id_" + d.target.TAZ_id)
                        .classed("target_h", true);
                }

                else if (d.target.TAZ_id == S_TAZ_id) {
                    d3.select("#TAZ_id_" + d.source.TAZ_id)
                        .classed("target_h", true);
                }


            })
            .on("mouseout", function () {
                d3.selectAll(".mappath")
                    .classed("target_h", false);
            });





    }

    d3.json("data/Morning/Morning_" + S_TAZ_id.toString() + ".json", arcDiagram);





});