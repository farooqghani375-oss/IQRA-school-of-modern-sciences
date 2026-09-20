const { requireAdmin, json } = require('./_lib/auth');
const { getGallery, saveGallery } = require('./_lib/contentStore');

// Cloudinary can generate a JPG thumbnail from any frame of a hosted video
// just by swapping the file extension on its /video/upload/ URL - no extra
// upload or transformation needed. Only applies to videos actually hosted on
// Cloudinary (i.e. uploaded through this admin panel), not local file paths.
function deriveVideoThumb(src) {
  if (typeof src !== 'string') return undefined;
  const match = src.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/.+)\.[a-zA-Z0-9]+$/);
  if (!match) return undefined;
  return `${match[1]}.jpg`;
}

exports.handler = async (event) => {
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
    const { categoryKey, type, src, caption } = body;
    if (!categoryKey || !src) return json(400, { error: 'categoryKey and src are required' });
    if (type !== 'photo' && type !== 'video') return json(400, { error: 'type must be "photo" or "video"' });

    const category = gallery.categories.find((c) => c.key === categoryKey);
    if (!category) return json(404, { error: 'Category not found' });

    const item = { src: String(src), caption: String(caption || category.title).slice(0, 200) };
    if (type === 'video') {
      const thumb = deriveVideoThumb(item.src);
      if (thumb) item.thumb = thumb;
    }
    if (type === 'photo') category.photos.push(item);
    else category.videos.push(item);

    await saveGallery(gallery);
    return json(201, item);
  }

  if (event.httpMethod === 'DELETE') {
    const { categoryKey, type, index } = body;
    if (!categoryKey || (type !== 'photo' && type !== 'video') || typeof index !== 'number') {
      return json(400, { error: 'categoryKey, type ("photo"|"video") and index are required' });
    }
    const category = gallery.categories.find((c) => c.key === categoryKey);
    if (!category) return json(404, { error: 'Category not found' });

    const list = type === 'photo' ? category.photos : category.videos;
    if (index < 0 || index >= list.length) return json(400, { error: 'Index out of range' });
    list.splice(index, 1);

    await saveGallery(gallery);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
};
