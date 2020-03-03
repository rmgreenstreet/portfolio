$(window).scroll(function() {     
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
        $("nav").addClass("scrolled");
    }
    else {
        $("nav").removeClass("scrolled");
    }
});