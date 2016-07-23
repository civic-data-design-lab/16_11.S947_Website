
module.exports = MyUI;

function MyUI(params){
}

MyUI.prototype = {
    initcontrol: function(){
        var myobj = this;

        d3.selectAll(".project_icon").style("height", d3.select(".project_icon").style("width"));

        $( window ).resize(function() {
            d3.selectAll(".project_icon").style("height", d3.select(".project_icon").style("width"));
        });
    }
}