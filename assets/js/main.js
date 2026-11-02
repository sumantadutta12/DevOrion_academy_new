"use strict";
document.addEventListener("DOMContentLoaded", () => {
  $(($ => {

    // Click to Scroll Top
    var ScrollTop = $(".scrollToTop");
    $('.scrollToTop').on('click', function () {
      $('html, body').animate({
        scrollTop: 0
      }, 600);
      return false;
    });

     //>> Aos Animation <<//
     $(document).ready(function () {
        $('.title').attr({
          "data-aos": "zoom-in",
          "data-aos-duration": "2000"
        });
    
        AOS.init({
          once: true,
        });
      });
     //>> Aos Animation <<//

    // Sticky Header
    var fixed_top = $(".one__header");
    if ($(window).scrollTop() > 50) {
      fixed_top.addClass("animated fadeInDown header-fixed");
    }
    else {
      fixed_top.removeClass("animated fadeInDown header-fixed");
    }
    
    // window on scroll function
    $(window).on("scroll", function () {

      // Sticky Header
      if ($(window).scrollTop() > 50) {
        fixed_top.addClass("animated fadeInDown header-fixed");
      }
      else {
        fixed_top.removeClass("animated fadeInDown header-fixed");
      }

      // Check Scroll 
      if ($(this).scrollTop() < 600) {
        ScrollTop.removeClass("active");
      } else {
        ScrollTop.addClass("active");
      }

      // Odometer Init 
      let windowHeight = $(window).height();
      $('.odometer').children().each(function () {
        if ($(this).isInViewport({ "tolerance": windowHeight, "toleranceForLast": windowHeight, "debug": false })) {
          var section = $(this).closest(".counters");
          section.find(".odometer").each(function () {
            $(this).html($(this).attr("data-odometer-final"));
          });
        }
      });

    });

    // magnific-popup
    $('.popup-video').magnificPopup({
      type: 'iframe'
    });

    // password hide--
    $(".toggle-password").click(function() {
      console.log('toggle click');
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $(".password-field, .password-field2, .password-field3");
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
    // password hide--

    // gridGallery
    $('.popup_img').magnificPopup({
        type:'image',
        gallery:{
            enabled:true
        }
    });
    
    // Navbar Auto Active Class 
    var curUrl = $(location).attr('href');
    var terSegments = curUrl.split("https://softivuspro.com/");
    var desired_segment = terSegments[terSegments.length - 1];
    var removeGarbage = desired_segment.split(".html")[0] + ".html";
    var checkLink = $('.menu-link a[href="' + removeGarbage + '"]');
    var targetClass = checkLink.addClass('active');
    targetClass.parents('.menu-item').addClass('active-parents');
    $('.active-parents > button').addClass('active');  

    // navbar custom
    $('.navbar-toggle-btn').on('click', function () {
      $('.navbar-toggle-item').slideToggle(300);
      $('body').toggleClass('overflow-hidden');
      $(this).toggleClass('open');
    });
    $('.menu-item button').on('click', function () {
      $(this).siblings("ul").slideToggle(300);
    });

    // toggle search box 
    $('.search-toggle-btn').on('click', function () {
      $('.search-toggle-box').slideToggle(300);
    });

    // Attach the handleWindowResize function to the window resize event
    $(window).resize(function () {
      handleWindowResize();
    });
        
      // Function to handle window resize
      function handleWindowResize() {
        var windowWidth = $(window).width();
        if (windowWidth <= 767) {
          $(document).click(function (event) {
            if (!$(event.target).closest(".search-toggle-box, .search-toggle-btn").length) {
              $('.search-toggle-box').slideUp(300);
            }
          });
        }
      }
      if ($(window).width() <= 767) {
        $(document).click(function (event) {
          if (!$(event.target).closest(".search-toggle-box, .search-toggle-btn").length) {
            $('.search-toggle-box').slideUp(300);
          }
        });
      }

      // swipper slide 
        var swiper = new Swiper(".free__livewrap", {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          spaceBetween: 48,
          speed: 1000,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          autoplay: {
            delay: 1400,
          },
          breakpoints: {
            1400: {
                slidesPerView: 2,
                spaceBetween: 48,
            },
            992: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            576: {
                slidesPerView: 1,
                spaceBetween: 14,
            },
        }
        });
      // swipper slide 

      // educational slide 
        var swiper = new Swiper(".educational__wrap", {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          spaceBetween: 24,
          speed: 1000,
          navigation: {
            nextEl: ".swiper-button-next2",
            prevEl: ".swiper-button-prev2",
          },
          autoplay: {
            delay: 1200,
          },
          breakpoints: {
            1400: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 14,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 14,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 14,
            },
            500: {
              slidesPerView: 1,
              spaceBetween: 14,
            },
        }
        });
      // swipper slide 

      // testi two slide 
        var swiper = new Swiper(".testitwo__wrap", {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          spaceBetween: 14,
          speed: 1000,
          navigation: {
            nextEl: ".swiper-button-next3",
            prevEl: ".swiper-button-prev3",
          },
          autoplay: {
            delay: 1600,
          },
          breakpoints: {
            1400: {
                slidesPerView: 1,
            },
        }
        });
      // swipper slide 

      // educational slide 
        var swiper = new Swiper(".sponsor__wrap", {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          spaceBetween: 34,
          speed: 1000,
          navigation: {
            nextEl: ".swiper-button-next2",
            prevEl: ".swiper-button-prev2",
          },
          autoplay: {
            delay: 1800,
          },
          breakpoints: {
            1400: {
                slidesPerView: 5,
            },
            992: {
                slidesPerView: 5,
            },
            768: {
                slidesPerView: 4,
            },
            576: {
                slidesPerView: 3,
            },
            500: {
              slidesPerView: 2,
            },
            0: {
              slidesPerView: 2,
            },
          }
        });
      // swipper slide 

      // educational slide 
      var swiper = new Swiper(".sponsor__wrap10", {
        loop: true,
        slidesPerView: 1,
        slidesToShow: 1,
        spaceBetween: 34,
        speed: 1800,
        navigation: {
          nextEl: ".swiper-button-next2",
          prevEl: ".swiper-button-prev2",
        },
        autoplay: {
          delay: 1900,
        },
        breakpoints: {
          1400: {
              slidesPerView: 4,
          },
          992: {
              slidesPerView: 4,
          },
          768: {
              slidesPerView: 4,
          },
          576: {
              slidesPerView: 3,
          },
          500: {
            slidesPerView: 2,
          },
          0: {
            slidesPerView: 2,
          },
        }
      });
      // swipper slide 

      // team  slide 
      var swiper = new Swiper(".teamfour__wrap", {
        loop: true,
        slidesPerView: 1,
        slidesToShow: 1,
        spaceBetween: 24,
        speed: 1400,
        navigation: {
          nextEl: ".swiper-button-nextteam",
          prevEl: ".swiper-button-prevteam",
        },
        autoplay: {
          delay: 1300,
        },
        breakpoints: {
          1400: {
              slidesPerView: 4,
          },
          1199: {
            slidesPerView: 4,
          },
          991: {
              slidesPerView: 3,
          },
          768: {
              slidesPerView: 2,
          },
          576: {
              slidesPerView: 2,
          },
          550: {
            slidesPerView: 2,
          },
          0: {
            slidesPerView: 1,
          },
        }
      });
      // team slide 

      // educational slide 
      var swiper = new Swiper(".testimonial__onewrap6", {
        loop: true,
        slidesPerView: 1,
        slidesToShow: 1,
        spaceBetween: 24,
        centeredSlides: true,
        speed: 1400,
        navigation: {
          nextEl: ".swiper-button-nextt6",
          prevEl: ".swiper-button-prevt6",
        },
        autoplay: {
          delay: 1100,
        },
        breakpoints: {
          1400: {
              slidesPerView: 3,
              spaceBetween: 24,
          },
          992: {
              slidesPerView: 3,
              spaceBetween: 14,
          },
          768: {
              slidesPerView: 2,
              spaceBetween: 14,
          },
          576: {
              slidesPerView: 2,
              spaceBetween: 14,
          },
          500: {
            slidesPerView: 1,
            spaceBetween: 14,
          },
        }
      });

        // educational slide 
        var swiper = new Swiper(".testimonial__onewrapupdate", {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          spaceBetween: 24,
          speed: 1400,
          navigation: {
            nextEl: ".swiper-button-nexttup",
            prevEl: ".swiper-button-prevtup",
          },
          autoplay: {
            delay: 1100,
          },
          breakpoints: {
            1400: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            992: {
                slidesPerView: 2,
                spaceBetween: 14,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 14,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 14,
            },
            500: {
              slidesPerView: 1,
              spaceBetween: 14,
            },
          }
        });
      // swipper slide 

      // team  slide 
      var swiper = new Swiper(".instructor__7wrap", {
        loop: true,
        slidesPerView: 1,
        slidesToShow: 1,
        spaceBetween: 24,
        speed: 1400,
        navigation: {
          nextEl: ".instructorsn",
          prevEl: ".instructorsp",
        },
        autoplay: {
          delay: 1500,
        },
        breakpoints: {
          1400: {
              slidesPerView: 4,
          },
          1199: {
            slidesPerView: 4,
          },
          991: {
              slidesPerView: 3,
          },
          768: {
              slidesPerView: 2,
          },
          576: {
              slidesPerView: 2,
          },
          400: {
            slidesPerView: 2,
          },
          0: {
            slidesPerView: 1,
          },
        }
      });
      // team slide 

      // story  slide 
      var swiper = new Swiper(".story-slidewrap", {
        loop: false,
        slidesPerView: 1,
        slidesToShow: 1,
        spaceBetween: 16,
        speed: 2000,
        navigation: {
          nextEl: ".story-prev",
          prevEl: ".story-next",
        },
        autoplay: {
          delay: 1900,
        },
        breakpoints: {
          1400: {
              slidesPerView: 5,
          },
          1199: {
            slidesPerView: 4,
            spaceBetween: 14,
          },
          991: {
              slidesPerView: 4,
              spaceBetween: 10,
          },
          768: {
              slidesPerView: 3,
              spaceBetween: 10,
          },
          576: {
              slidesPerView: 2,
              spaceBetween: 10,
          },
          400: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
        }
      });
      // story slide 

    //--reply box--
      $(".reply").on("click", function () {
        $(this).toggleClass("reply-active");
        $(this).parent().next(".reply__content").slideToggle();
      });
    //--reply box--

    //--profile change--
      var readURL = function(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();

              reader.onload = function (e) {
                  $('.profile-pic').attr('src', e.target.result);
              }

              reader.readAsDataURL(input.files[0]);
          }
      }
      $(".file-upload").on('change', function(){
          readURL(this);
      });
      $(".upload-button").on('click', function() {
        $(".file-upload").click();
      });	  
      //--profile change--

    // header-switch clone 
    var switchContent = $(".header-section .navbar-custom .right-area").html();
    $(".switch-wrapper-top").html(switchContent);

    // Current Year
    $(".currentYear").text(new Date().getFullYear());

    //propdown common lide
    $('.dropdown-toggle').dropdown()

    // sidebar-toggler
    var primarySidebar = $('.sidebar-toggler .sidebar-head');
    $('.sidebar-toggler .toggler-btn').on('click', function () {
      $(this).closest('.sidebar-head').toggleClass('active');
      if (!$('.sidebar-head').hasClass('active')) {
        setTimeout(function () {
          primarySidebar.css("height", "24px");
        }, 550);
      } else {
        primarySidebar.css("height", "100%");
      }
    });

    // sidebar-toggler
    $('.sidebar-wrapper .sidebar-item-head').on('click', function () {
      $(this).siblings('.sidebar-single-body').slideToggle();
      $(this).toggleClass('active');
    });

    //cmn-right click barhere
    // Profile Active
    $('.cmn__rightclick .clickhere-active, .global-scale').on('click', function () {
      $('.cmn__rightclick .cmn-rightclickbody, .kukis, .cmn-leftclickbody, .cmn-rightclickbody-profile, .overall-activeoverlay').toggleClass('active');
    });

    //dashboard menu
    $('.dashboard-menus .dashboard-active, .ov-dsh').on('click', function () {
      $('.dashboard-menus .dashboar-leftbar, .ov-dsh').toggleClass('active');
    });
    //dashboard menu

    // Profile Close
    $('.main-content .profile-close').on('click', function () {
      $('.main-content .profile-sidebar').removeClass('active');
    });
    //cmn-right click barhere

    // Social Item Remove
    $('.social-hide-btn').on('click', function () {
      $(this).parents(".single-box").toggleClass('active');
      if ($('.single-box').hasClass("active")) {
        $('.active .social-hide-btn i').html("remove");
      } else {
        $('.social-hide-btn i').html("add");
      }
    });

    // Custom Tabs
    $(".tablinks .nav-links").each(function () {
      var targetTab = $(this).closest(".singletab");
      targetTab.find(".tablinks .nav-links").each(function() {
        var navBtn = targetTab.find(".tablinks .nav-links");
        navBtn.click(function(){
          navBtn.removeClass('active');
          $(this).addClass('active');
          var indexNum = $(this).closest("li").index();
          var tabcontent = targetTab.find(".tabcontents .tabitem");
          $(tabcontent).removeClass('active');
          $(tabcontent).eq(indexNum).addClass('active');
        });
      });
    });

    // tabLinks add active 
    $('.tabLinks .nav-links').on('mouseenter', function () {
      $(this).addClass('active');
      $('.tabLinks .nav-links').not(this).removeClass('active');
    });

    //price counting
    $(document).ready(() => {
      const toggleSwitch = $("#js-pricing-switch, #js-pricing-switch2, #js-pricing-switch3, #js-pricing-switch4, #js-pricing-switch5, #js-pricing-switch6, #js-pricing-switch7, #js-pricing-switch8, #js-pricing-switch9 input");
    
      (() => {
        $(toggleSwitch).change(() => {
          // Change prices for plans
          togglePriceContent();
    
          // Toggle monthly/yearly style
          $(".js-switch-label-monthly, .js-switch-label-yearly").toggleClass("active");
        });
      })();
    
      function togglePriceContent() {
        if ($(toggleSwitch).is(":checked")) {
          // if toggle is yearly
          $(".js-toggle-price-content").each(function () {
            $(this).html($(this).data("price-yearly"));
          });
        } else {
          // if toggle is monthly
          $(".js-toggle-price-content").each(function () {
            $(this).html($(this).data("price-monthly"));
          });
        }
      }
    });    

    // progress-area
    let progressBars = $('.progress-area');
    let observer = new IntersectionObserver(function(progressBars) {
      progressBars.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          let width = $(entry.target).find('.progress-bar').attr('aria-valuenow');
          let count = 0;
          let time = 1000 / width;
          let progressValue = $(entry.target).find('.progress-value');
          setInterval(() => {
            if (count == width) {
              clearInterval();
            } else {
              count += 1;
              $(progressValue).text(count +"%")
            }
          }, time);
          $(entry.target).find('.progress-bar').css({"width": width + "%", "transition": "width 1s linear"});
        }else{
          $(entry.target).find('.progress-bar').css({"width": "0%", "transition": "width 1s linear"});
        }
      });
    });
    progressBars.each(function() {
      observer.observe(this);
    });
    $(window).on('unload', function() {
      observer.disconnect();
    });

    // custom Accordion
    $('.accordion-single .header-area').on('click', function () {
      if ($(this).closest(".accordion-single").hasClass("active")) {
        $(this).closest(".accordion-single").removeClass("active");
        $(this).next(".content-area").slideUp();
      } else {
        $(".accordion-single").removeClass("active");
        $(this).closest(".accordion-single").addClass("active");
        $(".content-area").not($(this).next(".content-area")).slideUp();
        $(this).next(".content-area").slideToggle();
      }
    });

    // Dropdown Active Remove
    $("section, .close-btn").on('click', function () {
      $('.single-item').removeClass('active');
    });
  
  }));

});


  //quantity
    const increaseCount = (a, b) => {
      const input = b.previousElementSibling;
      let value = parseInt(input.value, 10);
      value = isNaN(value) ? 0 : value;
      value++;
      input.value = value;
    };
    
    const decreaseCount = (a, b) => {
      const input = b.nextElementSibling;
      let value = parseInt(input.value, 10);
      if (value > 1) {
        value = isNaN(value) ? 0 : value;
        value--;
        input.value = value;
      }
    }; 
  //quantity

	// range sliger
	function getVals(){
		let parent = this.parentNode;
		let slides = parent.getElementsByTagName("input");
		  let slide1 = parseFloat( slides[0].value );
		  let slide2 = parseFloat( slides[1].value );
		if( slide1 > slide2 ){ let tmp = slide2; slide2 = slide1; slide1 = tmp; }
		
		let displayElement = parent.getElementsByClassName("rangeValues")[0];
			displayElement.innerHTML = "$" + slide1 + " - $" + slide2;
	}
	  
	window.onload = function(){
	let sliderSections = document.getElementsByClassName("range-slider");
		for( let x = 0; x < sliderSections.length; x++ ){
			let sliders = sliderSections[x].getElementsByTagName("input");
			for( let y = 0; y < sliders.length; y++ ){
			if( sliders[y].type ==="range" ){
				sliders[y].oninput = getVals;
				sliders[y].oninput();
			}
			}
		}
	}

	progressBar: () => {
		const pline = document.querySelectorAll(".progressbar.line");
		const pcircle = document.querySelectorAll(".progressbar.semi-circle");
		pline.forEach(e => {
			var line = new ProgressBar.Line(e, {
				strokeWidth: 6,
				trailWidth: 6,
				duration: 3000,
				easing: 'easeInOut',
				text: {
					style: {
						color: 'inherit',
						position: 'absolute',
						right: '0',
						top: '-30px',
						padding: 0,
						margin: 0,
						transform: null
					},
					autoStyleContainer: false
				},
				step: (state, line) => {
					line.setText(Math.round(line.value() * 100) + ' %');
				}
			});
			var value = e.getAttribute('data-value') / 100;
			new Waypoint({
				element: e,
				handler: function() {
					line.animate(value);
				},
				offset: 'bottom-in-view',
			})
		});
		pcircle.forEach(e => {
			var circle = new ProgressBar.SemiCircle(e, {
				strokeWidth: 6,
				trailWidth: 6,
				duration: 2000,
				easing: 'easeInOut',
				step: (state, circle) => {
					circle.setText(Math.round(circle.value() * 100));
				}
			});
			var value = e.getAttribute('data-value') / 100;
			new Waypoint({
				element: e,
				handler: function() {
					circle.animate(value);
				},
				offset: 'bottom-in-view',
			})
		});
	}

	const rangeInput = document.querySelectorAll(".range-input input"),
	priceInput = document.querySelectorAll(".price-input input"),
	range = document.querySelector(".slider .progress");
	let priceGap = 1000;

	priceInput.forEach((input) => {
		input.addEventListener("input", (e) => {
			let minPrice = parseInt(priceInput[0].value),
			maxPrice = parseInt(priceInput[1].value);

			if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
			if (e.target.className === "input-min") {
				rangeInput[0].value = minPrice;
				range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
			} else {
				rangeInput[1].value = maxPrice;
				range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
			}
			}
		});
	});

	rangeInput.forEach((input) => {
		input.addEventListener("input", (e) => {
			let minVal = parseInt(rangeInput[0].value),
			maxVal = parseInt(rangeInput[1].value);

			if (maxVal - minVal < priceGap) {
			if (e.target.className === "range-min") {
				rangeInput[0].value = maxVal - priceGap;
			} else {
				rangeInput[1].value = minVal + priceGap;
			}
			} else {
			priceInput[0].value = minVal;
			priceInput[1].value = maxVal;
			range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
			range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
			}
		});
	});	








