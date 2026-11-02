(function () {
    'use strict';
    var header = document.querySelector('.academy-header__bar');
    var backToTop = document.querySelector('.scrollToTop');
    if (!header || !backToTop) return;

    function updateChrome() {
        header.classList.toggle('header-fixed', window.scrollY > 50);
        backToTop.classList.toggle('active', window.scrollY > 600);
    }
    window.addEventListener('scroll', updateChrome, { passive: true });
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    updateChrome();
}());
