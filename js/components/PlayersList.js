const $playersListTemplate = document.createElement("template");

const playersListStyle = `
  <style>
    .players-list {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1em;
    }

    .player-collapsed-content {
      width: 100%;
    }

    .player-info {
      display: grid;
      grid-template-columns: 75px 1fr 90px;
      align-items: center;
      gap: 0.2em;
    }

    .player-points {
      text-align: right;
      margin-right: 0.5em;
    }

    .player-name,
    .player-points,
    .player-position {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .player-position,
    .player-points {
      color: var(--color-alternate);
    }

    .player-info-expanded {
      display: flex;
      flex-direction: column;
      gap: 1.5em;
      padding: 1em;
    }

    .player-info-item {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-size: 1rem;
    }

    .player-info-item span:first-child {
      color: var(--color-alternate);
      font-weight: bold;
    }

    /* Styles for top 3 positions */
    app-accordion:nth-child(1) .player-points {
      font-size: 1.4rem;
    }

    app-accordion:nth-child(2) .player-points {
      font-size: 1.3rem;
    }

    app-accordion:nth-child(3) .player-points {
      font-size: 1.2rem;
    }

    @media screen and (max-width: 1024px) {
      .players-list {
        margin: 2em 0;
      }

      .player-info {
        grid-template-columns: 40px 1fr 75px;
      }

      .player-position,
      .player-name,
      .player-points {
        font-size: 0.8rem;
      }

    /* Styles for top 3 positions */
    app-accordion:nth-child(1) .player-points,
    app-accordion:nth-child(1) .player-name {
      font-size: 1rem;
    }

    app-accordion:nth-child(2) .player-points,
    app-accordion:nth-child(1) .player-name {
      font-size: 0.9rem;
    }

    app-accordion:nth-child(3) .player-points,
    app-accordion:nth-child(3) .player-name {
      font-size: 0.85rem;
    }
    }
  </style>
`;

$playersListTemplate.innerHTML =
  `
    <div class="players-list">
      <!-- Players will be dynamically added here -->
    </div>
  ` + playersListStyle;

class PlayersList extends HTMLElement {
  allPlayers = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild($playersListTemplate.content.cloneNode(true));
    this.playersList = this.shadowRoot.querySelector(".players-list");
    this.allPlayers = []; // Store all players for filtering
  }

  setPlayers(players) {
    this.allPlayers = players; // Store all players
    this.renderPlayers(players);
  }

  renderPlayers(players) {
    this.playersList.innerHTML = ""; // Clear existing content

    // Check if there's a search term
    const searchComponent = document.querySelector("app-search");
    const hasSearchTerm = searchComponent.searchTerm.length > 0;

    players.forEach((player, index) => {
      const columns = player.split(",");
      const [position, playerName, points, hcp, torneos, procedencia] = columns;

      const accordion = document.createElement("app-accordion");

      // Create collapsed content (player name)
      const collapsedContent = document.createElement("div");
      collapsedContent.slot = "collapsed";
      collapsedContent.classList.add("player-collapsed-content");

      collapsedContent.innerHTML = `
        <div class="player-info">
          <span class="player-position">${position}</span>
          <span class="player-name">${playerName}</span>
          <span class="player-points">${points}</span>
        </div>
      `;

      // Create expanded content (empty for now)
      const expandedContent = document.createElement("div");
      expandedContent.slot = "expanded";
      expandedContent.innerHTML = `
        <div class="player-info-expanded">
          <div class="player-info-item"><span>HCP:</span> <span>${hcp}</span></div>
          <div class="player-info-item"><span>Torneos:</span> <span>${torneos}</span></div>
          <div class="player-info-item"><span>Procedencia:</span> <span>${procedencia}</span></div>
        </div>
      `;


      // Add content to accordion
      accordion.appendChild(collapsedContent);
      accordion.appendChild(expandedContent);

      // Add accordion to the list
      this.playersList.appendChild(accordion);
    });
  }

  filterPlayers(searchTerm) {
    if (!searchTerm) {
      this.renderPlayers(this.allPlayers);
      return;
    }

    const filteredPlayers = this.allPlayers.filter((player) => {
      const columns = player.split(",");
      return columns.some((column) =>
        column.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    this.renderPlayers(filteredPlayers);
  }
}

customElements.define("app-players-list", PlayersList);
