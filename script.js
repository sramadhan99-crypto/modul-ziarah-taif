(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var S = window.SITE || {};
  document.documentElement.classList.add('js');

  /* ---- harga ---- */
  $$('[data-price]').forEach(function (el) { el.textContent = 'RM' + Number(S.price || 19.9).toFixed(2); });

  /* ---- intro ---- */
  var intro = $('#intro');
  if (intro && document.documentElement.classList.contains('has-intro')) {
    var closed = false;
    var closeIntro = function () {
      if (closed) return; closed = true;
      intro.classList.add('is-done');
      try { sessionStorage.setItem('taif-intro', '1'); } catch (e) {}
      setTimeout(function () { document.documentElement.classList.remove('has-intro'); }, 900);
    };
    setTimeout(closeIntro, 2600);
    $('#introSkip').addEventListener('click', closeIntro);
    intro.addEventListener('click', closeIntro);
  }

  /* ---- tema ---- */
  $('#themeToggle').addEventListener('click', function () {
    var d = document.documentElement;
    var dark = d.dataset.theme ? d.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    d.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('taif-theme', d.dataset.theme); } catch (e) {}
  });

  /* ---- menu mudah alih ---- */
  var panel = $('#navPanel'), btn = $('#menuBtn');
  function setMenu(open) {
    panel.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
  }
  btn.addEventListener('click', function () { setMenu(!panel.classList.contains('is-open')); });
  $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---- header, progress, nav aktif ---- */
  var header = $('#siteHeader'), prog = $('#progress');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    var h = document.documentElement;
    prog.style.transform = 'scaleX(' + Math.min(1, window.scrollY / Math.max(1, h.scrollHeight - h.clientHeight)) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var links = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    var secs = links.map(function (a) { return $(a.getAttribute('href')); });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) so.observe(s); });
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('.reveal').forEach(function (el) { ro.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---- zum pratonton ---- */
  var dlg = $('#zoom'), zi = $('#zoomImg');
  $$('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () {
      zi.src = b.getAttribute('data-zoom'); zi.alt = $('img', b).alt;
      if (dlg.showModal) dlg.showModal(); else window.open(zi.src, '_blank');
    });
  });
  $('#zoomClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  /* ---- tempahan: Google Form (alamat boleh diubah dalam config.js) ---- */
  var orderBtn = $('#orderBtn');
  if (orderBtn && S.formUrl) orderBtn.href = S.formUrl;
  var wa = String(S.whatsapp || '').replace(/\D/g, ''), note = $('#contactNote');
  if (wa && note) {
    note.hidden = false;
    note.innerHTML = 'Ada masalah? <a href="https://wa.me/' + wa + '" target="_blank" rel="noopener">Hubungi penerbit</a>.';
  }
})();
