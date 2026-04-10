/* ═══════════════════════════════════════════
   PentolGhepek.Kita — script.js
═══════════════════════════════════════════ */

'use strict';

// ── NAVBAR: scroll state + hamburger ──────────────────
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ── SMOOTH SCROLL for anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── SCROLL REVEAL (IntersectionObserver) ─────────────
(function () {
  const elems = document.querySelectorAll('.reveal');
  if (!elems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elems.forEach(el => observer.observe(el));
})();

// ── ACTIVE NAV LINK on scroll (highlight) ─────────────
(function () {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const navH      = 80;

  function setActive() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - navH - 40;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.style.color = href === current
        ? 'var(--red-600)'
        : '';
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

// ── COUNTER ANIMATION for stat numbers ─────────────────
(function () {
  const stats = document.querySelectorAll('.stat-num');
  const animated = new Set();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || animated.has(entry.target)) return;
      animated.add(entry.target);

      const el    = entry.target;
      const text  = el.textContent.trim();
      const match = text.match(/[\d.]+/);
      if (!match) return; // Skip non-numeric like ⭐ 4.9

      const target = parseFloat(match[0]);
      const prefix = text.startsWith('⭐') ? '⭐ ' : '';
      const suffix = text.endsWith('+') ? '+' : '';
      const isDecimal = match[0].includes('.');
      const duration = 1000; // ms
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = eased * target;
        el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
