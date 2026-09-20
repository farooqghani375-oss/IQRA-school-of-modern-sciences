// ─── GALLERY ROW SCROLL ──────────────────────────────────────
function scrollRow(btn, dir) {
  // Find the sibling .gallery-scroll-row
  const wrapper = btn.closest('.gallery-scroll-wrapper');
  const row = wrapper.querySelector('.gallery-scroll-row');
  const cardWidth = row.querySelector('.folder-card')?.offsetWidth || 280;
  const scrollAmount = (cardWidth + 24) * 2; // scroll 2 cards at a time
  row.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
}

// ─── FALLBACK DATA ───────────────────────────────────────────
// Used only if /api/* can't be reached (e.g. testing the HTML file directly,
// or the Netlify Functions aren't deployed yet). Keeps the site from looking
// broken. Once the admin panel is used, the live API data takes over.
const FALLBACK_GALLERY_CATEGORIES = [
  { key: 'Red', group: 'events', title: 'Red Day 2026', emoji: '🍎', photos: [], videos: [{ src: 'videos/red-day.mp4', caption: 'Red Day 2026' }] },
  { key: 'dastarbandi', group: 'events', title: 'Dastarbandi', emoji: '🎓', photos: [1,2,3,4,5].map(n => ({ src: `images/Dastarbandi/D (${n}).jpeg`, caption: 'Dastarbandi Ceremony' })), videos: [] },
  { key: 'sports', group: 'events', title: 'Sports Day', emoji: '⚽', photos: [{ src: 'images/sport/s1.jpeg', caption: 'Sports Day' }], videos: [] },
  { key: 'art', group: 'events', title: 'Art Day', emoji: '🎨', photos: [1,2,3,4,5,6].map(n => ({ src: `images/art/a (${n}).jpeg`, caption: 'Art Exhibition' })), videos: [] },
  { key: 'results', group: 'academic', title: 'School Results', emoji: '🏆', photos: Array.from({length:18},(_,i)=>({ src: `images/results/r (${i+1}).jpeg`, caption: 'School Results' })), videos: [] },
  { key: 'tours', group: 'academic', title: 'School Tours', emoji: '🏫', photos: [1,2,3,4,5,6].map(n => ({ src: `images/tour/t (${n}).jpeg`, caption: 'School Tour' })), videos: [{ src: 'videos/1.mp4', caption: 'School Tour' }] },
  { key: 'building', group: 'campus', title: 'School Building', emoji: '🏛️', photos: [1,2,3].map(n => ({ src: `images/building/b (${n}).jpeg`, caption: 'School Campus' })), videos: [] },
];

const FALLBACK_ADMISSIONS = {
  intro: "Enrolling now for the new academic year. Seats are limited — secure your child's place today.",
  steps: [
    { title: 'Visit School', description: 'Come for a campus tour and meet our teachers' },
    { title: 'Assessment', description: '1. Birth Certificate OR Form B\n2. Father CNIC copy\n3. Two passport size pictures' },
    { title: 'Confirmation', description: 'Pay admission fee and get your welcome pack' },
  ],
};

const FALLBACK_SOCIAL_LINKS = [
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/923325216881', icon: 'whatsapp' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/', icon: 'facebook' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/', icon: 'instagram' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/', icon: 'tiktok' },
];

const GROUP_META = {
  events:   { icon: '🎉', heading: 'Events',       desc: 'Memorable school celebrations, ceremonies & special days' },
  academic: { icon: '📚', heading: 'Academic',      desc: 'Achievements, results and campus tours that showcase our excellence' },
  campus:   { icon: '🏛️', heading: 'Campus Life',   desc: 'Our classrooms, building and everyday life at IQRA School' },
  other:    { icon: '📂', heading: 'More',          desc: 'More photos and videos from around the school' },
};
const GROUP_ORDER = ['events', 'academic', 'campus', 'other'];

// ─── GALLERY DATA (populated from the API, keyed by category for the viewer) ──
let galleryData = {};

async function fetchJSON(path, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('bad status');
    return await res.json();
  } catch {
    return fallback;
  }
}

// ─── RENDER: GALLERY GROUPS + FOLDER CARDS ───────────────────
function renderGallery(categories) {
  galleryData = {};
  categories.forEach((cat) => {
    galleryData[cat.key] = {
      title: `${cat.emoji || '📸'} ${cat.title}`,
      photos: cat.photos || [],
      videos: cat.videos || [],
    };
  });

  const byGroup = {};
  categories.forEach((cat) => {
    const group = GROUP_META[cat.group] ? cat.group : 'other';
    (byGroup[group] = byGroup[group] || []).push(cat);
  });

  const container = document.getElementById('galleryGroups');
  if (!container) return;
  container.innerHTML = '';

  GROUP_ORDER.forEach((group) => {
    const cats = byGroup[group];
    if (!cats || !cats.length) return;
    const meta = GROUP_META[group];
    const rowId = `row-${group}`;

    const groupEl = document.createElement('div');
    groupEl.className = 'gallery-group';
    groupEl.innerHTML = `
      <div class="gallery-group-header">
        <div class="gallery-group-title-row">
          <span class="gallery-group-icon">${meta.icon}</span>
          <h3 class="gallery-group-heading">${meta.heading}</h3>
          <span class="gallery-group-count">${cats.length} album${cats.length === 1 ? '' : 's'}</span>
        </div>
        <p class="gallery-group-desc">${meta.desc}</p>
      </div>
      <div class="gallery-scroll-wrapper">
        <button class="scroll-arrow scroll-left" onclick="scrollRow(this,-1)" aria-label="Scroll left">&#8592;</button>
        <div class="gallery-scroll-row" id="${rowId}"></div>
        <button class="scroll-arrow scroll-right" onclick="scrollRow(this,1)" aria-label="Scroll right">&#8594;</button>
      </div>
    `;
    container.appendChild(groupEl);

    const row = groupEl.querySelector(`#${rowId}`);
    cats.forEach((cat) => row.appendChild(buildFolderCard(cat)));
  });
}

function buildFolderCard(cat) {
  const card = document.createElement('div');
  card.className = 'folder-card';
  card.dataset.cat = cat.key;
  card.onclick = () => openCategory(cat.key);
  const thumbSrc = (cat.photos && cat.photos[0] && cat.photos[0].src) || (cat.videos && cat.videos[0] && cat.videos[0].thumb) || '';
  const count = (cat.photos ? cat.photos.length : 0) + (cat.videos ? cat.videos.length : 0);
  card.innerHTML = `
    <div class="folder-body">
      <div class="folder-tab"></div>
      <div class="folder-preview">
        <div class="preview-strip">
          ${thumbSrc ? `<img class="folder-thumb" src="${thumbSrc}" alt="${cat.title}">` : ''}
          <div class="folder-thumb-overlay"></div>
          <span class="folder-emoji">${cat.emoji || '📸'}</span>
        </div>
      </div>
      <div class="folder-info">
        <h3>${cat.title}</h3>
        <p>${count} item${count === 1 ? '' : 's'}</p>
      </div>
    </div>
  `;
  return card;
}

// ─── RENDER: ADMISSIONS ───────────────────────────────────────
function renderAdmissions(data) {
  const introEl = document.getElementById('admissionsIntro');
  if (introEl && data.intro) introEl.textContent = data.intro;

  const stepsEl = document.getElementById('admissionSteps');
  if (!stepsEl) return;
  stepsEl.innerHTML = '';
  (data.steps || []).forEach((step, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    const paragraphs = String(step.description || '').split('\n').filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join('');
    div.innerHTML = `<div class="step-num">${i + 1}</div><h5>${escapeHtml(step.title)}</h5>${paragraphs}`;
    stepsEl.appendChild(div);
  });
}

// ─── RENDER: SOCIAL LINKS ──────────────────────────────────────
const SOCIAL_ICON_SVGS = {
  whatsapp: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 24C5.495 24 .16 18.665.157 12.108.155 5.552 5.49.157 12.05.157c6.554 0 11.89 5.335 11.893 11.892C23.94 18.606 18.605 24 12.05 24z"/>',
  facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
  instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
  tiktok: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>',
  youtube: '<path d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.94-1.9-.95-2.36-1C16.9 2.6 12 2.6 12 2.6h-.01s-4.89 0-8.2.24c-.46.05-1.46.06-2.36 1C.72 4.56.5 6.2.5 6.2S.27 8.12.27 10.04v1.8c0 1.92.23 3.84.23 3.84s.23 1.64.93 2.36c.9.95 2.08.92 2.6 1.02 1.9.18 8.07.24 8.07.24s4.9-.01 8.2-.25c.46-.05 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.23-1.92.23-3.84v-1.8c0-1.92-.23-3.84-.23-3.84zM9.75 14.85V7.85l6.5 3.5-6.5 3.5z"/>',
  twitter: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556z"/>',
  snapchat: '<path d="M12.003 2c3.5 0 5.7 2.6 5.85 5.9.05 1.05.03 2 .03 2.4.55.35 1.3.2 1.75.55.3.25.15.7-.15.9-.4.3-1.15.6-1.45.85.05.55.55 1.15 1.35 1.55.35.15.35.55.05.75-.35.25-1 .35-1.3.65-.1.55-.35 1.1-1.1 1.15-.55.05-1-.15-1.5-.05-.5.1-.85.6-1.75.9-.6.2-1.2-.05-1.75-.35-.5.3-1.1.55-1.75.35-.9-.3-1.25-.8-1.75-.9-.5-.1-.95.1-1.5.05-.75-.05-1-.6-1.1-1.15-.3-.3-.95-.4-1.3-.65-.3-.2-.3-.6.05-.75.8-.4 1.3-1 1.35-1.55-.3-.25-1.05-.55-1.45-.85-.3-.2-.45-.65-.15-.9.45-.35 1.2-.2 1.75-.55 0-.4-.02-1.35.03-2.4C6.303 4.6 8.503 2 12.003 2z"/>',
  telegram: '<path d="M21.905 4.567c.293-1.06-.35-1.487-1.293-1.166L2.4 10.27c-1.02.4-1.006 1.02-.183 1.276l4.51 1.41 10.46-6.59c.5-.3.953-.14.58.19l-8.47 7.65-.32 4.72c.47 0 .68-.216.936-.47l2.25-2.176 4.673 3.45c.86.475 1.48.23 1.696-.796l3.373-15.87z"/>',
  email: '<path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13 22 6.01V6H2zm20 2.24l-9.34 6.24a1 1 0 01-1.12 0L2 8.24V18h20V8.24z"/>',
  phone: '<path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>',
  website: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.02a15.6 15.6 0 00-1.32-5.46A8.03 8.03 0 0119.93 11zM12 4.06c.83 1.13 1.85 3.11 2.13 6.94H9.87c.28-3.83 1.3-5.81 2.13-6.94zM9.87 13h4.26c-.28 3.83-1.3 5.81-2.13 6.94-.83-1.13-1.85-3.11-2.13-6.94zM8.41 5.54A15.6 15.6 0 007.09 11H4.07a8.03 8.03 0 014.34-5.46zM4.07 13h3.02a15.6 15.6 0 001.32 5.46A8.03 8.03 0 014.07 13zm11.52 5.46A15.6 15.6 0 0016.91 13h3.02a8.03 8.03 0 01-4.34 5.46z"/>',
};

function renderSocialLinks(links) {
  const container = document.getElementById('heroSocialIcons');
  if (container) {
    container.innerHTML = '';
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.className = `hs-icon hs-${link.icon}`;
      a.title = link.label;
      if (link.icon === 'custom' && link.customIconUrl) {
        a.innerHTML = `<img src="${link.customIconUrl}" alt="${escapeHtml(link.label)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else {
        a.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">${SOCIAL_ICON_SVGS[link.icon] || ''}</svg>`;
      }
      container.appendChild(a);
    });
  }

  const whatsappLink = links.find((l) => l.icon === 'whatsapp');
  const stickyBtn = document.getElementById('stickyWhatsapp');
  if (stickyBtn && whatsappLink) stickyBtn.href = whatsappLink.url;
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ─── BOOTSTRAP: load everything from the API on page load ────
document.addEventListener('DOMContentLoaded', async () => {
  const [gallery, admissions, socialLinks] = await Promise.all([
    fetchJSON('/api/gallery', { categories: FALLBACK_GALLERY_CATEGORIES }),
    fetchJSON('/api/content-admissions', FALLBACK_ADMISSIONS),
    fetchJSON('/api/content-social-links', FALLBACK_SOCIAL_LINKS),
  ]);
  renderGallery(gallery.categories || FALLBACK_GALLERY_CATEGORIES);
  renderAdmissions(admissions);
  renderSocialLinks(socialLinks);
});

let currentCat      = null;
let currentTab      = 'photos';
let currentItems    = [];
let currentImgIndex = 0;

// ─── OPEN CATEGORY ───────────────────────────────────────────
function openCategory(cat) {
  currentCat = cat;
  currentTab = 'photos';
  const data = galleryData[cat];

  document.getElementById('lightboxTitle').textContent = data.title;
  document.getElementById('photoCount').textContent = data.photos.length;
  document.getElementById('videoCount').textContent = data.videos.length;
  document.getElementById('tabPhotos').classList.add('active');
  document.getElementById('tabVideos').classList.remove('active');

  renderTab('photos');
  document.getElementById('galleryLightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ─── SWITCH TAB ──────────────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tabPhotos').classList.toggle('active', tab === 'photos');
  document.getElementById('tabVideos').classList.toggle('active', tab === 'videos');
  renderTab(tab);
}

// ─── RENDER TAB ──────────────────────────────────────────────
function renderTab(tab) {
  const data  = galleryData[currentCat];
  const items = tab === 'photos' ? data.photos : data.videos;
  currentItems = items;

  const grid = document.getElementById('lightboxGrid');
  grid.innerHTML = '';
  grid.scrollTop = 0;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="tab-empty">
        <div class="empty-icon">${tab === 'photos' ? '🖼️' : '🎬'}</div>
        <p>${tab === 'photos' ? 'No photos in this folder yet.' : 'No videos in this folder yet.'}</p>
        <small style="color:#bbb;">Add files and update script.js to display them here.</small>
      </div>`;
    return;
  }

  items.forEach((item, i) => {
    const tile = document.createElement('div');
    tile.className = 'lightbox-tile' + (tab === 'videos' ? ' video-tile' : '');

    if (tab === 'photos') {
      tile.innerHTML = `
        <img src="${item.src}" alt="${item.caption}" loading="lazy">
        <div class="tile-overlay"><span>${item.caption}</span></div>
      `;
      tile.onclick = () => openImgViewer(i);
    } else {
      const thumb = item.thumb || '';
      tile.innerHTML = thumb
        ? `<img src="${thumb}" alt="${item.caption}" loading="lazy" style="filter:brightness(0.7);">
           <div class="tile-overlay"><span>${item.caption}</span></div>`
        : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0c1e12,#1a3a22);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;">
             <span style="font-size:2.2rem;">🎬</span>
             <span style="color:rgba(255,255,255,0.75);font-size:0.78rem;font-weight:700;">${item.caption}</span>
           </div>
           <div class="tile-overlay"><span>${item.caption}</span></div>`;
      tile.onclick = () => openVideoViewer(i);
    }
    grid.appendChild(tile);
  });
}

// ─── CLOSE GALLERY ───────────────────────────────────────────
function closeGalleryModal() {
  document.getElementById('galleryLightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── IMAGE VIEWER ────────────────────────────────────────────
function openImgViewer(index) {
  currentImgIndex = index;
  const item = currentItems[index];
  document.getElementById('viewerImg').src = item.src;
  document.getElementById('viewerCaption').textContent = item.caption || '';
  document.getElementById('imgViewer').classList.add('open');
}

function closeImgViewer() {
  document.getElementById('imgViewer').classList.remove('open');
}

function shiftImage(dir) {
  currentImgIndex = (currentImgIndex + dir + currentItems.length) % currentItems.length;
  openImgViewer(currentImgIndex);
}

// ─── VIDEO VIEWER ────────────────────────────────────────────
function openVideoViewer(index) {
  currentImgIndex = index;

  let viewer = document.getElementById('videoViewer');
  if (!viewer) {
    viewer = document.createElement('div');
    viewer.id = 'videoViewer';
    viewer.className = 'img-viewer';
    viewer.innerHTML = `
      <div class="img-viewer-overlay" onclick="closeVideoViewer()"></div>
      <button class="img-nav img-prev" onclick="shiftVideo(-1)">&#8592;</button>
      <div class="img-viewer-content" style="max-width:92vw;">
        <div id="videoContainer"></div>
        <div class="img-viewer-caption" id="videoCaption"></div>
      </div>
      <button class="img-nav img-next" onclick="shiftVideo(1)">&#8594;</button>
      <button class="img-viewer-close" onclick="closeVideoViewer()">✕</button>
    `;
    document.body.appendChild(viewer);
  }

  loadVideo(currentItems[index]);
  viewer.classList.add('open');
}

function loadVideo(item) {
  document.getElementById('videoCaption').textContent = item.caption || '';
  const c = document.getElementById('videoContainer');
  if (item.type === 'youtube') {
    c.innerHTML = `<iframe src="${item.src}" width="800" height="450"
      style="max-width:90vw;max-height:70vh;border-radius:12px;border:none;"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope"
      allowfullscreen></iframe>`;
  } else {
    c.innerHTML = `<video controls autoplay
      style="max-width:90vw;max-height:75vh;border-radius:12px;outline:none;box-shadow:0 0 60px rgba(0,0,0,0.6);">
      <source src="${item.src}">Your browser does not support video.
    </video>`;
  }
}

function closeVideoViewer() {
  const v = document.getElementById('videoViewer');
  if (!v) return;
  v.classList.remove('open');
  const vid = v.querySelector('video');
  if (vid) vid.pause();
}

function shiftVideo(dir) {
  currentImgIndex = (currentImgIndex + dir + currentItems.length) % currentItems.length;
  loadVideo(currentItems[currentImgIndex]);
}

// ─── KEYBOARD NAV ─────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (document.getElementById('imgViewer')?.classList.contains('open')) {
    if (e.key === 'ArrowRight') shiftImage(1);
    if (e.key === 'ArrowLeft')  shiftImage(-1);
    if (e.key === 'Escape')     closeImgViewer();
  } else if (document.getElementById('videoViewer')?.classList.contains('open')) {
    if (e.key === 'ArrowRight') shiftVideo(1);
    if (e.key === 'ArrowLeft')  shiftVideo(-1);
    if (e.key === 'Escape')     closeVideoViewer();
  } else if (document.getElementById('galleryLightbox')?.classList.contains('open')) {
    if (e.key === 'Escape') closeGalleryModal();
  }
});
