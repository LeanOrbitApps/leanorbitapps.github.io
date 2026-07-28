/* =========================================================================
   LEAN ORBIT — Site JS
   - Theme (system default, manual override persisted)
   - Mobile navigation
   - Sticky-nav hairline on scroll
   - Reveal-on-scroll
   - App category filtering (products page)
   ========================================================================= */

(function () {
  'use strict';

  /* ---------- Theme -----------------------------------------------------
     The inline snippet in <head> sets the initial theme before paint so
     there's no flash. Here we only wire up the toggle.
     -------------------------------------------------------------------- */
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  if (toggle) {
    const label = () =>
      root.getAttribute('data-theme') === 'light'
        ? 'Switch to dark theme'
        : 'Switch to light theme';

    toggle.setAttribute('aria-label', label());

    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      toggle.setAttribute('aria-label', label());
      try { localStorage.setItem('lo-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- Mobile navigation ---------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    const setOpen = (open) => {
      navLinks.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    };

    navToggle.addEventListener('click', () => {
      setOpen(!navLinks.classList.contains('is-open'));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- Sticky nav hairline -------------------------------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Reveal on scroll ----------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => io.observe(el));

    // Safety net for cases where the observer never fires (print, very short
    // viewports, screenshot tooling).
    setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 1800);
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- App filtering (products page) ---------------------------- */
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.app-card[data-cat]');
  const emptyState = document.querySelector('.apps__empty');

  if (filters.length && cards.length) {
    const apply = (value) => {
      let shown = 0;

      cards.forEach((card) => {
        const cats = (card.dataset.cat || '').split(' ');
        const match = value === 'all' || cats.includes(value);
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      filters.forEach((f) =>
        f.setAttribute('aria-pressed', String(f.dataset.filter === value))
      );

      if (emptyState) emptyState.hidden = shown > 0;
    };

    filters.forEach((f) => {
      f.addEventListener('click', () => apply(f.dataset.filter));
    });
  }

  /* ---------- Footer year ---------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
