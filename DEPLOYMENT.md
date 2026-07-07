Deployment

This app deploys as a Cloudflare Worker serving static assets, configured by
`wrangler.toml` (`name = "zest-comply"`, `[assets] directory = "./dist"`).
It is **not** a Cloudflare Pages project, and there is no CI/CD - pushing to
`main` on GitHub does not trigger a deploy.

To ship a change to production:

```
npm run build
npx wrangler deploy
```

`wrangler deploy` uploads the contents of `dist/` to the `zest-comply`
Worker and publishes it immediately - always run `npm run build` first so
you're not deploying a stale bundle.

The Worker is reachable directly at its `workers.dev` URL (shown in the
`wrangler deploy` output) and via the custom domain `www.zestcomply.com` /
`zestcomply.com`, which is bound to it through a Worker route/custom domain
in the Cloudflare dashboard. The custom domain sits behind Cloudflare's bot
protection (Turnstile challenge), which blocks headless/automated clients -
that's expected and unrelated to whether a deploy succeeded.

`not_found_handling = "single-page-application"` in `wrangler.toml` makes
the Worker fall back to `index.html` for unmatched paths, so client-side
routing (React Router) works correctly on refresh/direct navigation.

To check what's currently live: `npx wrangler deployments list`.
