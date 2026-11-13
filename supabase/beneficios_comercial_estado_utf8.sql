-- Corrección aplicada luego de beneficios_comercial_v1.
begin;
alter table public.fafg_comercios drop constraint fafg_comercios_estado_check;
alter table public.fafg_comercios add constraint fafg_comercios_estado_check check(estado in ('Prospecto','Contactado','En negociación','Confirmado','Pausado'));
commit;
