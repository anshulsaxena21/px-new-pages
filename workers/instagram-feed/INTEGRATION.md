# ParcelX merchant Instagram feed integration

This folder contains the customer-facing feed loader contract and a Cloudflare Worker API for the multi-merchant Instagram feed.

## What this adds

- One Instagram username per merchant, keyed by the ParcelX merchant ID.
- A public read endpoint for that merchant's four most recent eligible posts.
- A private write endpoint for ParcelX's authenticated dashboard backend.
- A 30-minute per-merchant cache in Cloudflare D1.
- Profile-link fallback when Meta cannot return media.
- No Meta access token is exposed in the tracking page.

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

## 2. Meta requirements

The Meta app needs a connected Instagram professional account to act as the Business Discovery caller and the required Graph API access. Business Discovery returns public media for eligible Business and Creator accounts; it is not a universal feed for every personal or private account. Advanced access / Meta App Review may be required before serving accounts outside app roles.

The Worker requests the first four media objects returned by Meta. It falls back to the Instagram profile link when the target account is unsupported or media is unavailable.

## 3. Dashboard save contract

Change the dashboard's Instagram field to a username rather than a full URL:

- Label: Instagram Username
- Placeholder: Enter Instagram username (e.g. parcelx.in)
- Helper: Public Business or Creator accounts only
- Optional toggle: Show latest 4 posts on tracking page

When the merchant clicks Save, the **ParcelX dashboard backend** must first verify that the signed-in user can edit this merchant, then call:

```http
PUT /internal/v1/merchants/{merchantId}/instagram
Authorization: Bearer <PARCELX_INTERNAL_API_KEY>
Content-Type: application/json

{
  "username": "parcelx.in"
}
```

To disconnect Instagram:

```http
DELETE /internal/v1/merchants/{merchantId}/instagram
Authorization: Bearer <PARCELX_INTERNAL_API_KEY>
```

Do not call these internal endpoints directly from the browser. The dashboard server must derive `merchantId` from the authenticated session, rather than trusting an arbitrary client-supplied merchant ID.

## 4. Tracking-page renderer contract

Before loading `standalone/order-tracking/script.js`, inject the current merchant context:

```html
<script>
  window.PARCELX_TRACKING_CONFIG = {
    merchantId: "merchant_123",
    instagramFeedEndpoint: "https://YOUR-WORKER.workers.dev/v1/instagram-feed"
  };
</script>
```

Use the actual merchant ID from the server-side tenant context. Do not expose any access token or internal API key in this object.

The customer page then calls:

```http
GET /v1/instagram-feed?merchantId=merchant_123
```

The API response includes `username`, `profileUrl`, `feedAvailable`, and up to four `posts` containing `mediaUrl`, `permalink`, `timestamp`, and `mediaType`.

The static GitHub Pages preview has no merchant session, so it shows a setup message until the renderer injects its merchant ID and the Worker endpoint.

## Files

- `index.js`: Cloudflare Worker API.
- `schema.sql`: D1 schema.
- `wrangler.toml`: Worker deployment configuration.
- `INTEGRATION.md`: dashboard and tracking renderer contract.
