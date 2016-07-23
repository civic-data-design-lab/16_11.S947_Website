
module.exports = MyUI;

function MyUI(params){
}

MyUI.prototype = {
    initcontrol: function(){
        var myobj = this;

        $(".project_icon").css("height", $(".project_icon").css("width"));

        $( window ).resize(function() {
            $(".project_icon").css("height", $(".project_icon").css("width"));
        });

        d3.selectAll(".project_icon").on("mouseover",function(){
            d3.select(this).select(".project_info").style("opacity","1");
            d3.select(this).select(".project_cover").style("opacity","1");

        }).on("mouseout",function(){
            d3.select(this).select(".project_info").style("opacity","0");
            d3.select(this).select(".project_cover").style("opacity","0");

        });

    }
}