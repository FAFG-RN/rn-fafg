const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_z4_nPfXouAPBrb5eP2u5JqNXsg1aQedaRk25l36isMLJy21nPlxeKE1GvOX75MFp5sCLXjc6BegJ/pub?output=csv";

// Theme switching functionality
function initTheme() {
  console.log('Initializing theme...');
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

// Function to debounce search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to load and parse CSV data
async function loadCSV() {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.text();
    const rows = data.split("\n");
    
    // Create the table body
    const $tableBody = document.querySelector(".tableContainer table tbody");
    $tableBody.innerHTML = ''; // Clear existing content

    // Store all rows for filtering
    window.allRows = rows.slice(1).filter(row => row.trim());

    // Initial render
    renderTableRows(window.allRows);

    // Add search functionality with debounce
    const searchInput = document.getElementById('searchInput');
    const debouncedSearch = debounce(handleSearch, 300); // 300ms delay
    searchInput.addEventListener('input', debouncedSearch);
    
    console.log('CSV data loaded successfully');
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

// Function to handle search filtering
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRows = window.allRows.filter(row => {
    const columns = row.split(",");
    return columns.some(column => column.toLowerCase().includes(searchTerm));
  });
  renderTableRows(filteredRows);
}

// Function to render table rows
function renderTableRows(rows) {
  const $tableBody = document.querySelector(".tableContainer table tbody");
  $tableBody.innerHTML = ''; // Clear existing content

  rows.forEach((row) => {
    if (row.trim()) {
      const columns = row.split(",");
      if (columns.length > 1) {
        const tr = document.createElement("tr");

        // Add position
        const posTd = document.createElement("td");
        posTd.className = "rank";
        posTd.textContent = columns[0];
        tr.appendChild(posTd);

        // Add player name
        const playerTd = document.createElement("td");
        playerTd.textContent = columns[1];
        tr.appendChild(playerTd);

        // Add points
        const pointsTd = document.createElement("td");
        pointsTd.className = "points";
        pointsTd.textContent = columns[2];
        tr.appendChild(pointsTd);

        // Add HCP
        const hcpTd = document.createElement("td");
        hcpTd.textContent = columns[3];
        tr.appendChild(hcpTd);

        // Add tournaments
        const tournamentsTd = document.createElement("td");
        tournamentsTd.textContent = columns[4];
        tr.appendChild(tournamentsTd);

        // Add origin
        const originTd = document.createElement("td");
        originTd.textContent = columns[5];
        tr.appendChild(originTd);

        // Add card 15
        const card15Td = document.createElement("td");
        card15Td.textContent = columns[6];
        tr.appendChild(card15Td);

        // Add points lost
        const pointsLostTd = document.createElement("td");
        pointsLostTd.textContent = columns[7];
        tr.appendChild(pointsLostTd);

        // Add card 16
        const card16Td = document.createElement("td");
        card16Td.textContent = columns[8];
        tr.appendChild(card16Td);

        $tableBody.appendChild(tr);
      }
    }
  });
}

// Initialize everything when the page loads
function initializeApp() {
  console.log('Initializing application...');
  initTheme();
  loadCSV();
  console.log('Application initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Fallback to window.onload
window.onload = function() {
  // Check if initialization hasn't happened yet
  if (!document.body.classList.contains('dark') && !document.body.classList.contains('light')) {
    initializeApp();
  }
};
