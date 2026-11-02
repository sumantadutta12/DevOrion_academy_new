(function () {
    'use strict';

    var dialog = document.getElementById('academy-enquiry');
    var form = document.getElementById('academy-enquiry-form');
    if (!document.body.classList.contains('home-page') || !dialog || !form || typeof dialog.showModal !== 'function') return;

    var root = document.documentElement;
    var loader = document.getElementById('site-loader');
    var closeButton = dialog.querySelector('.enquiry-modal__close');
    var laterButton = dialog.querySelector('.enquiry-later');
    var result = document.getElementById('enquiry-result');
    var draftLink = document.getElementById('enquiry-whatsapp-link');
    var editButton = dialog.querySelector('.enquiry-result__edit');
    var fields = {
        name: document.getElementById('enquiry-name'),
        phone: document.getElementById('enquiry-phone'),
        email: document.getElementById('enquiry-email'),
        course: document.getElementById('enquiry-course'),
        stage: document.getElementById('enquiry-stage'),
        start: document.getElementById('enquiry-start')
    };
    var ready = false;
    var hasOpened = false;
    var remaining = 20000;
    var countdownTimer = null;
    var countdownStarted = null;
    var closeTimer = null;
    var scrollState = null;
    var lastFocus = null;

    function reducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function pauseCountdown() {
        if (countdownTimer === null) return;
        clearTimeout(countdownTimer);
        countdownTimer = null;
        remaining = Math.max(0, remaining - (Date.now() - countdownStarted));
        countdownStarted = null;
    }

    function anotherDialogIsOpen() {
        return Array.from(document.querySelectorAll('dialog[open]')).some(function (item) { return item !== dialog; });
    }

    function lockPage() {
        if (scrollState) return;
        var gutter = Math.max(0, window.innerWidth - root.clientWidth);
        scrollState = { rootOverflow: root.style.overflow, bodyOverflow: document.body.style.overflow, paddingRight: root.style.paddingRight };
        if (gutter) root.style.paddingRight = ((parseFloat(window.getComputedStyle(root).paddingRight) || 0) + gutter) + 'px';
        root.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function unlockPage() {
        if (!scrollState) return;
        root.style.overflow = scrollState.rootOverflow;
        root.style.paddingRight = scrollState.paddingRight;
        document.body.style.overflow = scrollState.bodyOverflow;
        scrollState = null;
    }

    function openDialog() {
        if (dialog.open) return true;
        if (root.classList.contains('is-site-loading') || (loader && !loader.hidden) || anotherDialogIsOpen()) return false;
        lastFocus = document.activeElement;
        clearTimeout(closeTimer);
        closeTimer = null;
        dialog.classList.remove('is-closing');
        lockPage();
        try {
            dialog.showModal();
        } catch (error) {
            unlockPage();
            return false;
        }
        hasOpened = true;
        pauseCountdown();
        dialog.scrollTop = 0;
        // Keep the mobile keyboard closed when this opens automatically.
        closeButton.focus({ preventScroll: true });
        return true;
    }

    function tryAutomaticOpen() {
        if (!ready || hasOpened || remaining > 0 || document.visibilityState === 'hidden') return;
        var active = document.activeElement;
        if (active && active.matches('input, textarea, select, [contenteditable="true"]')) return;
        openDialog();
    }

    function startCountdown() {
        if (!ready || hasOpened || countdownTimer !== null || document.visibilityState === 'hidden') return;
        if (remaining <= 0) {
            tryAutomaticOpen();
            return;
        }
        countdownStarted = Date.now();
        countdownTimer = setTimeout(function () {
            countdownTimer = null;
            countdownStarted = null;
            remaining = 0;
            tryAutomaticOpen();
        }, remaining);
    }

    function pageReady() {
        if (ready) return;
        ready = true;
        startCountdown();
    }

    function finishClose() {
        clearTimeout(closeTimer);
        closeTimer = null;
        if (dialog.open) dialog.close();
    }

    function closeDialog() {
        if (!dialog.open || closeTimer !== null) return;
        if (reducedMotion()) finishClose();
        else {
            dialog.classList.add('is-closing');
            closeTimer = setTimeout(finishClose, 180);
        }
    }

    closeButton.addEventListener('click', closeDialog);
    laterButton.addEventListener('click', closeDialog);
    dialog.addEventListener('cancel', function (event) {
        event.preventDefault();
        closeDialog();
    });
    dialog.addEventListener('click', function (event) {
        if (event.target !== dialog) return;
        var bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
    });
    dialog.addEventListener('close', function () {
        if (dialog.open) return;
        clearTimeout(closeTimer);
        closeTimer = null;
        dialog.classList.remove('is-closing');
        unlockPage();
        if (lastFocus && lastFocus.isConnected && !anotherDialogIsOpen()) lastFocus.focus({ preventScroll: true });
        lastFocus = null;
    });

    // Run after the shared mobile sidebar has handled and closed its navigation.
    document.addEventListener('click', function (event) {
        var opener = event.target.closest && event.target.closest('[data-open-enquiry]');
        if (opener && openDialog()) event.preventDefault();
    });
    window.addEventListener('academy:page-ready', pageReady, { once: true });
    if (root.dataset.siteLoaded === 'true' || !loader || (loader.hidden && !root.classList.contains('is-site-loading'))) pageReady();
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') pauseCountdown();
        else startCountdown();
    });
    // Wait for the current menu/syllabus dialog or active field instead of covering it.
    document.addEventListener('close', tryAutomaticOpen, true);
    document.addEventListener('focusout', function () {
        if (ready && !hasOpened && remaining <= 0) setTimeout(tryAutomaticOpen, 0);
    });
    window.addEventListener('pagehide', function () {
        pauseCountdown();
        finishClose();
        unlockPage();
    });
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) startCountdown();
    });

    function validateName() {
        fields.name.setCustomValidity(fields.name.value.trim() ? '' : 'Please enter your name.');
    }
    function validatePhone() {
        var value = fields.phone.value.trim();
        var digits = value.replace(/\D/g, '');
        var valid = /^\+?[\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
        fields.phone.setCustomValidity(value && !valid ? 'Enter a valid mobile number with 10 to 15 digits, including your country code where needed.' : '');
    }
    fields.name.addEventListener('input', validateName);
    fields.phone.addEventListener('input', validatePhone);
    fields.phone.addEventListener('change', validatePhone);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        fields.name.value = fields.name.value.trim();
        fields.phone.value = fields.phone.value.trim();
        fields.email.value = fields.email.value.trim();
        validateName();
        validatePhone();
        if (!form.reportValidity()) return;

        var lines = [
            'Hello DevOrion Academy! I would like some course guidance.', '',
            'Name: ' + fields.name.value,
            'Mobile: ' + fields.phone.value,
            'Interested course: ' + fields.course.value
        ];
        if (fields.email.value) lines.push('Email: ' + fields.email.value);
        if (fields.stage.value) lines.push('Current stage: ' + fields.stage.value);
        if (fields.start.value) lines.push('Preferred start: ' + fields.start.value);
        lines.push('', 'I agree to be contacted about this course enquiry.');
        var draftUrl = 'https://wa.me/919046240277?text=' + encodeURIComponent(lines.join('\n'));
        draftLink.href = draftUrl;
        form.hidden = true;
        result.hidden = false;
        result.setAttribute('tabindex', '-1');
        result.focus({ preventScroll: true });
        // This prepares a draft. The student reviews and sends it in WhatsApp.
        window.open(draftUrl, '_blank', 'noopener,noreferrer');
    });
    editButton.addEventListener('click', function () {
        result.hidden = true;
        form.hidden = false;
        fields.name.focus({ preventScroll: true });
    });
}());
