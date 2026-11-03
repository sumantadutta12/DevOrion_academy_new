(function () {
    'use strict';

    var section = document.getElementById('career-counseling');
    if (!section) return;
    var fieldset = section.querySelector('.career-counseling__stages');
    var choices = Array.from(section.querySelectorAll('[name="career-stage"]'));
    var title = section.querySelector('[data-career-title]');
    var description = section.querySelector('[data-career-description]');
    var steps = Array.from(section.querySelectorAll('[data-career-step]'));
    var booking = section.querySelector('[data-career-booking]');
    if (!fieldset || !choices.length || !title || !description || steps.length !== 3 || !booking) return;

    var guidance = {
        starting: {
            stage: 'Starting out',
            title: 'Find a starting point that fits.',
            description: 'Talk through your interests, explore possible directions, and decide what to learn first.',
            steps: ['Explore interests', 'Compare paths', 'Pick a first step']
        },
        upskilling: {
            stage: 'Upskilling',
            title: 'Give your skills a clear direction.',
            description: 'Review what you know, identify what your target role needs, and focus your learning.',
            steps: ['Review your skills', 'Spot the gaps', 'Plan your learning']
        },
        switching: {
            stage: 'Career switch',
            title: 'Build a bridge to your next chapter.',
            description: 'Connect your experience with a new direction and discuss a realistic plan for the transition.',
            steps: ['Map your strengths', 'Explore new roles', 'Plan the transition']
        }
    };

    function updateGuidance(value) {
        if (!Object.prototype.hasOwnProperty.call(guidance, value)) return;
        var focus = guidance[value];
        title.textContent = focus.title;
        description.textContent = focus.description;
        steps.forEach(function (step, index) { step.textContent = focus.steps[index]; });
        var message = 'Hello DevOrion Academy! I would like to discuss career counseling.\n' +
            'My current stage: ' + focus.stage + '.\n' +
            'Please help me explore my options and arrange a suitable time to talk.';
        booking.href = 'https://wa.me/919046240277?text=' + encodeURIComponent(message);
    }

    choices.forEach(function (choice) {
        choice.addEventListener('change', function () {
            if (choice.checked) updateGuidance(choice.value);
        });
    });
    var selected = choices.find(function (choice) { return choice.checked; });
    updateGuidance(selected ? selected.value : 'starting');
    fieldset.hidden = false;
}());
