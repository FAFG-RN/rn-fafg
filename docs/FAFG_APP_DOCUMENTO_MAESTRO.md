# FAFG App — Documento maestro de continuidad
Actualizado: 2026-11-06. Proyecto privado en desarrollo. Fuente: decisiones de trabajo; confirmar contra GitHub/Supabase antes de afirmar que algo está publicado.

## Infraestructura y estado
- Repositorio: https://github.com/FAFG-RN/rn-fafg
- Rama de desarrollo: feature/panel-admin-fafg
- PR borrador: https://github.com/FAFG-RN/rn-fafg/pull/1 (NO fusionado)
- App actual: app.html, HTML/JS PWA, Supabase Auth; preservar comportamiento.
- Supabase proyecto: kkrzqxiomkorxyjlnjqc; NO incluir claves privadas en documentación.
- Cuenta administradora principal: usuario con UUID 6d2887ea-5b84-4ee3-84d4-8a88a36da00c. El usuario confirmó ejecutar admin_setup.sql y torneos_canchas.sql con respuesta Success; falta prueba extremo a extremo.
- Archivos de rama: admin.html (panel con módulos y formularios), supabase/admin_setup.sql (fafg_admins, RPC is_fafg_admin), supabase/torneos_canchas.sql (fafg_torneos, fafg_canchas, fafg_recorridos con RLS), app.html (botón condicionado a RPC en Mi perfil).
- En admin.html hay formularios para crear torneos, canchas, recorridos de 18 hoyos, editar pares y listar registros. Código guardado, NO confirmado probado ni desplegado.
- La versión pública main no se modificó. Siguiente: revisar seguridad y errores, probar flujos reales, habilitar entorno de pruebas, luego merge/publicación con autorización.
- No fusionar PR ni publicar sin confirmar pruebas; no decir que algo está disponible en app pública por estar commiteado.

## Alcance y decisiones
- Competiciones oficiales: Liga 1, Liga Nacional, Copa de la República, Copa Federación.
- Panel solo admins, dentro de Mi perfil; no alcanza ocultar botón, toda escritura debe protegerse con RLS.
- Inscripciones, afiliación y pagos: afiliados y no afiliados; cobro externo Paypertic, transferencia, efectivo, cuotas; validación administrativa manual.
- Categorías por edad al 31/12 del año de competición: Caballeros Juvenil 13–18, General 19–44, Senior 45–52, Veterano 53–60, Master 61+; Damas Juvenil 13–18, General 19–44, Senior 45+. Verificar contra normativa vigente antes de aplicar.
- Identidad única de jugador, distinguir homónimos. Rankings y fichas históricas no alterar sin validación.
- Canchas reutilizables, recorridos siempre 18 hoyos con par individual; snapshot de layout en torneo al comenzar score, histórico inmutable salvo corrección auditada.
- Rondas múltiples (p.ej. 54 hoyos en 3 rondas). Modalidades Shotgun y Tee Time.
- Líneas de salida: R1 sorteo aleatorio; R2 por score validado de primeros 18; R3 por acumulado validado de 36. Hoy agrupación por score sin separar categorías; futura opción por categoría. Empates de ordenamiento: últimos 9, 6, 3 hoyos de ronda reciente y luego ranking FAFG congelado. Tamaño habitual 3–4 jugadores configurable; cambios manuales auditados.
- Live Score: un anotador autorizado por línea carga todos los golpes hoyo a hoyo. Cada jugador lleva tarjeta en papel, única referencia oficial reglamentaria. Datos digitales provisionales hasta cotejo, corrección y publicación por administrador.
- Visualización pública en vivo, lectura sin login mediante QR/link; tablas por categoría y general, detalle hoyo a hoyo, par, diferencia, rondas y acumulado. QR público no da permisos de carga.
- Resultados oficiales se asocian a perfiles y ranking tras revisión. No asumir que resultado provisional es definitivo.
- Interfaz: azul/blanco FAFG, estética limpia, móvil primero, transparente sutil; conservar pantallas y estilos actuales.
- Ranking nacional: fuente Google Sheet y publicación controlada con botón publicar, historial y categorías; conservar identidad única.

## Método del agente
1. Antes de trabajar, revisar este documento y GitHub real; distinguir implementado, probado, desplegado y pendiente.
2. Priorizar código real y PRs verificables, mantener main estable; explicar qué cambió exactamente.
3. Nunca pedir contraseñas, tokens, service_role ni secretos; no exponer datos personales innecesarios.
4. Para cambios de esquema proporcionar SQL seguro, reversible si es posible, y políticas RLS.
5. Mantener actualizado documento maestro y checklist después de decisiones importantes; registrar fecha, commit y pendientes.
6. Si el usuario dice “retomemos FAFG App”, continuar desde el último estado verificable, sin reiniciar el diseño.


## Beneficios y panel comercial — 13/11/2026
- Decidido: desarrollar Beneficios FAFG y panel comercial, con la suscripción a ChatGPT como único gasto actual informado. No se contrataron servicios pagos.
- Rama: feature/beneficios-comercial, basada en feature/panel-admin-fafg. No fusionada ni publicada. La rama administrativa base es histórica; reconciliar con main antes de desplegar.
- Implementado en rama: beneficios.html (catálogo público con filtros y vigencia), comercial.html + comercial.js + comercial.css (admin, comercios/sponsors, borradores, vista previa/publicación/pausa, aportes, canjes, resumen y exportaciones CSV), enlace desde admin.html.
- Snapshot comercial-ciudades.json: 270 nombres únicos, 77 localidades y 8 jurisdicciones. Fuente Relevamiento_FAFG_por_ciudad.md; ranking corte 11/11/2026. Procedencia histórica, no residencia verificada ni condición de socio. CO/CB = Córdoba.
- Base aplicada: migración beneficios_comercial_v1 en FAFG APP. Tablas nuevas fafg_comercios, fafg_beneficios, fafg_aportes y fafg_comercial_historial. RLS, contactos/aportes privados; público solo beneficios publicados y vigentes. Historial por trigger en esquema privado, no editable por clientes. Sin cambios a ranking ni perfiles.
- Verificado: pruebas SQL transaccionales de CRUD administrativo, historial, restricciones de canjes, catálogo anónimo y bloqueo de usuarios no administradores: todas pasaron. Fixtures revertidos; tablas comerciales vacías. Pruebas Node de estados/vigencias, escape HTML, URLs, CSV y totales del relevamiento: pasaron.
- Revisión de seguridad: sin hallazgos nuevos relativos a estas tablas; el proyecto conserva avisos previos ajenos al módulo (funciones security definer, protección de contraseñas y tablas privadas sin políticas). No se cambiaron esos componentes.
- Pendiente: revisión visual móvil y prueba extremo a extremo con sesión real; navegador no pudo abrir el servidor local. No afirmar publicado. No hay convenios ni beneficios reales cargados.
- Acceso a beneficios para socios: condiciones y acreditación manual acordadas con comercio. Sin validación automática de membresía, cupones ni seguimiento automático de clics/canjes de jugadores.
- Próximo paso: revisar interfaz, reconciliar integración con versión actual de main y agregar acceso de jugadores a beneficios.html en la app vigente; publicar solo después de pruebas y autorización.
