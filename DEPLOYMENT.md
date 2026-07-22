Deployment

This app deploys as a Cloudflare Worker serving static assets, configured by
`wrangler.toml` (`name = "zest-comply"`, `[assets] directory = "./dist"`).
It is **not** a Cloudflare Pages project.

Pushing to `main` on GitHub triggers a deploy automatically via **Cloudflare
Workers Builds** (native git integration configured in the Cloudflare
dashboard) - no manual step required. There is no GitHub Actions workflow
for this anymore: an earlier `.github/workflows/deploy.yml` duplicated the
same deploy using a separate, stale `CLOUDFLARE_API_TOKEN` secret and was
removed on 2026-07-10 (commit `9742be1`) since Workers Builds already
handled it reliably on its own.

To deploy manually instead (e.g. to test a change before pushing):

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

## Backend (separate repo, separate cloud)

This document covers only the `zest-comply` frontend. The API lives in the
`zct-backend` repo and deploys to **Azure Container Apps**, not Cloudflare -
these are two independent deployments on two different clouds:

- Resource group: `zestcomply-rg` (subscription "Zest Creations
  Technologies", region `westus2`).
- `zct-api-private` - the API, a Container App in the VNET-isolated
  `zestcomply-env-private` managed environment.
- `zct-migrate-private` - a Container Apps Job that runs DB migrations.
- `zct-db-private` - PostgreSQL Flexible Server, private/VNET-only (no
  public network access).
- `zestcomply-kv` - Key Vault holding the app's 8 production secrets.
- `zctregistry` - Azure Container Registry for the API's container images.
- AWS was the original target (ECS/RDS/ALB via Terraform); that
  infrastructure and its GitHub Actions deploy workflows were deleted on
  2026-07-21 once the Azure move was confirmed. Terraform for the current
  Azure setup is not yet checked into `zct-backend/infra/` - the
  `infra/ibm/` Terraform there is unrelated (IBM Cloud dev environment for
  the separate watsonx.data track).
