# ParcelX Instagram feed — temporary username preview and future dashboard integration

The Instagram feed is powered by the connected Supabase project. This preview phase does not connect to or modify the ParcelX dashboard.

## Current temporary demo

The public tracking page includes an Instagram username field and a **Load posts** button. The viewer can enter a username or public Instagram profile URL. The page calls:

```http
GET https://ovdxipfxychotaspfccl.supabase.co/functions/v1/instagram-feed?username=parcelx.in
apikey: <SUPABASE_PUBLISHABLE_KEY>
```

The Edge Function validates the username, applies a per-IP limit of 12 preview requests per minute, uses a 30-minute username-based cache, and requests up to four recent media items from Meta Business Discovery. No merchant record is created when someone previews an arbitrary username.

## Supabase resources already created

- Project ref: `ovdxipfxychotaspfccl`
- Project URL: `https://ovdxipfxychotaspfccl.supabase.co`
- Private merchant table: `public.merchant_instagram_settings`
- Temporary preview cache: `public.instagram_preview_cache`
- Preview rate-limit table: `public.instagram_preview_rate_limits`
- Rate-limit RPC: `public.take_instagram_preview_slot(...)`
- Edge Function: `instagram-feed`

All three tables have RLS enabled and no client policies. Direct `anon` and `authenticated` access is revoked. Only the Edge Function's server-side Supabase credentials access these tables.

## Secrets still required for live posts

In Supabase Dashboard → Edge Functions → Secrets, configure:

- `META_ACCESS_TOKEN`: the Facebook User access token for the connected Instagram Professional account used as the Business Discovery caller.
- `META_INSTAGRAM_ACCOUNT_ID`: the ID of that connected Instagram Professional account.

The function uses Supabase's built-in server secret key. Do not put Meta credentials or service-role/secret keys in the browser or GitHub.

## Meta account limitation

The current implementation uses Meta Graph API `v27.0`. Meta's current Platform Versioning guide identifies v27.0 as the latest Graph API version. The versions schedule page separately lists v26.0 as the latest dated release in its table, so the Platform Versioning guide is used for the current endpoint version.

Business Discovery is intended for eligible public Instagram Professional (Business or Creator) accounts. Ordinary personal/consumer accounts and private accounts are not generally discoverable through this API. Meta App Review / Advanced Access may be required for production use with accounts outside the app's own roles.

References:
- [Meta Graph API versions](https://developers.facebook.com/docs/graph-api/changelog/versions/)
- [Instagram API changelog](https://developers.facebook.com/docs/instagram/platform/instagram-api/changelog/)

## Later dashboard integration (not connected in this phase)

When the dashboard is ready, it can use the same Edge Function and private merchant settings table. The server-side Save action should authenticate the dashboard user, derive the merchant ID from the trusted session, and call the private settings route. It will receive a generated `publicStoreKey` to inject into each merchant's tracking-page HTML. Do not send dashboard secrets from browser JavaScript.

The dashboard integration is intentionally not connected in this temporary preview phase.
