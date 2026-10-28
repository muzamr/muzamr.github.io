/* Request Access modal: sends access requests to Formspree */
(function () {
	var ENDPOINT = 'https://formspree.io/f/xjyywdnp';
	var overlay = document.getElementById('ra-overlay');
	if (!overlay) return;
	var modal = overlay.querySelector('.ra-modal');
	var form = document.getElementById('ra-form');
	var projectLabel = document.getElementById('ra-project');
	var projectField = document.getElementById('ra-project-field');
	var subjectField = document.getElementById('ra-subject-field');
	var status = document.getElementById('ra-status');
	var submitBtn = document.getElementById('ra-submit');
	var lastTrigger = null;

	function open(project, trigger) {
		lastTrigger = trigger || null;
		form.reset();
		modal.classList.remove('is-sent');
		status.textContent = ''; status.classList.remove('is-error');
		submitBtn.disabled = false; submitBtn.value = 'Send Request';
		projectLabel.textContent = project;
		projectField.value = project;
		subjectField.value = 'Portfolio access request: ' + project;
		overlay.classList.add('is-open');
		overlay.setAttribute('aria-hidden', 'false');
		document.body.classList.add('ra-locked');
		setTimeout(function () { document.getElementById('ra-name').focus(); }, 50);
	}
	function close() {
		overlay.classList.remove('is-open');
		overlay.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('ra-locked');
		if (lastTrigger) lastTrigger.focus();
	}

	document.querySelectorAll('.request-access').forEach(function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			open(el.getAttribute('data-project'), el);
		});
	});
	overlay.querySelectorAll('[data-ra-close]').forEach(function (el) {
		el.addEventListener('click', close);
	});
	overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
	});

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		if (!form.checkValidity()) { form.reportValidity(); return; }
		submitBtn.disabled = true; submitBtn.value = 'Sending...';
		status.textContent = ''; status.classList.remove('is-error');
		fetch(ENDPOINT, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
			.then(function (r) {
				if (!r.ok) throw new Error('bad status');
				modal.classList.add('is-sent');
			})
			.catch(function () {
				status.textContent = 'Sorry, your request could not be sent. Please try again in a moment.';
				status.classList.add('is-error');
				submitBtn.disabled = false; submitBtn.value = 'Send Request';
			});
	});
})();
