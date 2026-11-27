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


Publicación de acceso comprobada — 13/11/2026: PR #10 fusionado, commit 37c27ebcd734ca5569dcaa2c69536db3ae66f5d1. Pages run 43465272887 completado con success. HTTP de app.html entregado con el nuevo enlace Comunidad y beneficios · Jugadores por ciudad. No se verificó la sesión administradora real en iPhone; el acceso al Site publicado requiere la cuenta propietaria de ChatGPT. Revisión local del Site: logo oficial íntegro, filtro Córdoba = 10 y búsqueda trevolazavala con ficha y ocho resultados de Santa Fe. Pruebas automáticas con SQLite local: controles de versión, motivo obligatorio, origen, vista previa, instantáneas publicadas inmutables, auditoría, diferencias y duplicados correctos. No se ejecutaron correcciones de prueba sobre producción.


## Fecha de nacimiento en celular — 13/11/2026

Solicitud del usuario: un amigo no logra aplicar la fecha de nacimiento al registrarse. Revisión de app.html: el registro de cuenta solo pide correo, DNI y contraseña; la fecha se completa en Editar perfil. Se comprobó un fallo de precarga: la expresión regular de populateEditableProfile estaba doblemente escapada y rechazaba una fecha ISO válida, mostrando vacío el campo guardado. No se reprodujo el selector nativo del dispositivo del amigo.

Corrección en fix/fecha-nacimiento-movil: reemplazo del calendario nativo por selectores Día y Mes y campo Año de cuatro dígitos con teclado numérico; conserva fecha_nacimiento en ISO YYYY-MM-DD en los metadatos privados de la cuenta. Corrige precarga de fecha guardada. Fecha opcional; si se empieza a completar, exige las tres partes. Valida calendario, bisiestos y futuro. No se agregan límites de edad, no se cambia registro, permisos, identidad deportiva ni ranking.

Validación local: fechas válidas, 29/2 bisiesto/no bisiesto, 31/4, futuro, fecha parcial, vacío opcional y precarga/lectura de 1983-08-18; diez scripts inline compilan. Prueba en iPhone físico y guardado desde la sesión real del amigo pendientes. No se crearon usuarios ni se modificaron perfiles ajenos. Preparado para publicar; verificar estado de PR y Pages.


Publicación de fecha de nacimiento comprobada — 13/11/2026: PR #11 fusionado en 3de556920609a747d5f89ff370792c405dccb994. Pages run 43466463251 completado con success; app.html servido por HTTPS incluye Día/Mes/Año, validateBirthParts y populateBirthFields. Prueba del manejador real con cliente simulado: updateUser recibe 1983-08-18 al guardar sin cambiar una fecha precargada; 31/2 bloquea la actualización. No se modificaron perfiles reales. Pendiente comprobar desde el celular y sesión del amigo del usuario.


## Comunidad dentro de FAFG App, sin sesión de ChatGPT — 13/11/2026

El usuario no puede iniciar sesión en el Site privado externo. Se reemplaza el enlace externo por ./admin-comunidad.html, dentro del mismo origen y con storageKey fafg-app-auth existente. La pantalla verifica getUser y RPC is_fafg_admin, igual que el administrador de ranking. Sin sesión o sin rol, no muestra el panel; al cerrar sesión limpia filas y bloquea la vista. No se transfieren tokens a otro origen ni se modifica Supabase, roles o RLS.

La página contiene únicamente estadísticas agregadas derivadas del ranking ya público, no datos privados de jugadores. Esas estadísticas y su fuente son públicas a nivel de código; el control de sesión organiza el acceso administrativo y no pretende proteger cifras públicas como secretos. Para futuros datos confidenciales será necesario un endpoint protegido por RLS. Cuenta con 270 nombres únicos, 77 localidades, 8 jurisdicciones, buscador, filtro por provincia y CSV de selección. Conserva fuente, fecha de corte, normalizaciones, advertencia sobre residencia y socios activos y pendientes geográficos. El Site externo se conserva privado y no se cambia su audiencia.

Comprobaciones locales: sintaxis, totales 270/77, Córdoba=10; casos sin sesión, usuario sin rol, administrador válido y cierre de sesión. Prueba con la sesión real del usuario y iPhone pendientes. Preparado en fix/comunidad-dentro-app; comprobar PR y Pages antes de afirmar disponibilidad.


Publicación nativa de Comunidad comprobada — 13/11/2026: PR #12 fusionado, commit 8268aacac5c0fbb435d6c609dd381fedeb12dd39. Pages run 43467661971 completado con success. HTTPS entrega admin-comunidad.html con la sesión fafg-app-auth y RPC is_fafg_admin, y app.html con enlace relativo ./admin-comunidad.html. No solicita login de ChatGPT. Pendiente confirmar dentro de la sesión real del usuario en su celular.


## Beneficios y panel comercial — publicación autorizada 13/11/2026

Luciano aprobó la vista previa y solicitó expresamente «aplicalo a la app». La integración se reconstruye desde main actual en release/beneficios-comercial, sin incorporar la rama administrativa histórica ni el admin.html de desarrollo.

- Inicio agrega Beneficios FAFG hacia ./beneficios.html, respetando clases existentes. Mi perfil → Panel de administrador agrega Beneficios y panel comercial hacia ./comercial.html, dentro del control de acceso existente. Comunidad por ciudad se conserva.
- Catálogo público: ciudad, rubro, búsqueda, condiciones, destinatarios y vigencia. Sin comercios ni descuentos ficticios cargados. Solo beneficios publicados y vigentes son consultables públicamente por RLS.
- Panel comercial: getUser + is_fafg_admin; contactos y negociaciones privados, próxima gestión, borradores con vista previa antes de publicar, pausa, aportes previstos/confirmados/recibidos/cancelados, dinero por moneda y canjes separados; exportación CSV. Misma sesión fafg-app-auth, sin login de ChatGPT ni proveedores adicionales.
- Relevamiento agregado: 270 nombres únicos, 77 localidades, 8 jurisdicciones, corte 11/11/2026. Procedencia pendiente de validar como residencia actual; no equivale a socios activos. Exportación por filtro.
- Base previamente aplicada: beneficios_comercial_v1 y beneficios_comercial_estado_utf8, nuevas tablas con RLS e historial no editable por clientes. Sin cambios en datos deportivos, perfiles, Auth o rankings.
- Pruebas previas: CRUD administrativo, auditoría y restricciones monetarias/canjes; aislamiento de anónimos y no admins; cinco resultados SQL correctos, fixtures revertidos. Frontend: vigencias inclusivas, estados, URL segura, escape HTML, CSV y totales. En integración: sustitución inversa exacta del app.html actual y compilación de todos los scripts.
- Revisión visual móvil y con sesión real aún pendiente; la previa local no fue alcanzable por el navegador. Usuario conoce la limitación y autorizó aplicar tras ver la demostración descargable.
- No se contrataron servicios pagos. Sin validación automática de socio, cupones ni seguimiento automático de consultas/canjes de jugadores; acreditación según condiciones de cada comercio.
- Estado: integrado en rama para publicación autorizada. Verificar entrega HTTPS de páginas y recursos después de fusionar antes de afirmar publicado.


Publicación de Beneficios comprobada — 13/11/2026: PR #14 fusionado con autorización expresa del usuario, commit b1c35b9df75064e3e65428b6a07de8bbb742a628. Navegador HTTPS verificó beneficios.html con SDK y consulta reales: filtros cargados, 0 beneficios disponibles y estado vacío correcto; logo oficial visible e íntegro. comercial.html bloquea acceso sin sesión con indicación de ingresar desde Mi perfil. app.html público muestra Beneficios FAFG en Inicio y conserva los seis accesos anteriores y navegación. Pruebas locales: 10 scripts inline, módulo, enlaces, vigencias y totales correctos. Cuatro tablas comerciales con RLS; contactos/aportes sin lectura anónima; sin beneficios publicados. Pendiente probar formularios desde la sesión administradora real y en iPhone físico. El usuario comenzará a buscar comercios; no se cargaron acuerdos de ejemplo.


## Mis tours con logos de asociaciones — 13/11/2026

Usuario solicita igualar Mis tours a Mis torneos FAFG y aporta cinco JPG originales: BAFG, Ramallo, Santa Fe, Sudoeste y Tandil. Implementado en feature/mis-tours-logos, PR #15 borrador: cinco acordeones con caja 68×48 px, encabezado 84 px y blanco al 82%, título/subtítulo/flecha como torneos. Imágenes previstas con object-fit contain, sin recortar ni alterar. El selector original se conserva oculto; módulo nuevo mueve el mismo contenedor de resultados y emite el cambio existente. Todos los scripts de resultados originales permanecen idénticos. Pruebas de selección inicial Santa Fe, cinco tours, cierre de otros y reubicación de contenido correctas.

BLOQUEO: transferencia de originales desde Library falla por conectividad (helper tools/list DNS y descarga). Los cinco archivos están identificados, pero sus bytes no están disponibles en el repositorio. No se fusionó ni publicó para evitar imágenes rotas. Pendiente copiar originales a assets/images/tours/{bafg,ramallo,santa-fe,sudoeste,tandil}.jpg, comprobar correspondencia y revisión visual móvil. Usuario debe poder suministrar copia local en work/tour-originals o recuperar conectividad. No se recrearon logos ni se modificaron rankings, resultados, perfiles o Supabase.


Mis tours: originales disponibles — 13/11/2026. Luciano copió los cinco JPG a la carpeta solicitada. Se verificaron tamaños exactos contra los adjuntos (BAFG 61895, Ramallo 102440, Santa Fe 50876, Sudoeste 31757 y Tandil 66484 bytes), correspondencia visual y subida binaria sin recomprimir. El bloqueo de transferencia quedó resuelto. Imágenes completas con object-fit contain, sin recorte ni recreación; misma caja y diseño de encabezados que Mis torneos FAFG. Pruebas de selección inicial, cinco tours, cierre de otros y traslado del contenedor pasaron; todos los scripts y resultados originales permanecen idénticos. Revisión visual reproducible en pruebas/mis-tours-logos.html, sin datos de jugadores ni sesión. Preparado para publicar dentro del pedido del usuario; verificar Pages y logos tras fusión.


Publicación de Mis tours comprobada — 13/11/2026: PR #15 fusionado en 6807bc7e8660513ff1aed6a7890d921d623b14ca. Pages run 43503051753 completado con success. Navegador HTTPS revisó pruebas/mis-tours-logos.html a 390 px: cinco JPG cargados con sus dimensiones originales (1080×1080 salvo Sudoeste 461×406), imágenes completas visibles, mismos encabezados y fondo que torneos FAFG, sin desbordes. Se verificó integridad binaria adicional comparando SHA Git local de cada original con su blob remoto. Diez scripts inline compilan; navegación de cinco asociaciones probada. Sigue pendiente corroborar dentro de la sesión personal de cada jugador; no cambian sus resultados, rankings ni permisos. El bloqueo de originales quedó resuelto y no requiere más acción del usuario.


## Logos de Mis tours sin fondos — 13/11/2026

Pedido expreso de Luciano: quitar fondos blancos, negro y celeste/verde y recortar para dejar solo los logos. Se enmascaró el exterior y se recortaron márgenes sobre los JPG originales, preservando los blancos y colores internos de cada marca. La prueba generativa fue descartada porque reinterpretó detalles; ninguno de sus píxeles se utiliza en producción. Los cinco recortes maestros verifican cero cambios RGB respecto del original dentro de su caja; solo cambia el canal alfa y la caja exterior. Se conservan los JPG originales. Para la app se exportan PNG transparentes de hasta 256×256 px con escala proporcional, aptos para las cajas 68×48 de los botones, sin recomprimir como JPEG ni deformar.

Solo se sustituyen cinco rutas .jpg por .png en app.html y su página de revisión. Scripts de consultas y resultados íntegros; sin cambios a perfiles, ranking, permisos, navegación o Supabase. Revisión de recortes sobre fondos claro y azul realizada. Publicación autorizada por la solicitud de aplicar el recorte en la app; verificar entrega y fondos transparentes al terminar Pages.


Publicación de logos transparentes comprobada — 13/11/2026: PR #16 fusionado en 77a6790f4c5b26c8a8e4080a13ef408f8b288005; Pages run 43504777682 completado con success. Navegador HTTPS revisó los cinco PNG a 390 px: cargados correctamente, sin rectángulos exteriores y con blancos internos conservados. Dimensiones de derivados: BAFG 256×232, Ramallo 256×220, Santa Fe 181×256, Sudoeste 256×235 y Tandil 256×231. app.html y vista de revisión usan PNG; no cambian scripts ni resultados.


## Mi carrera deportiva: acceso alineado — 13/11/2026

Pedido directo según captura: mismo título/alineación/flecha que Mis torneos FAFG y Mis tours. Cambio exclusivamente CSS para la primera tarjeta generada de perfil (Mi carrera deportiva): fila única, padding de 20 px, altura mínima de 86 px como las tarjetas superiores, título heredado de la tipografía del perfil y chevron ⌄ a la derecha. Se ocultan solo en ese acceso el trofeo y el subtítulo Historial y resultados para igualar la gráfica. El botón, su texto, sus manejadores y la pantalla de carrera permanecen intactos; credencial y editar perfil sin cambios. Verificación por eliminación inversa exacta del bloque CSS: todo el HTML y JavaScript original se conserva. Publicación autorizada por la solicitud; verificar Pages después de fusionar.


Publicación del acceso Mi carrera deportiva comprobada — 13/11/2026: PR #17 fusionado en 8d42100606ed06b9122a7d08e88c43cd081f8aeb. Pages run 43505722416 completado con success. Navegador HTTPS confirmó el bloque CSS cargado y cascada efectiva del botón generado: padding izquierdo/derecho 20 px, altura mínima 86 px, título 16 px, chevron ⌄ con margin-left auto, icono y subtítulo ocultos. No se alteró el manejador de apertura. Verificación visual dentro de sesión real sigue a cargo del usuario; no se accedió a su sesión.


## Puntos del perfil iguales al Ranking Nacional — 13/11/2026

Incidente confirmado: rankings de Supabase conserva 2194.65 para Luciano, mientras ranking-general-2026.csv y categorías públicas al 11/11/2026 muestran 2220.75. Snapshot aprobado get_fafg_ranking devuelve null. La normalización de nombres de la búsqueda anterior tenía expresiones doblemente escapadas; no obtenía coincidencia única y activaba el reemplazo con la tabla anterior.

Corrección: nuevo resolver FAFGPublishedRanking.profile en js/ranking-public.js. Prioriza snapshot aprobado; si no existe, usa el archivo de categorías público, con búsqueda por todos los tokens del nombre (sin tildes/edad/orden) y categoría cuando sea necesario. Coincidencias ambiguas no se adjudican. Perfil deja de consultar rankings anterior y no muestra sus valores ante error, ausencia o ambigüedad: muestra guiones y un aviso específico. Puntos, posición por categoría, HCP y torneos provienen de una sola ficha pública. Se actualiza la fecha desde la fuente y se protege contra respuestas tardías de otra sesión. La carrera sigue tomando sus estadísticas del perfil, sin sumar scores históricos como ranking.

No se alteran tablas, puntos oficiales, cálculos, afiliación, permisos, resultados ni archivos de ranking. La función histórica de estado de socio permanece intacta. Cache de biblioteca renovada en app.html. Posición de Luciano: 2 en General Caballeros, 3 en general; puntos iguales (2220.75). Esa diferencia de posición es legítima por ámbito.

Validación: 276 coincidencias de fichas correctas, dos filas duplicadas MORALEDA ANDRES bloqueadas; nombres invertidos/edad/tildes, categoría, homónimos, ceros, snapshot posterior, errores de red y diez scripts inline correctos. Caso Luciano: 2.220,75 puntos idénticos al CSV público, posición de categoría 2, HCP 0 y 15 torneos. Pendiente comprobar entrega Pages al fusionar. Publicación autorizada por pedido directo de corrección.

## Cierre de Mi carrera y retiro de Beneficios — 13/11/2026

La pantalla de carrera y el acordeón histórico escuchaban el mismo botón: al volver al perfil quedaba visible la lista histórica. Se elimina el manejador del acordeón y el desplazamiento al contenido antiguo; la tarjeta histórica queda oculta como fuente de datos para la pantalla nueva. Apertura y cierre restablecen el estado cerrado, detalles y aria-expanded; se elimina el segundo manejador redundante de la tarjeta. Se conserva la carga de resultados para todas las cuentas.

Se retira únicamente el acceso público «Beneficios FAFG» del Inicio a pedido de Luciano; el módulo y herramientas administrativas se conservan para continuar su desarrollo. Sin modificaciones en datos o permisos.

Validación: tests/career-close.cjs (tres ciclos de apertura/cierre, detalles, foco, manejador único, lista oculta y enlace retirado), tests/profile-public-ranking.cjs (276 fichas y diez scripts inline) y git diff --check correctos. Navegador local bloqueado por restricciones de sockets del entorno; queda pendiente verificación visual en iPhone. Publicación autorizada por pedido directo de corregir la app; comprobar Pages al integrar.


## Tutoriales privados de tarjeta digital — 14/11/2026

Pedido de Luciano: aplicar los dos tutoriales, con logos oficiales, únicamente en su perfil de administrador para revisar cómo se ven. Acceso «Cómo usar la tarjeta digital» insertado en #perfil #private-profile; no se agrega a Inicio, Ayuda ni a otros perfiles. El acceso y el servidor exigen el usuario propietario verificado y RPC is_fafg_admin() verdadero; otros administradores/operadores tampoco acceden a esta prueba.

Dos videos verticales H.264 1080×1920: una línea 48 s y Live con amigos 56 s. Se compuso el original assets/images/FAFG-Horizontal-2.png con proporciones intactas en todos los cuadros, cabecera de la guía y práctica. Son pantallas esquemáticas con texto; sin voz grabada. Guía con capítulos, repetir paso, voz opcional del navegador y prácticas locales sin datos reales.

La función tutoriales-admin-preview valida el JWT mediante Auth y el permiso RPC con el token del usuario; no usa service_role. JWT del gateway habilitado. Devuelve el HTML con medios embebidos únicamente después de ambas comprobaciones, con no-store y CORS del origen de la app. El payload generado preview.ts se excluye del repositorio/Pages mediante .gitignore; los originales privados se conservan en la implementación desplegada de la función. No publicar una copia del payload en assets ni una ruta HTML pública.

El modal carga el contenido solo al abrir, en iframe con origen opaco (sin allow-same-origin). CSP de la guía prohíbe conexiones y formularios. Cerrar, cambiar pestaña o cerrar sesión destruye iframe y medios; respuestas tardías quedan invalidadas. No cambia tarjetas, resultados, ranking, tablas, roles, perfiles ni el resto del panel de administración.

Pruebas: tests/tutoriales-admin.cjs cubre servidor, cuenta única, denegación, caché, cierre, salida y respuestas tardías; verifica payload y sintaxis cuando el archivo privado está presente. Regresiones career-close y profile-public-ranking correctas. RPC existente comprobada para cuenta ajena (false); cuenta propietaria identificada en FAFG admins. Revisión visual del logo en cuadros 1080×1920 y duraciones por ffprobe. Pendiente verificación desde sesión real de Luciano en iPhone; no se tomó ni se solicitó su sesión. Publicación autorizada para esta prueba privada por pedido expreso del usuario.


Publicación de tutoriales privados comprobada — 14/11/2026: autorización explícita del usuario y PR #20 fusionado en 00ab5f7f8e4f6abb23d975cfa56624839918bbc3. Pages run 43596686423 completado con success. app.html devuelve 200 e incluye el módulo; tutoriales-admin.js devuelve 200 e idénticos bytes a la fuente probada. Payload privado preview.ts devuelve 404 desde Pages. Función ACTIVE v1 con JWT habilitado, rechazo anónimo 401, RPC propietario true y cuenta ajena false. Se mantiene pendiente la revisión desde la sesión real de Luciano en iPhone; no se accedió ni solicitó su sesión.


## Tutoriales aprobados en Ayuda — 14/11/2026

Luciano revisó la vista previa en su iPhone, la aprobó y pidió trasladarla a Ayuda para todos, reemplazando «¿Cómo uso la Tarjeta Digital?». Se conserva exactamente el contenido de los dos videos con logos oficiales y la práctica aprobada. Se reemplaza esa explicación de texto por un único acceso a los videos. Se retira el script que insertaba el acceso privado en el perfil; no queda duplicado.

La guía pública autónoma ayuda-tarjeta-digital.html contiene los mismos medios embebidos y el mismo aislamiento de práctica, sin depender de la cuenta ni de la función privada. El modal vuelve a Ayuda y destruye el iframe para detener la reproducción; también al cambiar de pestaña. Se eliminan las leyendas de vista previa privada. No cambia el inicio de sesión, panel de administrador, tarjetas, scores, rankings ni resultados oficiales. La función privada anterior permanece como respaldo, sin enlaces desde la app.

Pruebas previstas: acceso sin sesión desde Ayuda, reapertura, cierre y cambio de pestaña; integridad de ambos videos respecto de la vista aprobada; compilación de guía y regresiones de carrera/ranking. Publicación para todos autorizada por el pedido expreso de trasladar los videos aprobados a Ayuda.


## Globo de tarjeta en Ayuda — 14/11/2026

Pedido de Luciano: igualar el acceso de Tarjeta Digital a las demás tarjetas de Ayuda. Se elimina la clase home-link que duplicaba el fondo transparente dentro del globo y se reutilizan h2 y p de las demás tarjetas. El botón completo conserva apertura del modal y flecha, con fondo transparente, sin borde ni padding extra. Videos, logos oficiales dentro de la guía y práctica sin cambios. Se actualiza la versión del script para renovar caché.

Validación: tests/tutoriales-ayuda.cjs y git diff --check correctos. Comparación estática: mismo contenedor card y mismos h2/p; sin clase home-link interna. Revisión visual automática no disponible porque falta el ejecutable de Chromium; pendiente revisión en iPhone.


## Torneos dentro de Tarjeta digital — 16/11/2026

Pedido autorizado: Próximos torneos y Mis torneos internos a FAFG, sin abrir Ronda. Implementados en assets/js/torneos-tarjeta.js, cargado por tarjeta-digital.html. Sesión FAFG existente; catálogo público; solicitudes vinculadas al usuario, únicas por torneo. Copa de la República 2026 habilitada con cierre 3/12 20:00 Argentina. Las solicitudes quedan pendientes, sin importar formularios externos ni confirmar pagos o categorías automáticamente.

Tablas separadas fafg_eventos y fafg_inscripciones con RLS. Solo is_fafg_admin puede crear/publicar/cerrar torneos, confirmar/rechazar solicitudes y publicar salida y código de ronda. Gestión accesible desde el mismo módulo para administradores. El código vincula una ronda FAFG existente; NO crea automáticamente líneas ni asigna anotadores. Live provisional; papel oficial. Se conserva tarjeta anterior y marca Ronda.

Verificado: sintaxis JS, diff, CDN fijado responde 200; prueba transaccional con rol authenticated de alta propia, lectura propia, bloqueo de autoconfirmación y duplicado; consulta anónima del catálogo. Pruebas revertidas con ROLLBACK. RLS habilitada. Asesor sin nuevos hallazgos en estas tablas; conserva avisos históricos. Pendiente revisión visual y flujo completo con sesión real en iPhone.


### Torneos desplegable — 16/11/2026
El bloque se presenta cerrado al ingresar como «Mis torneos e inscripciones», usando details/summary y las mismas clases accordion-panel, accordion-chevron y accordion-content de los otros accesos. Flecha a la derecha y rotación al abrir; conserva las pestañas y operaciones internas. Sintaxis JS y diff verificados. Commit de interfaz 8e632d7dc9b97cbba86d42a724c2fbfa00d88bb4.


## Ícono oficial para pantalla de inicio — 16/11/2026
Se usa el símbolo pelota/bandera del archivo original assets/images/FAFG-Horizontal-2.png, sin letras, conservando colores y proporciones. Composición SVG con viewport del símbolo original, fondo azul translúcido y exportaciones PNG de 192/512; versión Apple 180 con fondo compuesto azul para compatibilidad. app.html e index.html apuntan al nuevo apple-touch-icon; ambos manifiestos usan las nuevas rutas. No modifica logos interiores. Revisión visual contra fuente y tamaños verificados. No se verificó reinstalación en dispositivo iOS real.


## Tour de Ramallo — 16/11/2026

Pedido expreso: cargar la planilla de Ramallo con el mismo diseño y proceso que Santa Fe y Sudoeste. Fuente local 000 2026 ACREDITACIONES RAMALLO.xlsm, SHA-256 4f863901360f73c947dd129f5d9fa561be4fd98b649b7cc6302077c48e05f986. Lectura de valores guardados sin ejecutar macros ni modificar el libro original.

AC1/RE1 contienen 16 jugadores y 16 tarjetas completas; AC2–AC10/RE2–RE10 sin jugadores, excluidas como plantillas vacías. Todas las sumas de 18 hoyos coinciden con SCORE, total AC y RE1. Identidades AC/RE y POSICIONES coinciden sin duplicados. Se conserva la posición y los puntos computables de POSICIONES, cotejados contra los puntos RE1; puntos de ranking se muestran por separado, sin recalcular ni publicar el Ranking Nacional.

Datos nuevos en data/tour-ramallo-2026-re1.json y data/tour-ramallo-2026-hoyos.json: únicamente campos deportivos, procedencia y hash. No se publica el XLSM, DNI, cuotas, pagos, contactos ni afiliación. Sin cambios de Supabase, perfiles o rankings existentes.

Mis tours → Tour de Ramallo: mismo encabezado/logo existente, Top Ten, ranking completo con búsqueda y paginación de 10 filas, detalle por fecha y tarjeta de ida/vuelta de 18 hoyos. Se reutiliza la estructura de Sudoeste para Ramallo; función original de Sudoeste conservada íntegra, Santa Fe conserva datos y renderizado. El overlay de Ramallo se elimina al cambiar de tour.

Verificado: 10 scripts inline compilan; extracción de 16 resultados y tarjetas reconciliada; pruebas de DOM de Top Ten, puntos de POSICIONES, 18 hoyos y total, búsqueda, paginación, volver, limpieza al cambiar de tour y regresión Santa Fe/Sudoeste. Revisión visual automatizada bloqueada: Edge no inicia en el entorno restringido (canalización del proceso cerrada). Pendiente revisión en sesión real/iPhone. Publicación autorizada por la solicitud de cargarlo igual que los tours existentes; verificar fusión y entrega Pages antes de afirmar publicado.


Publicación de Ramallo comprobada — 16/11/2026: PR #23 fusionado en 3e76a20615fe7c158a650a305f501dace67ccdaa. Pages run 43897218455 completado con success. Navegador HTTPS confirmó app.html con renderRamallo y ambos JSON publicados: 16 posiciones/resultados y 16 tarjetas de 18 hoyos, todas con suma igual a scoreTarjeta. Revisión visual dentro del perfil autenticado/iPhone pendiente; no se accedió a una sesión personal.


## Editar perfil desplegable — 16/11/2026

Pedido directo: mismo indicador de flecha que los demás botones y formulario desplegable. El acceso visible Editar perfil ocupa una fila completa con título y chevron ⌄ a la derecha, alineados como Mi carrera deportiva; la flecha gira al abrir. El formulario existente se reubica inmediatamente debajo del botón dentro de la misma grilla. Se reutilizan el manejador original de apertura/cierre y el formulario/guardado existentes. aria-controls y aria-expanded sincronizados con la visibilidad del panel, incluidos cierres programáticos. Desplazamiento al formulario solo al abrir. Datos, validaciones, autenticación y permisos sin cambios. Sintaxis y conservación del formulario verificadas; revisión visual autenticada en iPhone pendiente. Publicación autorizada por solicitud directa de aplicar el cambio.


### Corrección de tamaño de Editar perfil — 16/11/2026
El usuario aclara que solo solicitó la flecha: conservar exactamente el tamaño previo, igual a Mi credencial. Se retiran del acceso Editar perfil los estilos de fila completa, altura, padding, orientación, tipografía y ocultación de icono/subtítulo agregados en PR #24. Vuelve a heredar íntegramente las clases compartidas con Mi credencial, en la segunda columna de la grilla. Solo se agrega chevron posicionado sin ocupar espacio de layout; conserva despliegue debajo y sincronización accesible. Verificado por sustitución inversa exacta: exclusivamente cambia el bloque CSS específico; formulario y JavaScript idénticos.


## Logos oficiales en Noticias — 16/11/2026
Se reemplazan los avatares externos de Instagram por los PNG oficiales existentes de Mis tours para Ramallo, Santa Fe y Sudoeste. Archivos originales sin modificaciones, object-fit:contain sin máscara circular, dimensiones reservadas y texto alternativo. Tres PNG verificados y originales revisados visualmente. Revisión móvil automatizada no disponible por restricción del navegador local; pendiente comprobación en iPhone. Usuario autorizó explícitamente publicar el cambio. Implementado en rama fix/noticias-logos-asociaciones; verificar entrega pública tras fusionar.

## Ranking del Tour del Sudoeste — 17/11/2026

Pedido directo: incorporar la planilla adjunta manteniendo diseño y formato de Mis tours. Fuente: F6-7 FR 000 2026 ACREDITACIONES SUDOESTE (4).xlsm; SHA-256 88a7b8813295ec5d6d6ace1f737d2269f0b21e8f2cd032b932d9eb9549076adb. Lectura de valores guardados, sin ejecutar macros ni modificar el archivo.

Se incorpora data/tour-sudoeste-2026-posiciones.json con las 73 posiciones, nombres, categorías y puntos exactos de POSICIONES. La hoja contiene puntos hasta F5 y cero en F6/F7; RE6/RE7 no tienen resultados generales cargados en este archivo. Por eso se muestra explícitamente «Ranking hasta fecha 5 · Resultados hasta fecha 7». Se conservan los 296 resultados y todas las tarjetas previamente publicadas, incluidos los 100 resultados de fechas 6/7 que faltan en este archivo. Los 196 resultados de fechas 1–5 coinciden en score y puntos con la fuente, normalizando espacios finales en nombres.

El ranking usa el orden oficial de POSICIONES en lugar de sumar las siete fechas existentes. Primero Martínez Meier Germán: 417,2300396337562 puntos. Mismo Top Ten, formato de dos decimales, búsqueda por nombre/apellido, paginación de 10, detalles y tarjetas. Jugadores sin resultados individuales muestran una aclaración. Santa Fe/Ramallo conservan su implementación.

Verificado: 10 scripts inline compilan; prueba DOM de Top Ten, puntuación, 73 jugadores, búsqueda del último jugador preservando posición 73, segunda página y volver. Regresiones career-close y profile-public-ranking correctas; git diff --check correcto. Revisión visual en iPhone no realizada. Publicación autorizada por solicitud de incorporarlo a la app; verificar entrega pública antes de afirmar publicado.

## Sudoeste actualizado con F6 y F7 — 17/11/2026

Nueva planilla enviada por Luciano: F6-7 FR 000 2026 ACREDITACIONES SUDOESTE (4) (2)_.xlsm. Se reemplaza el ranking anterior por las 72 posiciones exactas de POSICIONES, ahora con puntos de las siete fechas. Primero Martínez Meier Germán 595,0988396337563; segundo Ocampo Cristian Aníbal 497,7594501967632; tercero Maier Jonatan 464,1402745336444. Se respeta la cantidad y orden del nuevo archivo, sin arrastrar filas ausentes del ranking anterior.

Se extraen nuevamente RE1–RE7 (296 resultados, 50 por cada fecha 6/7) y AC1–AC7 (255 tarjetas completas, todas con suma de hoyos igual al score). Solo campos deportivos públicos; no se publica el libro ni datos personales. Se actualizan las leyendas a ranking y resultados hasta fecha 7 y versiones de consulta para renovar caché. Diseño, Top Ten, búsqueda y paginación conservados.

Validación: 72 posiciones consecutivas cotejadas con la hoja; 10 scripts inline compilados; cantidades por fecha, total de tarjetas y regresión de ranking público correctos; git diff --check correcto. Publicación autorizada por continuación expresa del pedido. Verificar entrega pública antes de afirmar publicado; revisión visual en iPhone pendiente.

## Ayuda compacta con desplegables — 17/11/2026

Pedido expreso: acortar Ayuda usando menús desplegables y flecha a la derecha como los demás paneles. Los siete temas se presentan con details/summary nativos, cerrados al cargar, conservando el encabezado introductorio. Misma flecha ⌄ de 19 px y giro al abrir, alineada a la derecha, tipografía y fondo de las tarjetas existentes. Se oculta el marcador nativo para evitar flechas duplicadas; foco visible y uso por teclado nativos.

Todos los textos de ayuda se conservan. Tarjeta Digital también es desplegable: dentro mantiene el botón existente de videos/práctica, mismo id y funcionamiento del modal, con título Ver videos y práctica. No se cambian sus medios, aislamiento ni cierre al navegar.

Verificado: siete details sin open inicial, flechas y cuerpos presentes, listas y párrafos iguales al original; acceso único a videos; tests/tutoriales-ayuda.cjs correcto (reapertura, cierre y navegación sin sesión); diez scripts inline compilan y git diff --check correcto. Revisión visual en iPhone no realizada. Publicación autorizada por solicitud de aplicarlo en el panel de Ayuda.

## Carreras de todos los jugadores — 17/11/2026

Pedido autorizado: armar la carrera deportiva de todos los jugadores registrados en las planillas cargadas. Se agrega un directorio público en Ranking → Carreras deportivas y se conecta Mi carrera deportiva a la misma ficha, por coincidencia única del nombre deportivo vinculado. El historial anterior del perfil sigue accesible desde su ficha y como respaldo si el módulo no carga.

Fuentes públicas existentes, sin modificarlas: ranking nacional general y femenino, ranking por categorías, resultados y tarjetas de Santa Fe/Sudoeste/Ramallo, Liga Nacional y Liga 1. Las 117 posiciones de Santa Fe ya embebidas en app.html se extraen a un JSON para reutilizar exactamente la clasificación publicada. Se consulta el mismo adaptador FAFGPublishedRanking usado por la app para priorizar snapshots aprobados; los archivos existentes son respaldo. Las inscripciones o torneos sin resultados no generan participaciones.

Con archivos actuales: 343 fichas (incluyen identidades pendientes separadas), todos los nombres de 3.016 filas de entrada cubiertos y 1.366 participaciones. Las fichas incluyen ranking nacional y por categoría, puntos, HCP, clasificaciones de tour, temporada/competencia, scores, puntos de cada tipo, detalle de 18 hoyos cuando existe, resumen y evolución dentro de cada competencia. Liga 1 agrupa las tres rondas y conserva el total de RESULTADOS una sola vez. Los puntos nacionales se toman del ranking; nunca se calculan sumando las participaciones.

Identidad: coincidencia de nombre completo normalizando tildes, espacios, edad final y orden de palabras; sin aproximar apellidos ni apodos. Duplicados reales del ranking y ambiguousKeys de las planillas se mantienen por fuente para revisión (Moraleda Andrés y Pérez Fabricio). Estar en ranking general y damas NO se considera duplicidad de identidad. Solo estar en posiciones/ranking crea ficha con aviso de falta de resultados, sin ceros inventados. Liga Nacional mantiene temporada pendiente según metadata y ambas ligas conservan consulta pendiente de validación. Conflictos de tarjeta/score se señalan y excluyen de mejores rondas; no se comparan 54 hoyos con 18.

Historial vinculado: se verificaron 22 torneos y 152 resultados accesibles con rol authenticated bajo políticas existentes. No se exportan estos registros al repositorio público. Se leen únicamente durante sesión mediante el cliente de la app, consulta deportiva paginada y RLS existente. Se suman temporadas anteriores, copas y otros torneos cuando el usuario tiene acceso. Las coincidencias con planillas se muestran como referencias en una misma participación, conservando score/puntos divergentes y señalando el cotejo, sin sobrescribir fuentes. La posición del historial conserva su categoría, separada de la general de la planilla. Inconsistencias de temporada/nombre quedan pendientes. Cambio de usuario o cierre de sesión invalida datos, cancela entrega de cargas antiguas, cierra el diálogo y limpia su DOM. No se cambian permisos, tablas, autenticación ni políticas.

Verificado: tests/carreras.cjs reconcilia cobertura de nombres y resultados, tarjetas, ranking de Luciano, ausencia de F1 de Santa Fe para Luciano, agregación Liga 1, homónimos, NPT, ceros, acumulados, fuentes parciales, referencias históricas, duplicados, años contradictorios y conflictos sin sobreescritura. tests/carreras-ui.cjs comprueba directorio, búsqueda, ficha, volver/cerrar/reabrir, acceso propio, error parcial de fuente, lectura solo con sesión y limpieza al salir. Regresiones career-close, profile-public-ranking y tutoriales-ayuda correctas; scripts compilan y diff limpio. Consulta transaccional con rol authenticated confirmó acceso a 152 filas y terminó con ROLLBACK. Vista local en navegador remoto no disponible (localhost de otro host); verificar interfaz pública tras publicación. No se accedió a la sesión real de Luciano ni se modificaron datos de producción.

## Tours Serrano y BAFG y actualización de carreras — 17/11/2026

Pedido expreso de Luciano: cambiar Tour de Tandil por Tour Serrano, incorporar ambas planillas con el formato existente y sumar sus participaciones a las carreras. Se conservan los PNG oficiales existentes y la estructura de Mis tours. Se reutiliza el render de Ramallo como renderImportedTour parametrizado: mismo Top Ten, fila desplegable por jugador, puntos con dos decimales, ranking completo, buscador, páginas de diez y tarjetas de ida/vuelta. El orden y puntos provienen de POSICIONES, sin recalcularlos.

Fuentes: 000 2026 ACREDITACIONES SERRANO 5-6.xlsm y 000 2026 ACREDITACIONES BAFG.xlsm. SHA-256 y mapa de hojas/fechas constan en cada JSON exportado. El importador scripts/importar-tour-planilla.py lee valores guardados y fórmulas para verificar correspondencias, sin ejecutar macros ni alterar libros. Exporta solo campos deportivos, sin DNI, fechas de nacimiento, cuotas ni contactos.

Serrano: 45 posiciones, 78 resultados y 78 tarjetas completas coincidentes. Hay datos de tres fechas: POSICIONES enlaza F1→RE1, F2→RE2, F3→RE4 (AC4), y F4→RE3 está vacío. Se respeta esta correspondencia explícita del libro y se conserva la hoja real en las referencias de carrera. Pese al nombre del archivo 5-6, esas hojas no contienen resultados. Primero Ghezzi Marcos, 284 puntos.

BAFG: 57 posiciones, 144 resultados de RE1–RE4, más nueve participaciones con golpes/tarjeta en AC sin fila vinculada de resultados, señaladas como pendientes, sin inventar puntos ni posiciones. Total 153 participaciones y 139 tarjetas completas. Catorce NPT conservados como estado, nunca score cero. Tres diferencias entre suma por hoyo y total de acreditación: Lavallén Noelia Inés F1 (102 vs 104), Brandán Faustino F2 (68 vs 72), González Sebastián Jesús F2 (67 vs 72). Se conservan ambas fuentes, aviso visible y exclusión de mejores rondas cuando difieren. Primero Del Río Sebastián, 355,639296 puntos.

Las cinco asociaciones ya tienen posiciones y resultados. Carreras incorpora las dos fuentes, clasificaciones y registros de acreditación. Con archivos públicos actuales: 372 fichas y 1.597 participaciones (antes 343 / 1.366), siete competencias con resultados incluyendo ligas. Historial SERRANO/TANDIL y BAFG se vincula por competencia/fecha para no duplicar la participación ya importada. Se preservan las reglas de identidad, sesiones, RLS, rankings nacionales y datos anteriores. No se cambian tablas ni políticas.

Verificación: tests/carreras.cjs incluye ambas fuentes, todos sus nombres/resultados y registros, 45/57 posiciones, mapa RE4→fecha 3, nueve pendientes BAFG, tres diferencias, conservación del historial Serrano sin duplicar y regresiones de rankings/ligas/NPT. tests/tours-importados.cjs verifica Top Ten, puntos exactos, búsqueda del último jugador preservando posición, paginación, volver, formato Ramallo y aviso de discrepancia. tests/carreras-ui.cjs verifica directorio actualizado, navegación, fallo parcial, lectura por sesión y limpieza al salir. Regresiones de carrera, ranking público y Ayuda correctas; diez scripts inline compilan y diff limpio. Publicación autorizada por pedido directo de cargar ambos tours y actualizar carreras. Verificar entrega pública tras fusión; sesión real/iPhone no utilizados.

## Noticias desplegables — 17/11/2026

Pedido de Luciano: compactar Noticias conservando el título y logo oficial de cada asociación y flecha derecha como los otros paneles. Se convierten las tres noticias de Ramallo, Santa Fe y Sudoeste en details/summary nativos, cerrados al cargar. Resumen visible con logo original, asociación y título exactos; flecha ⌄ de 19 px, giro al abrir, marcador nativo oculto y foco por teclado visible. Fechas, textos y enlaces se mantienen dentro, sin modificaciones. Encabezado Noticias y torneos conservado. Estilos limitados a #noticias, sin modificar otros paneles.

Validación: comparación contra HEAD confirma tres desplegables cerrados, tres flechas y títulos, imágenes completas con sus rutas/alt, párrafos y enlaces idénticos; git diff --check y regresión de Ayuda correctos. Publicación autorizada por pedido directo. Verificar entrega pública tras fusión; no se cambian datos, logos ni permisos.

## Apertura automática de Mi carrera desde la cuenta — 17/11/2026

Incidencia reportada por Luciano: Sofía Salom entraba a Mi carrera y terminaba en el directorio debiendo buscarse. Causa comprobada: su cuenta tiene nombre completo declarado, pero aún no tiene vínculo en perfiles; el componente leía únicamente el texto transitorio «Mi perfil» de la pantalla. No se accedió a su sesión ni se modificó su cuenta.

La identidad de carrera ahora se obtiene de auth.getUser y del vínculo perfiles de ese usuario, independientemente del saludo o la carga visual. Prioridad: jugador_id vinculado cuando hay historial con ese ID; nombre deportivo del vínculo oficial; coincidencia única y exacta normalizada del nombre completo de la cuenta o proveedor. Solo como respaldo sin nombre de cuenta se usa el nombre deportivo ya mostrado (compatibilidad del historial piloto). No se usan correo, DNI ni aproximaciones de nombres para adivinar identidad. Se mantienen casos ambiguos separados y se evita que metadatos contradictorios elijan otra persona.

Mi carrera abre directamente la ficha resultante. Si la sesión falta o la identidad no alcanza para una coincidencia única, muestra un estado propio con reintento y retorno a Perfil: nunca deriva al buscador. El directorio general sigue disponible exclusivamente desde su acceso de consulta. Resolver por nombre es una comodidad para consultar la carrera; no crea una vinculación oficial, credencial, permisos ni autorización a partir de user_metadata.

Las altas nuevas incorporan Nombre y apellido completos obligatorio, guardado como nombre_completo junto con el DNI declarado existente, para permitir la identificación posterior sin buscarse. Las cuentas existentes sin nombre/vínculo suficiente siguen pendientes; no se asignan fichas al azar ni se importan DNIs a fuentes públicas. Se conservan getUser, RLS y acceso de historial existentes, invalidación al salir y protección contra entrega de solicitudes antiguas. Sin cambios de tablas, políticas, credenciales o datos de cuentas existentes.

Pruebas: resolver de Sofía con tildes y orden invertido; pantalla Mi perfil o saludo sin afectar identidad; ficha oficial prioritaria frente a otro nombre declarado; metadatos contradictorios y homónimos bloqueados; resolución por jugador_id de historial separado; sin sesión y cuentas incompletas sin buscador; conservación de directorio, sesiones y carga parcial. tests/carrera-registro-identidad.cjs prueba alta con nombre completo/DNI y rechazo de nombre incompleto mediante cliente falso, sin crear cuentas ni enviar correos. Regresiones de carreras, cierre, ranking y Ayuda correctas. Se mantiene pendiente comprobación con sesión real de Sofía/iPhone. Publicación autorizada por pedido directo y reiterado de corregir la apertura automática; verificar entrega pública antes de afirmar publicado.

## Ojo de contraseña en registro — 17/11/2026
Pedido limitado de Luciano: mostrar/ocultar contraseña al registrarse. Se añade un botón ojo dentro del campo de contraseña de alta, con type=button para no enviar el formulario, aria-label dinámico Mostrar/Ocultar contraseña y aria-pressed. Solo alterna type password/text; conserva valor, reglas y envío existentes. Ícono SVG local, área táctil 44 px, foco visible y estilos acotados al campo de registro. No cambia inicio de sesión ni otros campos.
Verificado: dos alternancias, conservación del valor, estados accesibles y botón sin envío; regresión del registro correcta y diff limpio. Publicación autorizada por pedido directo; verificar entrega pública.

## Boggie — 21/11/2026 — preparado, pendiente de publicación

Implementación en `feature/boggie-asistente`, basada en main 22fc026. Botón Jabulani de 60 px por encima de la navegación, resplandor con respeto de movimiento reducido, aviso temporal y diálogo accesible. Cuatro preguntas iniciales, consultas por texto con respuestas guiadas, dos sugerencias relacionadas y derivación a fafootgolf@gmail.com cuando no existe una respuesta verificada. Los accesos reutilizan la navegación y los documentos actuales. No hay integración con un modelo de IA ni consultas personales nuevas: no confirmar pagos, afiliación ni resultados desde Boggie.

Referencia visual: `App FAFG con asistente Boggie.png`, suministrada previamente por el usuario; utilizada como imagen con ventanas CSS para el personaje y la pelota, sin modificar logos institucionales. No se incorporan los textos del mockup a la interfaz. No se almacenan ni transmiten conversaciones; historial en memoria acotado. Service worker actualizado para incluir los archivos de Boggie.

Validación: sintaxis JavaScript y 10 consultas con sugerencias válidas comprobadas. Prueba visual automatizada pendiente: Chromium local no inicia por restricción de sockets. No se modificaron usuarios, datos, ranking ni Supabase. La revisión automática rechazó la subida a GitHub indicando que necesita autorización explícita para publicar el código y la imagen recuperada de archivos del usuario en el repositorio externo. No se subió la rama ni se publicó la app; solicitar esa autorización antes de reintentar. Próximo paso: revisar visualmente, subir rama, abrir/fusionar PR autorizado y comprobar GitHub Pages.

21/11/2026: el usuario autorizó expresamente subir el código y la imagen aprobada al repositorio y publicarlos en la app existente. Publicación en curso; comprobar Pages antes de confirmar disponibilidad.

Publicado y verificado el 21/11/2026: PR #36 fusionado, commit 1f051fbfb0665477ddbb42094ad464f64e0b8f3a. En https://fafg-rn.github.io/rn-fafg/app.html se comprobó visualmente el botón Jabulani y el personaje Boggie, las cuatro consultas iniciales, la respuesta de ranking y sus dos sugerencias, navegación efectiva a Ranking, reapertura del diálogo y derivación de una consulta no resuelta a fafootgolf@gmail.com. La prueba visual se realizó en navegador de escritorio; queda pendiente la revisión en dispositivo móvil físico. Es ayuda guiada, sin modelo generativo conectado.


## Ajuste visual Boggie — 21/11/2026
Solicitud del usuario: quitar Jabulani de la pelota del personaje, subir y usar la foto adjunta para el botón flotante y eliminar el rectángulo negro del Inicio en modo oscuro. Se agregan boggie-sin-texto.png y boggie-pelota.png, se actualiza CSS y caché PWA. La foto original se conserva sin modificaciones. La regla oscura de main queda transparente solo en Inicio. Input de Boggie conserva contraste. Publicación autorizada en el pedido; datos y navegación intactos.

## Pelota Boggie movible — 21/11/2026
Pedido final de Luciano: leve movimiento y arrastre libre. Balanceo de 3 px y 3 grados, desactivado con movimiento reducido. Pointer Events distingue toque de arrastre con umbral de 7 px, captura del puntero y cancelación; mover no abre el diálogo. Posición proporcional guardada localmente, límites de pantalla y barra inferior y ajuste al rotar/cambiar viewport. Caché PWA actualizada. Sin cambios de datos ni funciones del asistente. Publicación autorizada por pedido directo; comprobar Pages tras fusionar.

## Boggie realista aprobado — 22/11/2026
Cambio limitado al personaje y apertura del asistente: imagen aprobada original boggie-realista-aprobado.png con encuadre CSS del robot, entrada suave del diálogo, fondo y personaje, respetando prefers-reduced-motion. Pelota Jabulani, arrastre, consultas, sugerencias y navegación conservados. Caché PWA y referencias versionadas actualizadas para entregar el recurso nuevo. Sin modificaciones de otros componentes ni datos.
Validación previa: 10 respuestas y sugerencias correctas, sintaxis JS y service worker, diff limpio y vista previa del personaje completo y diálogo. Publicación autorizada explícitamente por el usuario sobre la URL existente; verificar entrega pública después del push.


## Corrección de presentación Boggie — 22/11/2026
A pedido del usuario se restaura el avatar circular de 130 × 130 px (100 × 100 px en pantallas pequeñas), con encuadre de cabeza y torso del robot 3D aprobado. Se elimina la presentación vertical de cuerpo entero y su altura adicional. Conserva animaciones, Jabulani arrastrable y funciones. La publicación anterior se verificó en Pages; esta corrección actualiza versión de recursos y caché PWA.


## Chomba FAFG de Boggie — 22/11/2026
Se reemplaza únicamente el texto BOGGIE de la chomba por FAFG en la imagen del robot. Se mantiene el encuadre circular, dimensiones, distribución, animaciones y lógica existentes. Nuevo recurso boggie-realista-fafg.png y caché PWA versionada. Edición visual inspeccionada: FAFG legible y composición conservada. Publicación solicitada en continuidad con la app existente.

## Boggie integrado al borde — 23/11/2026

Solicitud expresa de implementar y publicar únicamente la mejora visual. Se conserva el robot blanco/plateado, visor, chomba FAFG, bandera y vestimenta de la imagen vigente; nueva pose transparente sosteniendo la Jabulani y apoyando el antebrazo en el borde superior del mismo diálogo. Imagen derivada mediante edición de las referencias aprobadas, optimizada a WebP RGBA de 66.628 bytes; originales conservados. No incorpora el botón rectangular de la referencia conceptual. Es una ilustración 3D animada por capas SVG/CSS, no un modelo 3D articulado: cabeza, visor y cuerpo tienen movimientos discretos, con entrada de bienvenida y reducción de movimiento respetada. El cuerpo acompaña mínimamente los brazos; el punto de apoyo es el origen de la transformación.

Encabezado conserva 146 px, preguntas, sugerencias, respuestas, formulario, colores y navegación intactos. En altura reducida se compacta; visualViewport mantiene el formulario dentro del área visible con teclado. El botón Jabulani original y sus eventos de arrastre no se modifican. Referencias CSS/JS y caché PWA actualizadas; sin cambios de datos, usuarios, permisos ni Supabase.

Validación previa: 10 casos de respuesta y sugerencias, sintaxis JS/service worker y 10 scripts inline correctos. Vista real en Chromium con marcos 390×844 claro, 360×740 oscuro y 320×480 compacto: personaje sin superposición con consultas, formulario y cierre dentro de pantalla, sin desborde horizontal, contraste de entrada conservado. Probadas consulta de ranking/sugerencias, consulta libre sin respuesta/contacto, cierre, arrastre sin apertura accidental y reapertura. Inspección visual de postura sobre borde y transparencia. iPhone/Android físicos y teclado nativo pendientes; pruebas realizadas en navegador con dimensiones móviles. Publicación autorizada por el pedido actual; verificar entrega de Pages tras fusionar.

## Botines de Boggie — 23/11/2026

Se incorpora la imagen exacta aprobada por el usuario con Adidas Copa Mundial negros y taponcitos para sintético, transparente, 1053 × 1494 px. Conserva postura, capas SVG, animaciones, dimensiones y funciones del asistente. Se actualizan referencias y caché PWA para evitar mostrar el calzado anterior. Validación: imagen inspeccionada, geometría compatible con el SVG actual, prueba de respuestas y sintaxis JS/service worker. Publicación autorizada por continuidad del pedido; verificar despliegue de este commit en Pages.


## 2026-11-25 — Foto de inicio sin logo L1
Se reemplaza la foto de bienvenida por la imagen del usuario con el escudo L1 eliminado. Se mantienen marca FAFG, filtro y animaciones. Precarga y carga inicial apuntan al mismo archivo; caché PWA v11 incluye la foto. Publicación solicitada por el usuario; verificar despliegue del commit.


## 2026-11-27 — Compartir resultados de Ronda con amigos
- Implementado en feature/compartir-resultados-ronda; NO publicado. Cambios funcionales: c58015fd8118d8ff5f412a174557b7551b8a8b8d y 911c2f115fb946d766668dd18c52a28366f68dee.
- Botón independiente de la invitación, visible también en vista Live solo con estado finalizada. Exporta la clasificación existente completa, sin cambiar orden ni criterios de desempate: jugador, posición, línea, hoyos, golpes y diferencia con par; nombre de ronda, cancha y par total.
- PNG paginados cada 20 jugadores; preparación previa al toque para conservar activación de compartir en móvil. Alternativas: compartir texto, copiar y descarga por página. NPT identificado sin asignar posición. Sin escrituras de datos ni cambios en RLS.
- Verificado: sintaxis JS e inline; caso 3 jugadores 64/-8, 67/-5, 68/-4; gating de ronda abierta; 121 jugadores en 7 imágenes con canvas simulado, NPT y conservación de filas. No probado todavía con navegador/iPhone real ni Supabase autenticado.
- Pendiente: revisión móvil, autorización de fusión/publicación. No confundir cierre informal con validación oficial FAFG.

- 2026-11-27: Luciano autorizó explícitamente la publicación del PR #45. Revisión previa: PR fusionable, sin cambios en las tarjetas ni base de datos. Intento de QA con Playwright no ejecutable: navegadores ausentes y launcher Chromium sin binario; no afirmar prueba móvil real. Se procede con verificaciones de sintaxis/modelo previas y comprobación HTTP posterior al despliegue. Estado de publicación verificable en PR #45 y GitHub Pages.
