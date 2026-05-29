# Work Portfolio

Photography portfolio built with Vite, React, and Tailwind.

## Run locally

- Install Node.js 20+ (includes npm).
- Run:
  - `npm install`
  - `npm run dev`
- Open the URL Vite prints (default: `http://localhost:8181`).

## Update gallery with new work

The gallery reads data from `public/data/photos.json`.

1. Put your new image into `public/images/` (for example: `public/images/new-shot.jpg`).
2. Add a new object in `public/data/photos.json`:
   - `src`: `"/images/new-shot.jpg"`
   - `alt`: short accessible description
   - `title`: display title
   - `category`: e.g. Portrait, Landscape, Street
   - `aspect` (optional): Tailwind aspect class. For **Landscape**, wide previews work well: `aspect-[16/9]` or `aspect-[3/2]`. If you omit `aspect` and set `category` to `Landscape`, the gallery defaults to `aspect-[16/9]`.
3. Commit and push to Git.
4. Render redeploys automatically (see below).

## Deploy on Render

This project is configured for [Render](https://render.com) static hosting via `render.yaml`.

### First-time setup

1. Push this repo to **GitHub** (include `public/images/` and `public/data/photos.json`; do **not** commit `dist/` — Render builds it).
2. On Render: **New** → **Blueprint** → connect the repo (or **New** → **Static Site** with the settings below).
3. Render runs `npm ci && npm run build` and publishes `./dist`.
4. SPA rewrite `/*` → `/index.html` is defined in `render.yaml` for React Router.

### Manual Static Site settings (if not using Blueprint)

| Setting | Value |
|--------|--------|
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Rewrite | Source `/*` → Destination `/index.html` (Action: **Rewrite**) |

### After deploy

- Site URL: `https://aidulislamphotography.onrender.com` (matches the service name in `render.yaml`; Render may add a suffix if the name is taken globally).
- Optional: add a custom domain under **Settings → Custom Domains**.

### Updating the live site

1. Edit code, images, or `public/data/photos.json`.
2. `git commit` and `git push` to the branch Render watches (usually `main`).
3. Render rebuilds and deploys; no manual upload of `dist/` needed.
