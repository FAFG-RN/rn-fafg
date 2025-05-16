const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_z4_nPfXouAPBrb5eP2u5JqNXsg1aQedaRk25l36isMLJy21nPlxeKE1GvOX75MFp5sCLXjc6BegJ/pub?output=csv";

let playersList = [];
let $container = document.querySelector(".container");
let $tableComponent;
let $playersListComponent;
let $switchViewComponent;
let $searchComponent;

// Theme switching functionality
function initTheme() {
  console.log("Initializing theme...");
  const themeMode = document.querySelector("app-theme-mode");
  themeMode.initTheme();
}

function getSearchTerm() {
  // Get search term from URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search");
  return searchTerm;
}

function handleChangeView(view) {
  const existingTable = $container.querySelector("app-table");
  const existingList = $container.querySelector("app-players-list");

  const searchTerm = getSearchTerm();

  if (view === "table") {
    // Remove list if exists
    if (existingList) {
      existingList.remove();
    }

    // Create and initialize table if it doesn't exist
    if (!existingTable) {
      $tableComponent = document.createElement("app-table");
      $tableComponent.generateTableHeaders();
      $tableComponent.setRows(playersList);
      if (searchTerm) {
        $tableComponent.filterTable(searchTerm);
      }
      $container.appendChild($tableComponent);
    }
  } else {
    // Remove table if exists
    if (existingTable) {
      existingTable.remove();
    }

    // Create and initialize list if it doesn't exist
    if (!existingList) {
      $playersListComponent = document.createElement("app-players-list");
      $playersListComponent.setPlayers(playersList);
      if (searchTerm) {
        $playersListComponent.filterPlayers(searchTerm);
      }
      $container.appendChild($playersListComponent);
    }
  }
}

// Function to load and parse CSV data
async function loadCSV() {
  try {
    // Show skeleton loading state for initial list view
    $playersListComponent = document.querySelector("app-players-list");
    $playersListComponent.showSkeleton();

    const response = await fetch(SHEET_URL);
    const data = await response.text();
    const rows = data.split("\n");

    // Store all rows for filtering
    playersList = rows.slice(1).filter((row) => row.trim());

    // Get lastUpdate from first player
    let lastUpdate = "";
    if (playersList.length > 0) {
      const firstPlayerColumns = playersList[0].split(",");
      lastUpdate = firstPlayerColumns[firstPlayerColumns.length - 1];
    }

    const lastUpdateElement = document.querySelector(".last-update");
    lastUpdateElement.textContent = `Última actualización: ${
      lastUpdate || "No disponible"
    }`;

    // Get search term from URL
    const searchTerm = getSearchTerm();

    // Initialize view switching
    $switchViewComponent = document.querySelector("app-switch-view");
    $switchViewComponent.addEventListener("viewChange", (e) => {
      handleChangeView(e.detail.view);
    });

    // Initialize players list
    $playersListComponent.setPlayers(playersList);

    // If there's a search term, filter the rows
    if (searchTerm) {
      $playersListComponent.filterPlayers(searchTerm);
    }

    // Add search event listener
    $searchComponent = document.querySelector("app-search");
    $searchComponent.addEventListener("search", (e) => {
      const activeView =
        document.querySelector("app-table") ||
        document.querySelector("app-players-list");
      if (activeView) {
        activeView.filterTable?.(e.detail.searchTerm);
        activeView.filterPlayers?.(e.detail.searchTerm);
      }
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

// Add resize listener to handle window size changes
window.addEventListener("resize", () => {
  const view =
    window.innerWidth < 1024 ? "list" : $switchViewComponent.currentView;
  $switchViewComponent.switchView(view);
});

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
