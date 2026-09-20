const crypto = require('crypto');
const { requireAdmin, json } = require('./_lib/auth');
const { getSocialLinks, saveSocialLinks } = require('./_lib/contentStore');
const { BUILT_IN_ICONS } = require('./_lib/icons');

function isValidIcon(link) {
  if (link.icon === 'custom') return typeof link.customIconUrl === 'string' && link.customIconUrl.length > 0;
  return BUILT_IN_ICONS.includes(link.icon);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const links = await getSocialLinks();
    return json(200, links);
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

  const links = await getSocialLinks();

  if (event.httpMethod === 'POST') {
    if (!body.label || !body.url) return json(400, { error: 'label and url are required' });
    if (!isValidIcon(body)) return json(400, { error: 'Invalid icon. Pick a built-in icon or provide customIconUrl.' });

    const newLink = {
      id: crypto.randomUUID(),
      label: String(body.label).slice(0, 60),
      url: String(body.url).slice(0, 500),
      icon: body.icon,
      ...(body.icon === 'custom' ? { customIconUrl: body.customIconUrl } : {}),
    };
    links.push(newLink);
    await saveSocialLinks(links);
    return json(201, newLink);
  }

  if (event.httpMethod === 'PUT') {
    if (!body.id) return json(400, { error: 'id is required' });
    const idx = links.findIndex((l) => l.id === body.id);
    if (idx === -1) return json(404, { error: 'Link not found' });

    const updated = { ...links[idx] };
    if (body.label) updated.label = String(body.label).slice(0, 60);
    if (body.url) updated.url = String(body.url).slice(0, 500);
    if (body.icon) {
      if (!isValidIcon(body)) return json(400, { error: 'Invalid icon.' });
      updated.icon = body.icon;
      if (body.icon === 'custom') updated.customIconUrl = body.customIconUrl;
      else delete updated.customIconUrl;
    }
    links[idx] = updated;
    await saveSocialLinks(links);
    return json(200, updated);
  }

  if (event.httpMethod === 'DELETE') {
    const id = body.id || (event.queryStringParameters && event.queryStringParameters.id);
    if (!id) return json(400, { error: 'id is required' });
    const next = links.filter((l) => l.id !== id);
    await saveSocialLinks(next);
    return json(200, { success: true });
  }

  return json(405, { error: 'Method not allowed' });
};
