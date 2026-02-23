(function () {
  'use strict';

  // --- Year in footer ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobile nav toggle ---
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    // Close menu when clicking a link (for single-page nav)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Smooth scroll for anchor links (reinforce if needed) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Contact form: set redirect after submit (FormSubmit.co) ---
  var form = document.getElementById('contactForm');
  if (form) {
    var nextInput = form.querySelector('input[name="_next"]');
    if (nextInput) nextInput.value = window.location.href.split('#')[0] + '#contact';
  }

  // --- Scroll-in animation for sections ---
  var observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section-title, .about-card, .tech-card, .project-card, .contact-info, .contact-form').forEach(function (el) {
    el.classList.add('animate-in');
    observer.observe(el);
  });
})();
