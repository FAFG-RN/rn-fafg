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

## Vinculación Mario Boero — 11/11/2026

Incidente: cuenta registrada con nombre Mario Alberto Boero, sin fila en perfiles; ficha existente BOERO MARIO con 22 resultados y ranking. Se verificó unicidad de cuenta y ficha y ausencia de otra vinculación antes de insertar únicamente la relación en perfiles. Verificación posterior: perfil enlazado, 22 resultados conservados y una temporada de ranking. Sin modificar Auth, resultados, permisos ni políticas RLS. Falta confirmar visualización desde la sesión del jugador tras recargar la app.


## Título Tours que juego — 13/11/2026

Solicitud expresa del usuario: aplicar «Tours que juego» en lugar de «Mis tours». Se cambian únicamente el título visible y la etiqueta accesible de la sección en app.html. Se conserva el comportamiento, los datos y el alcance del piloto existente. Comprobación del diff: dos sustituciones de texto, reversibles exactamente al original. Implementado en main, commit 41962a715046d89cad76b98a898ecc5635ab67d6. Publicación verificada: app.html servido por GitHub Pages con HTTP 200 y ambos textos actualizados.

## Perfil: transparencia uniforme y Mis tours — 13/11/2026

Usuario aprobó la previa y solicitó aplicar en la app. app.html actualizado en main, commit 7a1db6c9eaf9250a92e244243c02c5d919a16efb: título visible y aria-label «Mis tours»; estadísticas, tarjeta de tours y tarjetas inferiores comparten fondo blanco al 27%, borde al 42% y sombra, sin desenfoque adicional sobre el panel de perfil. Solo presentación; datos y funciones conservados. Diff limitado y sintaxis de 10 scripts comprobados. Chromium local bloqueado por restricción de sockets, por lo que revisión visual autenticada pendiente. Al momento del control inicial Pages todavía servía la versión anterior; no confundir commit con despliegue confirmado.

## Mis tours para todos — 13/11/2026

Solicitud expresa: habilitar la opción a todos y compartir Santa Fe. Se elimina la condición por nombre Luciano Trevolazavala; la sección sigue dentro del perfil privado autenticado. Todos pueden elegir cualquiera de los cinco tours existentes. Santa Fe muestra ranking compartido de 117 jugadores, puntos, búsqueda normalizada y paginación. Otros tours conservan aviso de planilla pendiente. No se importaron nuevos scores: detalle por fecha existente solo para Luciano (F2–F9); los demás indican importación pendiente. Se corrige acumulación de overlays al cambiar el tour/renderizar. Sin cambios de datos oficiales ni Supabase. Commit f84527ea386bf61da35cec775dd5e5351e46210c. Sintaxis de scripts y habilitación con cuatro nombres comprobadas; revisión visual autenticada sigue pendiente por restricción local de Chromium. Publicación autorizada por usuario, primer control Pages aún anterior.


## Liga Nacional · Tarjetas hoyo por hoyo — 13/11/2026

Implementado en feature/liga-nacional-tarjetas-prueba: nuevo desplegable «Liga Nacional · Modo prueba» en Mi perfil, antes de Mis tours, bajo Torneos oficiales FAFG. Consulta automática por coincidencia exacta de todos los tokens del nombre deportivo normalizado, sin coincidencias parciales. Una clave con identidad de origen inconsistente queda bloqueada para revisión; sin coincidencia no se presume ausencia en el torneo. El estado no persiste entre cambios de jugador.

Se extraen solo AC/RE correspondientes a las fechas nominales de cada uno de los cinco archivos aportados: Norte F1–F4, Sur F1–F4 y Finales F5–F6. 500 registros, 442 tarjetas completas con suma de 18 hoyos reconciliada contra SCORE AC y 58 NPT sin ceros inventados. Siete registros requieren cotejo AC/RE o par/salidas; se muestran advertencias y se conservan ambos scores. Las referencias de temporada heredadas de 2025/2026 no se resuelven automáticamente: fecha, sede y temporada pendientes de corroboración. No cambia puntos, rankings, Supabase ni archivos originales.

Datos distribuidos mediante lista permitida de campos deportivos: nombres, zona, fecha ordinal, hoyos, par de referencia, score, posición/puntos RE y procedencia por hoja/fila. Excluidos DNI, pagos, afiliación y contactos. El par por hoyo se rotula «Par ref.» y las salidas diferenciadas requieren confirmación.

Validación: sintaxis de todos los scripts inline y del módulo; 500 registros y 442 sumas; NPT y privacidad de campos; seis tarjetas de Luciano. La vista privada de revisión se publica aparte en Coordinación interna /pruebas/liga/. Integración preparada en rama; no fusionada ni disponible todavía en la app pública.


## Mis torneos FAFG personalizado — 13/11/2026

Usuario aprobó «excelente, hagamos esa prueba» tras definir un botón personal en Mi perfil sobre Mis tours. Se reemplaza la entrada directa de Liga Nacional por un desplegable Mis torneos FAFG con Liga 1, Copa de la República, Liga Nacional y Copa Federación. No hay selector de nombres en la app; el nombre proviene de la ficha deportiva vinculada. Liga Nacional conserva el módulo probado de tarjetas; las otras tres competencias indican planillas pendientes sin inferir que el jugador no participó.

La vista privada de revisión se ajusta a un ejemplo personal de Luciano sin selector de nombres. Verificados orden, cuatro competencias, ausencia de selector y sintaxis de scripts. Publicación del modo prueba solicitada por usuario; confirmar entrega en Pages después de fusionar PR #7. No cambia resultados, rankings ni Supabase.


Publicación confirmada — 13/11/2026: PR #7 fusionado con autorización del usuario, commit a473203250383b0081bcb4d23264188df9c92f25. GitHub Pages sirve HTTP 200 para app.html con Mis torneos FAFG y los cuatro desplegables, módulo JS y archivo de 500 registros. No hay selector de nombres en el nuevo menú. La revisión visual del ejemplo personal funcionó; falta corroborar dentro de la sesión real del usuario en la PWA.


## Liga 1 2026: tres rondas y resultado total — 13/11/2026

Solicitud expresa del usuario: incorporar LIGA 1 2026 (1).xlsm en Mis torneos FAFG → Liga 1 para cada perfil. Se agregan módulo y datos separados, manteniendo intactos Liga Nacional y los otros paneles. La identidad se resuelve por el mismo nombre deportivo normalizado, sin selector de jugadores. No modifica Supabase, ranking ni archivos originales.

Fuente: AC1/RE1, AC2/RE2, AC3/RE3; total en RESULTADOS. Solo las tres rondas indicadas por el usuario, no las pestañas de plantilla AC4–AC10/RE4–RE10. RE1 contiene una columna extra, por lo que PAR y PTS RANK se localizan por encabezado. Se distingue puntaje de ronda RE del puntaje final de RESULTADOS; no se suman puntos de ronda para sustituir el final.

47 jugadores; 141 registros, 136 tarjetas completas con suma de 18 hoyos igual a SCORE y 5 NPT conservados sin ceros ficticios. 47 filas de resultado final, 44 totales completos reconciliados contra las tres rondas. Tres participantes no tienen total final en la fuente y conservan ese estado. No se detectaron discrepancias de score AC/RE ni colisiones de identidad dentro de este libro. Datos exportados solo deportivos; DNI, pagos, cuotas y contactos excluidos.

Verificados sintaxis de scripts, ambos paneles, privacidad, rondas y totales. La fuente original se incorpora también a Documentos de Coordinación interna. Cambios preparados para publicación autorizada; verificar entrega GitHub Pages después de fusionar.


Publicación Liga 1 confirmada — 13/11/2026: PR #8 fusionado, commit c3a7b23735fe5a829f0aac186d53160ca8ea3397. GitHub Pages sirve HTTP 200 para app.html con liga1-details, liga1-prueba.js y liga1-prueba.json con 141 registros y 47 resultados finales. La vista personal fue revisada en navegador; la sesión real de cada jugador sigue su vinculación deportiva existente.
