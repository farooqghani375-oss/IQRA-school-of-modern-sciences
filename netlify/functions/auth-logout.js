const { makeClearCookie, json } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  return json(200, { success: true }, { 'Set-Cookie': makeClearCookie() });
};
