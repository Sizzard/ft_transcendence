import { Player } from './Player.js';
import { joinRoomFetch, launchGameVSFriend, launchGameVSBot ,checkRoom } from './fetch.js'
import { stopHandlingGameInputs } from './input.js';

window.renderer = null;

let player1 = new Player();

async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);

        const html = await response.text();

        document.getElementById("app").innerHTML = html;

    } catch (error) {
        console.error("Failed to charge html file : ", filePath);
    }
}

async function displayHome() {

    await loadHTML('/static/html/home.html');

    document.getElementById('home').addEventListener("click", handleHomeButton);

    window.history.pushState(null, '', '/static/html/index.html');

    document.getElementById('playLogo').addEventListener("click", networkGameHTML);

}

async function roomLobbyGameHTML() {

    await loadHTML('/static/html/roomLobbyGame.html');

    const isJoined = await joinRoomFetch(player1);
    // console.log(isJoined);
    if (isJoined == true) {
        checkRoom(player1);
    }
    else {
        document.getElementById('errorMessage').innerText = "Please enter a valid Room ID.";
    }
}

function localGameHTML() {

    loadHTML('/static/html/localGame.html').then(() => {
        document.getElementById('friend').addEventListener("click", function() {
            launchGameVSFriend(player1);
        });
        document.getElementById('bot').addEventListener("click", function() {
            launchGameVSBot(player1);
        });
    });
}

async function networkGameHTML() {

    await loadHTML('/static/html/networkGame.html');

    document.getElementById('local').addEventListener("click", function() {
        localGameHTML();
    });
    document.getElementById('online').addEventListener("click", function() {
        roomLobbyGameHTML();
    });
}

function handleHomeButton() {
    stopHandlingGameInputs();
    displayHome();
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", handleHomeButton);
    document.getElementById('playLogo').addEventListener("click", networkGameHTML);
}

window.addEventListener("load", renderPage);

export { displayHome,handleHomeButton };