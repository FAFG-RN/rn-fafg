# Notificaciones automáticas de nuevas altas — FAFG App

**Destino fijo:** ltrevolazavala@gmail.com

## Activación (administrador)
1. En Supabase > SQL Editor, ejecutar `supabase/avisos-altas.sql`. Esto crea una cola privada y un trigger sobre `auth.users` para altas nuevas.
2. Crear cuenta en Resend y verificar un dominio de envío. Usar una dirección remitente válida de ese dominio (ejemplo: `FAFG <avisos@tudominio.com>`). Resend restringe destinatarios si se utiliza el dominio de prueba.
3. En GitHub > Settings > Secrets and variables > Actions, crear estos cuatro **repository secrets**:
   - `SUPABASE_URL`: URL del proyecto Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: clave secreta de rol de servicio de Supabase (NUNCA usar la publishable key ni publicarla).
   - `RESEND_API_KEY`: clave privada de Resend.
   - `FAFG_NOTIFICATION_FROM`: remitente autorizado en Resend, por ejemplo `FAFG <avisos@tudominio.com>`.
4. En GitHub > Actions > «FAFG - Avisos de nuevas altas» > Run workflow, ejecutar una prueba **después** de registrar una cuenta de prueba nueva. Verificar recepción y registro de ejecución.
5. Luego el workflow consulta cada ~5 minutos (GitHub Actions puede demorar y no garantiza puntualidad).

**Alcance:** notifica **cuentas nuevas**, no cada inicio de sesión. La confirmación del correo y la aprobación de la ficha deportiva son pasos separados. No se envían avisos de altas anteriores a la instalación. La cola usa RLS y no da acceso a clientes.

**Nota operativa:** el envío y la marca de procesado son dos operaciones distintas; en fallos excepcionales puede haber reintentos. Se usa clave de idempotencia en Resend para reducir duplicados. El workflow puede pausarse por inactividad del repositorio según políticas de GitHub.
