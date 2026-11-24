# ParcelX Instagram feed — Supabase

The Instagram integration runs entirely on the connected Supabase project. No Cloudflare Worker is required.

## Connected project

- Project ref: `ovdxipfxychotaspfccl`
- Project URL: `https://ovdxipfxychotaspfccl.supabase.co`
- Database table: `public.merchant_instagram_settings`
- Edge Function: `instagram-feed`
- Customer feed URL: `GET /functions/v1/instagram-feed?store_key=<public_store_key>`
- Dashboard save URL: `POST /functions/v1/instagram-feed/settings`
- Dashboard disconnect URL: `DELETE /functions/v1/instagram-feed/settings`

The database table has RLS enabled with no client policies. Only the Edge Function's server-side Supabase key can read or write it. The public customer page receives only a random UUID store key and the published post fields.

## Secrets still required

In Supabase Dashboard → Edge Functions → Secrets, add:

- `META_ACCESS_TOKEN`: a long-lived Facebook User access token for the connected Instagram Professional account used as the Business Discovery caller.
- `META_INSTAGRAM_ACCOUNT_ID`: the Instagram Professional account ID associated with that caller token.
- `PARCELX_DASHBOARD_API_KEY`: a strong random server-to-server key (generate one, for example, using `openssl rand -hex 32`). Store the same value only in the ParcelX dashboard backend's server-side environment.

The function uses the built-in Supabase server key (prefers `SUPABASE_SECRET_KEYS` and falls back to the legacy `SUPABASE_SERVICE_ROLE_KEY`). Never copy the service-role/secret key, Meta token, or dashboard API key into browser code or GitHub.

## Meta API

The function calls Graph API `v27.0`, which Meta currently lists as its latest Graph API version. The Business Discovery caller must be an Instagram Professional account and use the required permissions. Discovery returns eligible public Business and Creator accounts; it cannot read personal/consumer or private accounts. Meta may require app review / advanced access before the integration can serve merchants outside the app's roles.

Relevant references:

- [Meta Graph API versioning](https://developers.facebook.com/docs/graph-api/guides/versioning)
- [Meta Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)

## Dashboard Save integration

The merchant's Instagram field should store a username such as `parcelx.in`, not an embed URL. When the merchant clicks Save, the ParcelX dashboard **server** must authenticate the current session, derive the correct merchant ID from its trusted merchant context, then call:

```http
POST https://ovdxipfxychotaspfccl.supabase.co/functions/v1/instagram-feed/settings
apikey: <SUPABASE_PUBLISHABLE_KEY>
x-parcelx-dashboard-key: <PARCELX_DASHBOARD_API_KEY>
Content-Type: application/json

{
  "merchant_id": "merchant-id-from-authenticated-server-session",
  "username": "parcelx.in",
  "enabled": true
}
```

The response includes `publicStoreKey`. Persist this value in the merchant's custom tracking-page configuration. Inject it into the rendered tracking page before `script.js` loads:

```html
<script>
  window.PARCELX_TRACKING_CONFIG = {
    instagramStoreKey: "the-publicStoreKey-returned-by-save"
  };
</script>
```

Do not call the settings endpoint from browser JavaScript: the dashboard API key must remain server-side. Never trust a client-supplied merchant ID without checking that it belongs to the authenticated account.

To disconnect, the ParcelX server calls the same endpoint with HTTP `DELETE` and the JSON body `{"merchant_id":"..." }`, using the same two headers.

## Customer feed request

The static tracking template calls:

```http
GET https://ovdxipfxychotaspfccl.supabase.co/functions/v1/instagram-feed?store_key=<public_store_key>
apikey: <SUPABASE_PUBLISHABLE_KEY>
```

The response contains the Instagram username and up to four posts. Posts are cached per merchant for 30 minutes. If Meta is temporarily unavailable, the function returns the previous cached posts instead of blanking the section.

The tracking page reads `window.PARCELX_TRACKING_CONFIG.instagramStoreKey`; the Supabase project URL and publishable key are part of the public client config. Supabase publishable keys are designed for client applications and are safe with the database protected by RLS.

## Current integration boundary

The Supabase table and Edge Function are created and deployed. The public tracking template is connected to the function. The dashboard application itself is not present in this repository: its Save/Disconnect server action must still call the endpoints above and persist the returned `publicStoreKey` into each merchant's tracking-page configuration. Add the three secrets above before the function can retrieve live Instagram posts or accept the dashboard's settings changes.
