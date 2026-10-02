'use strict';
(() => {
  // Shared navigation and download behavior for the landing page and documents.
  const dialog = document.querySelector('#availability-dialog');
  let storeUrl = '';
  try {
    const candidate = new URL(window.BIPS_CONFIG?.googlePlayUrl || '');
    if (candidate.protocol === 'https:' && candidate.hostname === 'play.google.com' && candidate.pathname.startsWith('/store/apps/details') && candidate.searchParams.get('id')) storeUrl = candidate.href;
  } catch { /* The local preview stays in prelaunch mode. */ }
  document.querySelectorAll('[data-download]').forEach(button => {
    if (storeUrl) {
      button.querySelector('[data-download-label]').textContent = button.classList.contains('header-download') || button.closest('.mobile-download-bar') ? 'Get the app' : 'Get it on Google Play';
      button.querySelector('[data-store-caption]')?.replaceChildren('DOWNLOAD FOR ANDROID');
    }
    button.addEventListener('click', () => storeUrl ? window.location.assign(storeUrl) : dialog?.showModal());
  });
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => dialog?.close()));
  dialog?.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  if (storeUrl) {
    const answer = document.querySelector('[data-availability-answer]');
    if (answer) answer.textContent = 'Bible in Plain Sight is available for Android on Google Play. Use any download button on this page to open the app listing.';
    if (document.body.dataset.page === 'home') document.querySelector('meta[name="description"]').content = "Find Scripture and prayer for what you are facing. Bible in Plain Sight is a Christian Android app with Bible passages in context and a private journal. Available on Google Play.";
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  function closeMenu() {
    siteNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    siteNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  siteNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  // Highlight the section reached by the menu, including direct fragment links.
  const homePage = document.body.dataset.page === 'home';
  function updateNavigation() {
    siteNav?.querySelectorAll('a').forEach(link => {
      const active = homePage && new URL(link.href).hash === window.location.hash && Boolean(window.location.hash);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();

  const mobileBar = document.querySelector('.mobile-download-bar');
  const hero = document.querySelector('.hero');
  if (mobileBar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      mobileBar.classList.toggle('is-visible', !entry.isIntersecting);
      mobileBar.inert = entry.isIntersecting;
    }, { threshold: 0 }).observe(hero);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.style.setProperty('--ambient-play', entry.isIntersecting ? 'running' : 'paused')));
    document.querySelectorAll('.closing-section').forEach(element => observer.observe(element));
  }
  const syncVisibility = () => document.documentElement.classList.toggle('motion-paused', document.hidden);
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
})();
