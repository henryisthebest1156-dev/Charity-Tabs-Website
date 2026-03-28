/**
 * Charity Tabs — lightweight site behavior
 * - Mobile nav toggle
 * - Current year in footer
 * - Optional placeholder for total raised (demo value)
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
})();
