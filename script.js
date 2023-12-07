const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const cohortName = "2310-fsa-et-web-pt-sf";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * Fetches a single player from the API based on playerId.
 * @param playerId - ID of the player to fetch.
 * @returns An array of objects.
 */

const fetchAllPlayers = async () => {
  try {
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(
      `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`
    );
    const results = await response.json();
    console.log(results);
    // Implement logic to display player details in the UI
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId} details!`, err);
  }
};

/**
 * Adds a new player to the roster.
 * @param playerObj - Object containing player details.
 * @returns The newly added player.
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(
      `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Rufus",
          breed: "Irish Setter",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add new player. Status: ${response.status}`);
    }

    const newPlayer = await response.json();
    console.log("New Player Added:", newPlayer);
    // Implement logic to update UI with the new player
    return newPlayer;
  } catch (err) {
    console.error("Oops, something went wrong with adding the player!", err);
  }
};

/**
 * Removes a player from the roster based on playerId.
 * @param playerId - ID of the player to remove.
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(
      `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/${playerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to remove player #${playerId}. Status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log(result);
    // Implement logic to update UI after removing the player
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Renders all players to the DOM.
 * @param playerList - Array of player objects.
 */
const renderAllPlayers = (playerList) => {
  try {
    let playerContainerHTML = "";

    playerList.forEach((player) => {
      const playerHTML = `
                <div class="player-card">
                    <h3>${player.name}</h3>
                    <p>Position: ${player.breed}</p>
                    <!-- Add other player details as needed -->

                    <button class="details-button" data-player-id="${player.id}">See details</button>
                    <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
                </div>
            `;

      playerContainerHTML += playerHTML;
    });

    playerContainer.innerHTML = playerContainerHTML;

    document.querySelectorAll(".details-button").forEach((button) => {
      button.addEventListener("click", () => {
        const playerId = button.dataset.playerId;
        fetchSinglePlayer(playerId);
      });
    });

    document.querySelectorAll(".remove-button").forEach((button) => {
      button.addEventListener("click", () => {
        const playerId = button.dataset.playerId;
        removePlayer(playerId);
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * Renders a form to the DOM for adding a new player.
 */
const renderNewPlayerForm = () => {
  try {
    const formHTML = `
    <form id="newPlayerForm">
    <label for="playerName">Name:</label>
    <input type="text" id="playerName" name="playerName" required>

    <label for="playerBreed">Breed:</label>
    <input type="text" id="playerBreed" name="playerBreed" required>

    <button type="submit">Add Player</button>
    </form>
        `;
    newPlayerFormContainer.innerHTML = formHTML;

    const newPlayerForm = document.getElementById("newPlayerForm");
    newPlayerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const playerName = document.getElementById("playerName").value;
        const playerBreed = document.getElementById("playerBreed").value;
    
        const playerObj = {
            name: playerName,
            breed: playerBreed,
        };
    
        const newPlayer = await addNewPlayer(playerObj);
        // Implement logic to update UI with the new player
    });
    
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  try {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
  } catch (err) {
    console.error("Initialization failed:", err);
  }
};

init();
