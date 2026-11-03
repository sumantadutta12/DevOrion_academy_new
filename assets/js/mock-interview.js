(function () {
    'use strict';

    var section = document.getElementById('mock-interviews');
    if (!section) return;
    var tabs = Array.from(section.querySelectorAll('[role="tab"]'));
    var panels = Array.from(section.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length || tabs.length !== panels.length) return;

    function selectTab(tab, focus) {
        tabs.forEach(function (item) {
            var selected = item === tab;
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });
        panels.forEach(function (panel) {
            panel.hidden = panel.id !== tab.getAttribute('aria-controls');
        });
        if (focus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { selectTab(tab, false); });
        tab.addEventListener('keydown', function (event) {
            var nextIndex;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = tabs.length - 1;
            else return;
            event.preventDefault();
            selectTab(tabs[nextIndex], true);
        });
    });
}());
