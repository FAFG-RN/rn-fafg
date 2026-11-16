create table public.fafg_eventos (
 id uuid primary key default gen_random_uuid(), nombre text not null check(length(nombre) between 1 and 150),
 sede text not null default '', fecha date not null, cierre timestamptz not null,
 abierto boolean not null default false, publicado boolean not null default false
);
create table public.fafg_inscripciones (
 id uuid primary key default gen_random_uuid(), evento_id uuid not null references public.fafg_eventos(id),
 user_id uuid not null references auth.users(id), nombre text not null check(length(trim(nombre)) between 3 and 150),
 categoria text not null check(length(trim(categoria)) between 1 and 80),
 estado text not null default 'pendiente' check(estado in ('pendiente','confirmada','rechazada')),
 salida text not null default '', live_codigo text not null default '' check(live_codigo ~ '^[a-zA-Z0-9-]{0,40}$'),
 creado timestamptz not null default now(), unique(evento_id,user_id)
);
alter table public.fafg_eventos enable row level security;
alter table public.fafg_inscripciones enable row level security;
revoke all on public.fafg_eventos,public.fafg_inscripciones from anon,authenticated;
grant select on public.fafg_eventos to anon,authenticated;
grant insert,update on public.fafg_eventos to authenticated;
grant select,insert,update on public.fafg_inscripciones to authenticated;
create policy eventos_lectura on public.fafg_eventos for select using(publicado or public.is_fafg_admin());
create policy eventos_alta on public.fafg_eventos for insert to authenticated with check(public.is_fafg_admin());
create policy eventos_edicion on public.fafg_eventos for update to authenticated using(public.is_fafg_admin()) with check(public.is_fafg_admin());
create policy inscripcion_lectura on public.fafg_inscripciones for select to authenticated using(user_id=(select auth.uid()) or public.is_fafg_admin());
create policy inscripcion_alta on public.fafg_inscripciones for insert to authenticated with check(
 user_id=(select auth.uid()) and estado='pendiente' and salida='' and live_codigo='' and
 exists(select 1 from public.fafg_eventos e where e.id=evento_id and e.publicado and e.abierto and e.cierre>now()));
create policy inscripcion_gestion on public.fafg_inscripciones for update to authenticated using(public.is_fafg_admin()) with check(public.is_fafg_admin());
create index fafg_inscripciones_usuario on public.fafg_inscripciones(user_id);
insert into public.fafg_eventos(nombre,sede,fecha,cierre,abierto,publicado)
values('Copa de la República 2026','Smithfield · Zárate','2026-12-06','2026-12-03 23:00:00+00',true,true);
drop policy eventos_lectura on public.fafg_eventos; create policy eventos_publicos on public.fafg_eventos for select to anon,authenticated using(publicado); create policy eventos_admin_lectura on public.fafg_eventos for select to authenticated using(public.is_fafg_admin());
