const { getStore } = require('@netlify/blobs');
const { DEFAULT_GALLERY, DEFAULT_ADMISSIONS, DEFAULT_SOCIAL_LINKS } = require('./defaults');

function store() {
  return getStore('site-content');
}

async function getOrSeed(key, defaultValue) {
  const s = store();
  const existing = await s.get(key, { type: 'json' });
  if (existing !== null && existing !== undefined) return existing;
  await s.setJSON(key, defaultValue);
  return defaultValue;
}

async function getGallery() {
  return getOrSeed('gallery', DEFAULT_GALLERY);
}

async function saveGallery(gallery) {
  await store().setJSON('gallery', gallery);
  return gallery;
}

async function getAdmissions() {
  return getOrSeed('admissions', DEFAULT_ADMISSIONS);
}

async function saveAdmissions(admissions) {
  await store().setJSON('admissions', admissions);
  return admissions;
}

async function getSocialLinks() {
  return getOrSeed('social-links', DEFAULT_SOCIAL_LINKS);
}

async function saveSocialLinks(links) {
  await store().setJSON('social-links', links);
  return links;
}

module.exports = {
  getGallery,
  saveGallery,
  getAdmissions,
  saveAdmissions,
  getSocialLinks,
  saveSocialLinks,
};
