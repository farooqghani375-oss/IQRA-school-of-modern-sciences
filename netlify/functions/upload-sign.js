const { requireAdmin, json } = require('./_lib/auth');
const { buildSignedUpload } = require('./_lib/cloudinary');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

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

  const folder = `iqra-school/${(body.folder || 'general').replace(/[^a-zA-Z0-9/_-]/g, '')}`;

  try {
    const signed = buildSignedUpload({ folder });
    return json(200, signed);
  } catch (err) {
    return json(500, { error: err.message });
  }
};
