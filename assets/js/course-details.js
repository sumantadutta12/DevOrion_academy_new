(function () {
    'use strict';

    var previews = {
        frontend: { title: 'Build the frontend', description: 'Create a reusable interface with React components, then connect user actions to application state.', code: "function ProjectCard({ title }) {\n  return (\n    <article className=\"project-card\">\n      <h2>{title}</h2>\n      <button>Open project</button>\n    </article>\n  );\n}", output: 'Example project: Learning dashboard. Practice responsive layouts, reusable components and accessible interactions.' },
        backend: { title: 'Connect your backend', description: 'Build an API that validates requests and provides structured data to the frontend.', code: "app.get('/api/projects', async (req, res) => {\n  const projects = await Project.find({\n    owner: req.user.id\n  });\n\n  res.json({ projects });\n});", output: 'Example response: { "projects": [{ "title": "Learning dashboard", "status": "in-progress" }] }' },
        database: { title: 'Store application data', description: 'Model your application data, connect it to backend services and understand relationships between records.', code: "const projectSchema = new Schema({\n  title: { type: String, required: true },\n  owner: { type: ObjectId, ref: 'User' },\n  status: {\n    type: String,\n    default: 'in-progress'\n  }\n});", output: 'Example data model: each project has a title, an owner and a status. The course connects this model to your API and React interface.' }
    };
    function reviewIndex(index, count) { return count > 0 ? ((index % count) + count) % count : 0; }
    function reviewStep(width, perView, gap) { return (width - gap * (perView - 1)) / perView + gap; }
    if (typeof module !== 'undefined' && module.exports) module.exports = { previews: previews, reviewIndex: reviewIndex, reviewStep: reviewStep };
    if (typeof document === 'undefined') return;

    var activeOpener = null;
    var preview = document.querySelector('#course-preview-dialog');
    function openDialog(dialog, opener) { activeOpener = opener; dialog.showModal(); }
    document.querySelectorAll('[data-course-preview]').forEach(function (button) { button.addEventListener('click', function () { openDialog(preview, button); }); });
    document.querySelectorAll('.course-dialog').forEach(function (dialog) {
        dialog.querySelector('.course-dialog__close').addEventListener('click', function () { dialog.close(); });
        dialog.addEventListener('click', function (event) {
            if (event.target !== dialog) return;
            var bounds = dialog.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
        });
        dialog.addEventListener('close', function () { if (activeOpener) activeOpener.focus({ preventScroll: true }); });
    });
    var previewButtons = Array.from(document.querySelectorAll('[data-preview-topic]'));
    function setPreview(topic) {
        var details = previews[topic];
        preview.querySelector('#course-preview-lesson-title').textContent = details.title;
        preview.querySelector('.course-preview-lesson p').textContent = details.description;
        preview.querySelector('.course-preview-lesson code').textContent = details.code;
        preview.querySelector('.course-preview-output').textContent = details.output;
        previewButtons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.previewTopic === topic)); });
    }
    previewButtons.forEach(function (button) { button.addEventListener('click', function () { setPreview(button.dataset.previewTopic); }); });
    setPreview('frontend');

    var tabs = Array.from(document.querySelectorAll('.course-tabs a'));
    function updateTabs() {
        var hash = window.location.hash || '#course-overview';
        tabs.forEach(function (tab) { if (tab.hash === hash) tab.setAttribute('aria-current', 'location'); else tab.removeAttribute('aria-current'); });
        if (hash === '#course-faqs') document.querySelector('#course-faqs').open = true;
    }
    tabs.forEach(function (tab) { tab.addEventListener('click', function () { if (tab.hash === '#course-faqs') document.querySelector('#course-faqs').open = true; }); });
    window.addEventListener('hashchange', updateTabs);
    updateTabs();

    var reviewToggle = document.querySelector('#course-reviews-toggle');
    var reviewGrid = document.querySelector('#course-review-grid');
    reviewToggle.addEventListener('click', function () {
        var expanded = reviewToggle.getAttribute('aria-expanded') !== 'true';
        reviewToggle.setAttribute('aria-expanded', String(expanded));
        reviewToggle.querySelector('span').textContent = expanded ? 'Show Less' : 'Read Full Reviews';
        reviewGrid.classList.toggle('is-expanded', expanded);
    });

    var reviewViewport = document.querySelector('#course-review-viewport');
    var reviews = Array.from(reviewGrid.querySelectorAll('.course-review'));
    var reviewControls = document.querySelector('.course-review-controls');
    var reviewDots = document.querySelector('.course-review-dots');
    var reviewStatus = document.querySelector('#course-review-status');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var slidePosition = reviews.length;
    var slideStep = 0;
    var sliding = false;
    var slideTimer = null;
    var touchStart = null;

    function cloneReview(review) {
        var clone = review.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('inert', '');
        clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(function (item) { item.removeAttribute('id'); });
        return clone;
    }
    var leadingReviews = document.createDocumentFragment();
    var trailingReviews = document.createDocumentFragment();
    reviews.forEach(function (review, index) {
        review.setAttribute('role', 'group');
        review.setAttribute('aria-roledescription', 'slide');
        review.setAttribute('aria-label', (index + 1) + ' of ' + reviews.length);
        leadingReviews.appendChild(cloneReview(review));
        trailingReviews.appendChild(cloneReview(review));
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'course-review-dot';
        dot.setAttribute('aria-label', 'Show review by ' + review.querySelector('.course-review__author strong').textContent);
        dot.setAttribute('aria-controls', 'course-review-grid');
        dot.addEventListener('click', function () { goToReview(reviews.length + index); });
        reviewDots.appendChild(dot);
    });
    reviewGrid.prepend(leadingReviews);
    reviewGrid.appendChild(trailingReviews);
    reviewViewport.classList.add('is-carousel');
    reviewControls.hidden = reviews.length < 2;

    function setReviewPosition(animate) {
        reviewGrid.style.transition = animate ? 'transform 400ms cubic-bezier(.22,.61,.36,1)' : 'none';
        reviewGrid.style.transform = 'translateX(' + (-slidePosition * slideStep) + 'px)';
    }
    function updateReviewDots(announce) {
        var index = reviewIndex(slidePosition - reviews.length, reviews.length);
        Array.from(reviewDots.children).forEach(function (dot, dotIndex) {
            if (index === dotIndex) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        if (announce) reviewStatus.textContent = 'Review ' + (index + 1) + ' of ' + reviews.length + '.';
    }
    function finishReviewSlide() {
        clearTimeout(slideTimer);
        slidePosition = reviews.length + reviewIndex(slidePosition - reviews.length, reviews.length);
        setReviewPosition(false);
        sliding = false;
    }
    function goToReview(position) {
        if (sliding || reviews.length < 2 || position === slidePosition) return;
        slidePosition = position;
        sliding = true;
        setReviewPosition(!reducedMotion.matches);
        updateReviewDots(true);
        if (reducedMotion.matches) finishReviewSlide();
        else slideTimer = setTimeout(finishReviewSlide, 450);
    }
    function sizeReviews() {
        var styles = window.getComputedStyle(reviewGrid);
        var perView = Number(styles.getPropertyValue('--reviews-per-view')) || 1;
        var gap = parseFloat(styles.columnGap) || 16;
        slideStep = reviewStep(reviewGrid.getBoundingClientRect().width, perView, gap);
        finishReviewSlide();
        updateReviewDots(false);
    }
    reviewGrid.addEventListener('transitionend', function (event) {
        if (event.target === reviewGrid && event.propertyName === 'transform') finishReviewSlide();
    });
    document.querySelector('[data-review-prev]').addEventListener('click', function () { goToReview(slidePosition - 1); });
    document.querySelector('[data-review-next]').addEventListener('click', function () { goToReview(slidePosition + 1); });
    reviewViewport.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') { event.preventDefault(); goToReview(slidePosition - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); goToReview(slidePosition + 1); }
        if (event.key === 'Home') { event.preventDefault(); goToReview(reviews.length); }
        if (event.key === 'End') { event.preventDefault(); goToReview(reviews.length * 2 - 1); }
    });
    reviewViewport.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'mouse' || !event.isPrimary) return;
        touchStart = { x: event.clientX, y: event.clientY };
        reviewViewport.setPointerCapture(event.pointerId);
    });
    reviewViewport.addEventListener('pointerup', function (event) {
        if (!touchStart) return;
        var x = event.clientX - touchStart.x;
        var y = event.clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y)) goToReview(slidePosition + (x < 0 ? 1 : -1));
    });
    reviewViewport.addEventListener('pointercancel', function () { touchStart = null; });
    if (typeof ResizeObserver === 'function') new ResizeObserver(sizeReviews).observe(reviewViewport);
    else window.addEventListener('resize', sizeReviews, { passive: true });
    sizeReviews();
    var moduleList = Array.from(document.querySelectorAll('.course-module'));
    var totalLessons = moduleList.reduce(function (sum, item) { return sum + Number(item.dataset.lessons); }, 0);
    var totalMinutes = moduleList.reduce(function (sum, item) { return sum + Number(item.dataset.minutes); }, 0);
    document.querySelectorAll('[data-course-lesson-count]').forEach(function (item) { item.textContent = totalLessons + ' Lessons'; });
    document.querySelectorAll('[data-course-hours]').forEach(function (item) { item.textContent = (totalMinutes / 60) + ' Hours'; });

    var bar = document.querySelector('.academy-header__bar');
    var backToTop = document.querySelector('.scrollToTop');
    function updateChrome() {
        bar.classList.toggle('header-fixed', window.scrollY > 50);
        backToTop.classList.toggle('active', window.scrollY > 600);
    }
    window.addEventListener('scroll', updateChrome, { passive: true });
    window.addEventListener('resize', updateChrome, { passive: true });
    backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
    updateChrome();
}());
