(function () {
    'use strict';

    var sections = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
    if (!sections.length) return;
    var motion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if ((motion && motion.matches) || typeof window.IntersectionObserver !== 'function') return;
    var observer;

    function reveal(section, immediate) {
        if (!section) return;
        section.classList.remove('is-reveal-pending');
        if (immediate) section.classList.remove('home-reveal');
        if (observer) observer.unobserve(section);
    }
    function revealAll() {
        sections.forEach(function (section) { reveal(section, true); });
        if (observer) observer.disconnect();
    }
    function revealHashTarget() {
        if (!window.location.hash) return;
        try {
            var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
            if (target) reveal(target.closest('[data-scroll-reveal]'), true);
        } catch (error) {
            // A malformed fragment must not affect the page content.
        }
    }

    try {
        observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) reveal(entry.target, false);
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.01 });

        sections.forEach(function (section) {
            // Keep the initial viewport and any restored content immediately visible.
            if (section.getBoundingClientRect().top < window.innerHeight) return;
            section.classList.add('home-reveal', 'is-reveal-pending');
            observer.observe(section);
        });
    } catch (error) {
        revealAll();
        return;
    }

    revealHashTarget();
    window.addEventListener('hashchange', revealHashTarget);
    document.addEventListener('focusin', function (event) {
        if (event.target.closest) reveal(event.target.closest('[data-scroll-reveal]'), true);
    });
    window.addEventListener('pageshow', function (event) {
        if (!event.persisted) return;
        sections.forEach(function (section) {
            if (section.getBoundingClientRect().top < window.innerHeight) reveal(section, true);
        });
    });
    if (motion) {
        var onMotionChange = function (event) { if (event.matches) revealAll(); };
        if (motion.addEventListener) motion.addEventListener('change', onMotionChange);
        else if (motion.addListener) motion.addListener(onMotionChange);
    }
}());
