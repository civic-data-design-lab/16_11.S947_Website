window.jQuery = window.$ = require("../js/jquery");

window.d3 = require("../js/d3.v3.min");
window.topojson = require("../js/topojson.min");

hotspots_o = require("../flow/data/PNOhotspots_total");
hotspots_d = require("../flow/data/PNDhotspot_total");
metro = require("../hotspot_data/metro");

$(function () {


    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    d3.selection.prototype.moveToBack = function () {
        return this.each(function () {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };


    d3.json("flow/data/converted/roads_.geojson", function (roads) {


        // var sliderContainer = d3.slider().min(0).max(17).ticks(16);
        var inputValue = null;
        var time = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"];

        var width = 500;
        var height = 500;

        var origin_map = d3.select("#origin_map")
            .append("svg").moveToBack();
/*        .attr( "width", width )
        .attr( "height", height )*/;

        var g = origin_map.append("g");
        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "rgba(255,255,255,0.9)")
            .style("padding", "10px")
            .style("border-radius", "13px")
            .style("font-family", "'Open Sans', sans-serif")
            .style("font-size", "12px")
            .style("z-index", "10")
            .style("visibility", "hidden");

        // Set Projection Parameters
        // Mercator
        var projection = d3.geo.mercator()
            .scale(70000)
            .center([46.685, 24.763])
            .translate([width / 2, height / 2]);

        var geoPath = d3.geo.path()
            .projection(projection);

        var road_network = origin_map.append("g").attr("class", "road_network");
        road_network.selectAll("path")
            .data(topojson.feature(roads, roads.objects.roads_).features)


/*        .data( roads.features )
*/        .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#d3d3d3")
            .attr("opacity", .7)
            .attr("stroke-width", .1)
            .attr("d", geoPath)
            .attr("class", "roads");

        var chosenhour_origin;
        var enter_duration = 10

        var pnu = projection([46.723616, 24.852326])
        origin_map.append("circle")
            .attr("cx", pnu[0])
            .attr("cy", pnu[1])
            .attr("r", 4)
            .style("fill", "#a11e1e");
        origin_map.append("circle")
            .attr("cx", pnu[0])
            .attr("cy", pnu[1])
            .attr("r", 8)
            .style("fill", "none")
            .style("stroke-dasharray", "4 2")
            .style("stroke", "#a11e1e");

        var metroLines = origin_map.append("g").attr("class", "metroLines");
        metroLines.selectAll("path")
            .data(metro.features)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#828282")
            .attr("stroke-width", .5)
            .attr("d", geoPath)
            .attr("class", "metro");

        var PNO_routes = origin_map.append("g").attr("class", "PNO_routes")
        var PNOhotspots_total = origin_map.append("g").attr("class", "PNOhotspots_total");

        // when the input range changes update the value 
        d3.select("#timeslide").on("input", function () {
            update_pno(+this.value);
            update_pnd(+this.value);
        });

        // TIMESLIDER
        function update_pno(value) {
            PNO_routes.selectAll("path").remove();
            PNOhotspots_total.selectAll("circle").remove();

            document.getElementById("range").innerHTML = time[value];
            inputValue = time[value];
            var starttime = +(inputValue.replace(":00", ""));
            var endtime = starttime + 1;
            var filename = "flow/geojsons/PNOedgeflow" + ("0" + starttime).slice(-2) + ("0" + endtime).slice(-2) + ".geojson";

            d3.json(filename, function (chosenhour_origin) {

                //chosenhour_origin = eval("PNOedgeflow" + String(inputValue.replace(":00", "")) + ".features");
                PNO_routes.selectAll("path")
                    .data(chosenhour_origin.features)//maybe can make this query from database api
                    .enter()
                    .append("path")
                    .attr("stroke", "#000000")
                    .transition()
                    .delay(function (d, i) {
                        return (d.properties.animation) * enter_duration;
                    })
                    .attr("stroke-width", function (d) {
                        var flow2 = Math.sqrt(+d.properties.flow);
                        return flow2;
                    })
                    .attr("d", geoPath)
                    .attr("class", "Paths")


                PNOhotspots_total.selectAll("circle")
                    .data(hotspots_o.features)
                    .enter()
                    .append("circle")
                    .attr("stroke", "#ffe28a")
                    .attr("transform", function (d) {
                        return "translate(" + projection([+d.properties.long_dest, +d.properties.lat_dest]) + ")";
                    })
                    .attr("class", "hotspot")
                    .attr("r", 0)
                    .transition().delay(1100).duration(800)
                    .attr("r", function (d) { return d.properties.flow * 3; })
                    .attr("display", timeMatch);

                PNOhotspots_total.selectAll("circle")
                    .on("mouseover", function (d) {
                        tooltip.style("visibility", "visible").text("PERSON FLOW IN THIS HOUR: " + d.properties.flow);
                        d3.select(this).attr("class", "hotspothover");
                    })
                    .on("mousemove", function (d) {
                        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text("PERSON FLOW IN THIS HOUR: " + d.properties.flow);
                        d3.select(this).attr("class", "hotspothover");
                    })
                    .on("mouseout", function (d) {
                        tooltip.style("visibility", "hidden");
                        d3.select(this).attr("class", "hotspot");
                    })


            })

        }

        var destination_map = d3.select("#destination_map")
            .append("svg").moveToBack();
        /*
        .attr( "width", width )
        .attr( "height", height )*/;

        var g = destination_map.append("g");

        var road_network = destination_map.append("g").attr("class", "road_network");
        road_network.selectAll("path")
            .data(topojson.feature(roads, roads.objects.roads_).features)

/*        .data( roads.features )
*/        .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#d3d3d3")
            .attr("opacity", .7)
            .attr("stroke-width", .1)
            .attr("d", geoPath)
            .attr("class", "roads");

        var chosenhour_dest;
        var enter_duration = 10

        var pnu1 = projection([46.723616, 24.852326]);

        destination_map.append("circle")
            .attr("cx", pnu[0])
            .attr("cy", pnu[1])
            .attr("r", 4)
            .style("fill", "#a11e1e");

        destination_map.append("circle")
            .attr("cx", pnu[0])
            .attr("cy", pnu[1])
            .attr("r", 8)
            .style("fill", "none")
            .style("stroke-dasharray", "4 2")
            .style("stroke", "#a11e1e");


        var metroLines = destination_map.append("g").attr("class", "metroLines");
        metroLines.selectAll("path")
            .data(metro.features)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#828282")
            .attr("stroke-width", .5)
            .attr("d", geoPath)
            .attr("class", "metro");

        var PND_routes = destination_map.append("g").attr("class", "PND_routes");
        var PNDhotspots_total = destination_map.append("g").attr("class", "PNDhotspots_total");


        // TIMESLIDER
        function update_pnd(value) {
            PND_routes.selectAll("path").remove();
            PNDhotspots_total.selectAll("circle").remove();

            document.getElementById("range").innerHTML = time[value];
            inputValue = time[value];

            d3.selectAll(".hotspot")
                .attr("display", timeMatch);

            var starttime = +(inputValue.replace(":00", ""));
            var endtime = starttime + 1;
            var filename = "flow/geojsons/PNDedgeflow" + ("0" + starttime).slice(-2) + ("0" + endtime).slice(-2) + ".geojson";

            d3.json(filename, function (chosenhour_dest) {
                //chosenhour_dest = eval("PNDedgeflow" + String(inputValue.replace(":00", "")) + ".features");

                PND_routes.selectAll("path")
                    .data(chosenhour_dest.features)//maybe can make this query from database api
                    .enter()
                    .append("path")
                    .attr("stroke", "#000000")
                    .transition()
                    .delay(function (d, i) {
                        return (d.properties.animation) * enter_duration + 800;
                    })
                    .attr("stroke-width", function (d) {
                        var flow2 = Math.sqrt(+d.properties.flow);
                        return flow2;
                    })
                    .attr("d", geoPath)
                    .attr("class", "Paths");

                PNDhotspots_total.selectAll("circle")
                    .data(hotspots_d.features)
                    .enter()
                    .append("circle")
                    .attr("stroke", "#ffe28a")
                    .attr("transform", function (d) {
                        return "translate(" + projection([d.properties.long_origin, d.properties.lat_origin]) + ")";
                    })
                    .attr("class", "hotspot")
                    .attr("r", 0)
                    .transition().duration(800)
                    .attr("r", function (d) { return d.properties.flow * 3; })
                    .attr("display", timeMatch);

                PNDhotspots_total.selectAll("circle")
                    .on("mouseover", function (d) {
                        tooltip.style("visibility", "visible").text("PERSON FLOW IN THIS HOUR: " + d.properties.flow);
                        d3.select(this).attr("class", "hotspothover");
                    })
                    .on("mousemove", function (d) {
                        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text("PERSON FLOW IN THIS HOUR: " + d.properties.flow);
                        d3.select(this).attr("class", "hotspothover");
                    })
                    .on("mouseout", function (d) {
                        tooltip.style("visibility", "hidden");
                        d3.select(this).attr("class", "hotspot");
                    })



            });


        }

        update_pno(0);
        update_pnd(0);

        function timeMatch(data, value) {
            var d = data.properties.hour;
            var m = "9";
            if (inputValue == d) {
                this.parentElement.appendChild(this);
                return "display";
            } else {
                return "none";
            };
        }
    });


});
