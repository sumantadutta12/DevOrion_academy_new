(function () {
    'use strict';

    var section = document.querySelector('.featured-learning');
    if (!section) return;

    var cards = Array.from(section.querySelectorAll('.featured-course'));
    var filters = Array.from(section.querySelectorAll('[data-course-filter]'));
    var status = section.querySelector('.course-filter-status');
    var dialog = section.querySelector('.course-dialog');
    var opener = null;
    var syllabus = {
        software: {
            topics: ['Programming fundamentals and structured problem solving', 'Object-oriented concepts and reusable code', 'Debugging, testing, and maintainable project structure'],
            project: 'Build a command-line task manager.'
        },
        web: {
            topics: ['Responsive interfaces with HTML, CSS, and JavaScript', 'Working with APIs and handling application data', 'Connecting a frontend, backend, and database'],
            project: 'Build a full-stack project board.'
        },
        ux: {
            topics: ['User research, journeys, and wireframes', 'Design systems and reusable Figma components', 'Interactive prototypes and usability feedback'],
            project: 'Design and prototype a mobile app experience.'
        },
        python: {
            topics: ['Variables, control flow, functions, and collections', 'Reading files and handling real-world data', 'Writing small scripts to automate everyday tasks'],
            project: 'Create a personal expense-tracking script.'
        },
        design: {
            topics: ['Typography, color, spacing, and visual hierarchy', 'Responsive layouts with CSS Grid and Flexbox', 'Accessible patterns for different devices'],
            project: 'Design and build a responsive portfolio website.'
        },
        react: {
            topics: ['Components, JSX, props, and reusable interfaces', 'State, hooks, events, and form interactions', 'Bringing components together into a complete app'],
            project: 'Build an interactive personal dashboard.'
        }
    };

    filters.forEach(function (button) {
        button.addEventListener('click', function () {
            var filter = button.dataset.courseFilter;
            var visibleCount = 0;
            cards.forEach(function (card) {
                card.hidden = filter !== 'all' && card.dataset.courseCategory !== filter;
                if (!card.hidden) visibleCount += 1;
            });
            filters.forEach(function (item) {
                item.setAttribute('aria-pressed', String(item === button));
            });
            status.textContent = visibleCount + (filter === 'all' ? ' courses to explore.' : ' ' + filter + ' courses to explore.');
        });
    });

    cards.forEach(function (card) {
        card.querySelector('.course-syllabus-button').addEventListener('click', function (event) {
            var details = syllabus[card.dataset.courseId];
            var styles = window.getComputedStyle(card);
            opener = event.currentTarget;
            dialog.style.setProperty('--course-accent', styles.getPropertyValue('--course-accent'));
            dialog.style.setProperty('--course-tint', styles.getPropertyValue('--course-tint'));
            dialog.querySelector('.course-dialog__category').textContent = card.querySelector('.featured-course__category').textContent.trim();
            dialog.querySelector('h2').textContent = card.querySelector('h3').textContent;
            dialog.querySelector('.course-dialog__description').textContent = card.querySelector('.featured-course__description').textContent;
            dialog.querySelector('.course-dialog__skills').replaceChildren(card.querySelector('.featured-course__skills').cloneNode(true));
            var list = dialog.querySelector('.course-dialog__topics');
            list.replaceChildren();
            details.topics.forEach(function (topic) {
                var item = document.createElement('li');
                item.textContent = topic;
                list.appendChild(item);
            });
            dialog.querySelector('.course-dialog__project strong').textContent = details.project;
            dialog.showModal();
        });
    });

    dialog.querySelectorAll('.course-dialog__close, .course-dialog__back').forEach(function (button) {
        button.addEventListener('click', function () { dialog.close(); });
    });
    dialog.addEventListener('click', function (event) {
        if (event.target !== dialog) return;
        var bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', function () {
        if (opener) opener.focus({ preventScroll: true });
    });
})();
