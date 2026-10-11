create type public.app_role as enum ('admin', 'moderator', 'user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique (user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text not null default 'Friend', created_at timestamptz not null default now());
grant select, insert, update on public.profiles to authenticated; grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "members read profiles" on public.profiles for select to authenticated using (true);
create policy "insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1), 'Friend')); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.user_state (user_id uuid primary key, state jsonb not null default '{}', extra jsonb not null default '{}', updated_at timestamptz not null default now());
grant select, insert, update on public.user_state to authenticated; grant all on public.user_state to service_role;
alter table public.user_state enable row level security;
create policy "own state select" on public.user_state for select to authenticated using (auth.uid() = user_id);
create policy "own state insert" on public.user_state for insert to authenticated with check (auth.uid() = user_id);
create policy "own state update" on public.user_state for update to authenticated using (auth.uid() = user_id);

create table public.posts (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), author_name text not null, text text not null check (char_length(text) between 1 and 1000), tag text not null default '#MyWin', created_at timestamptz not null default now());
grant select, insert, delete on public.posts to authenticated; grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "members read posts" on public.posts for select to authenticated using (true);
create policy "insert own posts" on public.posts for insert to authenticated with check (auth.uid() = user_id);
create policy "delete own posts" on public.posts for delete to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'moderator') or public.has_role(auth.uid(),'admin'));

create table public.cheers (post_id uuid not null references public.posts(id) on delete cascade, user_id uuid not null default auth.uid(), primary key (post_id, user_id));
grant select, insert, delete on public.cheers to authenticated; grant all on public.cheers to service_role;
alter table public.cheers enable row level security;
create policy "members read cheers" on public.cheers for select to authenticated using (true);
create policy "own cheer insert" on public.cheers for insert to authenticated with check (auth.uid() = user_id);
create policy "own cheer delete" on public.cheers for delete to authenticated using (auth.uid() = user_id);

create table public.comments (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, user_id uuid not null default auth.uid(), author_name text not null, text text not null check (char_length(text) between 1 and 500), created_at timestamptz not null default now());
grant select, insert, delete on public.comments to authenticated; grant all on public.comments to service_role;
alter table public.comments enable row level security;
create policy "members read comments" on public.comments for select to authenticated using (true);
create policy "own comment insert" on public.comments for insert to authenticated with check (auth.uid() = user_id);
create policy "own comment delete" on public.comments for delete to authenticated using (auth.uid() = user_id);

create table public.early_access (id uuid primary key default gen_random_uuid(), email text not null check (email ~ '^\S+@\S+\.\S+$' and char_length(email) < 255), platform text not null check (platform in ('iPhone','Android')), user_id uuid, created_at timestamptz not null default now(), unique (email, platform));
grant insert on public.early_access to anon, authenticated; grant all on public.early_access to service_role;
alter table public.early_access enable row level security;
create policy "anyone can join waitlist" on public.early_access for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());
create policy "admins read waitlist" on public.early_access for select to authenticated using (public.has_role(auth.uid(),'admin'));
grant select on public.early_access to authenticated;

create table public.work_submissions (id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid(), challenge_id text not null, challenge_title text not null, summary text not null check (char_length(summary) between 10 and 2000), proof_url text check (proof_url is null or proof_url ~ '^https?://'), status text not null default 'submitted' check (status in ('submitted','verified','rejected')), reward int not null default 0, reviewer_note text, claimed boolean not null default false, created_at timestamptz not null default now(), reviewed_at timestamptz);
grant select, insert, update on public.work_submissions to authenticated; grant all on public.work_submissions to service_role;
alter table public.work_submissions enable row level security;
create policy "own or admin read" on public.work_submissions for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "own insert" on public.work_submissions for insert to authenticated with check (auth.uid() = user_id and status = 'submitted' and reward = 0 and claimed = false);
create policy "own or admin update" on public.work_submissions for update to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create or replace function public.guard_submission() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.has_role(auth.uid(),'admin') then
    if new.status <> old.status then new.reviewed_at := now(); end if;
    return new;
  end if;
  if new.status <> old.status or new.reward <> old.reward or new.reviewer_note is distinct from old.reviewer_note or new.user_id <> old.user_id or new.summary <> old.summary then
    raise exception 'Only reviewers can change this';
  end if;
  if new.claimed and (old.status <> 'verified' or old.claimed) then raise exception 'Nothing to claim'; end if;
  return new;
end $$;
create trigger guard_submission before update on public.work_submissions for each row execute function public.guard_submission();