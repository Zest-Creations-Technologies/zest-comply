# ZestComply

Compliance workspace frontend — Vite, TypeScript, React, shadcn-ui, Tailwind CSS.

## Getting started

Requires Node.js and npm.

```sh
git clone <YOUR_GIT_URL>
cd zest-comply
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server (http://localhost:8080)
- `npm run build` — production build to `dist/`
- `npm run build:dev` — development-mode build
- `npm run preview` — preview a production build locally
- `npm run lint` — run ESLint
- `npm test` — run the test suite once
- `npm run test:watch` — run tests in watch mode

## Deployment

Deployed to Cloudflare Workers (static assets, see `wrangler.toml`). Build locally and deploy with:

```sh
npm run build
npx wrangler deploy
```

There is no CI-driven auto-deploy on push — deploys are manual.
