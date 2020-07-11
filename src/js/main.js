var iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
var iPad = /iPad/.test(navigator.userAgent) && !window.MSStream;
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if(iPhone){
    $('body').addClass('iphone');
}
if(iPad){
    $('body').addClass('ipad');
}
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('safari') != -1) {
  if (ua.indexOf('chrome') > -1) {
    // alert("1") // Chrome
  } else {
    // alert("2") // Safari
    $('body').addClass('safari');
  }
}

if(window.navigator.userAgent.indexOf("Edge") > -1) {
  $('body').addClass('edge');
}

var UAString = navigator.userAgent;
if (UAString.indexOf("Trident") !== -1 && UAString.indexOf("rv:11") !== -1)
{
  $('body').addClass('ie');
}
if (UAString.indexOf("Trident") !== -1 && UAString.indexOf("rv:10") !== -1)
{
  $('body').addClass('ie');
}


$(document).ready(function () {

  var bLazy = new Blazy({
    src: 'data-blazy' // Default is data-src
  });

  $('#menu-btn').click(function () {
    $(this).closest('header').toggleClass('menu-open');
    $('body').toggleClass('oh');
  });

  $(document).on('click', function (e) {
    if($(e.target).closest('.header__content').length === 0 && $('.header__content').length > 0 && $(e.target).closest('#menu-btn').length === 0) {
      $('header').removeClass('menu-open');
      $('body').removeClass('oh');
    }
  });

  if($(window).width() < 992){
    $('.header__menu-i a').click(function () {
      $('header').removeClass('menu-open');
      $('body').removeClass('oh');
    });
  }

	$('.nav-link').on("click","a", function (event) {
		var id  = $(this).attr('href'),
			top = $(id).offset().top;
		if(id.indexOf('#')) {
			event.preventDefault();
		}
		$('body,html').animate({scrollTop: top}, 700);
	});

  $(document).scroll(function () {
    var top = $(document).scrollTop();
    if (top < 1) {
      $(".header").removeClass('scroll');
    } else {
      $(".header").addClass('scroll');
    }
  });

  // checking browser for WEBP
  hasWebP().then(function () {

    if($(window).width() > 768) {
      $('.webp-img').each(function () {
        var webp = $(this).data('webp');
        $(this).attr('data-blazy', webp);
      });
    } else {
      $('.webp-img').each(function () {
        var webp;
        if($(this).data('webp-mobile') !== undefined)
          webp = $(this).data('webp-mobile'); else webp = $(this).data('webp');
        console.log($(this).data('webp-mobile'));
        $(this).attr('data-blazy', webp);
      });
    }

    bLazy.revalidate();

  }, function () {
    if($(window).width() > 768) {
      $('.webp-img').each(function () {
        var img = $(this).data('img');
        $(this).attr('data-blazy', img);
      });
    } else {
      $('.webp-img').each(function () {
        var img;
        if($(this).data('img-mobile') !== undefined)
          img = $(this).data('img-mobile'); else webp = $(this).data('img');
        $(this).attr('data-blazy', img);
      });
    }

    bLazy.revalidate();
  });

  $('.phone').inputmask("+38 (999) 999-99-99");


  if($('#gallery-slider').length > 0) {

		$('#gallery-slider').slick({
			slidesToShow: 3,
			slidesToScroll: 3,
			dots: true,
			arrow: true,
			infinite: true,
			speed: 300,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 550,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});

		$('#gallery-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
			setTimeout(function(){
				bLazy.revalidate();
			},300);
		});

		$('#gallery-slider').magnificPopup({
			delegate: '.slick-slide:not(.slick-cloned) a',
			type: 'image',
			closeOnContentClick: false,
			closeBtnInside: false,
			gallery: {
				enabled: true,
			},
			zoom: {
				enabled: true,
				duration: 150
			},
			removalDelay: 300,
			disableOn: 0,
			midClick: true,

		});
	}


  /*popups start*/
  $(document).on('click', 'a[data-modal-class]', function (e) {
    e.preventDefault();
    var dataModalId = $(this).attr('data-modal-class');
    $('.popup.' + dataModalId + '').addClass('open');
    setTimeout(function () {

      bLazy.revalidate();
    },500)
  });

  $(document).on('click', '.popup__close', function (e) {
    $('.popup ').removeClass('open');
  });

  $(document).on('click', '.popup', function (e) {

    if(e.target.classList[0] == "popup") {
      $('.popup ').removeClass('open');
    }
  });
  /*popups end*/


	/*validation start*/

	$('form .form-btn').click(function (e) {
		e.preventDefault();

		if($(this).closest('form').find('input[type="tel"]').length != 0) {
			var inputTel = $(this).closest('form').find('input[type="tel"]');
			if (inputTel.val().indexOf('_') === -1 && inputTel.val() != 0) {
				$(inputTel).closest('.site-form__input').addClass('correct');
				$(inputTel).closest('.site-form__input').removeClass('error-field');
			} else {
				$(inputTel).closest('.site-form__input').addClass('error-field');
				$(inputTel).closest('.site-form__input').removeClass('correct');
			}
		}

		if($(this).closest('form').find('input[type="email"]')) {
			var reg = /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i;

			var input = $(this).closest('form').find('input[type="email"]');
			var email = $(this).closest('form').find('input[type="email"]').length > 0
				? $(this).closest('form').find('input[type="email"]')
				: false;


			if (email.val() == "" && email !== false) {
				email.closest('.site-form__input').addClass('error-field');

			} else {
				if (reg.test(email.val()) == false) {
					email.closest('.site-form__input').addClass('error-field');
					email.closest('.site-form__input').removeClass('correct');

				} else {
					email.closest('.site-form__input').addClass('correct');
					email.closest('.site-form__input').removeClass('error-field');
				}
			}
		}

		$(this).closest('form').find('input[type="text"]').each(function () {
			if($(this).val() === ''){
				$(this).closest('.site-form__input').addClass('error-field');
				$(this).closest('.site-form__input').removeClass('correct');
			} else {
				$(this).closest('.site-form__input').addClass('correct');
				$(this).closest('.site-form__input').removeClass('error-field');
			}
		});

		if($(this).closest('form').find('.error-field').length == 0 && $(this).closest('form').find('.correct').length > 0){
			$(this).closest('.site-form').addClass('submitted');
		}
	});

	var phoneMask = $('input[type="tel"]');
	$(phoneMask).inputmask('+380 (99) 999 99 99');

	/*validation end*/

});


//script fro webp img and background
var hasWebP = (function () {
  // some small (2x1 px) test images for each feature
  var images = {
    basic: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==",
    lossless: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
  };

  return function (feature) {
    var deferred = $.Deferred();

    $("<img>").on("load", function () {
      // the images should have these dimensions
      if (this.width === 2 && this.height === 1) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    }).on("error", function () {
      deferred.reject();
    }).attr("src", images[feature || "basic"]);

    return deferred.promise();
  }
})();

