# Welcome to your Lovable project

## Run locally

- Install Node.js (includes npm).
- Run:
  - `npm install`
  - `npm run dev`

## Update gallery with new work

The gallery now reads data from `public/data/photos.json`.

1. Put your new image into `public/images/` (for example: `public/images/new-shot.jpg`).
2. Add a new object in `public/data/photos.json`:
   - `src`: `"/images/new-shot.jpg"`
   - `alt`: short accessible description
   - `title`: display title
   - `category`: e.g. Portrait, Landscape, Street
   - `aspect` (optional): Tailwind aspect class. For **Landscape**, wide previews work well: `aspect-[16/9]` or `aspect-[3/2]`. If you omit `aspect` and set `category` to `Landscape`, the gallery defaults to `aspect-[16/9]`.
3. Save and commit/push changes.
4. Your live site updates on next deploy.
