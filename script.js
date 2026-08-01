// Donate With Hope Foundation — shared interactivity

document.addEventListener('DOMContentLoaded', () => {

  /* Page load transition — brief branded fade, respects reduced motion */
  const pageTransition = document.querySelector('.page-transition');
  if (pageTransition) {
    requestAnimationFrame(() => setTimeout(() => pageTransition.classList.add('done'), 280));
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

  /* Lightweight parallax on hero background layer */
  const parallaxLayer = document.querySelector('.hero-parallax-layer');
  if (parallaxLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.25;
      parallaxLayer.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
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

  /* Map markers — simple tooltip-on-click for the Pakistan project map */
  document.querySelectorAll('.map-marker').forEach(marker => {
    marker.addEventListener('click', () => {
      const label = marker.getAttribute('data-label');
      const tooltip = document.getElementById('mapTooltip');
      if (tooltip && label) {
        tooltip.textContent = label;
        tooltip.style.display = 'inline-block';
      }
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

  /* Animated counters */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = el.getAttribute('data-target').includes('.');
    if (reduceMotion) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = isDecimal ? (target * eased).toFixed(1) : Math.floor(target * eased);
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

  /* Progress bars fill on scroll */
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

  /* Donate page: amount selection */
  const amountOptions = document.querySelectorAll('.amount-option');
  const customAmountInput = document.getElementById('customAmount');
  amountOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      amountOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      if (customAmountInput) customAmountInput.value = '';
      updateDonationSummary();
    });
  });
  if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
      amountOptions.forEach(o => o.classList.remove('selected'));
      updateDonationSummary();
    });
  }

  /* Donate page: frequency toggle */
  const toggleOptions = document.querySelectorAll('.toggle-option[data-freq]');
  toggleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      toggleOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updateDonationSummary();
    });
  });

  /* Donate page: payment method selection */
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  function getSelectedAmount() {
    const selected = document.querySelector('.amount-option.selected');
    if (customAmountInput && customAmountInput.value) return parseFloat(customAmountInput.value) || 0;
    if (selected) return parseFloat(selected.getAttribute('data-amount'));
    return 0;
  }

  function updateDonationSummary() {
    const amountEl = document.getElementById('summaryAmount');
    const totalEl = document.getElementById('summaryTotal');
    const freqEl = document.getElementById('summaryFrequency');
    if (!amountEl) return;
    const amount = getSelectedAmount();
    amountEl.textContent = 'PKR ' + amount.toLocaleString();
    if (totalEl) totalEl.textContent = 'PKR ' + amount.toLocaleString();
    const freq = document.querySelector('.toggle-option.selected');
    if (freqEl && freq) freqEl.textContent = freq.textContent.trim();
  }
  updateDonationSummary();

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
