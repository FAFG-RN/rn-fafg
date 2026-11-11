-- Revisar y ejecutar en Supabase SQL Editor. No cambia resultados ni perfiles.
-- Requiere panel-admin-roles.sql y el rol admin asignado al administrador real.
begin;
-- Mantener la función existente si fue instalada con el panel anterior.
do $migration$
begin
 if to_regprocedure('public.is_fafg_admin()') is null then
  execute $definition$create function public.is_fafg_admin() returns boolean
   language sql stable security definer set search_path=''
   as 'select exists(select 1 from public.fafg_admin_roles where usuario_id=(select auth.uid()) and rol=''admin'')'$definition$;
 end if;
end $migration$;
revoke all on function public.is_fafg_admin() from public,anon;
grant execute on function public.is_fafg_admin() to authenticated;
create table if not exists public.fafg_ranking_versions (
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 created_by uuid not null references auth.users(id),
 source text not null check(length(source) between 1 and 300),
 payload jsonb not null,
 audit jsonb not null check(jsonb_typeof(audit)='array')
);
alter table public.fafg_ranking_versions enable row level security;
revoke all on public.fafg_ranking_versions from anon,authenticated;
grant select on public.fafg_ranking_versions to authenticated;
drop policy if exists "ranking_history_admin" on public.fafg_ranking_versions;
create policy "ranking_history_admin" on public.fafg_ranking_versions for select to authenticated using((select public.is_fafg_admin()));
create or replace function public.get_fafg_ranking() returns jsonb
language sql stable security definer set search_path=''
as $$ select jsonb_build_object('version',id,'payload',payload) from public.fafg_ranking_versions order by id desc limit 1 $$;
revoke all on function public.get_fafg_ranking() from public;
grant execute on function public.get_fafg_ranking() to anon,authenticated;
create or replace function public.publish_fafg_ranking(p_expected_version bigint,p_source text,p_payload jsonb,p_audit jsonb)
returns bigint language plpgsql security definer set search_path=''
as $$
declare current_version bigint; new_version bigint; player jsonb; clean_players jsonb='[]'::jsonb; clean_player jsonb; checked_payload jsonb; k text;
begin
 if auth.uid() is null or not public.is_fafg_admin() then raise exception 'Acceso de administrador requerido' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(20261111,1);
 select id into current_version from public.fafg_ranking_versions order by id desc limit 1;
 if current_version is distinct from p_expected_version then raise exception 'Otra publicación cambió la base. Recargá y volvé a comparar.' using errcode='40001'; end if;
 if p_payload->>'schema' is distinct from 'fafg-ranking-v1' or jsonb_typeof(p_payload->'players') is distinct from 'array' then raise exception 'Formato de ranking inválido'; end if;
 if jsonb_array_length(p_payload->'players')<1 or jsonb_array_length(p_payload->'players')>10000 or pg_column_size(p_payload)>10000000 then raise exception 'Tamaño de ranking inválido'; end if;
 if jsonb_typeof(p_audit) is distinct from 'array' or jsonb_array_length(p_audit)<1 then raise exception 'Falta auditoría'; end if;
 if exists(select 1 from jsonb_array_elements(p_audit) a where a->>'status' is distinct from 'confirmed') then raise exception 'Hay registros pendientes'; end if;
 if length(trim(coalesce(p_source,''))) not between 1 and 300 then raise exception 'Fuente inválida'; end if;
 for player in select value from jsonb_array_elements(p_payload->'players') loop
  if jsonb_typeof(player) is distinct from 'object' or length(trim(coalesce(player->>'id',''))) not between 1 and 300 or length(trim(coalesce(player->>'name',''))) not between 1 and 200
   or length(trim(coalesce(player->>'category',''))) not between 1 and 100 or player->>'category'='Sin categoría'
   or coalesce(player->>'division','') not in ('Caballeros','Damas')
   or jsonb_typeof(player->'points') is distinct from 'number' then raise exception 'Jugador incompleto'; end if;
  if (player->>'points')::numeric<0 or (player->>'points')::numeric>100000000 then raise exception 'Puntos inválidos'; end if;
  if player ? 'active' and jsonb_typeof(player->'active') is distinct from 'boolean' then raise exception 'Estado inválido'; end if;
  clean_player='{}'::jsonb;
  foreach k in array array['id','name','category','division','points','hcp','events','city','age','active','card15','card16','pointsLost','changes'] loop
   if player ? k then clean_player=clean_player||jsonb_build_object(k,player->k); end if;
  end loop;
  clean_players=clean_players||jsonb_build_array(clean_player);
 end loop;
 if (select count(*) from jsonb_array_elements(clean_players))<>(select count(distinct p->>'id') from jsonb_array_elements(clean_players) p) then raise exception 'Identidades duplicadas'; end if;
 checked_payload=jsonb_build_object('schema','fafg-ranking-v1','updated',now(),'players',clean_players);
 insert into public.fafg_ranking_versions(created_by,source,payload,audit) values(auth.uid(),trim(p_source),checked_payload,p_audit) returning id into new_version;
 return new_version;
end $$;
revoke all on function public.publish_fafg_ranking(bigint,text,jsonb,jsonb) from public,anon;
grant execute on function public.publish_fafg_ranking(bigint,text,jsonb,jsonb) to authenticated;
commit;
