const { requireAdmin, verifyCredentials, updateCredentials, signSession, makeSessionCookie, json } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const session = requireAdmin(event);
  if (!session) return json(401, { error: 'Not authenticated' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { currentPassword, newUsername, newPassword } = body;
  if (!currentPassword) return json(400, { error: 'Current password is required' });
  if (!newUsername && !newPassword) return json(400, { error: 'Provide a new username and/or password' });

  const currentlyValid = await verifyCredentials(session.sub, currentPassword);
  if (!currentlyValid) return json(401, { error: 'Current password is incorrect' });

  if (newPassword && newPassword.length < 8) {
    return json(400, { error: 'New password must be at least 8 characters' });
  }

  const updated = await updateCredentials({ newUsername, newPassword });

  // Re-issue the session cookie in case the username changed.
  const token = signSession(updated.username);
  return json(200, { success: true, username: updated.username }, { 'Set-Cookie': makeSessionCookie(token) });
};
