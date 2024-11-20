import { Player } from './Player.js';
import { joinRoomFetch, launchGameVSFriend, launchGameVSBot ,checkRoomAndCreateGame } from './fetch.js'
import { stopHandlingGameInputs } from './input.js';

window.renderer = null;

let prevURL = null;  

let player1 = new Player();

const routes = {
    "/static/html/index.html": displayHome,
    "/static/html/home.html": displayHome,
    "/static/html/networkGame.html": networkGameHTML,
    "/static/html/localGame.html": localGameHTML,
    "/static/html/chooseRoomGame.html": chooseRoomGameHTML,
    "/static/html/joinRoomGame.html": joinRoomGameHTML,
    "/static/html/roomLobbyGame.html": roomLobbyGameHTML,
};

window.addEventListener('popstate', async (event) => {

    const path = event.currentTarget.location.pathname;

    console.log('RETOUR ARRIERE');
    console.log("prevURL :", prevURL)
    console.log(window.location.pathname);
    console.log(event);

    if (prevURL == "/static/html/roomLobbyGame.html") {
        window.history.pushState(null, '', "/static/html/roomLobbyGame.html");
    }
    else if (routes[path]) {
        await routes[path]();
    }

});

async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);

        const html = await response.text();

        document.getElementById("app").innerHTML = html;

        window.history.pushState(null, '', filePath);

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
            if (isJoined == true) {
                roomLobbyGameHTML(roomId);
            }
            else {
                document.getElementById('errorMessage').innerText = "Please enter a valid Room ID.";
            }
        }
    });
}

async function chooseRoomGameHTML() {

    const url = "/static/html/chooseRoomGame.html";

    prevURL = url;

    await loadHTML(url);

    document.getElementById("create-room").addEventListener("click", function() {
        fetch(player1.createRoom,{
            method: "POST",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.room_id) {
                joinRoomFetch(player1, data.room_id).then(isJoined => {
                    if (isJoined === true) {
                        roomLobbyGameHTML(data.room_id);
                    }
                    else {
                        console.log("Error while trying to join room");
                    }
                })
            }
        });
        });
    document.getElementById('join-room').addEventListener("click", function() {
        joinRoomGameHTML();
    });
}

async function localGameHTML() {

    const url = "/static/html/localGame.html";

    prevURL = url;

    await loadHTML(url);

    document.getElementById('friend').addEventListener("click", function() {
        launchGameVSFriend(player1);
    });
    document.getElementById('bot').addEventListener("click", function() {
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