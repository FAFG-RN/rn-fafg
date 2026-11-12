/** Format ranking points for display without modifying the stored value. */
export function formatRankingPoints(value) {
  if (value === null || value === undefined || String(value).trim() === '') return '—';
  const normalized = String(value).trim().replace(/\s/g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number.toFixed(2) : String(value);
}
