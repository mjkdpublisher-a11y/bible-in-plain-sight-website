'use strict';
(() => {
  const scene = document.querySelector('.hero-products .hero-visual');
  if (scene) {
    const fit = () => {
      const scale = scene.clientWidth / 640;
      scene.style.setProperty('--scene-scale', String(scale));
      scene.style.height = `${590 * scale}px`;
    };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(scene);
    else window.addEventListener('resize', fit);
  }
  const purchases = window.BIPS_CONFIG?.purchases || {};
  document.querySelectorAll('[data-podcast]').forEach(link => {
    try {
      const url=new URL(window.BIPS_CONFIG?.podcast?.[link.dataset.podcast]);
      if(url.protocol==='https:' && url.hostname==='www.youtube.com') link.href=url.href;
    } catch { /* Keep the working literal link. */ }
  });
  document.querySelectorAll('[data-purchase]').forEach(link => {
    const candidate = purchases[link.dataset.purchase];
    if (!candidate) return;
    try {
      const url = new URL(candidate);
      if (url.protocol === 'https:') link.href = url.href;
    } catch { /* The verified literal link in the HTML remains available. */ }
  });
})();
