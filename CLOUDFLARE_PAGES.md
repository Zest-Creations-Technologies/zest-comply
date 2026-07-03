Cloudflare Pages deployment settings

This repository is deployed as a Cloudflare Pages project, not as a standalone
Cloudflare Worker.

Production build settings:

- Framework preset: Vite
- Build command: bun run build
- Build output directory: dist
- Root directory: /

Do not use `npx wrangler deploy` for this project. Cloudflare Pages should build
the Vite app and publish the generated `dist` directory.
