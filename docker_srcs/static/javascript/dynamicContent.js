import { Player } from './Player.js';
import { joinRoomFetch, launchGameVSFriend, launchGameVSBot ,checkRoomAndCreateGame, createRoom } from './fetch.js'
import { stopHandlingGameInputs } from './input.js';

window.renderer = null;

let prevURL = null;
let nextURL = null;

let player1 = new Player();

const routes = {
    "/static/html/index.html": displayHome,
    "/static/html/home.html": displayHome,
    "/static/html/networkGame.html": networkGameHTML,
    "/static/html/localGame.html": localGameHTML,
    "/static/html/chooseRoomGame.html": chooseRoomGameHTML,
    "/static/html/joinRoomGame.html": joinRoomGameHTML,
    "/static/html/roomLobbyGame.html": roomLobbyGameHTML,
    "/static/html/roomLobbyGame.html": displayGameHTML,
};

window.onbeforeunload = function() {
    window.setTimeout(function () {
        window.location = "/static/html/index.html";
    }, 0)
    window.onbeforeunload = null;
}

window.addEventListener('popstate', async (event) => {

    const pathURL = event.currentTarget.location.pathname;

    // console.log('RETOUR ARRIERE');
    // console.log("prevURL :", prevURL)
    // console.log(window.location.pathname);
    // console.log(event);

    if (prevURL == "/static/html/displayGame.html") {
        window.history.pushState("/static/html/displayGame.html", '', "/static/html/displayGame.html");
    }
    else if (routes[pathURL]) {
        await routes[pathURL]();
        window.history.pushState({path: pathURL}, '', pathURL)
    }

});

async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);

        const html = await response.text();

        document.getElementById("app").innerHTML = html;

        window.history.pushState(filePath, '', filePath);

    } catch (error) {
        console.error("Failed to charge html file : ", filePath);
    }
}

function copyRoomID(room_id) {
    navigator.clipboard.writeText(room_id).then(() => {
        const copyMessage = document.getElementById('copyMessage');
        copyMessage.style.display = "block";

        setTimeout(() => {
            copyMessage.style.display = "none";
        }, 2000);
    }).catch(error => {
        console.error("Failed to copy Room ID : ", error);
    });
}

async function displayHome() {

    const url = "/static/html/home.html";

    prevURL = url;

    await loadHTML(url);

    document.getElementById('home').addEventListener("click", handleHomeButton);

    document.getElementById('playLogo').addEventListener("click", networkGameHTML);

}

async function roomLobbyGameHTML(room_id) {

    const url = "/static/html/roomLobbyGame.html";

    prevURL = url;

    await loadHTML(url);

    const roomIDText = document.getElementById('roomIDText');
    if (roomIDText) {
        roomIDText.textContent = room_id;
    }

    document.getElementById('copyButton').addEventListener('click', function() {
        copyRoomID(room_id);
    });

    checkRoomAndCreateGame(player1);

}

async function joinRoomGameHTML() {
    const url = "/static/html/joinRoomGame.html";

    prevURL = url;

    await loadHTML(url);
    
    document.getElementById('joinRoomButton').addEventListener('click', async function() {
        const roomId = document.getElementById('roomIdInput').value;
        if (roomId) {
            const isJoined = await joinRoomFetch(player1, roomId);
            console.log(isJoined);
            if (isJoined == 200 || isJoined == 201 || isJoined == 206) {
                roomLobbyGameHTML(roomId);
            }
            else if (isJoined == 404) {
                document.getElementById('errorMessage').innerText = "Please enter a valid Room ID.";
            }
            else if (isJoined == 400) {
                document.getElementById('errorMessage').innerText = "You are already in a Room.";
            }
        }
    });
}

async function chooseRoomGameHTML() {

    const url = "/static/html/chooseRoomGame.html";

    prevURL = url;

    await loadHTML(url);

    document.getElementById("create-room").addEventListener("click", async () => {
        const isCreated = await createRoom(player1);
        console.log(isCreated);
        if (isCreated == 201 || isCreated == 206) {
            const isJoined = await joinRoomFetch(player1, player1.gID);
            console.log(isJoined);
                if (isJoined == 200 || isJoined == 206) 
                    roomLobbyGameHTML(player1.gID);
        }
        else {
            document.getElementById('errorMessage').innerText = "Player already in a Room.";
            setTimeout(() => {
                document.getElementById('errorMessage').innerText = ""
            }, 2000);
        }
    });
    document.getElementById('join-room').addEventListener("click", function() {
        joinRoomGameHTML();
    });
}

async function localGameHTML() {

    const url = "/static/html/localGame.html";

    prevURL = url;

    await loadHTML(url);

    document.getElementById('friend').addEventListener("click", async function() {
        await displayGameHTML();
        launchGameVSFriend(player1);
    });
    document.getElementById('bot').addEventListener("click", async function() {
        await displayGameHTML();
        launchGameVSBot(player1);
    });
}

async function networkGameHTML() {

    const url = "/static/html/networkGame.html";

    prevURL = url;

    await loadHTML(url);

    document.getElementById('local').addEventListener("click", function() {
        localGameHTML();
    });
    document.getElementById('online').addEventListener("click", function() {
        chooseRoomGameHTML();
    });
}

async function displayGameHTML() {

    const url = "/static/html/displayGame.html";

    prevURL = url;

    await loadHTML(url);
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

export { displayHome,handleHomeButton,displayGameHTML };