const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const state = {
    players: [],
};

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2310-fsa-et-web-pt-sf';
// Use the APIURL variable for fetch requests
const APIURL = 'https://fsa-puppy-bowl.herokuapp.com/api/2310-fsa-et-web-pt-sf/';

// Fetch players from the API
const fetchPlayers = async () => {
    try {
        const response = await fetch(APIURL + 'players');
        const result = await response.json();
        return result.data.players || [];
    } catch (error) {
        console.error('Error fetching players:', error);
        return [];
    }
};

// Fetch details of a single player
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + `players/${playerId}`);
        const result = await response.json();
        return result.data.player;
    } catch (error) {
        console.error(`Error fetching player #${playerId} details:`, error);
    }
};

// Add a new player
const addNewPlayer = async (playerObj) => {
    try {
        await fetch(APIURL + 'players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerObj),
        });
    } catch (error) {
        console.error('Error adding new player:', error);
    }
};

// Remove a player
const removePlayer = async (playerId) => {
    try {
        await fetch(APIURL + `players/${playerId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error(`Error removing player #${playerId}:`, error);
    }
};

// Clear players container
const clearPlayersContainer = () => {
    playerContainer.innerHTML = '';
};

// Create HTML card for a player
const createPlayerCard = (currentPlayer) => {
    const card = document.createElement("div");
    card.classList.add("card-class");
    card.innerHTML = `
      <img src="${currentPlayer.imageUrl}"/>
      <h3>${currentPlayer.name}</h3>
      <button class="details-button" id="details-${currentPlayer.id}">See Details</button>
      <button id="delete-${currentPlayer.id}" class="delete-button">Delete Player</button>
    `;
  
    const deleteButton = card.querySelector(`#delete-${currentPlayer.id}`);
    const detailsButton = card.querySelector(`#details-${currentPlayer.id}`);
  
    deleteButton.addEventListener("click", async () => {
      try {
        await removePlayer(currentPlayer.id);
        state.players = state.players.filter(
          (player) => player.id !== currentPlayer.id
        );
        await renderAllPlayers();
      } catch (error) {
        console.error(`Error deleting player #${currentPlayer.id}:`, error);
      }
    });
  
    detailsButton.addEventListener("click", () => {
      try {
        card.classList.add("card-class");
        card.innerHTML = `
          <img src="${currentPlayer.imageUrl}"/>
          <h3>${currentPlayer.name}</h3>
          <p>Breed: ${currentPlayer.breed}</p>
          <p>Status: ${currentPlayer.status}</p>
          <button id="return-${currentPlayer.id}" class="return-button">Return</button>
        `;
        const returnButton = card.querySelector(`#return-${currentPlayer.id}`);
        returnButton.addEventListener("click", () => {
          card.innerHTML = `
            <img src="${currentPlayer.imageUrl}"/>
            <h3>${currentPlayer.name}</h3>
            <button class="details-button" id="details-${currentPlayer.id}">See Details</button>
            <button id="delete-${currentPlayer.id}" class="delete-button">Delete Player</button>
          `;
          createPlayerCardListeners(currentPlayer, card);
        });
      } catch (error) {
        console.error(`Error showing details for player #${currentPlayer.id}:`, error);
      }
    });
  
    return card;
  };
  
  // Helper function to create event listeners for buttons in the card
  const createPlayerCardListeners = (currentPlayer, card) => {
    const deleteButton = card.querySelector(`#delete-${currentPlayer.id}`);
    const detailsButton = card.querySelector(`#details-${currentPlayer.id}`);
  
    deleteButton.addEventListener("click", async () => {
      try {
        await removePlayer(currentPlayer.id);
        state.players = state.players.filter(
          (player) => player.id !== currentPlayer.id
        );
        await renderAllPlayers();
      } catch (error) {
        console.error(`Error deleting player #${currentPlayer.id}:`, error);
      }
    });
  
    detailsButton.addEventListener("click", () => {
      try {
        card.classList.add("card-class");
        card.innerHTML = `
          <img src="${currentPlayer.imageUrl}"/>
          <h3>${currentPlayer.name}</h3>
          <p>Breed: ${currentPlayer.breed}</p>
          <p>Status: ${currentPlayer.status}</p>
          <button id="return-${currentPlayer.id}" class="return-button">Return</button>
        `;
        const returnButton = card.querySelector(`#return-${currentPlayer.id}`);
        returnButton.addEventListener("click", () => {
          card.innerHTML = `
            <img src="${currentPlayer.imageUrl}"/>
            <h3>${currentPlayer.name}</h3>
            <button class="details-button" id="details-${currentPlayer.id}">See Details</button>
            <button id="delete-${currentPlayer.id}" class="delete-button">Delete Player</button>
          `;
          createPlayerCardListeners(currentPlayer, card);
        });
      } catch (error) {
        console.error(`Error showing details for player #${currentPlayer.id}:`, error);
      }
    });
  };
  

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
// Render all players to the UI
const renderAllPlayers = async () => {
    try {
        const players = await fetchPlayers();
        clearPlayersContainer();
        players.forEach((currentPlayer) => {
            const card = createPlayerCard(currentPlayer);
            playerContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error rendering players:', error);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    const newForm = document.createElement("form");
    newForm.classList.add("form-class");
    

    const createInput = (name, label) => {
        const input = document.createElement("input");
        input.name = name;
        const inputLabel = document.createElement("label");

        inputLabel.textContent = label;
        inputLabel.appendChild(input);
        return inputLabel;
    };

    const nameInput = createInput("puppyName", "Name: ");
    const breedInput = createInput("breedType", "Breed: ");
    const imgInput = createInput("puppyImg", "Image URL: ");

    const submitButton = document.createElement("button");
    submitButton.textContent = "Add Player";

    newForm.append(nameInput, breedInput, imgInput, submitButton);
    newPlayerFormContainer.appendChild(newForm);

    newForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const playerObj = {
            name: nameInput.querySelector("input").value,
            breed: breedInput.querySelector("input").value,
            image: imgInput.querySelector("input").value,
        };

        try {
            await addNewPlayer(playerObj);
            location.reload();  // Reloading the page after adding a player
            newForm.reset();
        } catch (error) {
            console.error("Error adding player:", error);
        }
    });
};



// Initialize the application
const init = async () => {
    try {
        await renderAllPlayers();
        renderNewPlayerForm();
    } catch (error) {
        console.error('Initialization error:', error);
    }
};

// Call the initialization function
init();