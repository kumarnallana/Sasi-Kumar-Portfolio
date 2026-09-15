create table if not exists public.portfolio_appreciations (
  visitor_hash text primary key check (length(visitor_hash) = 64),
  created_at timestamptz not null default now()
);

alter table public.portfolio_appreciations enable row level security;
revoke all on table public.portfolio_appreciations from anon, authenticated;

create or replace function public.get_portfolio_appreciation(p_visitor_hash text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'count', count(*),
    'appreciated', count(*) filter (where visitor_hash = p_visitor_hash) > 0
  )
  from public.portfolio_appreciations;
$$;

create or replace function public.set_portfolio_appreciation(
  p_visitor_hash text,
  p_appreciated boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  if length(p_visitor_hash) <> 64 then
    raise exception 'Invalid visitor hash';
  end if;

  if p_appreciated then
    insert into public.portfolio_appreciations (visitor_hash)
    values (p_visitor_hash)
    on conflict (visitor_hash) do nothing;
  else
    delete from public.portfolio_appreciations
    where visitor_hash = p_visitor_hash;
  end if;

  select jsonb_build_object(
    'count', count(*),
    'appreciated', count(*) filter (where visitor_hash = p_visitor_hash) > 0
  )
  into result
  from public.portfolio_appreciations;

  return result;
end;
$$;

revoke all on function public.get_portfolio_appreciation(text) from public, anon, authenticated;
revoke all on function public.set_portfolio_appreciation(text, boolean) from public, anon, authenticated;
grant execute on function public.get_portfolio_appreciation(text) to service_role;
grant execute on function public.set_portfolio_appreciation(text, boolean) to service_role;
