Cloudflare Pages deployment settings

This repository is deployed through Cloudflare Pages Git integration.

Production build settings:

- Framework preset: Vite
- Build command: bun run build
- Build output directory: dist
- Root directory: /
- Deploy command: none

Cloudflare Pages should build the Vite app with `bun run build` and publish the
generated `dist` directory. No additional deploy command is required.

This repository intentionally does not include standalone edge runtime deployment
configuration. Production deployments should be handled by the Cloudflare Pages
Git integration only.
