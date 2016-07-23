
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
    }
}