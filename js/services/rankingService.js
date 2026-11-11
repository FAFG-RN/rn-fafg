const SHEET_URL = './data/ranking-general-2026.csv';

function parseStringToNumber(position, decimal = false) {
  try {
    if (decimal) {
      return parseFloat(position).toFixed(2);
    }
    return parseInt(position, 10);
  } catch {
    return null;
  }
}

// Function to load and parse CSV data from the Google Sheet
export async function getRanking() {
  try {
    const approved = await window.FAFGPublishedRanking?.latest();
    if (approved) return { ranking: window.FAFGPublishedRanking.general(approved.payload), lastUpdate: new Date(approved.payload.updated).toLocaleDateString('es-AR') };
    const response = await fetch(SHEET_URL);
    const data = await response.text();
    const rows = data.split('\n');

    // Store all rows for filtering
    const csvParsed = rows.slice(1).filter((row) => row.trim());
    const ranking = csvParsed.map((player) => {
      const columns = player.split(',');
      const [position, name, points, hcp, tournaments, origin, card15, pointsLost, card16, changes, lastUpdate] =
        columns;

      return {
        card15: parseStringToNumber(card15, true),
        card16: parseStringToNumber(card16, true),
        columns,
        hcp: parseStringToNumber(hcp),
        lastUpdate: lastUpdate?.trim() || null,
        name: name?.trim() || '',
        origin: origin?.trim() || '',
        points: parseStringToNumber(points, true),
        pointsLost: parseStringToNumber(pointsLost, true),
        changes: parseStringToNumber(changes),
        position: parseStringToNumber(position),
        tournaments: parseStringToNumber(tournaments),
      };
    });

    // Get lastUpdate from first player - The last update column is the same value for all players
    let lastUpdate = '';

    if (ranking.length > 0) {
      lastUpdate = ranking[0].lastUpdate;
    }

    console.log('CSV data loaded and parsed successfully');
    return {
      ranking,
      lastUpdate,
    };
  } catch (error) {
    console.error('Error loading CSV:', error);
    return Promise.reject(error);
  }
}
