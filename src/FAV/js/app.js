$(document).ready(function() {
	$('#showMobileLink').click(function() {
		$('.hideMobile, #hideMobileLink').slideToggle(500);
		$(this).slideToggle(500);
	});

	var showMobileAnchor = $('#showMobileLink').offset().top;

	$('#hideMobileLink').click(function() {
		$('.hideMobile, #showMobileLink').slideToggle(500);
		$(this).slideToggle(500);
		$('html, body').animate({scrollTop:showMobileAnchor}, 500);
	});

	$('form').submit(function() {
		var el = $(this);
		$.ajax({
			type: 'POST',
			url: el.attr('action'),
			data: el.serialize(),
			success: function(data) {
				$('input:not([type=submit]), textarea').val('');
				$('.alerts').remove();
				$('form').append("<p class='xs-col-12 alerts'>Your message was successfully submitted.</p>");
			},
			error: function(textStatus, errorThrown) {
				$('.alerts').remove();
				$('form').append("<p class='xs-col-12 alerts'>There was an error and your message was not submitted.</p>");
			}
		});
		return false;
	});

	$(function() {
		$('img.lazy').lazyload({
			effect: 'fadeIn'
		});
	});

});
