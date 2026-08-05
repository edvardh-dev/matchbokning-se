create extension if not exists pgcrypto;

create type public.gender_group as enum ('boys', 'girls', 'mixed');
create type public.match_format as enum ('5v5', '7v7', '9v9', '11v11');
create type public.match_level as enum ('easy', 'medium', 'hard', 'hard_plus', 'extra_hard');
create type public.member_role as enum ('owner', 'coach', 'team_admin');
create type public.match_request_status as enum ('active', 'request_sent', 'tentative', 'booked', 'cancelled', 'completed');
create type public.booking_request_status as enum ('pending', 'accepted', 'declined', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null default 'Stockholm',
  municipality text,
  website text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, region)
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  name text not null,
  gender gender_group not null,
  birth_year int not null check (birth_year between 2000 and 2035),
  level match_level not null default 'medium',
  home_pitch text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, name, birth_year)
);

create table public.team_members (
  user_id uuid not null references public.profiles(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  role member_role not null default 'coach',
  created_at timestamptz not null default now(),
  primary key (user_id, team_id)
);

create table public.match_requests (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  match_date date not null,
  match_time time,
  location text not null,
  format match_format not null,
  level match_level not null,
  pitch_available boolean not null default false,
  referee_available boolean not null default false,
  home_or_away text not null default 'flexible' check (home_or_away in ('home', 'away', 'flexible')),
  description text,
  status match_request_status not null default 'active',
  views int not null default 0 check (views >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  match_request_id uuid not null references public.match_requests(id) on delete cascade,
  requesting_team_id uuid not null references public.teams(id) on delete cascade,
  message text,
  status booking_request_status not null default 'pending',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_request_id, requesting_team_id)
);

create view public.public_match_requests as
select
  mr.id,
  mr.match_date,
  mr.match_time,
  mr.location,
  mr.format,
  mr.level,
  mr.pitch_available,
  mr.referee_available,
  mr.home_or_away,
  mr.description,
  mr.status,
  mr.views,
  mr.created_at,
  t.id as team_id,
  t.name as team_name,
  t.gender,
  t.birth_year,
  c.id as club_id,
  c.name as club_name,
  c.region,
  c.municipality,
  c.verified
from public.match_requests mr
join public.teams t on t.id = mr.team_id
join public.clubs c on c.id = t.club_id
where mr.status = 'active';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_team_member(team_id_to_check uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = team_id_to_check
      and tm.user_id = auth.uid()
  );
$$;

create or replace function public.is_team_admin(team_id_to_check uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = team_id_to_check
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'team_admin')
  );
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger clubs_set_updated_at
before update on public.clubs
for each row execute function public.set_updated_at();

create trigger teams_set_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

create trigger match_requests_set_updated_at
before update on public.match_requests
for each row execute function public.set_updated_at();

create trigger booking_requests_set_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.match_requests enable row level security;
alter table public.booking_requests enable row level security;

create policy "Profiles can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Profiles can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Profiles can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Anyone can read clubs"
on public.clubs for select
using (true);

create policy "Authenticated users can create clubs"
on public.clubs for insert
to authenticated
with check (true);

create policy "Team admins can update clubs"
on public.clubs for update
to authenticated
using (
  exists (
    select 1
    from public.teams t
    where t.club_id = clubs.id
      and public.is_team_admin(t.id)
  )
);

create policy "Anyone can read teams"
on public.teams for select
using (true);

create policy "Authenticated users can create teams"
on public.teams for insert
to authenticated
with check (true);

create policy "Team admins can update teams"
on public.teams for update
to authenticated
using (public.is_team_admin(teams.id));

create policy "Users can read own memberships"
on public.team_members for select
to authenticated
using (user_id = auth.uid());

create policy "Users can create own first memberships"
on public.team_members for insert
to authenticated
with check (user_id = auth.uid());

create policy "Team admins can manage memberships"
on public.team_members for all
to authenticated
using (public.is_team_admin(team_members.team_id))
with check (public.is_team_admin(team_members.team_id));

create policy "Anyone can read active match requests"
on public.match_requests for select
using (status = 'active');

create policy "Team members can create match requests"
on public.match_requests for insert
to authenticated
with check (public.is_team_member(match_requests.team_id));

create policy "Team members can update own match requests"
on public.match_requests for update
to authenticated
using (public.is_team_member(match_requests.team_id));

create policy "Involved teams can read booking requests"
on public.booking_requests for select
to authenticated
using (
  exists (
    select 1
    from public.match_requests mr
    where mr.id = booking_requests.match_request_id
      and (
        public.is_team_member(mr.team_id)
        or public.is_team_member(booking_requests.requesting_team_id)
      )
  )
);

create policy "Team members can create booking requests"
on public.booking_requests for insert
to authenticated
with check (public.is_team_member(booking_requests.requesting_team_id));

create policy "Involved teams can update booking requests"
on public.booking_requests for update
to authenticated
using (
  exists (
    select 1
    from public.match_requests mr
    where mr.id = booking_requests.match_request_id
      and (
        public.is_team_member(mr.team_id)
        or public.is_team_member(booking_requests.requesting_team_id)
      )
  )
);
