(() => {
  const API = '/api';

  // Same icon set as script.js on the public site — kept in sync manually.
  const ICON_SVGS = {
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 24C5.495 24 .16 18.665.157 12.108.155 5.552 5.49.157 12.05.157c6.554 0 11.89 5.335 11.893 11.892C23.94 18.606 18.605 24 12.05 24z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 7c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm6.406-1.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.94-1.9-.95-2.36-1C16.9 2.6 12 2.6 12 2.6h-.01s-4.89 0-8.2.24c-.46.05-1.46.06-2.36 1C.72 4.56.5 6.2.5 6.2S.27 8.12.27 10.04v1.8c0 1.92.23 3.84.23 3.84s.23 1.64.93 2.36c.9.95 2.08.92 2.6 1.02 1.9.18 8.07.24 8.07.24s4.9-.01 8.2-.25c.46-.05 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.23-1.92.23-3.84v-1.8c0-1.92-.23-3.84-.23-3.84zM9.75 14.85V7.85l6.5 3.5-6.5 3.5z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556z"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24"><path d="M12.003 2c3.5 0 5.7 2.6 5.85 5.9.05 1.05.03 2 .03 2.4.55.35 1.3.2 1.75.55.3.25.15.7-.15.9-.4.3-1.15.6-1.45.85.05.55.55 1.15 1.35 1.55.35.15.35.55.05.75-.35.25-1 .35-1.3.65-.1.55-.35 1.1-1.1 1.15-.55.05-1-.15-1.5-.05-.5.1-.85.6-1.75.9-.6.2-1.2-.05-1.75-.35-.5.3-1.1.55-1.75.35-.9-.3-1.25-.8-1.75-.9-.5-.1-.95.1-1.5.05-.75-.05-1-.6-1.1-1.15-.3-.3-.95-.4-1.3-.65-.3-.2-.3-.6.05-.75.8-.4 1.3-1 1.35-1.55-.3-.25-1.05-.55-1.45-.85-.3-.2-.45-.65-.15-.9.45-.35 1.2-.2 1.75-.55 0-.4-.02-1.35.03-2.4C6.303 4.6 8.503 2 12.003 2z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21.905 4.567c.293-1.06-.35-1.487-1.293-1.166L2.4 10.27c-1.02.4-1.006 1.02-.183 1.276l4.51 1.41 10.46-6.59c.5-.3.953-.14.58.19l-8.47 7.65-.32 4.72c.47 0 .68-.216.936-.47l2.25-2.176 4.673 3.45c.86.475 1.48.23 1.696-.796l3.373-15.87z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13 22 6.01V6H2zm20 2.24l-9.34 6.24a1 1 0 01-1.12 0L2 8.24V18h20V8.24z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/></svg>',
    website: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.02a15.6 15.6 0 00-1.32-5.46A8.03 8.03 0 0119.93 11zM12 4.06c.83 1.13 1.85 3.11 2.13 6.94H9.87c.28-3.83 1.3-5.81 2.13-6.94zM9.87 13h4.26c-.28 3.83-1.3 5.81-2.13 6.94-.83-1.13-1.85-3.11-2.13-6.94zM8.41 5.54A15.6 15.6 0 007.09 11H4.07a8.03 8.03 0 014.34-5.46zM4.07 13h3.02a15.6 15.6 0 001.32 5.46A8.03 8.03 0 014.07 13zm11.52 5.46A15.6 15.6 0 0016.91 13h3.02a8.03 8.03 0 01-4.34 5.46z"/></svg>',
    custom: '',
  };

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  async function api(path, options = {}) {
    const res = await fetch(API + path, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    let data = null;
    try { data = await res.json(); } catch { /* no body */ }
    if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
    return data;
  }

  function showMsg(el, text, type) {
    el.textContent = text || '';
    el.className = 'msg' + (type ? ' ' + type : '');
  }

  // ── AUTH ──────────────────────────────────────────────────
  async function checkSession() {
    try {
      const data = await api('/auth-me');
      if (data.loggedIn) {
        showDashboard(data.username);
        return;
      }
    } catch { /* fall through to login */ }
    showLogin();
  }

  function showLogin() {
    $('#loginScreen').classList.remove('hidden');
    $('#dashboard').classList.add('hidden');
  }

  function showDashboard(username) {
    $('#loginScreen').classList.add('hidden');
    $('#dashboard').classList.remove('hidden');
    $('#whoami').textContent = 'Logged in as ' + username;
    loadGallery();
    loadAdmissions();
    loadSocialLinks();
  }

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#loginBtn');
    btn.disabled = true;
    showMsg($('#loginMsg'), '', '');
    try {
      const username = $('#loginUsername').value.trim();
      const password = $('#loginPassword').value;
      const data = await api('/auth-login', { method: 'POST', body: JSON.stringify({ username, password }) });
      showDashboard(data.username);
    } catch (err) {
      showMsg($('#loginMsg'), err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });

  $('#logoutBtn').addEventListener('click', async () => {
    try { await api('/auth-logout', { method: 'POST' }); } catch {}
    showLogin();
  });

  // ── TAB SWITCHING ─────────────────────────────────────────
  $all('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      $all('.nav-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      $all('.tab-panel').forEach((p) => p.classList.add('hidden'));
      $('#tab-' + btn.dataset.tab).classList.remove('hidden');
    });
  });

  // ── GALLERY ───────────────────────────────────────────────
  async function loadGallery() {
    const gallery = await api('/gallery');
    renderCategories(gallery.categories);
  }

  function renderCategories(categories) {
    const container = $('#categoryList');
    container.innerHTML = '';
    categories.forEach((cat) => container.appendChild(renderCategoryCard(cat)));
  }

  function renderCategoryCard(cat) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-head">
        <h4>${cat.emoji || '📸'} ${escapeHtml(cat.title)}</h4>
        <span class="category-tag">${escapeHtml(cat.group)}</span>
        <button class="btn-danger-small" data-action="delete-category">Delete Category</button>
      </div>
      <div class="upload-row">
        <label class="btn-ghost-small" style="cursor:pointer;">
          + Add Photos <input type="file" accept="image/*" multiple class="hidden" data-role="photo-input">
        </label>
        <label class="btn-ghost-small" style="cursor:pointer;">
          + Add Videos <input type="file" accept="video/*" multiple class="hidden" data-role="video-input">
        </label>
        <span class="upload-progress" data-role="progress"></span>
      </div>
      <div class="media-grid" data-role="photo-grid"></div>
      <div class="media-grid" data-role="video-grid"></div>
    `;

    renderMediaGrid(card.querySelector('[data-role="photo-grid"]'), cat, 'photo');
    renderMediaGrid(card.querySelector('[data-role="video-grid"]'), cat, 'video');

    card.querySelector('[data-action="delete-category"]').addEventListener('click', async () => {
      if (!confirm(`Delete category "${cat.title}" and all its media links? (Files already on Cloudinary are not removed.)`)) return;
      await api('/gallery', { method: 'DELETE', body: JSON.stringify({ key: cat.key }) });
      loadGallery();
    });

    card.querySelector('[data-role="photo-input"]').addEventListener('change', (e) => {
      handleUpload(cat, 'photo', e.target.files, card);
    });
    card.querySelector('[data-role="video-input"]').addEventListener('change', (e) => {
      handleUpload(cat, 'video', e.target.files, card);
    });

    return card;
  }

  function renderMediaGrid(grid, cat, type) {
    grid.innerHTML = '';
    const list = type === 'photo' ? cat.photos : cat.videos;
    list.forEach((item, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'media-thumb';
      thumb.innerHTML = type === 'photo'
        ? `<img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.caption)}">`
        : `<video src="${escapeAttr(item.src)}" muted></video>`;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.title = 'Remove';
      removeBtn.addEventListener('click', async () => {
        if (!confirm('Remove this item from the gallery?')) return;
        await api('/gallery-media', { method: 'DELETE', body: JSON.stringify({ categoryKey: cat.key, type, index }) });
        loadGallery();
      });
      thumb.appendChild(removeBtn);
      grid.appendChild(thumb);
    });
  }

  async function handleUpload(cat, type, files, card) {
    if (!files || !files.length) return;
    const progress = card.querySelector('[data-role="progress"]');
    for (const file of Array.from(files)) {
      progress.textContent = `Uploading ${file.name}...`;
      try {
        const src = await uploadToCloudinary(file, cat.key);
        await api('/gallery-media', {
          method: 'POST',
          body: JSON.stringify({ categoryKey: cat.key, type, src, caption: cat.title }),
        });
      } catch (err) {
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }
    progress.textContent = '';
    loadGallery();
  }

  async function uploadToCloudinary(file, folder) {
    const signed = await api('/upload-sign', { method: 'POST', body: JSON.stringify({ folder }) });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signed.apiKey);
    formData.append('timestamp', signed.timestamp);
    formData.append('signature', signed.signature);
    formData.append('folder', signed.folder);

    const res = await fetch(signed.uploadUrl, { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
    return data.secure_url;
  }

  $('#newCategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = $('#catTitle').value.trim();
    const emoji = $('#catEmoji').value.trim();
    const group = $('#catGroup').value;
    if (!title) return;
    await api('/gallery', { method: 'POST', body: JSON.stringify({ title, emoji, group }) });
    $('#newCategoryForm').reset();
    loadGallery();
  });

  // ── ADMISSIONS ────────────────────────────────────────────
  let admissionsSteps = [];

  async function loadAdmissions() {
    const data = await api('/content-admissions');
    $('#admIntro').value = data.intro || '';
    admissionsSteps = data.steps || [];
    renderSteps();
  }

  function renderSteps() {
    const list = $('#admStepsList');
    list.innerHTML = '';
    admissionsSteps.forEach((step, i) => {
      const row = document.createElement('div');
      row.className = 'step-row';
      row.innerHTML = `
        <div class="step-row-head">
          <strong>Step ${i + 1}</strong>
          <button type="button" class="btn-danger-small" data-role="remove">Remove</button>
        </div>
        <input type="text" placeholder="Step title" data-role="title" value="${escapeAttr(step.title)}">
        <textarea rows="2" placeholder="Step description" data-role="desc">${escapeHtml(step.description || '')}</textarea>
      `;
      row.querySelector('[data-role="title"]').addEventListener('input', (e) => { admissionsSteps[i].title = e.target.value; });
      row.querySelector('[data-role="desc"]').addEventListener('input', (e) => { admissionsSteps[i].description = e.target.value; });
      row.querySelector('[data-role="remove"]').addEventListener('click', () => {
        admissionsSteps.splice(i, 1);
        renderSteps();
      });
      list.appendChild(row);
    });
  }

  $('#addStepBtn').addEventListener('click', () => {
    admissionsSteps.push({ title: '', description: '' });
    renderSteps();
  });

  $('#saveAdmissionsBtn').addEventListener('click', async () => {
    try {
      await api('/content-admissions', {
        method: 'POST',
        body: JSON.stringify({ intro: $('#admIntro').value, steps: admissionsSteps }),
      });
      showMsg($('#admMsg'), 'Saved! Changes are now live on the website.', 'success');
    } catch (err) {
      showMsg($('#admMsg'), err.message, 'error');
    }
  });

  // ── SOCIAL LINKS ──────────────────────────────────────────
  $('#socIcon').addEventListener('change', (e) => {
    $('#socCustomIconFile').classList.toggle('hidden', e.target.value !== 'custom');
  });

  async function loadSocialLinks() {
    const links = await api('/content-social-links');
    renderSocialLinks(links);
  }

  function renderSocialLinks(links) {
    const container = $('#socialList');
    container.innerHTML = '';
    links.forEach((link) => {
      const row = document.createElement('div');
      row.className = 'social-row';
      const iconHtml = link.icon === 'custom' && link.customIconUrl
        ? `<img src="${escapeAttr(link.customIconUrl)}" alt="">`
        : (ICON_SVGS[link.icon] || '');
      row.innerHTML = `
        <div class="social-icon-preview">${iconHtml}</div>
        <div class="info"><strong>${escapeHtml(link.label)}</strong><span>${escapeHtml(link.url)}</span></div>
        <button class="btn-danger-small" data-role="delete">Delete</button>
      `;
      row.querySelector('[data-role="delete"]').addEventListener('click', async () => {
        if (!confirm(`Remove the "${link.label}" link?`)) return;
        await api('/content-social-links', { method: 'DELETE', body: JSON.stringify({ id: link.id }) });
        loadSocialLinks();
      });
      container.appendChild(row);
    });
  }

  $('#newSocialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMsg($('#socMsg'), '', '');
    const label = $('#socLabel').value.trim();
    const url = $('#socUrl').value.trim();
    const icon = $('#socIcon').value;
    try {
      let body = { label, url, icon };
      if (icon === 'custom') {
        const file = $('#socCustomIconFile').files[0];
        if (!file) { showMsg($('#socMsg'), 'Please choose an icon image to upload.', 'error'); return; }
        const customIconUrl = await uploadToCloudinary(file, 'social-icons');
        body.customIconUrl = customIconUrl;
      }
      await api('/content-social-links', { method: 'POST', body: JSON.stringify(body) });
      $('#newSocialForm').reset();
      $('#socCustomIconFile').classList.add('hidden');
      loadSocialLinks();
    } catch (err) {
      showMsg($('#socMsg'), err.message, 'error');
    }
  });

  // ── ACCOUNT SETTINGS ──────────────────────────────────────
  $('#accountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMsg($('#accMsg'), '', '');
    const currentPassword = $('#accCurrentPassword').value;
    const newUsername = $('#accNewUsername').value.trim();
    const newPassword = $('#accNewPassword').value;
    const confirmPassword = $('#accConfirmPassword').value;

    if (newPassword && newPassword !== confirmPassword) {
      showMsg($('#accMsg'), 'New password and confirmation do not match.', 'error');
      return;
    }
    if (!newUsername && !newPassword) {
      showMsg($('#accMsg'), 'Enter a new username and/or new password.', 'error');
      return;
    }
    try {
      const data = await api('/auth-change-credentials', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newUsername: newUsername || undefined, newPassword: newPassword || undefined }),
      });
      showMsg($('#accMsg'), 'Account updated successfully.', 'success');
      $('#whoami').textContent = 'Logged in as ' + data.username;
      $('#accountForm').reset();
    } catch (err) {
      showMsg($('#accMsg'), err.message, 'error');
    }
  });

  // ── UTILS ─────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  checkSession();
})();
