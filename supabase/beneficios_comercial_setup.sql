-- Instalación aditiva. No modifica jugadores, ranking ni resultados.
begin;
create table public.fafg_comercios (
 id uuid primary key default gen_random_uuid(),
 nombre text not null check(length(trim(nombre)) between 1 and 300),
 tipo text not null check(tipo in ('Comercio','Sponsor','Ambos')),
 ciudad text not null check(length(trim(ciudad)) between 1 and 300),
 provincia text not null check(length(trim(provincia)) between 1 and 300),
 rubro text not null,
 estado text not null default 'Prospecto' check(estado in ('Prospecto','Contactado','En negociación','Confirmado','Pausado')),
 contacto text not null default '',email text not null default '',telefono text not null default '',
 notas text not null default '' check(length(notas)<=2000),proxima_gestion date,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.fafg_beneficios (
 id uuid primary key default gen_random_uuid(),
 comercio_id uuid not null references public.fafg_comercios(id),
 comercio_publico text not null check(length(trim(comercio_publico)) between 1 and 300),
 titulo text not null check(length(trim(titulo)) between 1 and 300),
 ciudad text not null check(length(trim(ciudad)) between 1 and 300),rubro text not null,
 descripcion text not null check(length(trim(descripcion)) between 1 and 2000),
 condiciones text not null check(length(trim(condiciones)) between 1 and 2000),
 acceso text not null check(length(trim(acceso)) between 1 and 2000),
 destinatarios text not null check(destinatarios in ('Socios activos FAFG','Todos los jugadores FAFG')),
 url_publica text not null default '' check(url_publica='' or url_publica ~ '^https://[^[:space:]]+$'),
 desde date not null,hasta date not null check(hasta>=desde),
 estado text not null default 'borrador' check(estado in ('borrador','publicado','pausado')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.fafg_aportes (
 id uuid primary key default gen_random_uuid(),
 comercio_id uuid not null references public.fafg_comercios(id),
 tipo text not null check(tipo in ('Dinero','Canje')),
 estado text not null check(estado in ('Previsto','Confirmado','Recibido','Cancelado')),
 fecha date not null,
 moneda text check(moneda in ('ARS','USD')),
 importe numeric(14,2),
 detalle text not null check(length(trim(detalle)) between 1 and 2000),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check((tipo='Dinero' and importe is not null and importe>0 and moneda is not null)
    or (tipo='Canje' and importe is null and moneda is null))
);
create index on public.fafg_beneficios(estado,desde,hasta);
create index on public.fafg_beneficios(comercio_id);
create index on public.fafg_aportes(comercio_id);
alter table public.fafg_comercios enable row level security;
alter table public.fafg_beneficios enable row level security;
alter table public.fafg_aportes enable row level security;
revoke all on public.fafg_comercios,public.fafg_beneficios,public.fafg_aportes from anon,authenticated;
grant select,insert,update on public.fafg_comercios,public.fafg_beneficios,public.fafg_aportes to authenticated;
grant select on public.fafg_beneficios to anon;
create policy comercio_admin on public.fafg_comercios for all to authenticated
 using ((select public.is_fafg_admin())) with check ((select public.is_fafg_admin()));
create policy aportes_admin on public.fafg_aportes for all to authenticated
 using ((select public.is_fafg_admin())) with check ((select public.is_fafg_admin()));
create policy beneficios_admin on public.fafg_beneficios for all to authenticated
 using ((select public.is_fafg_admin())) with check ((select public.is_fafg_admin()));
create policy beneficios_catalogo on public.fafg_beneficios for select to anon,authenticated
 using (estado='publicado' and desde <= (now() at time zone 'America/Argentina/Buenos_Aires')::date
 and hasta >= (now() at time zone 'America/Argentina/Buenos_Aires')::date);
-- Historial privado por trigger; no editable por clientes, incluso administradores.
create schema if not exists fafg_private;
revoke all on schema fafg_private from public,anon,authenticated;
create table public.fafg_comercial_historial (
 id bigint generated always as identity primary key,
 tabla text not null,registro_id uuid not null,accion text not null,
 actor uuid,fecha timestamptz not null default now(),antes jsonb,despues jsonb
);
alter table public.fafg_comercial_historial enable row level security;
revoke all on public.fafg_comercial_historial from anon,authenticated;
grant select on public.fafg_comercial_historial to authenticated;
create policy historial_admin on public.fafg_comercial_historial for select to authenticated using ((select public.is_fafg_admin()));
create function fafg_private.registrar_comercial() returns trigger
 language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not public.is_fafg_admin() then raise exception 'Acceso administrativo requerido'; end if;
 new.updated_at=now();
 insert into public.fafg_comercial_historial(tabla,registro_id,accion,actor,antes,despues)
 values(tg_table_name,new.id,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
 return new;
end;$$;
revoke all on function fafg_private.registrar_comercial() from public,anon,authenticated;
create trigger comercio_historial before insert or update on public.fafg_comercios for each row execute function fafg_private.registrar_comercial();
create trigger beneficio_historial before insert or update on public.fafg_beneficios for each row execute function fafg_private.registrar_comercial();
create trigger aporte_historial before insert or update on public.fafg_aportes for each row execute function fafg_private.registrar_comercial();
commit;
