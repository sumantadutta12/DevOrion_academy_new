(function () {
    'use strict';

    var previews = {
        frontend: { title: 'Build the frontend', description: 'Create a reusable interface with React components, then connect user actions to application state.', code: "function ProjectCard({ title }) {\n  return (\n    <article className=\"project-card\">\n      <h2>{title}</h2>\n      <button>Open project</button>\n    </article>\n  );\n}", output: 'Example project: Learning dashboard. Practice responsive layouts, reusable components and accessible interactions.' },
        backend: { title: 'Connect your backend', description: 'Build an API that validates requests and provides structured data to the frontend.', code: "app.get('/api/projects', async (req, res) => {\n  const projects = await Project.find({\n    owner: req.user.id\n  });\n\n  res.json({ projects });\n});", output: 'Example response: { "projects": [{ "title": "Learning dashboard", "status": "in-progress" }] }' },
        database: { title: 'Store application data', description: 'Model your application data, connect it to backend services and understand relationships between records.', code: "const projectSchema = new Schema({\n  title: { type: String, required: true },\n  owner: { type: ObjectId, ref: 'User' },\n  status: {\n    type: String,\n    default: 'in-progress'\n  }\n});", output: 'Example data model: each project has a title, an owner and a status. The course connects this model to your API and React interface.' }
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = { previews: previews };
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
    }
    window.addEventListener('hashchange', updateTabs);
    updateTabs();

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
