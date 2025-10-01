## Minimalist Portfolio

A single-page minimalist portfolio/landing experience built with Next.js 14 and a JSON-backed CMS. Dark mode is included out of the box and the project is ready to deploy on Netlify.

### Highlights

- **Elegant single page**: hero, focus areas, highlights, and contact footer with responsive spacing.
- **Dark mode**: toggle powered by `next-themes`, using animated sun/moon icons and CSS variables.
- **CMS editing**: Decap (Netlify) CMS manages the JSON content at `content/site.json` via a `/admin` dashboard.
- **Polished admin**: `/admin` ships with a custom Geist-powered skin and theme overrides for a cleaner editing experience.
- **Netlify ready**: `netlify.toml` plus the official Next.js plugin ensure zero-config deployments.

## Local development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the site. Edits to components or the JSON content hot-reload instantly.

## Editing content with the CMS

1. Run the dev server and open [http://localhost:3000/admin](http://localhost:3000/admin).
2. **Local only:** in another terminal run `npm run cms` to start the Decap local backend. The page will prompt for a username/password of your choice; the session is stored locally.
3. Update fields in the “Landing Page” collection — hero copy, focus cards, highlights, and contact info.
4. Publish changes; the CMS will write to `content/site.json`. Stop the local backend with `Ctrl+C` when finished.

For production, disable the local backend and enable Netlify Identity + Git Gateway in your Netlify site. The admin shell manually boots Decap CMS with `/admin/config.yml`; a rewrite also serves that file at `/config.yml` for compatibility. If you ever see a stale 404, restart `npm run dev` or hard-refresh the browser cache. Custom styling lives in `public/admin/custom.css` if you want to tweak the look further.

You can also edit `content/site.json` manually for quick tweaks or to seed different starter content.

## Deploying to Netlify

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Create a new site on Netlify and connect the repo.
3. Use the defaults: build command `npm run build`, publish directory `.next` (already configured).
4. Enable Netlify Identity and Git Gateway if you plan to use the `/admin` CMS UI.

Netlify will automatically install `@netlify/plugin-nextjs` and optimize the build for the Next.js App Router.

## Customization ideas

- Swap the palette or typography by adjusting CSS variables in `app/globals.css`.
- Add more homepage sections by extending `content/site.json` and mirroring in `app/page.tsx`.
- Register custom previews for the CMS by adding scripts to `public/admin/index.html`.

## Available scripts

- `npm run dev` – start the development server.
- `npm run lint` – run ESLint.
- `npm run build` – create an optimized production build.
- `npm run start` – serve the production build locally.
