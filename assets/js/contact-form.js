/* Contact form: sends messages to Formspree without leaving the page */
(function () {
	var form = document.getElementById('contact-form');
	if (!form) return;
	var btn = document.getElementById('contact-submit');
	var status = document.getElementById('contact-status');

	function show(msg, isError) {
		status.textContent = msg;
		status.style.color = isError ? '#c0392b' : '#18bfef';
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		if (!form.checkValidity()) { form.reportValidity(); return; }
		btn.disabled = true; btn.value = 'Sending...';
		show('', false);
		fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
			.then(function (r) {
				if (!r.ok) throw new Error('bad status');
				form.reset();
				show("Thank you! Your message has been sent. I'll get back to you soon.", false);
			})
			.catch(function () {
				show('Sorry, your message could not be sent. Please try again or reach me on LinkedIn.', true);
			})
			.then(function () { btn.disabled = false; btn.value = 'Send Message'; });
	});
})();
