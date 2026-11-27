/* Exporta la clasificación visible; no publica ni modifica tarjetas. */
(function (root) {
  const perPage = 20;
  const difference = n => n > 0 ? '+' + n : n === 0 ? 'E' : String(n);
  function model(round, rows) {
    if (round.estado !== 'finalizada') return null;
    return {
      title: round.nombre || 'Ronda con amigos',
      course: round.cancha || 'Cancha sin configurar',
      par: (round.pares || []).reduce((a, b) => a + b, 0),
      rows: rows.map((j, i) => ({ ...j, position: j.npt ? '—' : String(i + 1) })),
    };
  }
  function summary(m) {
    return ['FAFG · ' + m.title, 'Ronda finalizada · Tarjetas bloqueadas',
      m.course + ' · 18 hoyos · Par ' + m.par, '',
      ...m.rows.map(j => j.position + '. ' + j.name + ' · L' + j.line + ' · ' + j.played + '/18 · ' +
        (j.npt ? 'NPT' : j.total + ' golpes · ' + difference(j.diff))),
      '', 'Tarjeta digital informal · No constituye resultado oficial FAFG.'].join('\n');
  }
  function pages(m) {
    return Array.from({ length: Math.ceil(m.rows.length / perPage) }, (_, i) => m.rows.slice(i * perPage, (i + 1) * perPage));
  }
  async function images(m) {
    const chunks = pages(m), files = [];
    for (let index = 0; index < chunks.length; index++) {
      const rows = chunks[index], canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 360 + rows.length * 74;
      const g = canvas.getContext('2d');
      g.fillStyle = '#edf4fb'; g.fillRect(0, 0, canvas.width, canvas.height);
      g.fillStyle = '#102c53'; g.fillRect(0, 0, 1200, 210);
      function text(value, x, y, size, color, maxWidth) {
        g.fillStyle = color; g.font = '600 ' + size + 'px system-ui, sans-serif';
        g.fillText(String(value), x, y, maxWidth);
      }
      text('FAFG · RESULTADOS DE LA RONDA', 40, 52, 30, '#fff', 1120);
      text(m.title, 40, 102, 34, '#fff', 1120);
      text(m.course + ' · 18 hoyos · Par ' + m.par, 40, 148, 26, '#fff', 1120);
      text('Tarjetas bloqueadas · ' + m.rows.length + ' jugadores · Página ' + (index + 1) + '/' + chunks.length, 40, 187, 23, '#fff', 1120);
      const columns = [40, 115, 650, 750, 910, 1070];
      ['Pos.', 'Jugador', 'Línea', 'Hoyos', 'Golpes', '± Par'].forEach((v, i) => text(v, columns[i], 254, 24, '#143454'));
      rows.forEach((j, i) => {
        const y = 278 + i * 74;
        g.fillStyle = i % 2 ? '#e4eff8' : '#fff'; g.fillRect(25, y, 1150, 74);
        [j.position, j.name, j.line, j.played + '/18', j.npt ? 'NPT' : j.total, j.npt ? '—' : difference(j.diff)].forEach((v, c) => text(v, columns[c], y + 46, 26, '#143454', c === 1 ? 515 : 125));
      });
      text('Tarjeta digital informal · No constituye resultado oficial FAFG.', 40, canvas.height - 25, 22, '#5c7287', 1120);
      const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(Error('No se pudo generar la imagen')), 'image/png'));
      files.push(new File([blob], 'FAFG-resultados-' + (index + 1) + '.png', { type: 'image/png' }));
    }
    return files;
  }
  root.FAFGResults = { model, summary, pages, images };
})(typeof window === 'undefined' ? globalThis : window);
