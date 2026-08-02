# Content Admin — Setup Guide

You now have a `/admin` page that lets you edit your homepage content (hero text,
appeal banner, stats, campaigns, trust section, news) and your contact/social
info, through a visual editor — no code required. Every save there commits
directly to your GitHub repo, and your site updates automatically.

This is a **one-time setup**, about 10 minutes. After that, editing is just
logging into `yoursite.com/admin` and clicking around.

## Why Netlify?

Your CMS login (so only you — not the public — can edit the site) needs an
identity/auth service. GitHub Pages alone can't do this. Netlify's free tier
provides that login system (called **Identity**) plus a secure bridge back to
your GitHub repo (called **Git Gateway**). You are **not required to move your
site's hosting to Netlify** — you can keep GitHub Pages for the live site and
use Netlify purely to power the `/admin` login. But it's simplest to just let
Netlify host the site too, since it deploys from GitHub automatically and is
also free.

## Setup steps

1. **Create a free Netlify account** at [netlify.com](https://www.netlify.com) — sign up with your GitHub account, it's faster.

2. **Add your site**: Click "Add new site" → "Import an existing project" → choose GitHub → select this repository. Leave the build settings blank/default (this site has no build step) and click Deploy. Netlify will give you a live URL like `random-name-123.netlify.app`.

3. **Enable Identity**: In your new Netlify site's dashboard, go to **Site configuration → Identity** → click **Enable Identity**.

4. **Restrict registration**: Under Identity settings, set **Registration** to **Invite only** (so strangers can't sign themselves up as editors).

5. **Enable Git Gateway**: Still under Identity settings, scroll to **Services → Git Gateway** → click **Enable Git Gateway**. This lets the CMS commit to your GitHub repo on your behalf.

6. **Invite yourself**: Go to the **Identity** tab → **Invite users** → enter your own email. Check your email and accept the invite — it'll ask you to set a password.

7. **Update two lines in `admin/config.yml`**: open that file in this repo and replace:
   ```yaml
   site_url: https://yourusername.github.io/your-repo-name
   display_url: https://yourusername.github.io/your-repo-name
   ```
   with your actual site URL (either your GitHub Pages URL or your new `.netlify.app` URL). Also double check the `branch:` value at the top matches your repo's default branch (`main` or `master`).

8. **Go to `yoursite.com/admin`** (or `your-netlify-url.netlify.app/admin`) and log in with the email/password from step 6. You should see the content editor.

## Using it day to day

- Edit any field, click **Publish** — it commits straight to GitHub.
- If your live site is on GitHub Pages, changes appear in 1–2 minutes (GitHub's own rebuild time). If it's on Netlify, usually under a minute.
- Uploaded images go into `assets/uploads/` in your repo automatically.

## What's editable right now

- **Homepage**: hero text/photo, urgent appeal banner, impact stats, the 4 featured campaigns, the trust section, and the 3 latest news items.
- **Site Settings**: contact email/phone/address/hours (shown on the Contact page) and your social media links (shown in every footer).

## What's NOT editable yet

The About, Campaigns (listing), Donate, Volunteer, and Transparency pages are
still hand-coded HTML — editing those still means editing the file directly.
If this first batch works well for you, say so and I'll wire up the rest the
same way.

Also — this is a **content editor only**. It does not give you donor accounts,
real payment processing, or a donation database. That's a separate, much
bigger piece of work (a real backend + database + payment gateway) — let me
know when you're ready to talk through that and we'll scope it properly.
