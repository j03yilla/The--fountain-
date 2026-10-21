-- Apply with an owner connection. Runtime must be a separate, non-owner role.
begin;
create type public.editorial_state as enum ('draft','submitted','changes_requested','accepted','published','rejected');
create table public.profiles (
 id text primary key, name text not null, slug text not null unique,
 bio text not null default '', public boolean not null default false,
 role text not null default 'contributor' check(role in ('contributor','editor','administrator')),
 created_at timestamptz not null default now()
);
create table public.works (
 id uuid primary key default gen_random_uuid(),author_id text not null references public.profiles(id),
 title text not null check(length(title) between 1 and 200),slug text not null unique,
 excerpt text not null default '' check(length(excerpt)<=400),
 section text not null check(section in ('words','art','culture')),
 format text not null check(format in ('poem','essay','fiction','interview','visual-art')),
 content text not null check(length(content)<=150000),rich_content jsonb,
 state public.editorial_state not null default 'draft',cover_url text,
 published_at timestamptz,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 legacy_url text unique,legacy_date timestamptz,
 search tsvector generated always as (to_tsvector('english',coalesce(title,'')||' '||coalesce(excerpt,'')||' '||coalesce(content,''))) stored,
 check(state <> 'published' or published_at is not null)
);
create index works_search on public.works using gin(search);
create index works_author_state on public.works(author_id,state);
create index works_public_feed on public.works(published_at desc) where state='published';
create table public.reviews(id uuid primary key default gen_random_uuid(),work_id uuid not null references public.works(id),editor_id text not null references public.profiles(id),note text not null check(length(note)<=5000),created_at timestamptz not null default now());
create table public.editions(id uuid primary key default gen_random_uuid(),slug text unique not null,title text not null,description text not null default '',published boolean not null default false);
create table public.edition_works(edition_id uuid references public.editions(id),work_id uuid references public.works(id),position integer not null default 0,primary key(edition_id,work_id));
create table public.newsletter_subscribers(email text primary key check(length(email)<=254),consented_at timestamptz not null default now(),unsubscribe_hash text not null,active boolean not null default true);
-- Values are SET LOCAL inside authenticated transactions; never trust client role claims.
create function public.actor_id() returns text language sql stable as $$select nullif(current_setting('app.actor_id',true),'')$$;
create function public.is_editor() returns boolean language sql stable as $$select exists(select 1 from public.profiles where id=public.actor_id() and role in ('editor','administrator'))$$;
alter table public.profiles enable row level security;
alter table public.works enable row level security;
alter table public.reviews enable row level security;
alter table public.editions enable row level security;
alter table public.edition_works enable row level security;
alter table public.newsletter_subscribers enable row level security;
create policy profiles_read on public.profiles for select using(public or id=public.actor_id());
-- Provision profiles with trusted server-only provisioning connection, never the runtime role.
create policy works_read on public.works for select using(state='published' or author_id=public.actor_id() or public.is_editor());
create policy works_insert on public.works for insert with check(author_id=public.actor_id() and state='draft');
create policy works_update on public.works for update using((author_id=public.actor_id() and state in ('draft','changes_requested')) or public.is_editor()) with check(author_id=public.actor_id() or public.is_editor());
create policy reviews_read on public.reviews for select using(public.is_editor() or exists(select 1 from public.works where works.id=work_id and author_id=public.actor_id()));
create policy reviews_insert on public.reviews for insert with check(public.is_editor() and editor_id=public.actor_id());
create policy editions_read on public.editions for select using(published or public.is_editor());
create policy editions_write on public.editions for all using(public.is_editor()) with check(public.is_editor());
create policy edition_works_read on public.edition_works for select using(exists(select 1 from public.editions e where e.id=edition_id and e.published) or public.is_editor());
create policy edition_works_write on public.edition_works for all using(public.is_editor()) with check(public.is_editor());
create policy newsletter_insert on public.newsletter_subscribers for insert with check(true);
-- Restrict transitions and immutable ownership at DB level, including direct SQL callers.
create function public.enforce_work_update() returns trigger language plpgsql as $$
begin
 if new.author_id<>old.author_id or new.id<>old.id then raise exception 'Ownership is immutable'; end if;
 if new.state<>old.state then
  if not ((old.state='draft' and new.state='submitted') or (old.state='changes_requested' and new.state='submitted') or (public.is_editor() and ((old.state='submitted' and new.state in ('changes_requested','accepted','rejected')) or (old.state='accepted' and new.state in ('published','changes_requested')) or (old.state='published' and new.state='accepted')))) then raise exception 'Invalid state transition';end if;
 end if;
 if not public.is_editor() and (new.published_at is distinct from old.published_at or new.legacy_url is distinct from old.legacy_url or new.legacy_date is distinct from old.legacy_date) then raise exception 'Editorial fields are protected';end if;
 new.updated_at=now();return new;
end $$;
create trigger work_update before update on public.works for each row execute function public.enforce_work_update();
revoke all on all tables in schema public from public;
revoke execute on all functions in schema public from public;
-- After creating fountain_runtime (NOLOGIN or LOGIN, NOBYPASSRLS), grant explicitly:
-- grant usage on schema public to fountain_runtime;
-- grant select on profiles,works,reviews,editions,edition_works to fountain_runtime;
-- grant insert,update on works to fountain_runtime;
-- grant insert on reviews,newsletter_subscribers to fountain_runtime;
-- grant insert,update,delete on editions,edition_works to fountain_runtime;
-- grant execute on function actor_id(),is_editor(),enforce_work_update() to fountain_runtime;
commit;
