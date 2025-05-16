const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_z4_nPfXouAPBrb5eP2u5JqNXsg1aQedaRk25l36isMLJy21nPlxeKE1GvOX75MFp5sCLXjc6BegJ/pub?output=csv";

const tableConfig = {
  headers: ["POS", "JUGADOR", "PUNTOS", "HCP", "TORNEOS", "PROCEDENCIA"],
  columns: [
    {
      key: "position",
      index: 0,
      className: "rank",
    },
    {
      key: "player",
      index: 1,
      className: "player",
    },
    {
      key: "points",
      index: 2,
      className: "points",
    },
    {
      key: "hcp",
      index: 3,
    },
    {
      key: "tournaments",
      index: 4,
    },
    {
      key: "origin",
      index: 5,
    },
  ],
};

// Theme switching functionality
function initTheme() {
  console.log("Initializing theme...");
  const themeToggle = document.getElementById("themeToggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme based on system preference
  document.body.classList.add(prefersDark ? "dark" : "light");

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
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
    $tableBody.innerHTML = ""; // Clear existing content

    // Store all rows for filtering
    window.allRows = rows.slice(1).filter((row) => row.trim());

    // Get search term from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search");

    // If there's a search term, filter the rows
    if (searchTerm) {
      const searchInput = document.getElementById("searchInput");
      searchInput.value = searchTerm;
      filterTable(searchTerm);
    } else {
      // Otherwise render all rows
      renderTableRows(window.allRows);
    }

    // Add search functionality with debounce
    const searchInput = document.getElementById("searchInput");
    const debouncedSearch = debounce(handleSearch, 300); // 300ms delay
    searchInput.addEventListener("input", debouncedSearch);

    console.log("CSV data loaded successfully");
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

// Function to handle search filtering
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  updateSearchInURL(searchTerm);
  filterTable(searchTerm);
}

// Function to update URL with search parameter
function updateSearchInURL(searchTerm) {
  const url = new URL(window.location);
  if (searchTerm) {
    url.searchParams.set("search", searchTerm);
  } else {
    url.searchParams.delete("search");
  }
  window.history.replaceState({}, "", url);
}

// Function to filter table rows
function filterTable(searchTerm) {
  const filteredRows = window.allRows.filter((row) => {
    const columns = row.split(",");
    return columns.some((column) => column.toLowerCase().includes(searchTerm));
  });
  renderTableRows(filteredRows);
}

// Function to initialize search from URL
function initSearchFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("search");
  if (searchTerm) {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = searchTerm;
  }
}

// Function to generate table headers
function generateTableHeaders() {
  const $tableHeader = document.getElementById("tableHeader");

  tableConfig.headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    $tableHeader.appendChild(th);
  });
}

// Function to render table rows
function renderTableRows(rows) {
  const $tableBody = document.querySelector(".tableContainer table tbody");
  $tableBody.innerHTML = ""; // Clear existing content

  // Check if there's a search term
  const searchInput = document.getElementById("searchInput");
  const hasSearchTerm = searchInput.value.trim().length > 0;

  rows.forEach((row, index) => {
    if (row.trim()) {
      const columns = row.split(",");
      if (columns.length > 1) {
        const tr = document.createElement("tr");

        tableConfig.columns.forEach((column, colIndex) => {
          const td = document.createElement("td");
          const div = document.createElement("div");
          div.className = "cell-content";
          
          // Create header span for mobile view
          const headerSpan = document.createElement("span");
          headerSpan.className = "mobile-header";
          headerSpan.textContent = tableConfig.headers[colIndex];
          
          // Create value span
          const valueSpan = document.createElement("span");
          valueSpan.className = "cell-value";
          
          // Add medal for top 3 positions only if there's no search term
          if (column.key === "position" && index < 3 && !hasSearchTerm) {
            const medalImg = document.createElement("img");
            medalImg.className = "medal-icon";
            medalImg.alt = `${index + 1} place medal`;
            
            // Set the appropriate medal based on position
            switch (index) {
              case 0:
                medalImg.src = "assets/icons/medal-gold.png";
                break;
              case 1:
                medalImg.src = "assets/icons/medal-silver.png";
                break;
              case 2:
                medalImg.src = "assets/icons/medal-bronze.png";
                break;
            }
            
            valueSpan.appendChild(document.createTextNode(columns[column.index]));
            valueSpan.appendChild(medalImg);
          } else {
            valueSpan.textContent = columns[column.index];
          }

          if (column.className) {
            td.className = column.className;
          }
          
          div.appendChild(headerSpan);
          div.appendChild(valueSpan);
          td.appendChild(div);
          tr.appendChild(td);
        });

        // Only wrap in mobile view
        if (window.innerWidth <= 768) {
          const mobileWrapper = document.createElement("div");
          mobileWrapper.className = "mobile-row-wrapper";
          mobileWrapper.appendChild(tr);
          $tableBody.appendChild(mobileWrapper);
        } else {
          $tableBody.appendChild(tr);
        }
      }
    }
  });
}

// Add resize listener to handle window size changes
window.addEventListener("resize", () => {
  if (window.allRows) {
    renderTableRows(window.allRows);
  }
});

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
  generateTableHeaders();
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
