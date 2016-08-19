$(function() {

 	
	if (  $(window).innerWidth() > (760) ){
		new WOW().init();
	};

	$(".navbar-nav").on("click","a", function (event) {
	      event.preventDefault();
	      var id  = $(this).attr('href');
	      scrollTo(id, 500);
	});

})


function scrollTo(id, delay){
	if (id) {
		var top = $(id).offset().top;
		var newDelay= delay/700*top;
		$('body,html').animate({scrollTop: top-100}, newDelay || 400);
      }
};