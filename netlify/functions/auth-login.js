const { verifyCredentials, signSession, makeSessionCookie, json } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { username, password } = body;
  if (!username || !password) return json(400, { error: 'Username and password are required' });

  const ok = await verifyCredentials(username, password);
  if (!ok) return json(401, { error: 'Invalid username or password' });

  const token = signSession(username.trim());
  return json(200, { success: true, username: username.trim() }, { 'Set-Cookie': makeSessionCookie(token) });
};
