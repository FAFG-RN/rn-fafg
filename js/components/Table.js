const $tableTemplate = document.createElement("template");

const tableStyle = `
  <style>
  .table-container {
  background-color: var(--color-table-bg);
  border-radius: 0.5em;
  padding: 1.25em;
  margin: 0 1.25em;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.25em;
}

th {
  background-color: var(--color-table-header);
  font-weight: bold;
  color: var(--color-text);
  font-size: 1.1rem;
}

th:first-child {
  border-top-left-radius: 0.5em;
}

th:last-child {
  border-top-right-radius: 0.5em;
}

tr:hover {
  background-color: var(--color-table-hover);
}

tr:nth-child(even) {
  background-color: var(--color-striped);
}

tr:nth-child(odd) {
  background-color: var(--color-table-bg);
}

th, td {
  border-bottom: 0.0625em solid var(--color-border);
  padding: 1.5em 0.7em;
  color: var(--color-text);
}

.cell-content {
  text-align: center;
}

.rank {
  font-weight: bold;
  color: var(--color-primary);
  font-size: 1.1em;
  width: 100px;
}

.rank .cell-content {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.player .cell-content {
  color: var(--color-alternate);
  font-weight: bold;
  font-size: 1.1em;
}

.points .cell-content {
  color: var(--color-alternate);
  font-weight: bold;
  font-size: 1.1em;
}

.medal-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
} 
  </style>
`;

$tableTemplate.innerHTML = `
  <div class="table-container">
    <table>
      <thead>
        <tr id="tableHeader">
          <!-- Table headers will be populated by JavaScript -->
        </tr>
      </thead>
      <tbody id="tableBody">
        <!-- Table data will be populated by JavaScript -->
      </tbody>
    </table>
  </div>
` + tableStyle;

class Table extends HTMLElement {
  allRows = [];
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild($tableTemplate.content.cloneNode(true));
    
    this.tableHeader = this.shadowRoot.getElementById("tableHeader");
    this.tableBody = this.shadowRoot.getElementById("tableBody");
    
    this.tableConfig = {
      headers: ["POS", "JUGADOR", "PUNTOS", "HCP", "TORNEOS", "PROCEDENCIA"],
      columns: [
        { key: "position", index: 0, className: "rank" },
        { key: "player", index: 1, className: "player" },
        { key: "points", index: 2, className: "points" },
        { key: "hcp", index: 3 },
        { key: "tournaments", index: 4 },
        { key: "origin", index: 5 }
      ]
    };
  }

  generateTableHeaders() {
    this.tableConfig.headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      this.tableHeader.appendChild(th);
    });
  }

  renderTableRows(rows) {
    this.tableBody.innerHTML = ""; // Clear existing content

    // Check if there's a search term
    const searchComponent = document.querySelector('app-search');
    const hasSearchTerm = searchComponent.searchTerm.length > 0;

    rows.forEach((row, index) => {
      if (row.trim()) {
        const columns = row.split(",");
        if (columns.length > 1) {
          const tr = document.createElement("tr");

          this.tableConfig.columns.forEach((column, colIndex) => {
            const td = document.createElement("td");
            const divContent = document.createElement("div");
            divContent.className = "cell-content";
                                   
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
              
              divContent.appendChild(document.createTextNode(columns[column.index]));
              divContent.appendChild(medalImg);
            } else {
              divContent.textContent = columns[column.index];
            }

            if (column.className) {
              td.className = column.className;
            }
        
            td.appendChild(divContent);
            tr.appendChild(td);
          });

          this.tableBody.appendChild(tr);
        }
      }
    });
  }

  filterTable(searchTerm) {
    const filteredRows = this.allRows.filter((row) => {
      const columns = row.split(",");
      return columns.some((column) => column.toLowerCase().includes(searchTerm));
    });
    this.renderTableRows(filteredRows);
  }

  setRows(rows) {
    this.allRows = rows;
    this.renderTableRows(rows);
  }
}

window.customElements.define("app-table", Table);
