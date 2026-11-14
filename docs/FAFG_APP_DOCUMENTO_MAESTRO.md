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
