# IQRA School Website — Setup Guide (Netlify + Cloudinary)

This site is a static website (`index.html` / `style.css` / `script.js`) plus a small
serverless backend (`netlify/functions/`) that powers a custom `/admin` panel:
- Upload photos & videos into gallery categories
- Edit the Admissions section
- Add/remove social links + icons
- Change the admin username & password

Media files (photos/videos) are stored on **Cloudinary** (their free tier is plenty
for a school site). Everything else (admissions text, social links, gallery
metadata, and the admin login) is stored in **Netlify Blobs**, which is built into
Netlify — no separate database to set up.

## 1. Create a Cloudinary account

1. Sign up free at https://cloudinary.com
2. On your Cloudinary Dashboard, copy: **Cloud name**, **API Key**, **API Secret**

## 2. Push this project to a Git repo (recommended)

Netlify Blobs and Functions work best when the site is deployed from a connected
Git repo (GitHub/GitLab/Bitbucket), so every `git push` auto-deploys.

```bash
git init
git add .
git commit -m "IQRA school site with admin panel"
git remote add origin <your-repo-url>
git push -u origin main
```

Then in Netlify: **Add new site → Import an existing project** → pick the repo.
Netlify will detect `netlify.toml` automatically (publish dir `.`, functions dir
`netlify/functions`).

(You can also run `netlify deploy --prod` from the CLI without Git, but Git-based
deploys are easier to maintain long-term.)

## 3. Set environment variables in Netlify

Go to **Site settings → Environment variables** and add:

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | **Yes** | A long random string used to sign admin login sessions. Generate one with `openssl rand -hex 32`. |
| `ADMIN_INITIAL_USERNAME` | Recommended | Username for the very first admin login. Defaults to `admin` if not set. |
| `ADMIN_INITIAL_PASSWORD` | Recommended | Password for the very first admin login. Defaults to an insecure placeholder if not set — **set this yourself.** |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | **Yes** | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | **Yes** | From your Cloudinary dashboard — keep this secret, never put it in the frontend |

After adding/changing env vars, trigger a new deploy (Netlify → Deploys → Trigger deploy)
so the functions pick them up.

> The initial admin account is created automatically the first time anyone hits
> the login endpoint, using `ADMIN_INITIAL_USERNAME` / `ADMIN_INITIAL_PASSWORD`.
> **Log in once and immediately change the password** in Account Settings — this
> also works if you forget to set those env vars ahead of time, since you can
> reset via the panel afterwards (just make sure to log in and change it before
> anyone else finds the default credentials).

## 4. First login

1. Visit `https://your-site.netlify.app/admin`
2. Log in with `ADMIN_INITIAL_USERNAME` / `ADMIN_INITIAL_PASSWORD`
3. Go to **Account Settings** and set your own username/password right away

## 5. Using the panel day to day

See `OWNER-GUIDE.md` for a plain-language walkthrough of uploading media, editing
admissions, and managing social links.

## 6. Local development (optional, for a developer)

```bash
npm install -g netlify-cli   # once
npm install                  # installs function dependencies
netlify link                 # connect this folder to your Netlify site
netlify dev                  # runs the site + functions + Blobs locally
```
Then open the printed local URL + `/admin`.

## Notes on limits & costs

- **Cloudinary free tier** (as of writing) includes generous monthly storage/bandwidth
  for a school site's photos and a reasonable number of short videos. Very large or
  numerous long videos will eventually need a paid Cloudinary tier — check your
  Cloudinary dashboard's usage page occasionally.
- **Netlify Functions** have a request size limit, which is why uploads go browser →
  Cloudinary directly (via a signed upload URL) rather than through a function.
- **Netlify Blobs** easily handles the small amount of text/JSON data used here
  (admissions, social links, gallery metadata, the hashed admin password).

## What changed from the old setup

- The old `/admin` used Netlify Identity + Netlify CMS (Git Gateway), which could
  create gallery/event/notice entries as Git commits but had no way to let the
  school owner change their own login credentials, and wasn't actually wired up
  to the live gallery on the site. That's been replaced entirely by the custom
  panel described here.
- The old `_data/` folder (used by Netlify CMS) and the old `OWNER-GUIDE.md` have
  been removed/replaced — gallery, admissions, and social link content now lives
  in Netlify Blobs and is edited through `/admin`.
- If Netlify Identity / Git Gateway was enabled on this site before, you can turn
  it off in **Site settings → Identity** — it's no longer used.
