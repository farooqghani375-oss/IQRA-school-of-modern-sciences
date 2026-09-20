const { getStore } = require('@netlify/blobs');

// Netlify Blobs is supposed to auto-detect its environment inside Functions,
// but that auto-detection fails on some sites/teams. Passing siteID + token
// explicitly is the documented workaround, and falls back to auto-detection
// (needed for `netlify dev` locally) when those env vars aren't set.
function openStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

module.exports = { openStore };
