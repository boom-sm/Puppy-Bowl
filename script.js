const playerListContainer = document.getElementById("all-players-container");
const playerContainer = document.getElementById("player-container");
const cohortName = "2310-fsa-et-web-pt-sf";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}players`);
    const responseJson = await response.json();
    const players = responseJson.data.players;
    return players;
  } catch (error) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}players/${playerId}`);
    const responseJson = await response.json();
    const player = responseJson.data.player;
    return player; // Return the player data
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


    const result = await response.json();
    console.log(result);

    //refresh the player list after adding a new player
    const updatedPlayers = await fetchAllPlayers();
    renderAllPlayers(updatedPlayers);
  } catch (err) {
    console.error("Oops, something went wrong with adding the player!", err);
  }
};

const deleteSinglePlayerById = async (playerId) => {
  try {
    const reponse = await fetch(`${APIURL}players/${playerId}`, {
      method: "DELETE"
    });
    const responseJson = await response.Json();
    const player = responseJson.data.player;
    return player;
  } catch (error) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};

//add form
const form = document.getElementById("new-player-form");

const playerName = form.elements["name"];
const playerBreed = form.elements["breed"];


const playerImageUrl = form.elements["imageUrl"];

//get the element's value:
let name = playerName.value;
let breed = playerBreed.value;


let imageUrl = playerImageUrl.value;

//show a message with a type of the input
function showMessage(input, message, type) {
  //get the small element and set the message
  const msg = input.parentNode.querySelector("small");
  msg.innerText = message;
  //update the class for the input
  input.className = type ? "sucess" : "error";
  return type;
}
function showError(input, message) {
  return showMessage(input, message, false);
}
function showSuccess(input) {
  return showMessage(input, "", true);
}
function hasValue(input, message) {
  if (input.value.trim() === "") {
    return showError(input, message);
  }
  return showSuccess(input);
}


const NAME_REQUIRED = "Enter player's name";
const BREED_REQUIRED = "Enter puppy's breed";

form.addEventListener("submit", function (event) {
  //stop form submission
  event.preventDefault();

  //validate the form
  let nameValid = hasValue(form.elements["name"], NAME_REQUIRED);
  let breedValid = hasValue(form.elements["breed"], BREED_REQUIRED);
  


  //if valid submit the form
  if (nameValid && breedValid ) {
    alert("Player submitted");
    form.submit();
    form.submit.addEventListener("load", function () {
      document
        .querySelector(id = "imageUrl")
        .addEventListener("change", function () {
          if (this.files && this.files[0]) {
            let img = document.getElementById("imageUrl"); // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            img.onload = imageIsLoaded;
          }
        });
    })
  }
}
);

const renderSinglePlayerById = async (playerId) => {
  try {
    const player = await fetchSinglePlayerById(playerId);

    // create new HTML element to display player details
    const playerDetailsElement = document.createElement("div");
    playerDetailsElement.classList.add("player");
    playerDetailsElement.innerHTML = `
      <h2>Name: ${player.name}</h2>
      <p>Id: ${player.id}</p>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <p>Team Id: ${player.teamId}</p>
      <img src=${player.imageUrl} alt="Player Image"> 
      <button class="close-button">Close</button>
    `;


    // hide the player list container
    playerListContainer.style.display = "none";

    // put the player details on the page (in the container)
    playerContainer.appendChild(playerDetailsElement);

    // add event listener to close button
    const closeButton = playerDetailsElement.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      playerContainer.appendChild(playerDetailsElement);
      window.location.href = "index.html";

    });
  } catch (error) {
    console.error(error);
  }
};

const renderAllPlayers = async (players) => {
  try {
    players.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player");
      playerElement.innerHTML = `
                <h2>${player.name}</h2>
                
                <img src="${player.imageUrl}" alt="Player Image"/>
                <button class="details-button" data-id="${player.id}">See Details</button>
                <button class="delete-button" data-id="${player.id}">Delete</button>
            `;

      playerListContainer.appendChild(playerElement);

      // see details
      const detailsButton = playerElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        // get the id
        const playerId = event.target.dataset.id;
        renderSinglePlayerById(playerId);
      });

      // delete player
      const deleteButton = playerElement.querySelector('.delete-button');
      deleteButton.addEventListener("click", async (event) => {
        // get the id
        const playerId = event.target.dataset.id;
        await deleteSinglePlayerById(playerId);
        console.log("deleted");
        event.target.closest('div.player').remove();
        
      });
      // location.reload();
    });
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  console.log(players);
};

init();