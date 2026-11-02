(function () {
    'use strict';

    function selectCourses(courses, options) {
        var query = (options.query || '').trim().toLowerCase();
        var category = options.category || 'all';
        return courses.filter(function (course) {
            return (category === 'all' || course.categories.indexOf(category) !== -1) &&
                (!query || (course.title + ' ' + course.description + ' ' + course.categories.join(' ')).toLowerCase().indexOf(query) !== -1);
        }).sort(function (a, b) {
            if (options.sort === 'rating') return b.rating - a.rating || b.reviews - a.reviews;
            if (options.sort === 'newest') return b.newness - a.newness;
            if (options.sort === 'duration') return a.duration - b.duration || a.order - b.order;
            return a.order - b.order;
        });
    }

    var curricula = {
        fullstack: { topics: ['Build responsive interfaces with HTML, CSS and JavaScript', 'Create React components and connect them to REST APIs', 'Build Node.js services, work with databases and deploy your app'], project: 'Build and deploy a full-stack project management app.' },
        angular: { topics: ['Build reusable Angular components and templates', 'Handle routing, forms, services and dependency injection', 'Connect to APIs and manage asynchronous data with RxJS'], project: 'Create a dashboard with forms, routing and live API data.' },
        react: { topics: ['Create accessible, reusable components with JSX and props', 'Manage state, effects and forms with React hooks', 'Add routing, fetch API data and ship a production build'], project: 'Build an interactive task planner with persistent data.' },
        mobile: { topics: ['Build cross-platform screens with React Native and Expo', 'Add navigation, forms and device features', 'Connect to APIs and prepare your app for publishing'], project: 'Create a mobile habit tracker for iOS and Android.' },
        node: { topics: ['Create HTTP services and REST APIs with Node.js and Express', 'Add authentication, validation and database integration', 'Test, debug and deploy a backend application'], project: 'Build an authenticated API for a team project board.' },
        python: { topics: ['Work with Python syntax, functions, collections and modules', 'Read files, process data and consume APIs', 'Structure, test and debug practical Python applications'], project: 'Create a personal finance tracker with data import and reports.' },
        sql: { topics: ['Design relational schemas and understand normalization', 'Write queries with joins, grouping and subqueries', 'Manage indexes, transactions and database performance'], project: 'Design and query a database for an online learning platform.' },
        devops: { topics: ['Use Git workflows and automate checks with CI/CD', 'Package services with Docker and manage environments', 'Deploy, monitor and troubleshoot cloud applications'], project: 'Build a CI/CD pipeline for a containerized web application.' }
    };

    var paths = {
        frontend: { title: 'Frontend Developer Path', description: 'Go from your first web page to responsive, interactive React applications.', facts: ['4 Courses', '16 Weeks'], topics: ['HTML and accessible page structure', 'CSS layouts and responsive design', 'JavaScript fundamentals and browser APIs', 'React components, state and real-world projects'], project: 'Create a responsive portfolio and a complete React application.', category: 'frontend' },
        fullstack: { title: 'Full Stack Developer Path', description: 'Connect frontend interfaces, backend services and databases into complete products.', facts: ['6 Courses', '24 Weeks'], topics: ['HTML, CSS and JavaScript foundations', 'React interfaces and frontend architecture', 'Node.js, REST APIs and authentication', 'SQL, data modeling and database integration', 'Testing and collaborative Git workflows', 'Cloud deployment and CI/CD'], project: 'Build, test and deploy a complete full-stack web application.', category: 'fullstack' },
        mobile: { title: 'Mobile App Developer Path', description: 'Build a practical foundation for cross-platform mobile development.', facts: ['4 Courses', '16 Weeks'], topics: ['JavaScript and React fundamentals', 'React Native layouts and navigation', 'Expo device features and API integration', 'Testing and preparing your app for release'], project: 'Create a polished mobile application with real API data.', category: 'mobile' },
        backend: { title: 'Backend Developer Path', description: 'Learn to build reliable services and work confidently with application data.', facts: ['4 Courses', '20 Weeks'], topics: ['Programming foundations with Node.js or Python', 'REST APIs, validation and authentication', 'Relational databases and SQL queries', 'Testing, deployment and monitoring'], project: 'Ship a tested API with authentication and a relational database.', category: 'backend' },
        data: { title: 'Database & SQL Path', description: 'Understand data models, write useful queries and build data-driven applications.', facts: ['3 Courses', '12 Weeks'], topics: ['Relational database design', 'SQL queries, joins and reporting', 'Indexes, transactions and application integration'], project: 'Design a learning platform database and build reporting queries.', category: 'backend' },
        devops: { title: 'DevOps & Cloud Path', description: 'Take projects from source code to repeatable, monitored cloud deployments.', facts: ['3 Courses', '12 Weeks'], topics: ['Git collaboration and continuous integration', 'Docker containers and environment configuration', 'Cloud deployment, monitoring and troubleshooting'], project: 'Automate the build, test and deployment of a web application.', category: 'devops' }
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = { selectCourses: selectCourses, curricula: curricula, paths: paths };
    if (typeof document === 'undefined') return;

    var grid = document.querySelector('#software-course-grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll('.software-course'));
    var filters = Array.from(document.querySelectorAll('[data-software-filter]'));
    var search = document.querySelector('#software-search');
    var sort = document.querySelector('#software-sort');
    var status = document.querySelector('#software-results-status');
    var empty = document.querySelector('#software-empty');
    var heading = document.querySelector('#software-results-title');
    var activeCategory = 'all';
    var dialog = document.querySelector('#software-preview');
    var opener = null;
    var relatedCategory = null;
    var catalog = cards.map(function (card, index) {
        return { element: card, id: card.dataset.courseId, title: card.querySelector('h3').textContent.trim(), description: card.querySelector('.software-course__description').textContent.trim(), categories: card.dataset.categories.split(' '), rating: Number(card.dataset.rating), reviews: Number(card.dataset.reviews), duration: Number(card.dataset.duration), newness: Number(card.dataset.newness), order: index };
    });

    function updateCourses(announce) {
        var matches = selectCourses(catalog, { query: search.value, category: activeCategory, sort: sort.value });
        var visible = new Set(matches.map(function (course) { return course.id; }));
        catalog.forEach(function (course) { course.element.hidden = !visible.has(course.id); });
        matches.forEach(function (course) { grid.appendChild(course.element); });
        filters.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.softwareFilter === activeCategory)); });
        empty.hidden = matches.length !== 0;
        heading.textContent = activeCategory === 'all' && !search.value.trim() ? 'Most Popular Courses' : 'Explore Your Courses';
        if (announce) status.textContent = matches.length + (matches.length === 1 ? ' course found.' : ' courses found.');
    }

    filters.forEach(function (button) {
        var count = catalog.filter(function (course) { return button.dataset.softwareFilter === 'all' || course.categories.indexOf(button.dataset.softwareFilter) !== -1; }).length;
        button.querySelector('[data-filter-count]').textContent = '(' + count + ')';
        button.addEventListener('click', function () { activeCategory = button.dataset.softwareFilter; updateCourses(true); });
    });
    search.addEventListener('input', function () { updateCourses(true); });
    search.form.addEventListener('submit', function (event) { event.preventDefault(); updateCourses(true); });
    sort.addEventListener('change', function () { updateCourses(true); });
    document.querySelector('#software-clear-filters').addEventListener('click', function () {
        activeCategory = 'all'; search.value = ''; sort.value = 'popular'; updateCourses(true); search.focus();
    });

    function openPreview(details, trigger) {
        opener = trigger;
        relatedCategory = details.category || null;
        dialog.querySelector('.software-dialog__eyebrow').textContent = details.type;
        dialog.querySelector('h2').textContent = details.title;
        dialog.querySelector('.software-dialog__description').textContent = details.description;
        var facts = dialog.querySelector('.software-dialog__facts');
        facts.replaceChildren();
        details.facts.forEach(function (fact) { var item = document.createElement('span'); item.textContent = fact; facts.appendChild(item); });
        var topics = dialog.querySelector('.software-dialog__topics');
        topics.replaceChildren();
        details.topics.forEach(function (topic) { var item = document.createElement('li'); item.textContent = topic; topics.appendChild(item); });
        dialog.querySelector('.software-dialog__project').textContent = 'Put it into practice: ' + details.project;
        var action = dialog.querySelector('.software-dialog__action');
        action.href = relatedCategory ? '#software-courses' : '#contact';
        action.querySelector('span').textContent = relatedCategory ? 'Explore related courses' : 'Speak to our team';
        dialog.showModal();
    }

    catalog.forEach(function (course) {
        var button = course.element.querySelector('.software-course__open');
        if (button.tagName === 'A') return;
        button.addEventListener('click', function () {
            var curriculum = curricula[course.id];
            openPreview({ type: 'Course overview', title: course.title, description: course.description, facts: [course.element.dataset.lessons + ' Lessons', course.duration + ' Months', course.rating.toFixed(1) + ' Rating'], topics: curriculum.topics, project: curriculum.project }, button);
        });
    });
    document.querySelectorAll('[data-software-path]').forEach(function (button) {
        button.addEventListener('click', function () {
            var path = paths[button.dataset.softwarePath];
            openPreview({ type: 'Recommended learning path', title: path.title, description: path.description, facts: path.facts, topics: path.topics, project: path.project, category: path.category }, button);
        });
    });
    dialog.querySelector('.software-dialog__close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.software-dialog__action').addEventListener('click', function () {
        if (relatedCategory) { activeCategory = relatedCategory; search.value = ''; updateCourses(true); }
        dialog.close();
    });
    dialog.addEventListener('click', function (event) {
        if (event.target !== dialog) return;
        var bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', function () { if (opener) opener.focus({ preventScroll: true }); });

    document.querySelector('.software-cta__button').addEventListener('click', function () {
        activeCategory = 'all'; search.value = ''; sort.value = 'popular'; updateCourses(true);
    });

    var pathToggle = document.querySelector('#software-path-toggle');
    var extraPaths = document.querySelector('#software-extra-paths');
    pathToggle.addEventListener('click', function () {
        var expanded = pathToggle.getAttribute('aria-expanded') !== 'true';
        extraPaths.hidden = !expanded;
        pathToggle.setAttribute('aria-expanded', String(expanded));
        pathToggle.querySelector('span').textContent = expanded ? 'Show Fewer Paths' : 'View All Paths';
    });

    var headerBar = document.querySelector('.academy-header__bar');
    var backToTop = document.querySelector('.scrollToTop');
    function updateChrome() { headerBar.classList.toggle('header-fixed', window.scrollY > 50); backToTop.classList.toggle('active', window.scrollY > 600); }
    window.addEventListener('scroll', updateChrome, { passive: true });
    backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
    updateChrome();
    updateCourses(false);
}());
