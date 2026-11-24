create table if not exists public.merchant_instagram_settings (
  id uuid primary key default gen_random_uuid(),
  merchant_id text not null unique,
  public_store_key uuid not null unique default gen_random_uuid(),
  instagram_username text not null
    check (instagram_username ~ '^[A-Za-z0-9._]{1,30}$'),
  enabled boolean not null default true,
  posts jsonb not null default '[]'::jsonb
    check (jsonb_typeof(posts) = 'array'),
  posts_fetched_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists merchant_instagram_settings_updated_at_idx
  on public.merchant_instagram_settings (updated_at desc);

alter table public.merchant_instagram_settings enable row level security;

revoke all on table public.merchant_instagram_settings from anon, authenticated;
grant all on table public.merchant_instagram_settings to service_role;

comment on table public.merchant_instagram_settings is
  'Private merchant-level Instagram profile settings and cached public feed posts. Access is restricted to the service role through the instagram-feed Edge Function.';
