// Theme switching functionality
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme based on system preference
  document.body.classList.add(prefersDark ? 'dark' : 'light');
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
  });
}

// Function to load and parse CSV data
async function loadCSV() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/DavidRnR/ranking-footgolf/refs/heads/main/276RANKING%20250%2014-05-25.csv");
    const data = await response.text();
    const rows = data.split("\n");

    // Skip header rows (first 3 rows)
    const $tableBody = document.querySelector(".tableContainer table tbody");

    rows.slice(3).forEach((row) => {
      if (row.trim()) {
        const columns = row.split(",");
        if (columns.length > 1) {
          const tr = document.createElement("tr");

          // Add position
          const posTd = document.createElement("td");
          posTd.className = "rank";
          posTd.textContent = columns[1];
          tr.appendChild(posTd);

          // Add player name
          const playerTd = document.createElement("td");
          playerTd.textContent = columns[4];
          tr.appendChild(playerTd);

          // Add points
          const pointsTd = document.createElement("td");
          pointsTd.className = "points";
          pointsTd.textContent = columns[5];
          tr.appendChild(pointsTd);

          // Add HCP
          const hcpTd = document.createElement("td");
          hcpTd.textContent = columns[6];
          tr.appendChild(hcpTd);

          // Add tournaments
          const tournamentsTd = document.createElement("td");
          tournamentsTd.textContent = columns[7];
          tr.appendChild(tournamentsTd);

          // Add origin
          const originTd = document.createElement("td");
          originTd.textContent = columns[8];
          tr.appendChild(originTd);

          // Add card 15
          const card15Td = document.createElement("td");
          card15Td.textContent = columns[9];
          tr.appendChild(card15Td);

          // Add points lost
          const pointsLostTd = document.createElement("td");
          pointsLostTd.textContent = columns[10];
          tr.appendChild(pointsLostTd);

          // Add card 16
          const card16Td = document.createElement("td");
          card16Td.textContent = columns[11];
          tr.appendChild(card16Td);

          $tableBody.appendChild(tr);
        }
      }
    });
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

// Initialize everything when the page loads
function initializeApp() {
  initTheme();
  loadCSV();
}

// Single event listener for initialization
window.addEventListener('DOMContentLoaded', initializeApp);
