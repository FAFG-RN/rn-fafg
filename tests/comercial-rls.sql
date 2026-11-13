begin;
create temporary table test_report(test text,passed boolean) on commit drop;
grant insert,select on test_report to anon,authenticated;
do $$begin perform set_config('request.jwt.claim.sub',(select user_id::text from public.fafg_admins order by user_id limit 1),true); end$$;
set local role authenticated;
do $$
declare p uuid; b uuid; d date:=(now() at time zone 'America/Argentina/Buenos_Aires')::date;
begin
 if not public.is_fafg_admin() then raise exception 'No admin fixture available';end if;
 insert into public.fafg_comercios(nombre,tipo,ciudad,provincia,rubro) values('__QA_COMERCIAL__','Comercio','Rosario','Santa Fe','Deporte') returning id into p;
 perform set_config('fafg.test_partner',p::text,true);
 insert into public.fafg_beneficios(comercio_id,comercio_publico,titulo,ciudad,rubro,descripcion,condiciones,acceso,destinatarios,desde,hasta,estado)
 values(p,'__QA_COMERCIAL__','Vigente','Rosario','Deporte','Descripción','Condiciones','Credencial','Socios activos FAFG',d,d,'publicado') returning id into b;
 perform set_config('fafg.test_benefit',b::text,true);
 insert into public.fafg_beneficios(comercio_id,comercio_publico,titulo,ciudad,rubro,descripcion,condiciones,acceso,destinatarios,desde,hasta,estado)
 values(p,'__QA_COMERCIAL__','Borrador','Rosario','Deporte','Descripción','Condiciones','Credencial','Socios activos FAFG',d,d,'borrador'),
 (p,'__QA_COMERCIAL__','Vencido','Rosario','Deporte','Descripción','Condiciones','Credencial','Socios activos FAFG',d-2,d-1,'publicado'),
 (p,'__QA_COMERCIAL__','Futuro','Rosario','Deporte','Descripción','Condiciones','Credencial','Socios activos FAFG',d+1,d+2,'publicado');
 insert into public.fafg_aportes(comercio_id,tipo,estado,fecha,moneda,importe,detalle) values(p,'Dinero','Recibido',d,'ARS',100,'QA'),(p,'Canje','Recibido',d,null,null,'QA canje');
 update public.fafg_comercios set estado='Confirmado' where id=p;
 if (select count(*) from public.fafg_comercial_historial where registro_id=p)<>2 then raise exception 'Audit failed';end if;
 begin
 insert into public.fafg_aportes(comercio_id,tipo,estado,fecha,moneda,importe,detalle) values(p,'Canje','Recibido',d,'ARS',100,'Invalid');
 raise exception 'Canje money constraint failed';
 exception when check_violation then null;
 end;
end$$;
insert into test_report select 'admin_crud_audit_constraints' as test,true as passed;
reset role;
set local role anon;
insert into test_report select 'anon_only_current_published' as test,count(*)=1 as passed from public.fafg_beneficios where comercio_id=current_setting('fafg.test_partner')::uuid;
insert into test_report select 'anon_no_private_access' as test,not has_table_privilege('anon','public.fafg_comercios','select') and not has_table_privilege('anon','public.fafg_aportes','select') and not has_table_privilege('anon','public.fafg_comercial_historial','select') as passed;
reset role;
do $$begin perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);end$$;
set local role authenticated;
insert into test_report select 'nonadmin_private_rows_hidden' as test,(select count(*)=0 from public.fafg_comercios where id=current_setting('fafg.test_partner')::uuid) and (select count(*)=0 from public.fafg_aportes where comercio_id=current_setting('fafg.test_partner')::uuid) and (select count(*)=0 from public.fafg_comercial_historial where registro_id=current_setting('fafg.test_partner')::uuid) as passed;
do $$begin
 begin
 insert into public.fafg_comercios(nombre,tipo,ciudad,provincia,rubro) values('__QA_UNAUTHORIZED__','Comercio','Rosario','Santa Fe','Deporte');
 raise exception 'Nonadmin insert incorrectly succeeded';
 exception when insufficient_privilege then null;
 when raise_exception then if SQLERRM <> 'Acceso administrativo requerido' then raise; end if;
 end;
end$$;
with changed as (update public.fafg_beneficios set estado='pausado' where id=current_setting('fafg.test_benefit')::uuid returning id) insert into test_report select 'nonadmin_cannot_update_public_benefit' as test,count(*)=0 as passed from changed;
reset role;
select bool_and(passed) as all_passed,json_agg(test_report) as tests from test_report;
rollback;