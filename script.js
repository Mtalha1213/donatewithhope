// Donate With Hope Foundation — shared interactivity

document.addEventListener('DOMContentLoaded', () => {

  /* Brief branded loading screen (logo fade) — respects reduced motion */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    requestAnimationFrame(() => setTimeout(() => loader.classList.add('done'), 260));
  }

  /* Header gains shadow once the page scrolls */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Sticky mobile donate bar — appears after scrolling past the hero */
  const stickyBar = document.querySelector('.sticky-donate-bar');
  const heroEl = document.querySelector('.hero, .page-header');
  if (stickyBar && heroEl) {
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => stickyBar.classList.toggle('show', !entry.isIntersecting));
    }, { threshold: 0 });
    barIO.observe(heroEl);
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* Footer year */
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal-on-scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach(el => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* Animated counters (impact stats — values are demo/zero until real data exists) */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion || target === 0) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }
    const duration = 1200;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = prefix + Number(value).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  }

  /* Progress bars fill on scroll (campaign progress — illustrative demo data) */
  const bars = document.querySelectorAll('.progress-fill[data-percent]');
  if (bars.length) {
    const pio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-percent') + '%';
          pio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(el => pio.observe(el));
  }

  /* Gallery lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  document.querySelectorAll('[data-lightbox]').forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (!lightbox) return;
      const fullSrc = thumb.getAttribute('data-full') || thumb.querySelector('img')?.src;
      const caption = thumb.getAttribute('data-caption') || '';
      lightboxImg.src = fullSrc;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-lightbox-close]').forEach(el => el.addEventListener('click', closeLightbox));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* Gallery album filter */
  const albumPills = document.querySelectorAll('.album-pill');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (albumPills.length && galleryItems.length) {
    albumPills.forEach(pill => {
      pill.addEventListener('click', () => {
        albumPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const album = pill.getAttribute('data-album');
        galleryItems.forEach(item => {
          item.style.display = (album === 'all' || item.getAttribute('data-album') === album) ? '' : 'none';
        });
      });
    });
  }

  /* Generic demo form submit handling (front-end only — no backend wired up) */
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-demo-note');
      if (note) {
        note.style.display = 'block';
        note.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  });
});
