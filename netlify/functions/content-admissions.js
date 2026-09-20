const { requireAdmin, json } = require('./_lib/auth');
const { getAdmissions, saveAdmissions } = require('./_lib/contentStore');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const data = await getAdmissions();
    return json(200, data);
  }

  if (event.httpMethod === 'POST') {
    const session = requireAdmin(event);
    if (!session) return json(401, { error: 'Not authenticated' });

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }

    if (typeof body.intro !== 'string' || !Array.isArray(body.steps)) {
      return json(400, { error: 'Expected { intro: string, steps: [{title, description}] }' });
    }
    const steps = body.steps
      .filter((s) => s && s.title)
      .map((s) => ({ title: String(s.title).slice(0, 120), description: String(s.description || '').slice(0, 2000) }));

    const saved = await saveAdmissions({ intro: body.intro.slice(0, 1000), steps });
    return json(200, saved);
  }

  return json(405, { error: 'Method not allowed' });
};
