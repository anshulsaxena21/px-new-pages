# ParcelX merchant Instagram feed integration

This folder contains the customer-facing feed loader contract and a Cloudflare Worker API for a multi-merchant Instagram feed.

## What this adds

- One Instagram username per merchant, keyed internally by the ParcelX merchant ID.
- A separate random public store key for read-only customer feed requests; internal merchant IDs are not exposed in tracking-page markup.
- A public read endpoint for up to four recent eligible posts.
- A private write endpoint for ParcelX's authenticated dashboard backend.
- A 30-minute per-merchant feed cache in Cloudflare D1.
- A profile-link fallback when Meta cannot return media.
- No Meta access token or internal API key is exposed in the tracking page.

## 1. Cloudflare setup

1. Create a Cloudflare D1 database named `parcelx-instagram-feed`.
2. Run the SQL in `schema.sql`.
3. Replace the D1 `database_id` placeholder in `wrangler.toml`.
4. From this folder, run `npx wrangler deploy`.
5. Add Worker secrets:

```bash
npx wrangler secret put META_ACCESS_TOKEN
npx wrangler secret put META_INSTAGRAM_ACCOUNT_ID
npx wrangler secret put PARCELX_INTERNAL_API_KEY
```

Keep `PARCELX_INTERNAL_API_KEY` only in the ParcelX server environment. Never put it in dashboard JavaScript, browser storage, or this repository. The Meta token must also remain a Worker secret.

## 2. Meta requirements and supported accounts

This implementation uses Instagram Business Discovery with the Instagram API with Facebook Login. The caller must be an Instagram Professional account (Business or Creator) linked to a Facebook Page, with the required Meta app permissions, including `instagram_basic`, `pages_show_list`, and `pages_read_engagement`. Meta app review / advanced access may be required before serving merchants outside app roles.

The target account must be public and professional (Business or Creator). Consumer/personal and private Instagram accounts are not supported by this API. The Worker requests the four most recent media objects returned by Meta and falls back to the public Instagram profile link if media is unavailable.

Meta's Graph API version is configurable with `META_GRAPH_API_VERSION`; the current default in this Worker config is `v27.0`.

## 3. Dashboard save contract

Change the screenshot's Instagram field to a username rather than a full URL:

- Label: Instagram Username
- Placeholder: Enter Instagram username (e.g. parcelx.in)
- Helper: Public Business or Creator accounts only
- Optional toggle: Show latest 4 posts on tracking page

When a merchant clicks Save, the **ParcelX dashboard backend** must first verify that the signed-in user can edit this merchant, then call:

```http
PUT /internal/v1/merchants/{merchantId}/instagram
Authorization: Bearer <PARCELX_INTERNAL_API_KEY>
Content-Type: application/json

{
  "username": "parcelx.in"
}
```

The response contains a generated `publicStoreKey`. Persist that key in the merchant's custom tracking-page configuration, and inject it into that merchant's public tracking-page HTML. The backend must derive `merchantId` from the authenticated session, not trust an arbitrary merchant ID from the browser.

To disconnect Instagram, the ParcelX backend calls:

```http
DELETE /internal/v1/merchants/{merchantId}/instagram
Authorization: Bearer <PARCELX_INTERNAL_API_KEY>
```

## 4. Tracking-page renderer contract

Before loading `standalone/order-tracking/script.js`, inject the current store's public key and Worker endpoint:

```html
<script>
  window.PARCELX_TRACKING_CONFIG = {
    instagramStoreKey: "generated-public-store-key",
    instagramFeedEndpoint: "https://YOUR-WORKER.workers.dev/v1/instagram-feed"
  };
</script>
```

The key is an opaque, randomly generated UUID. Do not expose any access token or internal API key in this object.

The tracking page calls:

```http
GET /v1/instagram-feed?storeKey=generated-public-store-key
```

The API response includes `username`, `profileUrl`, `feedAvailable`, and up to four posts containing `mediaUrl`, `permalink`, `timestamp`, and `mediaType`.

The static GitHub Pages preview has no merchant context, so it displays a setup message until the real ParcelX tracking-page renderer injects the public store key and Worker endpoint. The ParcelX dashboard project and its merchant-settings backend are not included in this repository; that integration still needs to be connected there.

## Files

- `index.js`: Cloudflare Worker API.
- `schema.sql`: D1 schema.
- `wrangler.toml`: Worker deployment configuration.
- `INTEGRATION.md`: dashboard and tracking renderer contract.
