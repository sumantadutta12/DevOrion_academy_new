(function () {
    'use strict';

    var header = document.querySelector('.academy-header');
    if (!header) return;
    var toggle = header.querySelector('.academy-nav__toggle');
    var content = header.querySelector('.academy-nav__content');
    if (!toggle || !content) return;

    var desktop = window.matchMedia('(min-width: 1200px)');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var sidebar = document.createElement('dialog');
    // Keep the ordinary navigation available in browsers without modal dialogs.
    if (typeof sidebar.showModal !== 'function') return;
    var dropdowns = Array.from(content.querySelectorAll('.academy-nav__dropdown'));
    var placeholder = document.createComment('Shared navigation returns here on desktop.');
    content.before(placeholder);

    function icon(paths) {
        return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><g stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + paths + '</g></svg>';
    }
    var arrow = icon('<path d="M5 12h14m-6-6 6 6-6 6"/>');
    var menuIcons = [
        '<path d="m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9"/>',
        '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m5 10v-3a6 6 0 0 0-4-5.6"/>',
        '<path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>',
        '<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a24 24 0 0 0 18 0m-9 0v3"/>',
        '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3m-2-7-2 14"/>',
        '<path d="M4 13v-1a8 8 0 0 1 16 0v1M4 12H3v6h4v-6H4Zm16 0h1v6h-4v-6h3Zm0 6v1a3 3 0 0 1-3 3h-3"/>'
    ];
    var topLinks = content.querySelectorAll('.academy-nav__links > li > .academy-nav__link, .academy-nav__links > li > details > .academy-nav__link');
    topLinks.forEach(function (link, index) {
        var mark = document.createElement('span');
        mark.className = 'academy-nav__item-icon';
        mark.setAttribute('aria-hidden', 'true');
        mark.innerHTML = icon(menuIcons[index] || menuIcons[2]);
        link.prepend(mark);
    });

    sidebar.id = 'academy-mobile-sidebar';
    sidebar.className = 'academy-sidebar';
    sidebar.setAttribute('aria-labelledby', 'academy-sidebar-title');
    sidebar.setAttribute('aria-modal', 'true');
    sidebar.innerHTML = '<div class="academy-sidebar__panel">' +
        '<div class="academy-sidebar__head"><a class="academy-sidebar__logo" href="index.html" aria-label="DevOrion Academy home"></a>' +
        '<button class="academy-sidebar__close" type="button" aria-label="Close navigation" autofocus>' + icon('<path d="m6 6 12 12M18 6 6 18"/>') + '</button></div>' +
        '<div class="academy-sidebar__body"><div class="academy-sidebar__intro"><span class="academy-sidebar__eyebrow">Your learning journey</span>' +
        '<h2 id="academy-sidebar-title">Explore the Academy</h2><p>Build the skills for what comes next.</p></div>' +
        '<nav class="academy-sidebar__navigation" aria-label="Mobile navigation"></nav></div>' +
        '<div class="academy-sidebar__foot">' + icon('<path d="m4 17 6-6 4 4 6-10m-6 0h6v6"/>') + '<span>From Campus To Corporate</span></div></div>';
    var logo = header.querySelector('.header-logo img');
    if (logo) sidebar.querySelector('.academy-sidebar__logo').appendChild(logo.cloneNode(true));
    var actions = content.querySelector('.academy-nav__actions');
    if (actions) {
        var help = document.createElement('div');
        help.className = 'academy-sidebar__help';
        help.innerHTML = '<span aria-hidden="true">' + icon(menuIcons[5]) + '</span><div><strong>A little guidance goes a long way.</strong><a href="contact.html#contact-form">Talk to our team ' + arrow + '</a></div>';
        actions.prepend(help);
    }
    document.body.appendChild(sidebar);
    var closeButton = sidebar.querySelector('.academy-sidebar__close');
    var mobileNavigation = sidebar.querySelector('.academy-sidebar__navigation');
    var open = false;
    var closeTimer = null;
    var openFrame = null;
    var scrollState = null;

    function closeDropdowns(except) {
        dropdowns.forEach(function (dropdown) {
            if (dropdown !== except) dropdown.open = false;
        });
    }
    function lockScroll() {
        if (scrollState) return;
        var body = document.body;
        var properties = ['position', 'top', 'left', 'right', 'width', 'overflow', 'paddingRight'];
        scrollState = { y: window.scrollY, styles: {} };
        properties.forEach(function (property) { scrollState.styles[property] = body.style[property]; });
        var gutter = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        if (gutter) body.style.paddingRight = ((parseFloat(window.getComputedStyle(body).paddingRight) || 0) + gutter) + 'px';
        body.style.position = 'fixed';
        body.style.top = -scrollState.y + 'px';
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';
    }
    function unlockScroll() {
        if (!scrollState) return;
        var saved = scrollState;
        scrollState = null;
        Object.keys(saved.styles).forEach(function (property) { document.body.style[property] = saved.styles[property]; });
        window.scrollTo({ top: saved.y, left: window.scrollX, behavior: 'instant' });
    }
    function finishClose(restoreFocus) {
        clearTimeout(closeTimer);
        closeTimer = null;
        if (sidebar.open) sidebar.close();
        unlockScroll();
        if (restoreFocus && !desktop.matches) toggle.focus({ preventScroll: true });
    }
    function closeMenu(options) {
        options = options || {};
        open = false;
        if (openFrame !== null) window.cancelAnimationFrame(openFrame);
        openFrame = null;
        header.classList.remove('is-menu-open');
        sidebar.classList.remove('is-visible');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        closeDropdowns();
        if (!sidebar.open || options.immediate || reducedMotion.matches) finishClose(options.restoreFocus !== false);
        else {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(function () { finishClose(options.restoreFocus !== false); }, 300);
        }
    }
    function openMenu() {
        if (desktop.matches) return;
        clearTimeout(closeTimer);
        closeTimer = null;
        if (openFrame !== null) window.cancelAnimationFrame(openFrame);
        if (!sidebar.open) sidebar.showModal();
        open = true;
        lockScroll();
        header.classList.add('is-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation');
        // Commit the closed position before animating the drawer into view.
        sidebar.getBoundingClientRect();
        openFrame = window.requestAnimationFrame(function () {
            sidebar.classList.add('is-visible');
            openFrame = null;
        });
        closeButton.focus({ preventScroll: true });
    }
    function syncLayout() {
        closeMenu({ immediate: true, restoreFocus: false });
        if (desktop.matches) {
            placeholder.after(content);
            toggle.removeAttribute('aria-haspopup');
            toggle.setAttribute('aria-controls', content.id);
        } else {
            mobileNavigation.appendChild(content);
            toggle.setAttribute('aria-haspopup', 'dialog');
            toggle.setAttribute('aria-controls', sidebar.id);
        }
    }

    toggle.addEventListener('click', function () { if (open) closeMenu(); else openMenu(); });
    closeButton.addEventListener('click', function () { closeMenu(); });
    sidebar.addEventListener('click', function (event) {
        if (event.target === sidebar) closeMenu();
        else if (event.target.closest('a')) closeMenu({ immediate: true, restoreFocus: false });
    });
    sidebar.addEventListener('cancel', function (event) {
        event.preventDefault();
        closeMenu();
    });
    sidebar.addEventListener('close', function () {
        // Recover if another script closes the native dialog.
        if (!sidebar.open) closeMenu({ immediate: true, restoreFocus: false });
    });
    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('toggle', function () { if (dropdown.open) closeDropdowns(dropdown); });
        dropdown.addEventListener('focusout', function (event) {
            if (!dropdown.contains(event.relatedTarget)) dropdown.open = false;
        });
    });
    document.addEventListener('click', function (event) {
        if (desktop.matches && !header.contains(event.target)) closeDropdowns();
    });
    header.addEventListener('click', function (event) {
        if (desktop.matches && event.target.closest('a')) closeDropdowns();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        if (open) {
            event.preventDefault();
            closeMenu();
        } else if (desktop.matches) {
            var activeDropdown = dropdowns.find(function (dropdown) { return dropdown.open; });
            if (activeDropdown) {
                closeDropdowns();
                activeDropdown.querySelector('summary').focus();
            }
        }
    });
    desktop.addEventListener('change', syncLayout);
    window.addEventListener('pagehide', function () { closeMenu({ immediate: true, restoreFocus: false }); });
    syncLayout();
    header.classList.add('is-enhanced');
}());
