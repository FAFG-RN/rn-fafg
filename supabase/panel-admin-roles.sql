-- FAFG APP: ejecutar una sola vez en Supabase SQL Editor.
-- Los roles se asignan exclusivamente desde el SQL Editor (no desde la app).
create table if not exists public.fafg_admin_roles (
  usuario_id uuid primary key references auth.users(id) on delete cascade,
  rol text not null check (rol in ('admin','operador')),
  creado_en timestamptz not null default now()
);
alter table public.fafg_admin_roles enable row level security;
revoke all on public.fafg_admin_roles from anon;
revoke insert, update, delete on public.fafg_admin_roles from authenticated;
grant select on public.fafg_admin_roles to authenticated;
drop policy if exists "Consultar mi rol administrativo" on public.fafg_admin_roles;
create policy "Consultar mi rol administrativo"
on public.fafg_admin_roles for select to authenticated
using (usuario_id = (select auth.uid()));
-- Habilitar al administrador identificado previamente:
-- insert into public.fafg_admin_roles(usuario_id,rol)
-- values ('6d2887ea-5b84-4ee3-84d4-8a88a36da00c','admin')
-- on conflict(usuario_id) do update set rol=excluded.rol;
-- IMPORTANTE: este SQL NO crea tablas de torneos ni habilita escritura de resultados.
