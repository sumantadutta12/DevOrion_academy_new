(function () {
    'use strict';

    var header = document.querySelector('.academy-header__bar');
    var backToTop = document.querySelector('.scrollToTop');
    function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    function updateChrome() {
        if (header) header.classList.toggle('header-fixed', window.scrollY > 50);
        if (backToTop) backToTop.classList.toggle('active', window.scrollY > 600);
    }
    window.addEventListener('scroll', updateChrome, { passive: true });
    if (backToTop) backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
    updateChrome();

    var grid = document.getElementById('project-grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll('.project-card'));
    var filters = Array.from(document.querySelectorAll('[data-project-filter]'));
    var search = document.getElementById('project-search');
    var sort = document.getElementById('project-sort');
    var results = document.getElementById('project-results');
    var empty = document.getElementById('project-empty');
    var selectedCategory = 'all';

    function renderProjects() {
        var words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
        var visible = 0;
        cards.forEach(function (card) {
            var matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
            var text = card.dataset.search.toLowerCase();
            var matchesSearch = words.every(function (word) { return text.indexOf(word) !== -1; });
            card.hidden = !matchesCategory || !matchesSearch;
            if (!card.hidden) visible += 1;
        });
        var ordered = cards.slice();
        if (sort.value === 'title') ordered.sort(function (a, b) {
            return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        });
        ordered.forEach(function (card) { grid.appendChild(card); });
        filters.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.projectFilter === selectedCategory));
        });
        empty.hidden = visible !== 0;
        results.textContent = 'Showing ' + visible + ' of ' + cards.length + ' project briefs';
    }
    filters.forEach(function (button) {
        button.addEventListener('click', function () {
            selectedCategory = button.dataset.projectFilter;
            renderProjects();
        });
    });
    search.addEventListener('input', renderProjects);
    sort.addEventListener('change', renderProjects);
    document.getElementById('project-reset').addEventListener('click', function () {
        selectedCategory = 'all';
        search.value = '';
        sort.value = 'featured';
        renderProjects();
        search.focus({ preventScroll: true });
    });
    renderProjects();
    document.getElementById('project-controls').hidden = false;

    var dialog = document.getElementById('project-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var activeOpener = null;
    var originalOverflow = null;
    function unlockPage() {
        if (!originalOverflow) return;
        document.documentElement.style.overflow = originalOverflow.root;
        document.body.style.overflow = originalOverflow.body;
        originalOverflow = null;
    }
    function openProject(id, opener) {
        var card = document.getElementById('project-' + id);
        if (!card) return false;
        var art = card.querySelector('.project-preview');
        var tech = card.querySelector('.project-tech');
        var brief = card.querySelector('.project-brief');
        if (!art || !tech || !brief) return false;
        document.getElementById('project-dialog-title').textContent = card.querySelector('h3').textContent;
        document.getElementById('project-dialog-category').textContent = 'Sample Project Brief / ' + card.querySelector('.project-card__category > span').textContent;
        document.getElementById('project-dialog-art').replaceChildren(art.cloneNode(true), tech.cloneNode(true));
        document.getElementById('project-dialog-brief').replaceChildren(brief.cloneNode(true));
        document.getElementById('project-dialog-course').href = card.dataset.course;
        activeOpener = opener;
        if (!originalOverflow) {
            originalOverflow = { root: document.documentElement.style.overflow, body: document.body.style.overflow };
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
        try {
            if (!dialog.open) dialog.showModal();
        } catch (error) {
            unlockPage();
            return false;
        }
        return true;
    }
    document.querySelectorAll('[data-view-project]').forEach(function (button) {
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-controls', 'project-dialog');
        button.addEventListener('click', function (event) {
            if (openProject(button.dataset.viewProject, button)) event.preventDefault();
        });
    });
    dialog.querySelector('.projects-dialog__close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
        if (event.target !== dialog) return;
        var bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', function () {
        if (dialog.open) return;
        unlockPage();
        if (activeOpener && activeOpener.isConnected) activeOpener.focus({ preventScroll: true });
        activeOpener = null;
    });
    window.addEventListener('pagehide', function () {
        activeOpener = null;
        if (dialog.open) dialog.close();
        unlockPage();
    });
}());
