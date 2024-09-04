// JavaScript Document
$(document).ready(function() {
	'use strict';
	var splash = $('.tt-splash');
	var scrollpane = $('.tt-scrollpane');
	var modalService = $('#tt-modal-service, #tt-modal');
	var modal = $('#tt-modal');
	var lat = 51.5233841;
	var lng = -0.0838453;
	
	$(window).on('load resize', function(){
		// Hide Splash screen
		splash.delay(500).fadeOut(300);
		if($(window).width() <= 768){
			$('html').css('overflow', 'auto');
		}
		
		// Initialize and descroy fullpage.js plugin
		if($(window).width() > 768){
			if(!$('html').hasClass('fp-enabled')){
				CretaeFullPage();
			}
		} else {
			if($('html').hasClass('fp-enabled')){
				$.fn.fullpage.destroy('all');
			}
		}
		
		
		if($(window).width() > 768){
			scrollpane.each(function(){
				$(this).jScrollPane({autoReinitialise: true});
			});
		} else {
			scrollpane.each(function(){
				var element = $(this).jScrollPane();
				var api = element.data('jsp');
				api.destroy();
			});
		}
		google.maps.event.trigger(map, 'resize');
	});
		
	function CretaeFullPage(){
		// Fullpage.js plugin
		// For more and docs - visit https://github.com/alvarotrigo/fullPage.js/
		$('#fullpage').fullpage({
			menu: '#tt-menu, aside',
			anchors:['home', 'services', 'team', 'prices', 'gallery', 'reviews', 'contacts'],
			paddingTop: '80px',
			paddingBottom: '50px',
			fixedElements: '.navbar-fixed-top',
			sectionSelector: '.tt-section',
			slideSelector: null,
			lazyLoading: true,
		});
	}
	function closeDrawer(){
		// Close navigation drawer
		var marginLeft = ($(window).width() <= 768) ? '-100%' : '-300px';
		$('aside').stop().animate({'margin-left' : marginLeft}, 100, function(){
			$(this).removeClass('open').addClass('closed');
			$('.tt-drawer a').removeClass('cross').addClass('burger');
			$('aside ul, aside ul li').hide();
		});
	}
	
	// Supports swipe on the Bootstrap Carousel
	// Bootstrap Carousel - http://getbootstrap.com/javascript/#carousel
	// TouchSwipe Plugin - http://labs.rampinteractive.co.uk/touchSwipe/demos/index.html
	$('.carousel-inner').swipe({
		swipeLeft: function(){
			$(this).parent().carousel('next');  
		},
    	swipeRight: function() {
			$(this).parent().carousel('prev');  
        },
		allowPageScroll: 'auto'
    });
	
	// Navigation drawer navigation 
	$('aside a').on('click', function() {
    	var marginTop = 80;
		var section = $(this).parent().data('menuanchor');
		if($(window).width() <= 768){
			$('aside li').removeClass('active');
			$(this).parent().addClass('active');
			$('html, body').animate({
				scrollTop: $('.' + section).offset().top - marginTop
			}, 300, closeDrawer());
		}
	});
		
	// Navigation drawer open, animation menu item
	$('.tt-drawer a').on('click', function(){
		$(this).removeClass('burger'). addClass('cross');
		var state = $('aside').hasClass('closed');
		if(state){
			$('aside').removeClass('closed').addClass('open').stop().animate({'margin-left' : 0}, 100, function(){
				$('aside ul').fadeIn(0);
				$('aside li').each(function(i) {
				if ($(this).is(':hidden')){
					 $(this).delay((i++) * 75).fadeTo(75, 1);
				}
			});
			});
		} else {
			closeDrawer();
		}
		return false;
	});
	
	// Masked Input plugin
	// For more and docs - visit http://digitalbush.com/projects/masked-input-plugin/
	$('input[name=phone]').mask('+9(999)999-99-99');
	
	// jScrollPane plugin
	// For more and docs - visit http://jscrollpane.kelvinluck.com/
	scrollpane.jScrollPane({autoReinitialise: true});
	
	// LightGallery plugin
	// For more and docs - visit http://sachinchoolur.github.io/lightGallery/
    $('#captions').lightGallery({
		download: false,
		thumbnail: true,
		actualSize: true,
		animateThumb: false,
    	showThumbByDefault: false,
		share: false
	}); 

	// AJAX-sending form, validation form in modal
	$('#tt-modal button').on('click', function(){
		var error, messages = [];
		if(modal.find('input[name=name]').val() === ''){
			messages.push('The field "Your name" is empty or incorrect');
			error = true;
		}
		if(modal.find('input[name=phone]').val() === ''){
			messages.push('The field "Your phone" is empty or incorrect');
			error = true;
		}
		if(!error){
			$.ajax({
				type: modal.find('form').attr('method'),
				url: modal.find('form').attr('action'),
				data: modal.find('form').serialize(),
				beforeSend: function(){
					modal.find('.response img').removeClass('hidden');
					modal.find('.response p').text('Please wait, your message is sent.').addClass('pull-left');
				},
				success: function(response){
					var data = JSON.parse(response);
					if (data.status === 1) {
						modal.find('.response img').addClass('hidden');
						modal.find('.response p').text(data.message).addClass('pull-left');
						modal.find('form')[0].reset();
					}
				}
			});
		} else {
			modal.find('.response p').remove();
			for (var i = 0; i < messages.length; i++){
				modal.find('.response').append('<p>' + messages[i] + '</p>');
			}
		}
	});
	

	// Show modal on clcik services item
	$('.services a').on('click', function(){
		var slide = $(this).data('slide');
		$('#tt-modal-service').modal('show').find('#carousel-popup').carousel(slide);
		return false;
	});
	
	// Bootstrap modal events
	// For more and docs - visit http://getbootstrap.com/javascript/#modals-events
	$(modalService).on('show.bs.modal', function (event) {
  		var button = $(event.relatedTarget);
  		var master = button.data('master');
  		$(this).find('.modal-body input[name=master]').val(master);
		if($(window).width() <= 768){
				$('html').css('overflow', 'hidden');
			}
	});
	$(modalService).on('hide.bs.modal', function () {
  		$(this).find('input').val('');
		$(this).find('.response p').text('');
		if($(window).width() <= 768){
				$('html').css('overflow', 'auto');
			}
	});
	
	// Counter Bootstrap carousel
	var total = $('#carousel-team-screen .item').length;
  	var current = $('#carousel-team-screen div.active').index() + 1;
	$('.tt-counter').html('<span class="current">' + current + '<span><span class="divider">/</span><span class="total">' + total + '</span>');
	
	// Bootstrap carousel events
	//For more and docs - visit http://getbootstrap.com/javascript/#carousel-events
	$('#carousel-team-screen').on('slid.bs.carousel', function () {
		current = $('#carousel-team-screen div.active').index() + 1;
   		$('.tt-counter').html('<span class="current">' + current + '<span><span class="divider">/</span><span class="total">' + total + '</span>');
	});
	
	//Google Maps
	var latlng = new google.maps.LatLng(lat, lng);
	var style = [
		{
			'stylers': [
				{'invert_lightness': true},
				{'weight': 0.6},
				{'hue': '#ffff00'},
				{'saturation': -100}
			]
		}
		
	];
	var settings = {
		zoom: 17,
		center: latlng,
		scrollwheel: false,
		streetViewControl: false,
		mapTypeControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: style
	};
	var map = new google.maps.Map(document.getElementById('map'), settings);
	var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: 'Tattoo\'s',
				icon: 'images/pin.png'
	});
});