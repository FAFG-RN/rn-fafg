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
