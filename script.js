const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const cohortName = "2310-fsa-et-web-pt-sf";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}players`);
    const result = await response.json();
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}players/${playerId}`);
    const result = await response.json();
    return result.data; // Return the player data
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(playerObj)
    });

    // Assuming you might want to do something with the response
    const result = await response.json();
    console.log(result);

    // Assuming you might want to refresh the player list after adding a new player
    const updatedPlayers = await fetchAllPlayers();
    renderAllPlayers(updatedPlayers);
  } catch (err) {
    console.error("Oops, something went wrong with adding the player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    await fetch(`${APIURL}players/${playerId}`, {
      method: "DELETE"
    });

    // Assuming you might want to refresh the player list after deleting a player
    const updatedPlayers = await fetchAllPlayers();
    renderAllPlayers(updatedPlayers);

    // Implement logic to update UI after removing the player
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

const createNewPlayerForm = () => {
  try {
    const newForm = document.createElement("form");
    newForm.classList.add("form-class");

    const nameInput = document.createElement("input");
    nameInput.name = "puppyName";

    const breedInput = document.createElement("input");
    breedInput.name = "breedType";

    const imgInput = document.createElement("input");
    imgInput.name = "puppyImg";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Add Player";

    // creates labels for form
    const createInputLabel = (text, inputElement) => {
      const label = document.createElement("label");
      label.textContent = text;
      label.appendChild(inputElement);
      return label;
    };

    const nameLabel = createInputLabel("Name:", nameInput);
    const breedLabel = createInputLabel("Breed:", breedInput);
    const imgLabel = createInputLabel("Image URL:", imgInput);

    newForm.append(
      nameLabel,
      nameInput,
      breedLabel,
      breedInput,
      imgLabel,
      imgInput,
      submitButton
    );

    NewPlayerFormContainer.appendChild(newForm);

    newForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const playerObj = {
        name: nameInput.value,
        breed: breedInput.value,
        image: imgInput.value
      };
      try {
        await addNewPlayer(playerObj);
        newForm.reset();
      } catch (err) {
        console.error("Error adding player:", err);
      }
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const clearPlayersContainer = () => {
  playerContainer.innerHTML = "";
};

const createPlayerCard = (currentPlayer) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <img src="${currentPlayer.imageUrl}" alt="${currentPlayer.name}">
    <h3>${currentPlayer.name}</h3>
  `;
  return card;
};

const renderAllPlayers = async (playerList) => {
  clearPlayersContainer();
  try {
    for (let i = 0; i < playerList.length; ++i) {
      const currentPlayer = playerList[i];
      const card = createPlayerCard(currentPlayer);
      playerContainer.appendChild(card);
    }
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

const renderNewPlayerForm = () => {
  try {
    const newForm = document.createElement("form");
    newForm.classList.add("form-class");
    // ... (your existing code for creating the form)

    newForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const playerObj = {
        name: nameInput.value,
        breed: breedInput.value,
        image: imgInput.value
      };
      try {
        await addNewPlayer(playerObj);
        newForm.reset();
        // Assuming you might want to refresh the player list after adding a new player
        const updatedPlayers = await fetchAllPlayers();
        renderAllPlayers(updatedPlayers);
      } catch (err) {
        console.error("Error adding player:", err);
      }
    });

    newPlayerFormContainer.appendChild(newForm);
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  clearPlayersContainer();
  try {
    const players = await fetchAllPlayers();
    await renderAllPlayers(players);
    renderNewPlayerForm();
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

init();
