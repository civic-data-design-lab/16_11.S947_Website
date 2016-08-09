window.jQuery = window.$ = require("../js/jquery");

window.d3 = require("../js/d3.v3.min");
window.topojson = require("../js/topojson.min");
window.queue = require("../js/queue.min");

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

    queue()
        .defer(d3.json, 'data/json/converted/fsq_checkin_.json')
        .defer(d3.json, 'data/json/converted/riyadh_traffic_s.json')
        .await(makeMyMap);

    function makeMyMap(error, checkin, traffic_json) {

        var width = window.innerWidth;
        var height = window.innerHeight;
        var scale0 = (width - 1) * 200 / Math.PI;

        var albersProjection = d3.geo.mercator()
            .scale(70000)
            .rotate([-46.6106, 0])
            .center([0, 24.7160])
            .translate([width / 2, height / 2]);

        var geoPath = d3.geo.path()
            .projection(albersProjection);
        var inputValue = null
        var typeofcost = ["Money", "Time", "Distance"]
        var color_roads = d3.scale.linear()
            .domain([0, 0.5, 4])
            .range(["#111a37", "#768dd5", "#ccd4ef"]);
        var opa_roads = d3.scale.linear()
            .domain([0, 0.5, 4])
            .range([0, 0.5, 1]);

        var color_gradient = d3.scale.linear()
            .domain([4, 20, 36])
            .range(['#88d8b0', '#ffcc5c', '#ff6f69']);
        var color_checkin = d3.scale.threshold()
            .domain([10, 10000, 35000, 70000, 95000])
            .range(["#e2f4c7", "#eae374", "#f9d62e", "#fc913a", "#ff4e50"]);
        var color_checkin_warm = d3.scale.threshold()
            .domain([10, 5000, 20000, 50000, 70000, 95000])
            .range(["#dc6900", "#eb8c00 ", "#eeba30", "#e0301e", "#a32020", "#602320"]);
        var color_time = d3.scale.threshold()
            .domain([0, 5, 10, 20, 30])
            .range(["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"]);
        var color_dist = d3.scale.threshold()
            .domain([0, 1, 5, 10, 20])
            .range(["#83d0c9", "#65c3ba", "#54b2a9", "#35a79c", "#009688"]);
        var color_money = d3.scale.threshold()
            .domain([1, 5, 10, 15, 20])
            .range(["#96ceb4", "88d8b0", "ffeead", "ffcc5c", "ff6f69"]);
        var svg = d3.select("body")
            .append("svg")
            .attr('class', 'road_network')
            .attr("width", width - 20)
            .attr("height", height - 20)
            .attr("top", 200);

        var zoom = d3.behavior.zoom()
            .size([width, height])
            .on("zoom", zoomed);
        var g = svg.append("g");

        function zoomed() {
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        svg
            .call(zoom)
            .call(zoom.event);


        var city_network = g.append("g")
            .attr('class', 'RiyadhVoc');

        city_network.selectAll("path")
            .data(topojson.feature(traffic_json, traffic_json.objects.riyadh_traffic_).features)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#8a9edb")
            .attr("opacity", function (x) {
                return opa_roads(x.properties.voc_md);
            })
            .attr("stroke-linecap", "round")

            .attr("stroke-width", function (x) {
                return x.properties.voc_md * 0.9 * 2 + 0.3;
            })
            .attr("d", geoPath) // "d" is D3.attribute stands for coordinates of a path
            .attr("class", "incident");
        city_network.moveToBack();

        d3.select("#On").on("click", function () {//###should not recalculate if it's on already
            d3.select(".RiyadhVoc").remove();
            var city_network = g.append("g")
                .attr('class', 'RiyadhVoc');
            city_network.selectAll("path")
                .data(topojson.feature(traffic_json, traffic_json.objects.riyadh_traffic_).features)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", "#8a9edb")
                .attr("opacity", function (x) {
                    return opa_roads(x.properties.voc_md);
                })

                .attr("stroke-linecap", "square")
                .attr("stroke-width", function (x) { return x.properties.voc_md * 0.9 * 2 + 0.3 })
                .attr("d", geoPath) // "d" is D3.attribute stands for coordinates of a path
                .attr("class", "incident");

            city_network.moveToBack();

        })
        d3.select("#Off").on("click", function () {
            d3.select(".RiyadhVoc").remove();
            d3.select(".Shortest_Path").remove();
        })
        var check_in = g.append("g")
            .attr('class', 'FSQ_checkin');
        check_in.selectAll("path")
            .data(topojson.feature(checkin, checkin.objects.fsq_checkin_).features)
            .enter()
            .append("path")
            .attr("stroke", function (x) { return color_checkin_warm(x.properties.checkin); })
            .attr("d", geoPath)
            .attr("class", "incident")
            .attr("opacity", 0.7)
            .attr("stroke-width", function (x) { return (x.properties.checkin * 0.0002 + 0.1); })
            .attr("fill", function (x) { return color_checkin_warm(x.properties.checkin); })
            .on("mouseover", function (d) {
                tooltip.style("visibility", "visible").text(d.properties.category + " | CHECKINs: " + d.properties.checkin);
                d3.select(this).attr("class", "incident hover");
            })
            .on("mousemove", function (d) {
                tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text(d.properties.category + " | CHECKINs: " + d.properties.checkin);
                d3.select(this).attr("class", "incident hover");
            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
                d3.select(this).attr("class", "incident");
            })
            .on('click', function (x) {
                var node_id = x.properties.closest_node;
                d3.select(".Shortest_Path").remove();
                create_shortpath(node_id);
            });
        //Define the tootip which realize hover show text function
        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "rgba(0,0,0,0.8)")
            .style("padding", "10px")
            .style("border-radius", "13px")
            .style("font-family", "'Open Sans', sans-serif")
            .style("font-size", "16px")
            .style("z-index", "10")
            .style("visibility", "hidden");

        function map(node_id, inputValue) {

            //here all_json can be made into a query from the database

            var current_paths = g.append("g")
                .attr('class', 'Shortest_Path'); //"id" can be change to whatever for example "class", but if it is not "id", it cannot be selected by d3.select().romove
            d3.json("data/json/splited/" + node_id + ".json", function (node) {
                console.log(node);

                if (inputValue == "Distance") {

                    current_paths.selectAll(".incident2")
                        .data(node.features)
                        .enter()
                        .append("path")
                        .attr("stroke", "white")
                        .attr("fill", "none")
                        .attr("stroke-width", 0.1)
                        .on("mouseover", function (d) {
                            tooltip.style("visibility", "visible").text("Money Cost(SAR): " + Math.round((4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist) * 100) / 100 + " | Distance(KM): " + d.properties.sum_dist + " | " + "Time(Minutes) " + d.properties.sum_time);
                        })
                        .on("mousemove", function (d) {
                            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text("Money Cost(SAR): " + Math.round((4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist) * 100) / 100 + " | Distance(KM): " + d.properties.sum_dist + " | " + "Time(Minutes) " + d.properties.sum_time);
                        })
                        .on("mouseout", function (d) {
                            tooltip.style("visibility", "hidden");
                        })
                        .transition()
                        .duration(2000)
                        .attr("fill", "#900")
                        .attr("d", geoPath)
                        .attr("class", "incident2")
                        .attr("stroke", function (d) { return color_dist(d.properties.sum_dist); })
                        .attr("stroke-width", function (x) { return (x.properties.sum_dist * 0.2); });

                } else if (inputValue == "Time") {
                    current_paths.selectAll(".incident2")
                        .data(node.features)
                        .enter()
                        .append("path")
                        .attr("stroke", "white")
                        .attr("fill", "none")
                        .attr("stroke-width", 0.1)
                        .on("mouseover", function (d) {
                            tooltip.style("visibility", "visible").text("Money Cost(SAR): " + Math.round((4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist) * 100) / 100 + " | Distance(KM): " + d.properties.sum_dist + " | " + "Time(Minutes) " + d.properties.sum_time);
                        })
                        .on("mousemove", function (d) {
                            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text("Money Cost(SAR): " + Math.round((4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist) * 100) / 100 + " | Distance(KM): " + d.properties.sum_dist + " | " + "Time(Minutes) " + d.properties.sum_time);
                        })
                        .on("mouseout", function (d) {
                            tooltip.style("visibility", "hidden");
                        })
                        .transition()
                        .duration(2000)
                        .attr("fill", "#900")
                        .attr("d", geoPath)
                        .attr("class", "incident")
                        .attr("stroke", function (d) { return color_time(d.properties.sum_time); })
                        .attr("stroke-width", function (x) { return (x.properties.sum_time * 0.2); });
                } else {
                    current_paths.selectAll(".incident2")
                        .data(node.features)
                        .enter()
                        .append("path")
                        .attr("stroke", "white")
                        .attr("fill", "none")
                        .attr("stroke-width", 0)
                        .on("mouseover", function (d) {
                            tooltip.style("visibility", "visible").text("Money Cost(SAR): " + Math.round((4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist) * 100) / 100 + " | Distance(KM): " + d.properties.sum_dist + " | " + "Time(Minutes) " + d.properties.sum_time);
                        })
                        .on("mousemove", function (d) {
                            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").text("Money Cost(SAR): " + Math.round((4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist) * 100) / 100 + " | Distance(KM): " + d.properties.sum_dist + " | " + "Time(Minutes) " + d.properties.sum_time);
                        })
                        .on("mouseout", function (d) {
                            tooltip.style("visibility", "hidden");
                        })
                        .transition()
                        .duration(2000)
                        .attr("fill", "#900")
                        .attr("d", geoPath)
                        .attr("class", "incident2")
                        .attr("stroke", function (d) { return color_gradient(4 + 0.35 * d.properties.sum_time + 1.05 * d.properties.sum_dist); })
                        .attr("stroke-width", function (x) { return ((4 + 0.35 * x.properties.sum_time + 1.05 * x.properties.sum_dist) * 0.15 + 0.05); });
                }


            })

        }
        function changeRadio(node_id) {
            d3.selectAll("#cost_radio input[name=mode]").on("change", function () {
                d3.select(".Shortest_Path").remove();
                inputValue = (this.value);
                map(node_id, inputValue);
            });
        }
        function create_shortpath(node_id) {//create path based on node chosen
            var inputValue;
            var radio = document.getElementsByName('mode');
            for (i = 0; i < radio.length; i++) {
                if (radio[i].checked)
                    inputValue = radio[i].value;
            }
            map(node_id, inputValue);
            changeRadio(node_id);
            // Crepate SVG for Tooltip on Mouseover
            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("font-family", "'Open Sans', sans-serif")
                .style("font-size", "10px")
                .style("z-index", "10")
                .style("visibility", "hidden")
        }


    };






});