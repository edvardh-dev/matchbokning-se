insert into public.clubs (name, region, municipality, verified)
values
  ('Hammarby IF', 'Stockholm', 'Stockholm', true),
  ('Skå IK', 'Stockholm', 'Ekerö', true),
  ('BP', 'Stockholm', 'Bromma', true),
  ('Täby FK', 'Stockholm', 'Täby', true)
on conflict (name, region) do nothing;

insert into public.teams (club_id, name, gender, birth_year, level, home_pitch)
select id, 'P2014A', 'boys', 2014, 'hard_plus', 'Årsta IP'
from public.clubs where name = 'Hammarby IF'
on conflict (club_id, name, birth_year) do nothing;

insert into public.teams (club_id, name, gender, birth_year, level, home_pitch)
select id, 'P2014', 'boys', 2014, 'hard', 'Skå IP'
from public.clubs where name = 'Skå IK'
on conflict (club_id, name, birth_year) do nothing;

insert into public.teams (club_id, name, gender, birth_year, level, home_pitch)
select id, 'P2012-3', 'boys', 2012, 'hard', 'Grimsta IP'
from public.clubs where name = 'BP'
on conflict (club_id, name, birth_year) do nothing;

insert into public.teams (club_id, name, gender, birth_year, level, home_pitch)
select id, 'F2013', 'girls', 2013, 'medium', 'Tibblevallen'
from public.clubs where name = 'Täby FK'
on conflict (club_id, name, birth_year) do nothing;

insert into public.match_requests (
  team_id,
  match_date,
  match_time,
  location,
  format,
  level,
  pitch_available,
  referee_available,
  home_or_away,
  description,
  views
)
select id, '2026-08-15', '10:00', 'Årsta IP', '9v9', 'hard_plus', true, true, 'home',
  'Söker motstånd i toppskiktet inför seriestart. Konstgräs, omklädningsrum finns.',
  214
from public.teams where name = 'P2014A'
on conflict do nothing;

insert into public.match_requests (
  team_id,
  match_date,
  match_time,
  location,
  format,
  level,
  pitch_available,
  referee_available,
  home_or_away,
  description,
  views
)
select id, '2026-08-17', '13:30', 'Skå IP', '9v9', 'hard', true, false, 'home',
  'Vi spelar gärna 2 x 30 min. Naturgräs i mycket bra skick.',
  168
from public.teams where name = 'P2014'
on conflict do nothing;
