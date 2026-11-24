create table if not exists public.instagram_preview_cache (
  username text primary key
    check (username ~ '^[A-Za-z0-9._]{1,30}$'),
  posts jsonb not null default '[]'::jsonb
    check (jsonb_typeof(posts) = 'array'),
  posts_fetched_at timestamptz,
  last_error text,
  updated_at timestamptz not null default now()
);

alter table public.instagram_preview_cache enable row level security;
revoke all on table public.instagram_preview_cache from anon, authenticated;
grant all on table public.instagram_preview_cache to service_role;

comment on table public.instagram_preview_cache is
  'Server-side 30-minute cache for temporary public Instagram username previews. Access only through the instagram-feed Edge Function.';
