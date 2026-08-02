// Donate With Hope Foundation — CMS content loader.
// Fetches JSON files (edited via /admin, the Decap CMS panel) and renders
// them into the static HTML. If a fetch fails (offline, file missing), the
// hand-written HTML already in each page is left in place as a fallback —
// nothing breaks, it just won't reflect the latest edits.

async function fetchJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

async function loadHomepageContent() {
  if (!document.getElementById('homeHero')) return; // not the homepage
  const data = await fetchJSON('content/homepage.json');
  if (!data) return;

  if (data.hero) {
    const headline = document.getElementById('heroHeadline');
    const sub = document.getElementById('heroSub');
    const photo = document.getElementById('heroPhoto');
    if (headline && data.hero.headline) headline.innerHTML = data.hero.headline;
    if (sub && data.hero.subtext) sub.textContent = data.hero.subtext;
    if (photo && data.hero.image) photo.style.backgroundImage = `url('${data.hero.image}')`;
  }

  if (data.appeal) {
    const label = document.getElementById('appealLabel');
    const title = document.getElementById('appealTitle');
    const text = document.getElementById('appealText');
    const link = document.getElementById('appealLink');
    if (label && data.appeal.label) label.textContent = data.appeal.label;
    if (title && data.appeal.title) title.textContent = data.appeal.title;
    if (text && data.appeal.text) text.textContent = data.appeal.text;
    if (link && data.appeal.link) link.href = data.appeal.link;
  }

  if (Array.isArray(data.stats)) {
    const grid = document.getElementById('statsGrid');
    if (grid) {
      grid.innerHTML = data.stats.map(s => `
        <div class="stat-card">
          <div class="stat-num" data-target="${esc(s.value)}" data-prefix="${esc(s.prefix || '')}" data-suffix="${esc(s.suffix || '')}">0</div>
          <div class="stat-label">${esc(s.label)}</div>
        </div>`).join('');
    }
  }

  if (Array.isArray(data.campaigns)) {
    const grid = document.getElementById('campaignGrid');
    if (grid) {
      grid.innerHTML = data.campaigns.map(c => `
        <article class="campaign-card">
          <div class="campaign-img">
            <span class="campaign-tag">${esc(c.tag)}</span>
            <img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">
          </div>
          <div class="campaign-body">
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.description)}</p>
            <div class="campaign-footer">
              <div class="progress-track"><div class="progress-fill" data-percent="${esc(c.percent)}"></div></div>
              <div class="progress-meta"><span><strong>${esc(c.raised)}</strong> raised</span><span>Goal: ${esc(c.goal)}</span></div>
            </div>
            <a href="${esc(c.link || 'campaign-detail.html')}" class="btn btn-navy btn-block btn-sm">Donate to This Campaign</a>
          </div>
        </article>`).join('');
    }
  }

  if (data.trust) {
    const eyebrow = document.getElementById('trustEyebrow');
    const heading = document.getElementById('trustHeading');
    const text = document.getElementById('trustText');
    const image = document.getElementById('trustImage');
    const bullets = document.getElementById('trustBullets');
    if (eyebrow && data.trust.eyebrow) eyebrow.textContent = data.trust.eyebrow;
    if (heading && data.trust.heading) heading.textContent = data.trust.heading;
    if (text && data.trust.text) text.textContent = data.trust.text;
    if (image && data.trust.image) image.src = data.trust.image;
    if (bullets && Array.isArray(data.trust.bullets)) {
      bullets.innerHTML = data.trust.bullets.map(b =>
        `<li style="display:flex; gap:10px; align-items:flex-start;"><span style="color:var(--emerald); font-weight:700;">✓</span><span>${esc(b)}</span></li>`
      ).join('');
    }
  }

  if (Array.isArray(data.news)) {
    const grid = document.getElementById('newsGrid');
    if (grid) {
      grid.innerHTML = data.news.map(n => `
        <article class="news-card">
          <div class="news-img"><img src="${esc(n.image)}" alt="${esc(n.title)}" loading="lazy"></div>
          <div class="news-body">
            <div class="news-date">${esc(n.date)}</div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.text)}</p>
            <a href="${esc(n.link || '#')}" class="news-link">Read more →</a>
          </div>
        </article>`).join('');
    }
  }
}

async function loadSiteSettings() {
  const data = await fetchJSON('content/settings.json');
  if (!data) return;

  if (data.contact) {
    document.querySelectorAll('[data-cms="contact-email"]').forEach(el => el.textContent = data.contact.email);
    document.querySelectorAll('[data-cms="contact-phone"]').forEach(el => el.textContent = data.contact.phone);
    document.querySelectorAll('[data-cms="contact-address"]').forEach(el => el.textContent = data.contact.address);
    document.querySelectorAll('[data-cms="contact-hours"]').forEach(el => el.textContent = data.contact.hours);
  }
  if (data.social) {
    document.querySelectorAll('[data-cms="social-facebook"]').forEach(el => el.href = data.social.facebook);
    document.querySelectorAll('[data-cms="social-instagram"]').forEach(el => el.href = data.social.instagram);
    document.querySelectorAll('[data-cms="social-twitter"]').forEach(el => el.href = data.social.twitter);
    document.querySelectorAll('[data-cms="social-linkedin"]').forEach(el => el.href = data.social.linkedin);
  }
}

// Exposed so script.js can await these before setting up counters/observers,
// which need the (possibly CMS-replaced) DOM elements to exist first.
window.__dwhLoadContent = async function () {
  await Promise.all([loadHomepageContent(), loadSiteSettings()]);
};
