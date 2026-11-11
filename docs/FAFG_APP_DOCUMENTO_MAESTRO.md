# FAFG App — Documento maestro de continuidad

Actualizado: 11/11/2026. Repositorio FAFG-RN/rn-fafg. Esta versión documenta el trabajo de ranking; no confirma un despliegue.

## Estado actual verificado

Main contiene el acceso administrativo dentro de Mi perfil con rol consultado en `fafg_admin_roles`; módulos como torneos y canchas aún figuran próximos. Existe además PR borrador #1 en `feature/panel-admin-fafg`, no fusionado y con conflictos con main: no debe sustituir la app vigente.

## Ranking desde administrador

Rama nueva: `feature/ranking-admin-import`, basada en main. Acceso dentro del panel existente a `admin-ranking.html`. Importación Excel completa, comparación con archivos actuales o snapshot aprobado, revisión individual, búsqueda, estados, vista previa, exportación e historial. Lecturas compartidas en app y web mediante `js/ranking-public.js`.

La publicación necesita `supabase/ranking-admin.sql`, permisos de administrador reales y pruebas autenticadas. Preparado en código, NO aplicado a Supabase, NO publicado en la app pública. No se modificaron tarjetas, resultados, perfiles o afiliación. Conserva funciones y logos oficiales existentes.

Detalles de implementación, pruebas y activación: `docs/RANKING_ADMIN.md`. Mantener diferencias entre implementado, probado localmente y publicado. No presentar la migración como ejecutada ni el módulo como activo antes de verificarlo.
