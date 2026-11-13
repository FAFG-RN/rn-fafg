# Liga Nacional: prueba de tarjetas individuales

Ubicación: Mi perfil, antes de Mis tours. El perfil vinculado determina el jugador; no hay selector de terceros en la app. La vista privada de revisión permite elegir jugadores para probar.

## Fuentes y columnas

Cinco libros XLSM aportados el 13/11/2026. Solo se leen las hojas AC/RE de las fechas nominales de cada archivo. Las hojas previas copiadas entre versiones no se suman ni duplican.

- Norte: AC1/RE1, AC2/RE2; AC3/RE3, AC4/RE4.
- Sur: AC1/RE1, AC2/RE2; AC3/RE3, AC4/RE4.
- Finales: AC5/RE5, AC6/RE6.
- Identificación deportiva y score: AC columnas E/F, fila 5 en adelante.
- Hoyos: AC M:U y W:AE; se excluyen los subtotales V/AF.
- Par de referencia: mismas columnas en fila 4.
- Clasificación general: RE B:G, vinculada por nombre normalizado único.

Lista permitida de salida: nombre, zona, número de fecha, hoyos, score, par de referencia, posición/puntos y ubicación de la fuente. No se distribuyen libros originales, DNI, contactos, pagos ni afiliación. Los identificadores privados solo se usan localmente para detectar colisiones de identidad y nunca se exportan.

## Controles y límites

500 registros: 442 tarjetas completas con suma de hoyos igual al score AC y 58 NPT. NPT y blancos no se transforman en cero. Siete registros AC/RE o referencia de par diferentes quedan por corroborar; no se los denomina errores confirmados. Una clave de nombre con identificadores de origen distintos no se vincula automáticamente. Nombre sin coincidencia exacta no implica ausencia en el torneo.

Las planillas contienen rótulos heredados de 2025 junto con referencias de 2026. No se inventan sede, fecha ni temporada. La prueba no modifica la base, las tarjetas oficiales ni el ranking. El par diferenciado de algunas salidas requiere validación.

Pruebas: sintaxis, reconciliación de 442 tarjetas, conservación de NPT y exclusión de campos privados. En navegador se comprobaron las seis fechas de Luciano, apertura de 18 hoyos, cambio de jugador, NPT y bloqueo de identidad ambigua. Integración autenticada dentro de la PWA aún pendiente; la vista de revisión prueba el mismo módulo aislado.
