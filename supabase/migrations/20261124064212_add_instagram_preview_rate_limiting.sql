create table if not exists public.instagram_preview_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.instagram_preview_rate_limits enable row level security;
revoke all on table public.instagram_preview_rate_limits from anon, authenticated;
grant all on table public.instagram_preview_rate_limits to service_role;

create or replace function public.take_instagram_preview_slot(
  p_ip_hash text,
  p_now timestamptz,
  p_limit integer default 12,
  p_window_seconds integer default 60
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_request_count integer;
begin
  insert into public.instagram_preview_rate_limits as current_window (
    ip_hash, window_started_at, request_count, updated_at
  )
  values (p_ip_hash, p_now, 1, p_now)
  on conflict (ip_hash) do update
  set
    window_started_at = case
      when current_window.window_started_at <= p_now - make_interval(secs => p_window_seconds)
      then p_now else current_window.window_started_at end,
    request_count = case
      when current_window.window_started_at <= p_now - make_interval(secs => p_window_seconds)
      then 1 else current_window.request_count + 1 end,
    updated_at = p_now
  returning request_count into v_request_count;

  return v_request_count <= p_limit;
end;
$$;

revoke all on function public.take_instagram_preview_slot(text, timestamptz, integer, integer) from public, anon, authenticated;
grant execute on function public.take_instagram_preview_slot(text, timestamptz, integer, integer) to service_role;
