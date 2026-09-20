const { requireAdmin, json } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  const session = requireAdmin(event);
  if (!session) return json(401, { loggedIn: false });
  return json(200, { loggedIn: true, username: session.sub });
};
