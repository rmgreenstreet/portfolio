//add drop shadow to navbar when page is scrolled
$(window).scroll(function() {     
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
        $("nav").addClass("scrolled");
    }
    else {
        $("nav").removeClass("scrolled");
    }
});

// Smooth scrolling using jQuery easing
$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: (target.offset().top - 20)
      }, 1000, "easeInOutExpo");
      return false;
    }
  }
});

//collapse navHamburger on item click
$('.nav-link').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});