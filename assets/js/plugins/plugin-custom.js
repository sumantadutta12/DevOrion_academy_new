"use strict";
document.addEventListener("DOMContentLoaded", function () {

    $(function ($) {

        /* niceSelect */
        $("select").niceSelect();

        // common slide one
        let commonSlide1 = document.querySelectorAll('.testimonial__onewrap');
        commonSlide1.forEach(function (commonSlide1) {
            var swiper = new Swiper(commonSlide1, {
                loop: false,
                watchOverflow: true,
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 24,
                navigation: {
                    nextEl: commonSlide1.querySelector('.ara-next'),
                    prevEl: commonSlide1.querySelector('.ara-prev'),
                },
                breakpoints: {
                    992: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },

                }
            });
        });

        // free live slider
        let commonSlide2 = document.querySelectorAll('.free__livewra');
        commonSlide2.forEach(function (commonSlide2) {
            var swiper = new Swiper(commonSlide2, {
                loop: true,
                slidesPerView: 1,
                slidesToShow: 1,
                paginationClickable: true,
                spaceBetween: 48,
                navigation: {
                    nextEl: commonSlide2.querySelector('.ara-next'),
                    prevEl: commonSlide2.querySelector('.ara-prev'),
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
        });

        // Top Online Slots 3 cards
        let commonSlide3 = document.querySelectorAll('.common-slider3');
        commonSlide3.forEach(function (commonSlide3) {
            var swiper = new Swiper(commonSlide3, {
                loop: true,
                slidesPerView: 1,
                slidesToShow: 1,
                paginationClickable: true,
                spaceBetween: 12,
                navigation: {
                    nextEl: commonSlide3.querySelector('.ara-next'),
                    prevEl: commonSlide3.querySelector('.ara-prev'),
                },
                breakpoints: {
                    992: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    576: {
                        slidesPerView: 2,
                    },

                }
            });
        });

        // Common Silder 4
        let commonSlide4 = document.querySelectorAll('.common-slider4');
        commonSlide4.forEach(function (commonSlide4) {
            var swiper = new Swiper(commonSlide4, {
                loop: true,
                slidesPerView: 1,
                slidesToShow: 1,
                paginationClickable: true,
                spaceBetween: 0,
                centeredSlides: true,
                navigation: {
                    nextEl: commonSlide4.querySelector('.ara-next'),
                    prevEl: commonSlide4.querySelector('.ara-prev'),
                },
                breakpoints: {
                    992: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                }
            });
        });

        // Common Silder 5
        let commonSlide5 = document.querySelectorAll('.common-slider5');
        commonSlide5.forEach(function (commonSlide5) {
            var swiper = new Swiper(commonSlide5, {
                loop: true,
                slidesPerView: 1,
                slidesToShow: 1,
                paginationClickable: true,
                spaceBetween: 12,
            });
        });

        /* price-range */
        if (document.querySelector('#price-range') !== null) {
            $("#price-range").slider({
                step: 1,
                range: true,
                min: 0,
                max: 1000,
                values: [50, 800],
                slide: function (event, ui) { $("#priceRange").val(ui.values[0] + " - " + ui.values[1]); }
            });
            $("#priceRange").val($("#price-range").slider("values", 0) + " - " + $("#price-range").slider("values", 1));
        }

        /* Wow js */
        new WOW().init();

    });
});
