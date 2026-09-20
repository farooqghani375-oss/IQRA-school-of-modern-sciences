const { requireAdmin, json } = require('./_lib/auth');
const { getGallery, saveGallery } = require('./_lib/contentStore');

const VALID_GROUPS = ['events', 'academic', 'campus', 'other'];

function slugify(str) {
  return String(str).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const gallery = await getGallery();
    return json(200, gallery);
  }

  const session = requireAdmin(event);
  if (!session) return json(401, { error: 'Not authenticated' });

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }
  }

  const gallery = await getGallery();

  if (event.httpMethod === 'POST') {
    if (!body.title) return json(400, { error: 'title is required' });
    const key = slugify(body.key || body.title);
    if (!key) return json(400, { error: 'Could not derive a valid key from title' });
    if (gallery.categories.some((c) => c.key === key)) {
      return json(409, { error: 'A category with this key already exists' });
    }
    const group = VALID_GROUPS.includes(body.group) ? body.group : 'other';
    const newCategory = {
      key,
      group,
      title: String(body.title).slice(0, 80),
      emoji: (body.emoji || '📸').slice(0, 8),
      photos: [],
      videos: [],
    };
    gallery.categories.push(newCategory);
    await saveGallery(gallery);
    return json(201, newCategory);
  }

  if (event.httpMethod === 'DELETE') {
    const key = body.key || (event.queryStringParameters && event.queryStringParameters.key);
    if (!key) return json(400, { error: 'key is required' });
    gallery.categories = gallery.categories.filter((c) => c.key !== key);
    await saveGallery(gallery);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
};
