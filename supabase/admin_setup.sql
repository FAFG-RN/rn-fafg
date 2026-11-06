-- Ejecutar en Supabase SQL Editor después de revisar el proyecto.
-- La asignación de administradores se realiza únicamente desde SQL Editor.
create table if not exists public.fafg_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.fafg_admins enable row level security;
revoke all on public.fafg_admins from anon, authenticated;
create or replace function public.is_fafg_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.fafg_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_fafg_admin() from public;
grant execute on function public.is_fafg_admin() to authenticated;
-- Habilitar el administrador principal DESPUÉS de confirmar su UUID en Authentication > Users:
-- insert into public.fafg_admins(user_id) values ('UUID_DEL_USUARIO') on conflict do nothing;
-- Toda futura tabla de torneos/resultados requiere políticas RLS propias.
