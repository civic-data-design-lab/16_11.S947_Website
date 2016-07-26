
window.jQuery = window.$ =  require("./lib/jquery.min");

window.d3 = require("./lib/d3.min");
require("./lib/bootstrap.min");

var ui = require("./modules/myui");

$(function(){

    var myui = new ui({
    });

    myui.initcontrol();

});

