# FAFG App — Documento maestro de continuidad

Actualizado: 11/11/2026. Repositorio FAFG-RN/rn-fafg.

## Estado actual

Main contiene el acceso administrativo dentro de Mi perfil, con rol en fafg_admin_roles. PR #1 permanece como trabajo histórico no fusionado. PR #2 fusionado con autorización del usuario mediante commit 277ed630a3575d3dd48b38d7dbc95db68c1fd141. Despliegue GitHub Pages completado correctamente (Actions run 42996766182). Panel disponible en https://fafg-rn.github.io/rn-fafg/admin-ranking.html y enlazado desde el panel de Mi perfil.

## Supabase — instalación completada

Con autorización expresa del usuario, se instaló supabase/ranking-admin.sql mediante la migración 20261111093131_fafg_ranking_admin_publication en el proyecto FAFG APP (kkrzqxiomkorxyjlnjqc). Se conservó la función is_fafg_admin existente y el administrador previamente asignado; no se agregaron usuarios ni roles.

Verificado: RLS habilitado en fafg_ranking_versions; historial SELECT solo para administrador; anon sin permiso de publicar ni leer historial; authenticated sin INSERT/UPDATE directos; función pública de lectura responde HTTP 200 y null porque todavía no hay publicaciones. Cantidades antes/después iguales: 13 jugadores, 4 perfiles, 152 resultados. Cero versiones de ranking publicadas.

La prueba transaccional con SET ROLE y reversión fue rechazada por permisos de la conexión antes de ejecutarse. Por tanto, la publicación autenticada, rechazo efectivo de bases desactualizadas y flujo completo con cuenta administradora todavía NO están probados en servidor. El panel está desplegado y solicita iniciar sesión al visitante sin sesión; la prueba de publicación con la cuenta administradora sigue pendiente. No se publicó ningún ranking.

## Funcionalidad implementada

Entrada disponible en Mi perfil → Panel de administrador → Actualizar y revisar ranking. Excel completo, comparación por identidad, estados, búsqueda, vista previa, historial, exportación. Fuente de ranking compartida entre app y web, con archivos actuales como respaldo. No se escriben tarjetas, resultados, perfiles o afiliación.

Detalles en docs/RANKING_ADMIN.md. Verificación del despliegue: HTTP 200 en app, panel, scripts y biblioteca XLSX; botón de acceso presente en HTML de producción; navegador muestra el bloqueo por falta de sesión. Próximo paso: iniciar sesión real, importar planilla, revisar diferencias y comprobar vista previa/publicación.

## Navegación inferior aprobada

11/11/2026: el usuario aprobó y solicitó aplicar la vista previa con orden Inicio, Noticias, Perfil, Ranking, Ayuda. Perfil central elevado en círculo de 76 px (68 px en pantallas estrechas), sin texto visible y con etiqueta accesible «Mi perfil». Paleta azul, degradé y logos oficiales conservados. Se mantienen las rutas y manejadores existentes. Verificar despliegue Pages tras publicar este cambio.

## Historial de torneos — 11/11/2026

Diseño aprobado por el usuario mediante previa visual. Implementado en feature/historial-torneos-tarjetas: tarjeta por resultado con nombre, fecha, golpes, posición y puntos; detalles desplegables conservan sede, categoría, diferencias y rondas existentes. Orden cronológico, filtro de temporada compatible con años de 2 y 4 cifras, modo oscuro. Ranking separado de la pestaña Historial. No cambia consultas ni datos de Supabase.

Validación: todos los scripts inline compilan; pruebas de orden, años, filtro, score ausente, puntos cero y conservación de rondas correctas. Prueba visual Playwright pendiente: Chromium no inicia en este entorno por restricción de sockets. El usuario solicitó expresamente «Aplícalo a la app» luego de conocer esta limitación. Publicación autorizada; comprobar entrega de HTML en Pages después de fusionar. La validación visual autenticada sigue pendiente.

## Historial compacto aprobado — 11/11/2026

El usuario aprobó la segunda previa «Sí. Así compacto». Se compactan tarjetas, tipografía, separación y botones Ver detalle; en móviles de 360px o más se alinean identificación, resultados y botón. En pantallas menores se coloca el botón debajo para preservar lectura. Detalle abierto conserva toda la información y ocupa el ancho completo. Sin cambios de datos, filtros o consultas. Sintaxis de scripts comprobada; limitación de revisión visual local ya registrada. Publicación autorizada. Versión anterior de tarjetas publicada por PR #3, commit d39dd1d1eb59b980a0efefb66cc64f39223af45f, Pages run 43011398068 exitoso.

## Encabezado Copa Federación — 11/11/2026

Solicitud directa del usuario según captura: agrandar logo y centrar textos en el ancho. Se aumenta caja del logo original a 240×160 px, conservando proporción y archivo; composición vertical centrada con título y subtítulo centrados en todo el ancho. Solo CSS de rumbo-copa-federacion.html; datos, tabla y JavaScript intactos. Se verificó que el cambio únicamente agrega estilos. Publicación autorizada por solicitud.

11/11/2026: ajuste adicional aprobado del logo Copa Federación, +20% mediante transform:scale(1.2) con origen central. Se conserva caja 240×160 y todo el flujo/layout: ninguna modificación del título, subtítulo, posición, tabla ni márgenes. PR #6 fusionado en 93e045026250543eae80ccc563abe11e17015b6e. Comprobación: diferencia exclusivamente CSS del logo.
