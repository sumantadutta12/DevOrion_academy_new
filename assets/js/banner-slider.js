(function ($) {
    'use strict';

    $(function () {
        var $slider = $('.hero-slider');
        if (!$slider.length || typeof $.fn.slick !== 'function') return;

        var $banner = $slider.closest('.premium-banner');
        var $controls = $banner.find('.hero-controls');
        var $pause = $banner.find('.hero-pause');
        var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        var paused = motionPreference.matches;
        var labels = ['Learn Today', 'Build Real Projects', 'Your Next Chapter'];
        var themes = ['learn', 'connect', 'achieve'];

        function updateSlide(slick, index) {
            var current = index + 1;
            $banner.attr('data-theme', themes[index]);
            $banner.find('.hero-current').text(String(current).padStart(2, '0'));
            $banner.find('.hero-total').text(String(slick.slideCount).padStart(2, '0'));
            $banner.find('.hero-counter').attr('aria-label', 'Slide ' + current + ' of ' + slick.slideCount);
        }

        function updatePauseButton() {
            $pause.attr('aria-pressed', String(paused));
            $pause.attr('aria-label', paused ? 'Play banner autoplay' : 'Pause banner autoplay');
            $pause.find('i').toggleClass('ti-player-play', paused).toggleClass('ti-player-pause', !paused);
        }

        $slider.on('init', function (event, slick) {
            $controls.prop('hidden', false);
            updateSlide(slick, slick.currentSlide);
            updatePauseButton();
        });

        $slider.on('beforeChange', function (event, slick, current, next) {
            updateSlide(slick, next);
        });

        $slider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            rows: 0,
            infinite: true,
            fade: true,
            speed: motionPreference.matches ? 0 : 750,
            cssEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
            autoplay: !paused,
            autoplaySpeed: 6500,
            pauseOnHover: true,
            pauseOnFocus: true,
            pauseOnDotsHover: true,
            accessibility: true,
            adaptiveHeight: true,
            swipe: true,
            touchThreshold: 8,
            dots: true,
            appendDots: $banner.find('.hero-dots'),
            prevArrow: $banner.find('.hero-prev'),
            nextArrow: $banner.find('.hero-next'),
            customPaging: function (slick, index) {
                return '<button type="button" aria-label="Show ' + labels[index] + ' slide">' + (index + 1) + '</button>';
            }
        });

        $pause.on('click', function () {
            paused = !paused;
            $slider.slick(paused ? 'slickPause' : 'slickPlay');
            updatePauseButton();
        });

        motionPreference.addEventListener('change', function (event) {
            $slider.slick('slickSetOption', 'speed', event.matches ? 0 : 750);
            if (event.matches) {
                paused = true;
                $slider.slick('slickPause');
                updatePauseButton();
            }
        });

        // Recalculate after local images and fonts settle, including file:// previews.
        $(window).on('load', function () { $slider.slick('setPosition'); });
    });
})(jQuery);
