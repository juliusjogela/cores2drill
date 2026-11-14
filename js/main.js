// Cores2Drill — small enhancements. The page works fully without this file.
(function () {
  // Mobile menu
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Placeholder links (e.g. Instagram until the real URL is added) shouldn't jump to the top
  document.querySelectorAll('a[data-placeholder]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Gallery lightbox
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lightbox__caption');
    document.querySelectorAll('.shot').forEach(function (shot) {
      shot.addEventListener('click', function () {
        lbImg.src = shot.dataset.full;
        lbImg.alt = shot.dataset.caption || '';
        lbCap.textContent = shot.dataset.caption || '';
        lightbox.showModal();
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target !== lbImg) lightbox.close();
    });
  }

  // Video clips: play muted while on screen, pause when scrolled away, tap to toggle
  var clips = document.querySelectorAll('video.clip');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  clips.forEach(function (v) {
    v.addEventListener('click', function () {
      if (v.paused) { v.play().catch(function () {}); } else { v.pause(); }
    });
  });
  if ('IntersectionObserver' in window && !reduced) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.play().catch(function () {}); }
        else { entry.target.pause(); }
      });
    }, { threshold: 0.4 });
    clips.forEach(function (v) { vio.observe(v); });
  } else {
    clips.forEach(function (v) { v.controls = true; });
  }

  // Fade sections in as they scroll into view
  var items = document.querySelectorAll('.card, .feature > *, .gallery > *, .clips > *, .steps li, .contact__item');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
