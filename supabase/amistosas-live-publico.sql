-- Additive: existing rounds stay private until their organizer shares them.
alter table public.amistosas_rondas add column if not exists publico boolean not null default false;
alter table public.amistosas_rondas add column if not exists enlace_publico uuid;
create unique index if not exists amistosas_rondas_enlace_publico on public.amistosas_rondas(enlace_publico) where enlace_publico is not null;

create or replace function public.amistosa_publicar(p_codigo text, p_publico boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.amistosas_rondas%rowtype;
begin
 if auth.uid() is null then raise exception 'Iniciá sesión'; end if;
 if p_publico is null then raise exception 'Indicá el estado del acceso público'; end if;
 update public.amistosas_rondas set publico=p_publico,
 enlace_publico=case when p_publico then coalesce(enlace_publico,gen_random_uuid()) else null end
 where codigo=upper(trim(p_codigo)) and creador=auth.uid() returning * into r;
 if not found then raise exception 'Solo el organizador puede cambiar el acceso público'; end if;
 return jsonb_build_object('publico',r.publico,'enlace_publico',r.enlace_publico);
end $$;
revoke all on function public.amistosa_publicar(text,boolean) from public,anon;
grant execute on function public.amistosa_publicar(text,boolean) to authenticated;

-- Deliberate narrow anonymous read API. UUID possession + enabled flag is the
-- authorization boundary; never return account IDs, invitation codes or full rows.
create or replace function public.amistosa_publica(p_enlace uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare r public.amistosas_rondas%rowtype;
begin
 select * into r from public.amistosas_rondas where enlace_publico=p_enlace and publico;
 if not found then return jsonb_build_object('disponible',false); end if;
 return jsonb_build_object('disponible',true,'nombre',r.nombre,'cancha',r.cancha,'estado',r.estado,'pares',r.pares,
 'jugadores',coalesce((select jsonb_agg(jsonb_build_object('clave',l.numero::text||':'||j.orden::text,'linea',l.numero,'nombre',j.nombre,'golpes',j.golpes,'npt',j.npt) order by l.numero,j.orden)
 from public.amistosas_lineas l join public.amistosas_jugadores j on j.linea_id=l.id where l.ronda_id=r.id),'[]'::jsonb));
end $$;
revoke all on function public.amistosa_publica(uuid) from public;
grant execute on function public.amistosa_publica(uuid) to anon,authenticated;
