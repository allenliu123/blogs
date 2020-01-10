$(function(){
    $('body').on('click', (e) => {
        var $i0 = $("<div/>");
        var $i1 = $("<div/>");
        var $i2 = $("<div/>");
        var x = e.pageX, y = e.pageY;
        $i0.css({
            "z-index": 1,
            "top": y,
            "left": x,
            "width": 0,
            "height": 0,
            "border-radius": "50%",
            "background": "#00c4b6",
            "position": "absolute",
        });
        $("body").append($i0);
        $i0.animate({
            "top": y - 25,
            "left": x - 25,
            "opacity": 0,
            "width": 50,
            "height": 50,
        }, 800, "linear", function() {
            $i0.remove();
        });
        $i1.css({
            "z-index": 1,
            "top": y,
            "left": x,
            "width": 0,
            "height": 0,
            "border-radius": "50%",
            "background": "#00c4b6",
            "position": "absolute",
        });
        $("body").append($i1);
        $i1.animate({
            "top": y - 25,
            "left": x - 25,
            "opacity": 0,
            "width": 50,
            "height": 50,
        }, 1000, "linear", function() {
            $i1.remove();
        });
        $i2.css({
            "z-index": 1,
            "top": y,
            "left": x,
            "width": 0,
            "height": 0,
            "border-radius": "50%",
            "background": "#00c4b6",
            "position": "absolute",
        });
        $("body").append($i2);
        $i2.animate({
            "top": y - 25,
            "left": x - 25,
            "opacity": 0,
            "width": 50,
            "height": 50,
        }, 1200, "linear", function() {
            $i2.remove();
        });
    });
});