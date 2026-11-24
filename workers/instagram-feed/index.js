const FEED_CACHE_SECONDS = 30 * 60;
const USERNAME_PATTERN = /^[A-Za-z0-9._]{1,30}$/;
const MERCHANT_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const STORE_KEY_PATTERN = /^[0-9a-f-]{36}$/i;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Cache-Control": "no-store"
    }
  });
}

function normalizeUsername(value) {
  const username = String(value || "").trim().replace(/^@/, "");
  return USERNAME_PATTERN.test(username) ? username.toLowerCase() : "";
}

function profileUrl(username) {
  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
}

async function getMerchantSettings(env, merchantId) {
  return env.DB.prepare(
    "SELECT public_store_key, username, feed_json, feed_cached_at FROM merchant_instagram_settings WHERE merchant_id = ?"
  ).bind(merchantId).first();
}

async function fetchBusinessDiscovery(env, username) {
  if (!env.META_ACCESS_TOKEN || !env.META_INSTAGRAM_ACCOUNT_ID) {
    throw new Error("META_NOT_CONFIGURED");
  }

  const version = env.META_GRAPH_API_VERSION || "v27.0";
  const fields = `business_discovery.username(${username}){username,media.limit(4){id,caption,media_type,media_url,thumbnail_url,permalink,timestamp}}`;
  const url = new URL(`https://graph.facebook.com/${version}/${env.META_INSTAGRAM_ACCOUNT_ID}`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", env.META_ACCESS_TOKEN);

  const response = await fetch(url.toString(), { method: "GET" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) throw new Error("META_LOOKUP_FAILED");

  const discovery = body.business_discovery;
  if (!discovery) return null;
  const media = Array.isArray(discovery.media?.data) ? discovery.media.data : [];
  return {
    username: normalizeUsername(discovery.username) || username,
    posts: media.slice(0, 4).map((item) => ({
      id: String(item.id || ""),
      caption: String(item.caption || ""),
      mediaType: String(item.media_type || ""),
      mediaUrl: item.media_url || item.thumbnail_url || null,
      permalink: item.permalink || null,
      timestamp: item.timestamp || null
    }))
  };
}

async function handleFeed(request, env) {
  const url = new URL(request.url);
  const storeKey = url.searchParams.get("storeKey") || "";
  if (!STORE_KEY_PATTERN.test(storeKey)) return json({ ok: false, code: "INVALID_STORE_KEY" }, 400);
  if (!env.DB) return json({ ok: false, code: "SERVICE_NOT_CONFIGURED" }, 503);

  const settings = await env.DB.prepare(
    "SELECT username, feed_json, feed_cached_at FROM merchant_instagram_settings WHERE public_store_key = ?"
  ).bind(storeKey).first();

  if (!settings?.username) return json({ ok: false, code: "NOT_CONFIGURED", username: "", posts: [] });
  const username = normalizeUsername(settings.username);
  if (!username) return json({ ok: false, code: "INVALID_CONFIGURATION", username: "", posts: [] }, 500);

  const now = Math.floor(Date.now() / 1000);
  if (settings.feed_json && settings.feed_cached_at && now - settings.feed_cached_at < FEED_CACHE_SECONDS) {
    try {
      return json({ ...JSON.parse(settings.feed_json), cached: true });
    } catch {
      // Ignore a corrupt cache and refresh it.
    }
  }

  try {
    const discovery = await fetchBusinessDiscovery(env, username);
    const result = discovery
      ? { ok: true, username, profileUrl: profileUrl(username), feedAvailable: discovery.posts.length > 0, posts: discovery.posts, cached: false }
      : { ok: true, username, profileUrl: profileUrl(username), feedAvailable: false, posts: [], message: "This account is not available through Instagram Business Discovery.", cached: false };

    await env.DB.prepare(
      "UPDATE merchant_instagram_settings SET feed_json = ?, feed_cached_at = ? WHERE public_store_key = ?"
    ).bind(JSON.stringify(result), now, storeKey).run();
    return json(result);
  } catch (error) {
    const code = error.message === "META_NOT_CONFIGURED" ? "META_NOT_CONFIGURED" : "INSTAGRAM_UNAVAILABLE";
    return json({
      ok: true, username, profileUrl: profileUrl(username), feedAvailable: false, posts: [], code,
      message: "Instagram posts are temporarily unavailable. The profile link is still available."
    });
  }
}

async function handleSettings(request, env, merchantId) {
  const expectedKey = env.PARCELX_INTERNAL_API_KEY;
  const authorization = request.headers.get("Authorization") || "";
  if (!expectedKey || authorization !== `Bearer ${expectedKey}`) return json({ ok: false, code: "UNAUTHORIZED" }, 401);
  if (!env.DB) return json({ ok: false, code: "SERVICE_NOT_CONFIGURED" }, 503);

  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM merchant_instagram_settings WHERE merchant_id = ?").bind(merchantId).run();
    return json({ ok: true, merchantId, configured: false });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "INVALID_JSON" }, 400);
  }

  const username = normalizeUsername(body?.username);
  if (!username) return json({ ok: false, code: "INVALID_USERNAME", message: "Enter an Instagram username without a URL." }, 400);

  const now = Math.floor(Date.now() / 1000);
  const existing = await getMerchantSettings(env, merchantId);
  const publicStoreKey = existing?.public_store_key || crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO merchant_instagram_settings (merchant_id, public_store_key, username, feed_json, feed_cached_at, updated_at)
     VALUES (?, ?, ?, NULL, NULL, ?)
     ON CONFLICT(merchant_id) DO UPDATE SET public_store_key = excluded.public_store_key,
       username = excluded.username, feed_json = NULL, feed_cached_at = NULL, updated_at = excluded.updated_at`
  ).bind(merchantId, publicStoreKey, username, now).run();

  return json({ ok: true, merchantId, username, publicStoreKey, profileUrl: profileUrl(username), configured: true });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/v1/instagram-feed") return await handleFeed(request, env);
      const match = url.pathname.match(/^\/internal\/v1\/merchants\/([^/]+)\/instagram$/);
      if (match && ["PUT", "DELETE"].includes(request.method)) {
        const merchantId = decodeURIComponent(match[1]);
        if (!/^[A-Za-z0-9_-]{1,128}$/.test(merchantId)) return json({ ok: false, code: "INVALID_MERCHANT" }, 400);
        return await handleSettings(request, env, merchantId);
      }
      return json({ ok: false, code: "NOT_FOUND" }, 404);
    } catch {
      return json({ ok: false, code: "INTERNAL_ERROR" }, 500);
    }
  }
};
