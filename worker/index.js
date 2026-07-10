// Wraps static asset serving so every response (including the SPA shell,
// JS/CSS bundles, and the SPA-fallback index.html) gets hardened security
// headers. Cloudflare's classic Pages `_headers` file convention does not
// apply to the newer [assets] Workers config (see wrangler.toml), so this
// is the supported way to attach headers to asset responses there.

const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api-dev.zestcomply.com https://api.zestcomply.com wss://api-dev.zestcomply.com wss://api.zestcomply.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default {
  async fetch(request, env) {
    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value);
    }
    return response;
  },
};
