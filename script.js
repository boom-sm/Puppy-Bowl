const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const cohortName = '2310-fsa-et-web-pt-sf';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * Fetches a single player from the API based on playerId.
 * @param playerId - ID of the player to fetch.
 */
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch player details. Status: ${response.status}`);
        }

        const player = await response.json();
        console.log('Player Details:', player);
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
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });

        if (!response.ok) {
            throw new Error(`Failed to add new player. Status: ${response.status}`);
        }

        const newPlayer = await response.json();
        console.log('New Player Added:', newPlayer);
        // Implement logic to update UI with the new player
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding the player!', err);
    }
};

/**
 * Removes a player from the roster based on playerId.
 * @param playerId - ID of the player to remove.
 */
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to remove player. Status: ${response.status}`);
        }

        console.log(`Player #${playerId} successfully removed from the roster`);
        // Implement logic to update UI after removing the player
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};

/**
 * Renders all players to the DOM.
 * @param playerList - Array of player objects.
 */
const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';

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

        document.querySelectorAll('.details-button').forEach((button) => {
            button.addEventListener('click', () => {
                const playerId = button.dataset.playerId;
                fetchSinglePlayer(playerId);
            });
        });

        document.querySelectorAll('.remove-button').forEach((button) => {
            button.addEventListener('click', () => {
                const playerId = button.dataset.playerId;
                removePlayer(playerId);
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


export { fetchAllPlayers, fetchSinglePlayer, addNewPlayer, removePlayer, renderAllPlayers, renderNewPlayerForm };
/**
 * Renders a form to the DOM for adding a new player.
 */
const renderNewPlayerForm = () => {
    try {
        const formHTML = `
            <!-- Add your form HTML here -->
            <form id="newPlayerForm">
                <!-- Include form fields for player details -->
                <button type="submit">Add Player</button>
            </form>
        `;
        newPlayerFormContainer.innerHTML = formHTML;

        const newPlayerForm = document.getElementById('newPlayerForm');
        newPlayerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Extract player details from the form and create a playerObj
            const playerObj = {
                // Populate with form field values
            };

            const newPlayer = await addNewPlayer(playerObj);
            // Implement logic to update UI with the new player
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const init = async () => {
    try {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);

        renderNewPlayerForm();
    } catch (err) {
        console.error('Initialization failed:', err);
    }
};

init();