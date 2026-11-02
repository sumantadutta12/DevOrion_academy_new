(function () {
    'use strict';

    var loader = document.getElementById('site-loader');
    if (!loader) return;

    var root = document.documentElement;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var minimumDuration = reduceMotion ? 0 : 380;
    var startedAt = Date.now();
    var leaving = false;
    var finished = false;
    var readyTimer = null;
    var hideTimer = null;
    var fallbackTimer = setTimeout(dismiss, 3000);

    function unlockPage() {
        root.classList.remove('is-site-loading');
        document.body.removeAttribute('aria-busy');
    }
    function hideLoader() {
        clearTimeout(fallbackTimer);
        clearTimeout(readyTimer);
        clearTimeout(hideTimer);
        finished = true;
        unlockPage();
        loader.hidden = true;
        loader.setAttribute('aria-hidden', 'true');
    }
    function dismiss() {
        if (finished || leaving) return;
        var remaining = Math.max(0, minimumDuration - (Date.now() - startedAt));
        clearTimeout(readyTimer);
        if (remaining) {
            readyTimer = setTimeout(dismiss, remaining);
            return;
        }
        leaving = true;
        clearTimeout(fallbackTimer);
        unlockPage();
        loader.classList.add('is-leaving');
        loader.setAttribute('aria-hidden', 'true');
        if (reduceMotion) hideLoader();
        else hideTimer = setTimeout(hideLoader, 280);
    }
    function waitForPage() {
        if (finished || leaving) return;
        try {
            var pending = [];
            var hero = document.querySelector('.premium-banner .hero-photo, .software-hero__visual > img, .about-hero__visual > img, .contact-hero__visual > img');
            if (document.fonts && document.fonts.ready) pending.push(document.fonts.ready);
            if (hero && !hero.complete) {
                if (typeof hero.decode === 'function') pending.push(hero.decode());
                else pending.push(new Promise(function (resolve) {
                    hero.addEventListener('load', resolve, { once: true });
                    hero.addEventListener('error', resolve, { once: true });
                }));
            }
            Promise.allSettled(pending).then(dismiss);
        } catch (error) {
            dismiss();
        }
    }

    try {
        loader.hidden = false;
        loader.removeAttribute('aria-hidden');
        root.classList.add('is-site-loading');
        document.body.setAttribute('aria-busy', 'true');
        window.addEventListener('load', dismiss, { once: true });
        window.addEventListener('pagehide', hideLoader);
        window.addEventListener('pageshow', function (event) { if (event.persisted) hideLoader(); });
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForPage, { once: true });
        else waitForPage();
    } catch (error) {
        hideLoader();
    }
}());
