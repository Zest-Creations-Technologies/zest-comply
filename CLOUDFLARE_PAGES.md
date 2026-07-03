Cloudflare Pages deployment settings

This repository is deployed as a Cloudflare Pages project, not as a standalone
Cloudflare Worker.

Production build settings:

- Framework preset: Vite
- Build command: bun run build
- Build output directory: dist
- Root directory: /
- Deploy command: none
- Workers build configuration: none

Do not use `npx wrangler deploy` for this project. Cloudflare Pages should build
the Vite app with `bun run build` and publish the generated `dist` directory.

This repository intentionally does not include a `wrangler.toml` file or a
Wrangler deployment workflow. Production deployments should be handled by the
Cloudflare Pages Git integration.

If a Cloudflare deployment attempts to run `npx wrangler deploy`, it is using a
Workers deployment target or a Workers deploy command. Remove that deploy command
from the Cloudflare project settings and deploy this repository from a Cloudflare
Pages project instead.
