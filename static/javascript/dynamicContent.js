import { Player } from './Player.js';
import { joinRoomFetch, launchGameVSFriend, launchGameVSBot ,checkRoomAndCreateGame } from './fetch.js'

const app = document.getElementById("app");

window.renderer = null;

let player1 = new Player();

async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);

        const html = await response.text();

        app.innerHTML = html;

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

function displayHome() {
    app.innerHTML ='<h1 class="center">Accueil</h1> \
                    <p class="center">Bienvenue sur la page d\'accueil.</p> \
                    <br> \
                    <h4 class="center">Play :</h4> \
                    <div class="divToCenter"> \
                        <button class="center">\
                            <img class="imgToCenter" id="playLogo" src="/static/img/playLogo.png" /> \
                        </button> \
                    </div>' ;
    window.history.pushState(null, '', '/static/html/index.html');
    document.getElementById('playLogo').addEventListener("click", networkGameHTML);
}

async function roomLobbyGameHTML(room_id) {

    await loadHTML('/static/html/roomLobbyGame.html');

    const roomIDText = document.getElementById('roomIDText');
    if (roomIDText) {
        roomIDText.textContent = room_id;
    }

    document.getElementById('copyButton').addEventListener('click', function() {
        copyRoomID(room_id);
    });

    checkRoomAndCreateGame(player1);

}

function joinRoomGameHTML() {

    loadHTML('/static/html/joinRoomGame.html').then(() => {
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
    });
}

function chooseRoomGameHTML() {
    loadHTML("/static/html/chooseRoomGame.html").then (() => {
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
    });
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
        chooseRoomGameHTML();
    });
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", () => {
        stop3DRendering(player1);
        stopHandlingGameInputs();
        displayHome();
    });
    document.getElementById('playLogo').addEventListener("click", networkGameHTML);
}

window.addEventListener("load", renderPage);

export { displayHome };