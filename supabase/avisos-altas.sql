-- Ejecutar una sola vez en Supabase SQL Editor, con permisos de administrador.
-- La cola es privada: los clientes de FAFG App no pueden leerla ni modificarla.
create table if not exists public.avisos_altas_fafg (
  usuario_id uuid primary key references auth.users(id) on delete cascade,
  correo text not null,
  creado_en timestamptz not null default now(),
  enviado_en timestamptz,
  intentos integer not null default 0,
  ultimo_error text
);
alter table public.avisos_altas_fafg enable row level security;
revoke all on public.avisos_altas_fafg from anon, authenticated;
create or replace function public.encolar_alta_fafg()
returns trigger language plpgsql security definer
set search_path = '' as $$
begin
  insert into public.avisos_altas_fafg(usuario_id,correo,creado_en)
  values (new.id,coalesce(new.email,''),coalesce(new.created_at,now()))
  on conflict (usuario_id) do nothing;
  return new;
end;
$$;
revoke all on function public.encolar_alta_fafg() from public, anon, authenticated;
drop trigger if exists fafg_alta_nueva on auth.users;
create trigger fafg_alta_nueva after insert on auth.users
for each row execute function public.encolar_alta_fafg();
-- Solo solicitudes posteriores a la instalación; NO se notifican usuarios anteriores.
