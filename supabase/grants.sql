grant usage on schema public to anon, authenticated;

grant select on public.clubs to anon, authenticated;
grant select on public.teams to anon, authenticated;
grant select on public.match_requests to anon, authenticated;
grant select on public.public_match_requests to anon, authenticated;

grant insert on public.profiles to authenticated;
grant select, update on public.profiles to authenticated;

grant insert on public.clubs to authenticated;
grant update on public.clubs to authenticated;

grant insert on public.teams to authenticated;
grant update on public.teams to authenticated;

grant insert, select, update on public.team_members to authenticated;
grant insert, select, update on public.match_requests to authenticated;
grant insert, select, update on public.booking_requests to authenticated;
