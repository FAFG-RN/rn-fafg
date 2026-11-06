-- FAFG: torneos y biblioteca de canchas. Ejecutar en SQL Editor después de admin_setup.sql.
create table if not exists public.fafg_canchas (
 id uuid primary key default gen_random_uuid(),
 nombre text not null check(length(trim(nombre)) between 2 and 120),
 localidad text not null default '',
 provincia text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.fafg_recorridos (
 id uuid primary key default gen_random_uuid(),
 cancha_id uuid not null references public.fafg_canchas(id) on delete restrict,
 nombre text not null check(length(trim(nombre)) between 2 and 120),
 pares integer[] not null check(array_length(pares,1)=18),
 created_at timestamptz not null default now()
);
create table if not exists public.fafg_torneos (
 id uuid primary key default gen_random_uuid(),
 nombre text not null check(length(trim(nombre)) between 2 and 160),
 competencia text not null check(competencia in ('Liga 1','Liga Nacional','Copa de la República','Copa Federación')),
 fecha_inicio date not null,
 fecha_fin date not null,
 sede text not null default '',
 modalidad text not null default 'shotgun' check(modalidad in ('shotgun','tee_time')),
 rondas integer not null default 1 check(rondas between 1 and 6),
 estado text not null default 'borrador' check(estado in ('borrador','inscripciones','en_juego','finalizado')),
 created_at timestamptz not null default now(),
 check(fecha_fin>=fecha_inicio)
);
alter table public.fafg_canchas enable row level security;
alter table public.fafg_recorridos enable row level security;
alter table public.fafg_torneos enable row level security;
grant select,insert,update,delete on public.fafg_canchas,public.fafg_recorridos,public.fafg_torneos to authenticated;
grant select on public.fafg_canchas,public.fafg_recorridos,public.fafg_torneos to anon;
drop policy if exists "fafg_canchas_public_read" on public.fafg_canchas;
create policy "fafg_canchas_public_read" on public.fafg_canchas for select to anon,authenticated using(true);
drop policy if exists "fafg_recorridos_public_read" on public.fafg_recorridos;
create policy "fafg_recorridos_public_read" on public.fafg_recorridos for select to anon,authenticated using(true);
drop policy if exists "fafg_torneos_public_read" on public.fafg_torneos;
create policy "fafg_torneos_public_read" on public.fafg_torneos for select to anon,authenticated using(true);
drop policy if exists "fafg_canchas_admin_insert" on public.fafg_canchas;
create policy "fafg_canchas_admin_insert" on public.fafg_canchas for insert to authenticated with check((select public.is_fafg_admin()));
drop policy if exists "fafg_canchas_admin_update" on public.fafg_canchas;
create policy "fafg_canchas_admin_update" on public.fafg_canchas for update to authenticated using((select public.is_fafg_admin())) with check((select public.is_fafg_admin()));
drop policy if exists "fafg_canchas_admin_delete" on public.fafg_canchas;
create policy "fafg_canchas_admin_delete" on public.fafg_canchas for delete to authenticated using((select public.is_fafg_admin()));
drop policy if exists "fafg_recorridos_admin_insert" on public.fafg_recorridos;
create policy "fafg_recorridos_admin_insert" on public.fafg_recorridos for insert to authenticated with check((select public.is_fafg_admin()));
drop policy if exists "fafg_recorridos_admin_update" on public.fafg_recorridos;
create policy "fafg_recorridos_admin_update" on public.fafg_recorridos for update to authenticated using((select public.is_fafg_admin())) with check((select public.is_fafg_admin()));
drop policy if exists "fafg_recorridos_admin_delete" on public.fafg_recorridos;
create policy "fafg_recorridos_admin_delete" on public.fafg_recorridos for delete to authenticated using((select public.is_fafg_admin()));
drop policy if exists "fafg_torneos_admin_insert" on public.fafg_torneos;
create policy "fafg_torneos_admin_insert" on public.fafg_torneos for insert to authenticated with check((select public.is_fafg_admin()));
drop policy if exists "fafg_torneos_admin_update" on public.fafg_torneos;
create policy "fafg_torneos_admin_update" on public.fafg_torneos for update to authenticated using((select public.is_fafg_admin())) with check((select public.is_fafg_admin()));
drop policy if exists "fafg_torneos_admin_delete" on public.fafg_torneos;
create policy "fafg_torneos_admin_delete" on public.fafg_torneos for delete to authenticated using((select public.is_fafg_admin()));
