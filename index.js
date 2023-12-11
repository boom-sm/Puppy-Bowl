const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const state = {
    players: [],
};

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2310-fsa-et-web-pt-sf';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL + '/players');
        const result = await response.json();
        console.log(data);
        return result.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        return [];
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + '/players/' + playerId);
        const result = await response.json();
        state.players = result.data;
        return result.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL + '/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(playerObj),
        });
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        await fetch(APIURL + '/players/' + playerId, {
            method: 'DELETE',
        });
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const clearPlayersContainer = () => {
    playerContainer.innerHTML = "";
};

const createPlayerCard = (currentPlayer) => {
    const card = document.createElement("div");
    card.classList.add("card-class");
  
    const createDetailsCard = () => {
      const detailsCard = document.createElement("div");
      detailsCard.classList.add("card-class");
      detailsCard.innerHTML = `
        <img src="${currentPlayer.imageUrl}"/>
        <h3>${currentPlayer.name}</h3>
        <p>Breed: ${currentPlayer.breed}</p>
        <p>Status: ${currentPlayer.status}</p>
        <button id="return-${currentPlayer.id}" class="return-button">Return</button>
      `;
  
      detailsCard
        .querySelector(`#return-${currentPlayer.id}`)
        .addEventListener("click", () => {
          card.innerHTML = originalCardContent; // Return to the original content
        });
  
      return detailsCard;
    };
  
    const originalCardContent = `
      <img src="${currentPlayer.imageUrl}"/>
      <h3>${currentPlayer.name}</h3>
      <button class="details-button" id="details-${currentPlayer.id}">See Details</button>
      <button id="delete-${currentPlayer.id}" class="delete-button">Delete Player</button>
    `;

    card.innerHTML = originalCardContent;

  card
    .querySelector(`#delete-${currentPlayer.id}`)
    .addEventListener("click", async () => {
      try {
        await removePlayer(currentPlayer.id);
        state.players = state.players.filter(
          (player) => player.id !== currentPlayer.id
        );
        await renderAllPlayers();
      } catch (err) {
        console.log(`Error deleting player #${currentPlayer.id}:`, err);
      }
    });

  card
    .querySelector(`#details-${currentPlayer.id}`)
    .addEventListener("click", () => {
      card.innerHTML = ""; // Clear the card content
      card.appendChild(createDetailsCard()); // Append the detailed view
    });

  return card;
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
const renderAllPlayers = async (playerList) => {
  console.log(playerList);
  clearPlayersContainer();
  try {
    playerList.forEach((currentPlayer) => {
      const card = createPlayerCard(currentPlayer);
      playerContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = async () => {
    try {
      //await clearPlayersContainer();
      const newForm = document.createElement("form");
      newForm.classList.add("form-class");
      const nameInput = document.createElement("input");
      nameInput.name = "puppyName";
      const breedInput = document.createElement("input");
      breedInput.name = "breedType";
      const imgInput = document.createElement("input");
      imgInput.name = "puppyImg";
      const submitName = document.createElement("button");
      submitName.textContent = "Add Player";
  
      // creates labels for form
      const createInputLabel = (text, inputElement) => {
        const label = document.createElement("label");
        label.textContent = text;
        label.appendChild(inputElement);
        return label;
      };
  
      const nameLabel = createInputLabel("Name: ", nameInput);
      const breedLabel = createInputLabel("Breed: ", breedInput);
      const imgLabel = createInputLabel("Image URL: ", imgInput);
  
      newForm.append(
        nameLabel,
        nameInput,
        breedLabel,
        breedInput,
        imgLabel,
        imgInput,
        submitName
      );
      newPlayerFormContainer.appendChild(newForm);
    //adding event listener to form
    newForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const playerObj = {
        name: nameInput.value,
        breed: breedInput.value,
        image: imgInput.value,
      };
      try {
        await addNewPlayer(playerObj);
        location.reload();
        newForm.reset();
      } catch (err) {
        console.error("Error adding player:", err);
      }
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
    try {
      const players = await fetchAllPlayers();
      state.players = players;
      await renderAllPlayers(players);
      renderNewPlayerForm();
    } catch (err) {
      console.log("Initialization error:", err);
    }
  };
  
  init();