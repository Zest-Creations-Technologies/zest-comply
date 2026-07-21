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

// Backs the support chat widget (src/components/support/SupportChatWidget.tsx).
// Uses Workers AI (env.AI, bound in wrangler.toml) rather than a paid LLM API -
// free within Cloudflare's daily neuron allowance, no separate API key/cost.
const SUPPORT_CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SUPPORT_CHAT_SYSTEM_PROMPT = `You are the ZestComply support assistant, embedded on ZestComply's public marketing site.

About ZestComply: an AI-assisted governance, risk, and compliance (GRC) platform. It guides organizations from initial assessment through delivery of a complete, audit-ready compliance documentation package (policies, procedures, System Security Plans, POA&Ms). It supports SOC 2, FedRAMP, HIPAA, PCI-DSS, ISO 27001, CMMC 2.0, and other frameworks - dynamically generating content for any framework, not just a fixed list. Optional integrations let security scanners (ZestRecon or others) feed findings in as evidence.

Your job: answer visitor questions about ZestComply's product, supported frameworks, and how the platform works, based only on the information above. If asked something you don't know (specific pricing numbers, account-specific issues, or anything about an existing customer's data), say plainly that you don't have that information and suggest they use the site's "Request Access" / contact flow instead of guessing.

Keep answers concise (2-4 sentences) and friendly. Never claim a capability not described above.`;

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleSupportChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return jsonResponse({ error: "Invalid message history." }, 400);
  }

  const sanitized = [];
  for (const message of messages) {
    if (
      !message ||
      (message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string" ||
      message.content.length === 0 ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return jsonResponse({ error: "Invalid message format." }, 400);
    }
    sanitized.push({ role: message.role, content: message.content });
  }

  try {
    const result = await env.AI.run(SUPPORT_CHAT_MODEL, {
      messages: [{ role: "system", content: SUPPORT_CHAT_SYSTEM_PROMPT }, ...sanitized],
      max_tokens: 400,
    });
    return jsonResponse({ reply: result?.response ?? "" }, 200);
  } catch (err) {
    return jsonResponse(
      { error: "The support assistant is temporarily unavailable. Please try again shortly." },
      502
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/support-chat" && request.method === "POST") {
      return handleSupportChat(request, env);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value);
    }
    return response;
  },
};
