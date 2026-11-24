import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TABLE = "merchant_instagram_settings";
const CACHE_TTL_MS = 30 * 60 * 1000;
const GRAPH_VERSION = "v27.0";
const USERNAME_RE = /^[A-Za-z0-9._]{1,30}$/;

type InstagramPost = {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string | null;
  permalink: string | null;
  timestamp: string | null;
};

function response(body: unknown, status = 200, publicCache = false) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, apikey, x-parcelx-dashboard-key",
    "Cache-Control": publicCache ? "public, max-age=60, s-maxage=60" : "no-store",
    "Vary": "Origin"
  };
  // A 204 preflight response must have a null body.
  if (status === 204) return new Response(null, { status, headers });
  return new Response(JSON.stringify(body), { status, headers });
}

function normalizeUsername(value: unknown): string {
  const username = String(value ?? "").trim().replace(/^@/, "");
  return USERNAME_RE.test(username) ? username : "";
}

function safeMerchantId(value: unknown): string {
  const merchantId = String(value ?? "").trim();
  return merchantId.length > 0 && merchantId.length <= 128 ? merchantId : "";
}

function normalizePublicKey(value: unknown): string {
  const key = String(value ?? "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)
    ? key
    : "";
}

function profileUrl(username: string) {
  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
}

function getServiceKey() {
  const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeysRaw) {
    try {
      const secretKeys = JSON.parse(secretKeysRaw);
      const key = secretKeys?.default || Object.values(secretKeys)[0];
      if (typeof key === "string" && key.length > 20) return key;
    } catch {
      console.error("SUPABASE_SECRET_KEYS is not valid JSON.");
    }
  }
  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyKey) return legacyKey;
  throw new Error("No Supabase server secret key is configured for this Edge Function.");
}

async function dbRequest(path: string, init: RequestInit = {}) {
  const projectUrl = Deno.env.get("SUPABASE_URL");
  if (!projectUrl) throw new Error("SUPABASE_URL is not configured.");

  const serviceKey = getServiceKey();
  const headers = new Headers(init.headers || {});
  headers.set("apikey", serviceKey);
  // New sb_secret keys must be sent only as apikey, not as a Bearer JWT.
  if (serviceKey.startsWith("sb_secret_")) {
    headers.delete("Authorization");
  } else {
    headers.set("Authorization", `Bearer ${serviceKey}`);
  }
  headers.set("Content-Type", "application/json");

  const result = await fetch(`${projectUrl}/rest/v1/${path}`, {
    ...init,
    headers
  });

  const text = await result.text();
  if (!result.ok) {
    console.error("Instagram settings database request failed", result.status, text.slice(0, 500));
    throw new Error("DATABASE_REQUEST_FAILED");
  }
  return text ? JSON.parse(text) : null;
}

async function findByPublicKey(publicKey: string) {
  const query = new URLSearchParams({
    select: "merchant_id,public_store_key,instagram_username,enabled,posts,posts_fetched_at",
    public_store_key: `eq.${publicKey}`,
    limit: "1"
  });
  const rows = await dbRequest(`${TABLE}?${query.toString()}`);
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

async function logMetaTokenPermissions(accessToken: string) {
  const authHeaders = { Authorization: `Bearer ${accessToken}` };
  const configuredInstagramId = Deno.env.get("META_INSTAGRAM_ACCOUNT_ID") ?? "";
  const originalInstagramId = "17841447011292787";
  try {
    const endpoints = [
      ["permissions", `https://graph.facebook.com/${GRAPH_VERSION}/me/permissions`],
      ["facebookUser", `https://graph.facebook.com/${GRAPH_VERSION}/me?fields=id,name`],
      ["pages", `https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?fields=id,name,instagram_business_account{id,username},tasks&limit=100`],
      ["assignedInstagramAccounts", `https://graph.facebook.com/${GRAPH_VERSION}/me/assigned_instagram_accounts?fields=id,username,permitted_roles&limit=100`],
      ["assignedPages", `https://graph.facebook.com/${GRAPH_VERSION}/me/assigned_pages?fields=id,name,instagram_business_account{id,username},tasks&limit=100`],
      ["businesses", `https://graph.facebook.com/${GRAPH_VERSION}/me/businesses?fields=id,name&limit=100`],
      ["configuredInstagramAccount", `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(configuredInstagramId)}?fields=id,username`],
      ["originalInstagramAccount", `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(originalInstagramId)}?fields=id,username`]
    ] as const;
    const results = await Promise.all(endpoints.map(async ([key, endpoint]) => {
      const result = await fetch(endpoint, { headers: authHeaders });
      const body = await result.json().catch(() => ({}));
      return [key, result.status, body] as const;
    }));
    const byKey = Object.fromEntries(results.map(([key, status, body]) => [key, { status, body }]));
    const permissionsBody = byKey.permissions.body;
    const permissions = Array.isArray(permissionsBody?.data)
      ? permissionsBody.data.map((item: Record<string, unknown>) => ({
          permission: String(item.permission ?? ""),
          status: String(item.status ?? "")
        }))
      : [];
    const flattenInstagram = (body: Record<string, unknown>) => {
      const accounts = Array.isArray(body?.data) ? body.data : [];
      return accounts.map((item: Record<string, unknown>) => ({
        id: String(item.id ?? ""),
        username: String(item.username ?? ""),
        permittedRoles: Array.isArray(item.permitted_roles) ? item.permitted_roles : []
      }));
    };
    const pagesBody = byKey.pages.body;
    const assignedPagesBody = byKey.assignedPages.body;
    const pages = Array.isArray(pagesBody?.data) ? pagesBody.data : [];
    const assignedPages = Array.isArray(assignedPagesBody?.data) ? assignedPagesBody.data : [];
    const pageInstagramAccounts = [...pages, ...assignedPages].flatMap((page: Record<string, unknown>) => {
      const ig = page.instagram_business_account as Record<string, unknown> | undefined;
      return ig ? [{ id: String(ig.id ?? ""), username: String(ig.username ?? "") }] : [];
    });
    const assignedInstagramAccounts = flattenInstagram(byKey.assignedInstagramAccounts.body);
    const configuredBody = byKey.configuredInstagramAccount.body;
    const originalBody = byKey.originalInstagramAccount.body;
    const businessesBody = byKey.businesses.body;
    const errorSummary = (body: Record<string, unknown>) => {
      const error = body?.error as Record<string, unknown> | undefined;
      return error ? {
        code: error.code ?? null,
        subcode: error.error_subcode ?? null,
        message: String(error.message ?? "").slice(0, 220)
      } : null;
    };
    const instagramIdsAvailable = [
      ...assignedInstagramAccounts.map((a: Record<string, unknown>) => a.id),
      ...pageInstagramAccounts.map((a: Record<string, unknown>) => a.id)
    ];
    console.error("Meta account access diagnostic", JSON.stringify({
      permissionsStatus: byKey.permissions.status,
      permissions,
      facebookUserStatus: byKey.facebookUser.status,
      facebookUserReturned: !byKey.facebookUser.body?.error && Boolean(byKey.facebookUser.body?.id),
      pageListStatus: byKey.pages.status,
      pageCount: pages.length,
      assignedInstagramAccountsStatus: byKey.assignedInstagramAccounts.status,
      assignedInstagramAccounts,
      assignedPagesStatus: byKey.assignedPages.status,
      assignedPageCount: assignedPages.length,
      linkedInstagramAccounts: pageInstagramAccounts,
      businessListStatus: byKey.businesses.status,
      businessCount: Array.isArray(businessesBody?.data) ? businessesBody.data.length : 0,
      configuredInstagramId,
      configuredInstagramAccount: configuredBody && !configuredBody.error
        ? { id: String(configuredBody.id ?? ""), username: String(configuredBody.username ?? "") }
        : null,
      configuredInstagramIdMatchesAssignedAsset: instagramIdsAvailable.includes(configuredInstagramId),
      originalInstagramId,
      originalInstagramAccount: originalBody && !originalBody.error
        ? { id: String(originalBody.id ?? ""), username: String(originalBody.username ?? "") }
        : null,
      originalInstagramIdMatchesAssignedAsset: instagramIdsAvailable.includes(originalInstagramId),
      errors: {
        permissions: errorSummary(permissionsBody),
        facebookUser: errorSummary(byKey.facebookUser.body),
        pages: errorSummary(pagesBody),
        assignedInstagramAccounts: errorSummary(byKey.assignedInstagramAccounts.body),
        assignedPages: errorSummary(assignedPagesBody),
        businesses: errorSummary(businessesBody),
        configuredInstagramAccount: errorSummary(configuredBody),
        originalInstagramAccount: errorSummary(originalBody)
      }
    }));
  } catch (error) {
    console.error("Meta account access diagnostic failed", error instanceof Error ? error.message : "UNKNOWN");
  }
}

async function fetchInstagramPosts(username: string): Promise<InstagramPost[]> {
  const accessToken = Deno.env.get("META_ACCESS_TOKEN");
  const instagramAccountId = Deno.env.get("META_INSTAGRAM_ACCOUNT_ID");
  if (!accessToken || !instagramAccountId) throw new Error("META_CREDENTIALS_MISSING");

  const fields = `business_discovery.username(${username}){username,media.limit(4){id,caption,media_type,media_url,thumbnail_url,permalink,timestamp}}`;
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(instagramAccountId)}`);
  url.searchParams.set("fields", fields);

  const metaResponse = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const payload = await metaResponse.json().catch(() => ({}));
  if (!metaResponse.ok || payload?.error) {
    const apiError = payload?.error ?? {};
    if (apiError.code === 10 || apiError.code === 200) {
      await logMetaTokenPermissions(accessToken);
    }
    console.error("Instagram Business Discovery request failed", JSON.stringify({
      status: metaResponse.status,
      type: apiError.type ?? null,
      code: apiError.code ?? null,
      subcode: apiError.error_subcode ?? null,
      message: String(apiError.message ?? "").slice(0, 400),
      userTitle: String(apiError.error_user_title ?? "").slice(0, 200),
      userMessage: String(apiError.error_user_msg ?? "").slice(0, 300),
      fbtraceId: apiError.fbtrace_id ?? null
    }));
    throw new Error("INSTAGRAM_LOOKUP_FAILED");
  }

  const items = payload?.business_discovery?.media?.data;
  if (!Array.isArray(items)) return [];

  return items.slice(0, 4).map((item: Record<string, unknown>) => {
    const mediaUrl = typeof item.media_url === "string" ? item.media_url
      : typeof item.thumbnail_url === "string" ? item.thumbnail_url
      : null;
    const permalink = typeof item.permalink === "string" && item.permalink.startsWith("https://www.instagram.com/")
      ? item.permalink
      : null;
    return {
      id: String(item.id ?? ""),
      caption: String(item.caption ?? ""),
      mediaType: String(item.media_type ?? ""),
      mediaUrl: mediaUrl?.startsWith("https://") ? mediaUrl : null,
      permalink,
      timestamp: typeof item.timestamp === "string" ? item.timestamp : null
    };
  });
}

async function refreshFeed(row: Record<string, unknown>) {
  const username = normalizeUsername(row.instagram_username);
  const publicKey = String(row.public_store_key);
  const existingPosts = Array.isArray(row.posts) ? row.posts as InstagramPost[] : [];
  const fetchedAt = row.posts_fetched_at ? Date.parse(String(row.posts_fetched_at)) : 0;
  const isFresh = fetchedAt > 0 && Date.now() - fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return {
      ok: true,
      username,
      profileUrl: profileUrl(username),
      feedAvailable: existingPosts.length > 0,
      posts: existingPosts.slice(0, 4),
      cached: true
    };
  }

  try {
    const posts = await fetchInstagramPosts(username);
    const now = new Date().toISOString();
    const filter = new URLSearchParams({ public_store_key: `eq.${publicKey}` });
    await dbRequest(`${TABLE}?${filter.toString()}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        posts,
        posts_fetched_at: now,
        last_error: null,
        updated_at: now
      })
    });

    return {
      ok: true,
      username,
      profileUrl: profileUrl(username),
      feedAvailable: posts.length > 0,
      posts,
      cached: false
    };
  } catch (error) {
    const now = new Date().toISOString();
    const filter = new URLSearchParams({ public_store_key: `eq.${publicKey}` });
    try {
      await dbRequest(`${TABLE}?${filter.toString()}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          last_error: error instanceof Error ? error.message : "INSTAGRAM_LOOKUP_FAILED",
          updated_at: now
        })
      });
    } catch {
      // Keep the feed response usable even when writing diagnostics fails.
    }

    return {
      ok: true,
      username,
      profileUrl: profileUrl(username),
      feedAvailable: existingPosts.length > 0,
      posts: existingPosts.slice(0, 4),
      cached: existingPosts.length > 0,
      stale: existingPosts.length > 0,
      message: "Instagram posts could not be refreshed. Showing the most recently cached posts."
    };
  }
}


async function hashRateLimitKey(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((part) => part.toString(16).padStart(2, "0")).join("");
}

async function takePreviewRateLimitSlot(request: Request): Promise<boolean> {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = request.headers.get("cf-connecting-ip") || forwardedFor || "unknown";
  const ipHash = await hashRateLimitKey(clientAddress);

  const allowed = await dbRequest("rpc/take_instagram_preview_slot", {
    method: "POST",
    body: JSON.stringify({
      p_ip_hash: ipHash,
      p_now: new Date().toISOString(),
      p_limit: 12,
      p_window_seconds: 60
    })
  });
  return allowed === true;
}

async function handleUsernamePreview(request: Request) {
  const url = new URL(request.url);
  const username = normalizeUsername(url.searchParams.get("username"));
  if (!username) {
    return response({
      ok: false,
      code: "INVALID_USERNAME",
      message: "Enter a valid Instagram username without @ or a profile URL."
    }, 400);
  }

  if (!await takePreviewRateLimitSlot(request)) {
    return response({
      ok: false,
      code: "RATE_LIMITED",
      message: "Too many preview requests. Please wait a minute and try again."
    }, 429);
  }

  const query = new URLSearchParams({
    select: "username,posts,posts_fetched_at",
    username: `eq.${username}`,
    limit: "1"
  });
  const rows = await dbRequest(`${"instagram_preview_cache"}?${query.toString()}`);
  const cached = Array.isArray(rows) ? rows[0] ?? null : null;
  const existingPosts = Array.isArray(cached?.posts) ? cached.posts : [];
  const fetchedAt = cached?.posts_fetched_at ? Date.parse(String(cached.posts_fetched_at)) : 0;
  const isFresh = fetchedAt > 0 && Date.now() - fetchedAt < CACHE_TTL_MS;
  if (isFresh) {
    return response({
      ok: true,
      username,
      profileUrl: profileUrl(username),
      feedAvailable: existingPosts.length > 0,
      posts: existingPosts.slice(0, 4),
      cached: true
    }, 200, true);
  }

  try {
    const posts = await fetchInstagramPosts(username);
    const now = new Date().toISOString();
    await dbRequest("instagram_preview_cache?on_conflict=username", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        username,
        posts,
        posts_fetched_at: now,
        last_error: null,
        updated_at: now
      })
    });

    return response({
      ok: true,
      username,
      profileUrl: profileUrl(username),
      feedAvailable: posts.length > 0,
      posts,
      cached: false,
      message: posts.length ? "" : "No public posts were returned. The profile may be private, personal, or unavailable through Instagram Business Discovery."
    }, 200, true);
  } catch (error) {
    console.error("Instagram preview could not be refreshed", error instanceof Error ? error.message : "UNKNOWN");
    const stalePosts = existingPosts.slice(0, 4);
    return response({
      ok: stalePosts.length > 0,
      username,
      profileUrl: profileUrl(username),
      feedAvailable: stalePosts.length > 0,
      posts: stalePosts,
      cached: stalePosts.length > 0,
      stale: stalePosts.length > 0,
      code: "INSTAGRAM_UNAVAILABLE",
      message: stalePosts.length
        ? "Instagram could not be refreshed. Showing previously cached posts."
        : "We couldn't load posts. Check that this is a public Business or Creator account and that Meta API access is configured."
    }, stalePosts.length ? 200 : 503, true);
  }
}

async function handleFeed(request: Request) {
  const url = new URL(request.url);
  const publicKey = normalizePublicKey(url.searchParams.get("store_key"));
  if (!publicKey) return response({ ok: false, code: "INVALID_STORE_KEY" }, 400, true);

  const row = await findByPublicKey(publicKey);
  if (!row || row.enabled !== true) {
    return response({ ok: false, code: "NOT_CONFIGURED", username: "", posts: [] }, 404, true);
  }

  const result = await refreshFeed(row);
  return response(result, 200, true);
}

async function handleSave(request: Request) {
  const expectedKey = Deno.env.get("PARCELX_DASHBOARD_API_KEY");
  const providedKey = request.headers.get("x-parcelx-dashboard-key");
  if (!expectedKey || !providedKey || providedKey !== expectedKey) {
    return response({ ok: false, code: "UNAUTHORIZED" }, 401);
  }

  const body = await request.json().catch(() => null);
  const merchantId = safeMerchantId(body?.merchant_id);
  const username = normalizeUsername(body?.username);
  if (!merchantId) return response({ ok: false, code: "INVALID_MERCHANT_ID" }, 400);
  if (!username) {
    return response({
      ok: false,
      code: "INVALID_INSTAGRAM_USERNAME",
      message: "Enter a valid Instagram username, without @ or a full profile URL."
    }, 400);
  }

  const query = new URLSearchParams({
    select: "id,public_store_key",
    merchant_id: `eq.${merchantId}`,
    limit: "1"
  });
  const existingRows = await dbRequest(`${TABLE}?${query.toString()}`);
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;
  const publicStoreKey = existing?.public_store_key || crypto.randomUUID();
  const now = new Date().toISOString();

  const upsertQuery = new URLSearchParams({
    on_conflict: "merchant_id",
    select: "merchant_id,public_store_key,instagram_username,enabled"
  });
  const rows = await dbRequest(`${TABLE}?${upsertQuery.toString()}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      merchant_id: merchantId,
      public_store_key: publicStoreKey,
      instagram_username: username,
      enabled: body?.enabled !== false,
      posts: [],
      posts_fetched_at: null,
      last_error: null,
      updated_at: now
    })
  });
  const saved = Array.isArray(rows) ? rows[0] : null;

  return response({
    ok: true,
    merchantId,
    username,
    publicStoreKey: saved?.public_store_key || publicStoreKey,
    profileUrl: profileUrl(username),
    enabled: saved?.enabled ?? true
  });
}

async function handleDisconnect(request: Request) {
  const expectedKey = Deno.env.get("PARCELX_DASHBOARD_API_KEY");
  const providedKey = request.headers.get("x-parcelx-dashboard-key");
  if (!expectedKey || !providedKey || providedKey !== expectedKey) {
    return response({ ok: false, code: "UNAUTHORIZED" }, 401);
  }

  const body = await request.json().catch(() => null);
  const merchantId = safeMerchantId(body?.merchant_id);
  if (!merchantId) return response({ ok: false, code: "INVALID_MERCHANT_ID" }, 400);

  const query = new URLSearchParams({ merchant_id: `eq.${merchantId}` });
  await dbRequest(`${TABLE}?${query.toString()}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  return response({ ok: true, merchantId, disconnected: true });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return response(null, 204);
  try {
    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    if (request.method === "GET" && path.endsWith("/instagram-feed")) {
      if (new URL(request.url).searchParams.has("username")) return await handleUsernamePreview(request);
      return await handleFeed(request);
    }
    if (request.method === "POST" && path.endsWith("/instagram-feed/settings")) return await handleSave(request);
    if (request.method === "DELETE" && path.endsWith("/instagram-feed/settings")) return await handleDisconnect(request);
    return response({ ok: false, code: "NOT_FOUND" }, 404);
  } catch (error) {
    console.error("Instagram feed function error", error instanceof Error ? error.message : "UNKNOWN");
    return response({ ok: false, code: "INTERNAL_ERROR" }, 500);
  }
});
