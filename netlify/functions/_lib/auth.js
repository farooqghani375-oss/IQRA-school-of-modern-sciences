const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcryptjs');
const { openStore } = require('./blobs');

const COOKIE_NAME = 'iqra_admin_session';
const SESSION_HOURS = 12;

// JWT_SECRET must be set as a Netlify environment variable in production.
// The fallback below only exists so the site doesn't hard-crash if it's
// missing, but sessions signed with it are NOT secure - always set your own.
function getSecret() {
  return process.env.JWT_SECRET || 'iqra-insecure-dev-secret-CHANGE-ME';
}

function credentialsStore() {
  return openStore('admin-credentials');
}

// Ensure an admin account exists. Seeds one on first run from env vars
// (ADMIN_INITIAL_USERNAME / ADMIN_INITIAL_PASSWORD) or a hardcoded fallback
// that MUST be changed immediately via the admin panel.
async function ensureAdminSeeded() {
  const store = credentialsStore();
  const existing = await store.get('account', { type: 'json' });
  if (existing) return existing;

  const username = process.env.ADMIN_INITIAL_USERNAME || 'admin';
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 10);
  const account = { username, passwordHash, updatedAt: new Date().toISOString() };
  await store.setJSON('account', account);
  return account;
}

async function verifyCredentials(username, password) {
  const account = await ensureAdminSeeded();
  if (!account || typeof username !== 'string' || typeof password !== 'string') return false;
  if (username.trim().toLowerCase() !== account.username.trim().toLowerCase()) return false;
  return bcrypt.compare(password, account.passwordHash);
}

async function updateCredentials({ newUsername, newPassword }) {
  const store = credentialsStore();
  const account = await ensureAdminSeeded();
  const next = { ...account };
  if (newUsername && newUsername.trim()) next.username = newUsername.trim();
  if (newPassword && newPassword.trim()) next.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
  next.updatedAt = new Date().toISOString();
  await store.setJSON('account', next);
  return { username: next.username };
}

function signSession(username) {
  return jwt.sign({ sub: username, role: 'admin' }, getSecret(), { expiresIn: `${SESSION_HOURS}h` });
}

function makeSessionCookie(token) {
  return cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
}

function makeClearCookie() {
  return cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

// Returns the decoded session if the request has a valid admin cookie, else null.
function getSession(event) {
  const header = event.headers.cookie || event.headers.Cookie || '';
  const parsed = cookie.parse(header || '');
  const token = parsed[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

function requireAdmin(event) {
  const session = getSession(event);
  if (!session || session.role !== 'admin') return null;
  return session;
}

function json(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...(extraHeaders || {}) },
    body: JSON.stringify(body),
  };
}

module.exports = {
  COOKIE_NAME,
  verifyCredentials,
  updateCredentials,
  signSession,
  makeSessionCookie,
  makeClearCookie,
  getSession,
  requireAdmin,
  json,
};
