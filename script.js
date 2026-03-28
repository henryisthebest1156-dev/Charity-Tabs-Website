/**
 * Charity Tabs — lightweight site behavior
 * - Mobile nav toggle
 * - Current year in footer
 * - Optional placeholder for total raised (demo value)
 * - Contact form → FormSubmit AJAX → htgamesdev@gmail.com
 */

(function () {
  'use strict';

  // --- Mobile navigation: open/close and sync aria-expanded ---
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when a same-page link is chosen (better UX on small screens)
    menu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 640px)').matches) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- Footer year (no build step needed) ---
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // --- Total raised placeholder: replace with API fetch when ready ---
  var totalRaisedEl = document.getElementById('total-raised');
  if (totalRaisedEl) {
    // Example static placeholder; swap for fetch('/api/stats') etc.
    totalRaisedEl.textContent = '$0.00';
  }

  // --- Contact form: POST JSON to FormSubmit (forwards to inbox above) ---
  // First submission triggers a one-time activation email from FormSubmit to that address.
  var contactForm = document.getElementById('contact-form');
  var contactStatus = document.getElementById('contact-status');
  if (contactForm && contactStatus) {
    var submitBtn = contactForm.querySelector('.contact-form__submit');
    var formsubmitAjax = 'https://formsubmit.co/ajax/htgamesdev@gmail.com';

    function setStatus(message, kind) {
      contactStatus.hidden = false;
      contactStatus.textContent = message;
      contactStatus.className = 'contact-form__status';
      if (kind === 'success') {
        contactStatus.classList.add('contact-form__status--success');
      } else if (kind === 'error') {
        contactStatus.classList.add('contact-form__status--error');
      }
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!submitBtn) return;

      contactStatus.hidden = true;
      contactStatus.textContent = '';
      contactStatus.className = 'contact-form__status';

      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');

      var payload = {};
      new FormData(contactForm).forEach(function (value, key) {
        payload[key] = value;
      });

      fetch(formsubmitAjax, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success !== false) {
            setStatus('Thanks — your message was sent. We’ll get back to you soon.', 'success');
            contactForm.reset();
          } else {
            var err =
              (result.data && result.data.message) ||
              'Something went wrong. Please try again or email us directly.';
            setStatus(err, 'error');
          }
        })
        .catch(function () {
          setStatus(
            'Could not send right now. Try again later or email htgamesdev@gmail.com directly.',
            'error',
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
        });
    });
  }
})();
