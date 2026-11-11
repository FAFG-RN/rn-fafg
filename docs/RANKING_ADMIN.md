# Actualización del ranking desde FAFG App

Implementado en `feature/ranking-admin-import`, a partir de main vigente. Entrada: Mi perfil → Panel de administrador → Actualizar y revisar ranking. No sustituye los módulos de torneos o tarjetas.

## Activación pendiente

1. COMPLETADO: `supabase/ranking-admin.sql` instalado el 11/11/2026 en FAFG APP mediante migración `20261111093131_fafg_ranking_admin_publication`. Se conservaron los roles existentes. Verificados RLS, privilegios de tabla y funciones, y lectura REST pública HTTP 200 (sin publicaciones todavía).
2. Probar con la cuenta administradora real, una cuenta sin permisos y una sesión anónima. Los operadores no pueden publicar rankings.
3. Probar dos sesiones de administrador: la segunda publicación basada en una versión anterior debe fallar sin sobrescribir la primera.
4. Revisar una planilla real, publicar una versión y confirmar coincidencia entre portada web, Top 10, categorías y perfil. Validar snapshots y auditoría con otra sesión.
5. Solo después desplegar la rama revisada. La configuración SQL está instalada; no se publicó ningún ranking ni se alteraron datos oficiales.

## Funcionamiento

La base inicial incluye 278 registros de las planillas general (262) y femenina (16), con categorías actuales. Son registros de ranking, no necesariamente 278 personas distintas. Se conservaron nombres repetidos y diferencias entre fuentes; no se deduplican identidades por conjetura. MORALEDA ANDRES aparece dos veces en el CSV general; se asignaron claves internas separadas para exigir una revisión posterior. Algunos nombres están en ambas fuentes con distintos valores.

Importación: XLSX/XLS/CSV, hojas seleccionables, encabezado configurable, asignación de nombre, puntos, categoría, ID interno del ranking, HCP, torneos, procedencia y edad. Las columnas opcionales ausentes conservan sus datos. La edad no determina automáticamente una categoría. Revisar las categorías contra reglamento antes de aprobar. Los nombres con edad al final, acentos y orden invertido se normalizan. Un ID único tiene prioridad; homónimos sin ID requieren asociación manual. Duplicados en la misma importación requieren corregir el origen o asignar IDs distintos. El vínculo es con la clave del ranking, no cambia IDs de Supabase ni fusiona perfiles.

Los ausentes exigen decidir entre conservar y excluir del ranking. La exclusión mantiene sus registros. Estados: confirmado, pendiente de verificación, con cambios detectados. Las diferencias deben confirmarse individualmente. Vista previa general, femenina y por categoría. Posiciones compartidas por puntos iguales; no se infiere otro desempate reglamentario.

`publish_fafg_ranking` verifica administrador en servidor, valida el payload, serializa publicaciones, rechaza bases desactualizadas y guarda snapshot/auditoría inmutables en una transacción. No otorga INSERT/UPDATE/DELETE directos a usuarios. El historial completo solo es accesible a administradores por RLS; `get_fafg_ranking` expone únicamente el último ranking aprobado, sin usuario autor ni auditoría. Solo se publican campos de ranking permitidos; tarjetas y perfiles nunca se copian al payload público.

La app y web consultan el mismo snapshot. Hasta la primera publicación, o si falla la lectura remota, mantienen los archivos vigentes como respaldo. La consulta pública tiene un límite de siete segundos. Una página abierta mantiene su versión durante la sesión; recargar para consultar una publicación posterior.

Las tarjetas, fotos, afiliación y resultados individuales permanecen intactos en sus fuentes originales: no se escribe en jugadores, perfiles, rankings históricos ni resultados. Las fichas históricas embebidas en categorías se mantienen. El perfil consume el ranking aprobado al encontrar un nombre único; los homónimos ambiguos mantienen su ranking anterior y necesitan una futura vinculación con ID deportivo para resolverlos.

Exportación: JSON del ranking y Excel general, femenino, categorías e incidencias. El JSON no contiene las tarjetas, porque estas no se trasladan ni se reemplazan. Borradores de revisión en el dispositivo, asociados al usuario y a la versión de base. Historial de publicaciones en Supabase; respaldos descargables. No hay integración de escritura a GitHub desde el navegador.

## Verificación realizada

- `node tests/ranking-admin.cjs`: base real, Mario Boero, nombres normalizados, homónimos, duplicados, datos inválidos, conservación de tarjetas/perfiles/campos, exclusión, empates, adaptadores públicos y lectura/escritura XLSX real.
- Análisis de sintaxis de scripts nuevos e inline de app/categorías.
- Migración ejecutada. Verificación posterior: cero versiones; jugadores/perfiles/resultados mantienen 13/4/152 registros. Permisos de publicación anónima e historial bloqueados; escritura directa autenticada bloqueada. La prueba transaccional con cambio de rol fue rechazada por la conexión antes de ejecutarse; pendiente prueba autenticada extremo a extremo y concurrencia real. El asesor de seguridad señala las funciones SECURITY DEFINER expuestas: su exposición está acotada intencionalmente a lectura del último payload público y publicación con verificación is_fafg_admin; no se expone el historial por la RPC pública.

Dependencia local: SheetJS CE 0.20.3, Apache 2.0, `vendor/SHEETJS-LICENSE`.
