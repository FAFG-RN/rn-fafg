const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_z4_nPfXouAPBrb5eP2u5JqNXsg1aQedaRk25l36isMLJy21nPlxeKE1GvOX75MFp5sCLXjc6BegJ/pub?output=csv";


let playersList = [];

// Theme switching functionality
function initTheme() {
  console.log("Initializing theme...");
  const themeMode = document.querySelector('app-theme-mode');
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme based on system preference
  document.body.classList.add(prefersDark ? "dark" : "light");

  // Listen for theme changes from the web component
  themeMode.addEventListener('themeChange', (e) => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  });
}

// Function to load and parse CSV data
async function loadCSV() {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.text();
    const rows = data.split("\n");

    // Store all rows for filtering
    playersList = rows.slice(1).filter((row) => row.trim());

    // Get search term from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search");

    // Initialize table
    const tableComponent = document.querySelector('app-table');
    tableComponent.generateTableHeaders();
    tableComponent.setRows(playersList);

    // Initialize players list
    const playersListComponent = document.querySelector('app-players-list');
    playersListComponent.setPlayers(playersList);

    // Initialize view switching
    const switchViewComponent = document.querySelector('app-switch-view');
    switchViewComponent.addEventListener('viewChange', (e) => {
      const view = e.detail.view;
      if (view === 'table') {
        tableComponent.style.display = 'block';
        playersListComponent.style.display = 'none';
      } else {
        tableComponent.style.display = 'none';
        playersListComponent.style.display = 'block';
      }
    });

    // If there's a search term, filter the rows
    if (searchTerm) {
      tableComponent.filterTable(searchTerm);
      playersListComponent.filterPlayers(searchTerm);
    }

    // Add search event listener
    const searchComponent = document.querySelector('app-search');
    searchComponent.addEventListener('search', (e) => {
      tableComponent.filterTable(e.detail.searchTerm);
      playersListComponent.filterPlayers(e.detail.searchTerm);
    });

    console.log("CSV data loaded successfully");
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// Initialize everything when the page loads
function initializeApp() {
  console.log("Initializing application...");
  initTheme();
  loadCSV();
  console.log("Application initialized");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Fallback to window.onload
window.onload = function () {
  // Check if initialization hasn't happened yet
  if (
    !document.body.classList.contains("dark") &&
    !document.body.classList.contains("light")
  ) {
    initializeApp();
  }
};
