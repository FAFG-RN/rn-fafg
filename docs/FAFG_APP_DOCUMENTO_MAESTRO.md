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


## Orden de Mis torneos FAFG — 13/11/2026

Solicitud directa del usuario: Liga Nacional, Liga 1, Copa de la República, Copa Federación. Se reordenan únicamente los cuatro bloques HTML existentes, preservando exactamente sus contenidos, IDs y manejadores. Verificación del cambio mediante sustitución inversa exacta. No cambia datos ni funcionalidad de tarjetas.


## 2026-11-13 · Logos oficiales en Mis torneos FAFG

Usuario aprobó la vista previa y solicitó aplicarla para todos los perfiles, retirando «Modo prueba». Se reutilizan los cuatro PNG oficiales existentes, sin modificar sus bytes ni proporciones. Columna uniforme de 68 × 48 px, ajuste de márgenes transparentes y filas de al menos 84 px; títulos y estados alineados. Orden: Liga Nacional, Liga 1, Copa de la República, Copa Federación. Se retira la etiqueta de prueba del encabezado y de los módulos; se conserva el aviso de validación pendiente y separación respecto al ranking oficial. Datos, vinculación personal, permisos y tarjetas sin cambios.

Validación: vista privada revisada en navegador con ancho de contenido móvil, cuatro logos completos; compilan 10 scripts inline y ambos módulos. Publicación autorizada por el usuario; comprobar Pages después de fusionar.

Publicación comprobada: PR #9 fusionado en main, commit d056b4ace10ea6aa49ff9184712e1c9da201880f. Pages devuelve HTTP 200 con los cuatro logos y sin «Modo prueba». Navegador confirmó carga correcta de los cuatro PNG oficiales en la app pública. app-sw.js mantiene estrategia de red para app.html; basta reabrir o recargar online para recibir la actualización.


## Botones de torneos blancos translúcidos — 13/11/2026

Solicitud directa del usuario según captura: fondo blanco transparente para distinguir logos y títulos. Encabezados de las cuatro competencias con blanco al 82%, títulos, subtítulos y flechas azul #103c70, sin sombra de texto. Logos, tamaño, orden, desplegables, tarjetas y datos conservados. Cambio exclusivamente CSS, aplicado en main en a04b9e59784158d2fb161193a920b3fa5477bdb7. Confirmación de entrega Pages pendiente; revisión visual autenticada no realizada.


## Comunidad y beneficios — 13/11/2026

Nuevo acceso dentro de Mi perfil → Panel de administrador: «Comunidad y beneficios · Jugadores por ciudad», enlaza al Site privado https://fafg-carrera-historica.weedychub6.chatgpt.site. Conserva íntegramente la condición de acceso existente al panel y los permisos de Supabase; el Site tiene su propio acceso privado de propietario. No se transfieren credenciales ni parámetros de sesión en el enlace.

Relevamiento del archivo 322RANKING 250 11-11-26(1).xlsx: General 262 registros + Femenino 16 = 278; deduplicación por nombre normalizado (sin edad) elimina un duplicado interno de General y siete coincidencias entre hojas: 270 nombres únicos, 77 localidades, 8 jurisdicciones. No equivale a padrón validado por DNI ni a socios activos. Procedencia del ranking, no residencia actual. Hoja DATOS histórica excluida. CO y CB = Córdoba, confirmado por Luciano. Marcos Juárez 10. ROCA/GENERAL ROCA y BUENOS AIRES/CABA se mantienen separados hasta corroboración. Equivalencias tipográficas y geográficas adicionales documentadas en el informe del Site.

Site desplegado privado; comunidad con búsqueda, filtros, CSV e informe. Carrera con 799 resultados procedentes de los JSON de Santa Fe y Sudoeste publicados en el repositorio. Revisión, importación JSON normalizado, diferencias, motivos, versiones y publicación de instantáneas internas. Tarjetas individuales y cortes históricos de ranking faltan cargar; Excel/fotos requieren extracción. No se conecta aún publicación de correcciones con app/web FAFG; no se modifica ranking ni Supabase. Integración del acceso preparada en rama feature/admin-comunidad-beneficios; verificar estado de PR y despliegue antes de afirmar disponibilidad en app.
