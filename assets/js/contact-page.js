(function () {
    'use strict';

    function reducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    var header = document.querySelector('.academy-header__bar');
    var backToTop = document.querySelector('.scrollToTop');
    function updateChrome() {
        if (header) header.classList.toggle('header-fixed', window.scrollY > 50);
        if (backToTop) backToTop.classList.toggle('active', window.scrollY > 600);
    }
    window.addEventListener('scroll', updateChrome, { passive: true });
    if (backToTop) backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
    updateChrome();

    var form = document.getElementById('academy-contact-form');
    if (!form) return;
    var interest = document.getElementById('contact-interest');
    var phone = document.getElementById('contact-phone');
    var message = document.getElementById('contact-message');
    var status = document.getElementById('contact-form-status');
    var draftActions = document.getElementById('contact-draft-actions');
    var draftLink = document.getElementById('contact-draft-link');
    var copyButton = document.getElementById('contact-copy-message');
    var currentMessage = '';
    var recipient = 'info@devorionacademy.com';

    document.querySelectorAll('[data-enquiry]').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            draftActions.hidden = true;
            currentMessage = '';
            interest.value = button.dataset.enquiry;
            status.textContent = button.dataset.enquiry + ' selected. Tell us how we can help below.';
            document.getElementById('contact-form').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
            message.focus({ preventScroll: true });
        });
    });

    function validatePhone() {
        var value = phone.value.trim();
        var digits = value.replace(/\D/g, '');
        var valid = /^[+\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
        phone.setCustomValidity(value && !valid ? 'Enter a valid phone number with 7 to 15 digits.' : '');
    }
    phone.addEventListener('input', validatePhone);
    phone.addEventListener('change', validatePhone);

    form.addEventListener('input', function () {
        if (!draftActions.hidden) {
            draftActions.hidden = true;
            currentMessage = '';
            status.textContent = 'Your details have changed. Use Send Message to prepare an updated draft.';
        }
    });
    form.addEventListener('change', function () {
        if (!draftActions.hidden) {
            draftActions.hidden = true;
            currentMessage = '';
            status.textContent = 'Your details have changed. Use Send Message to prepare an updated draft.';
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validatePhone();
        var name = document.getElementById('contact-name');
        name.setCustomValidity(name.value.trim() ? '' : 'Enter your name.');
        message.setCustomValidity(message.value.trim() ? '' : 'Tell us how we can help you.');
        if (!form.reportValidity()) return;

        var email = document.getElementById('contact-email').value.trim();
        var subject = 'DevOrion Academy enquiry: ' + interest.value;
        currentMessage = [
            'Hello DevOrion Academy,', '',
            'Name: ' + name.value.trim(),
            'Email: ' + email,
            'Phone: ' + phone.value.trim(),
            'Interested in: ' + interest.value,
            '', 'Message:', message.value.trim(), ''
        ].join('\r\n');
        var draftUrl = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(currentMessage);
        draftLink.href = draftUrl;
        draftActions.hidden = false;
        status.textContent = 'Your email draft is ready. Complete sending in your email app. You can also copy your message below.';
        window.location.href = draftUrl;
    });

    ['contact-name', 'contact-message'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', function (event) {
            event.target.setCustomValidity('');
        });
    });

    copyButton.addEventListener('click', function () {
        if (!currentMessage) return;
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            status.textContent = 'Copy is unavailable here. Use Open Email Draft or email ' + recipient + ' directly.';
            return;
        }
        navigator.clipboard.writeText(currentMessage).then(function () {
            status.textContent = 'Message copied. Paste it into an email to ' + recipient + ' and send it there.';
        }).catch(function () {
            status.textContent = 'The message could not be copied. Use Open Email Draft or email ' + recipient + ' directly.';
        });
    });
}());
