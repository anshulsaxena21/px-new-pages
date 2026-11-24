# ParcelX merchant Instagram feed — Supabase implementation

The Instagram feed uses the connected Supabase project only. Cloudflare is not required.

## Supabase resources

- Project: `ovdxipfxychotaspfccl`
- Project URL: `https://ovdxipfxychotaspfccl.supabase.co`
- Database table: `public.merchant_instagram_settings`
- Edge Function: `instagram-feed`
- Public endpoint: `GET /functions/v1/instagram-feed?store_key=<public_store_key>`
- Private save endpoint: `POST /functions/v1/instagram-feed/settings`
- Private disconnect endpoint: `DELETE /functions/v1/instagram-feed/settings`

The table is protected by RLS and has no policies for `anon` or `authenticated`. The Edge Function accesses it using the server-side service role only. The browser only receives a random UUID public store key and the four post objects.

## Required Edge Function secrets

Add these under Supabase Dashboard → Edge Functions → Secrets:

- `META_ACCESS_TOKEN`: access token for the Instagram Professional account used as the Business Discovery caller.
- `META_INSTAGRAM_ACCOUNT_ID`: ID of that connected Instagram Professional account.
- `PARCELX_DASHBOARD_API_KEY`: generate a high-entropy value (for example, `openssl rand -hex 32`) and store the same value in the ParcelX dashboard backend's server-side environment.
  
Supabase's built-in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are used by the function. Never copy service-role or Meta credentials into the browser or GitHub repository.

The function uses Meta Graph API `v27.0`, currently the latest version listed by Meta as of November 24, 2026. See [Meta Graph API versions](https://developers.facebook.com/docs/graph-api/changelog/versions/) and [Facebook Platform versioning](https://developers.facebook.com/docs/graph-api/guides/versioning).

## Dashboard integration contract

The Instagram dashboard field should save a username, rather than requiring a pasted embed URL.

After authenticating the dashboard user and verifying that they can edit this merchant, the **ParcelX server** calls:

```http
POST https://ovdxipfxychotaspfccl.supabase.co/functions/v1/instagram-feed/settings
apikey: <SUPABASE_PUBLISHABLE_KEY>
x-parcelx-dashboard-key: <PARCELX_DASHBOARD_API_KEY>
Content-Type: application/json

{
  "merchant_id": "the-merchant-id-from-the-authenticated-session",
  "username": "parcelx.in",
  "enabled": true
}
```

The response includes `publicStoreKey`. Persist this on the merchant's custom tracking-page settings and inject it into the customer-facing HTML:

```html
<script>
  window.PARCELX_TRACKING_CONFIG = {
    instagramStoreKey: "the-publicStoreKey-returned-by-the-save-endpoint"
  };
</script>
```

Do not call the settings endpoint directly from browser JavaScript. The dashboard server must derive `merchant_id` from its authenticated session; it must not trust an arbitrary merchant ID supplied by the browser. Keep `PARCELX_DASHBOARD_API_KEY` server-side.

To disconnect, the ParcelX server sends a `DELETE` request to the settings endpoint with the same headers and JSON body containing `merchant_id`.

## Customer-facing feed

The tracking template already calls the deployed Edge Function with:

```http
GET https://ovdxipfxychotaspfccl.supabase.co/functions/v1/instagram-feed?store_key=<public_store_key>
apikey: <SUPABASE_PUBLISHABLE_KEY>
```

The Edge Function returns up to four posts and caches them per merchant for 30 minutes. It shows a profile-link fallback when Meta does not return feed media.

## Instagram account eligibility

The current Business Discovery implementation is for eligible public Instagram Professional (Business or Creator) accounts. It is not a universal feed for personal or private accounts. The caller account and Meta app must have the appropriate Graph API permissions and production access. Meta review / advanced access may be needed before this works for accounts outside the app's roles.

## Deployment status and remaining integration

- The settings table has been created in the connected Supabase project with RLS enabled.
- The `instagram-feed` Edge Function is deployed with JWT gateway verification disabled; the GET route is public by opaque store key and write routes require the private dashboard API key.
- Add the three secrets above before the function can fetch real posts or accept dashboard writes.
- The separate ParcelX dashboard application is not present in this website repository. Its Save button still needs to call this private endpoint and persist `publicStoreKey` in its per-merchant tracking-page settings.
