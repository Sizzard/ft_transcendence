const app = document.getElementById("app");

const OGhtml = app.innerHTML;

const ADRESS = "10.31.2.4"

class Player {
    constructor() {
        this.APIRoot = "http://" + ADRESS + ":8000/api/"
        this.pID = this.requestPID();
        this.gID = "1";
        this.createGameAPI = this.APIRoot + "create_game/"
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.createRoom = this.APIRoot + "create_room/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
    }

    requestPID() {
        fetch(this.APIRoot + "request_pid/", {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            this.pID = data.player_id
        });
    }

    setGameID(gameID) {
        this.gID = gameID;
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
        this.createGameAPI = this.APIRoot + "create_game/" + this.gID + "/";
    }

}

const player = new Player();

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
                            <img class="imgToCenter" id="playLogo" src="img/playLogo.png" /> \
                        </button> \
                    </div>' ;
    window.history.pushState(null, '', '/static/index.html');
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

function chooseNetwork() {
    app.innerHTML = '<p class="center"> PONG </p> \
                    <div class= "divToCenter"> \
                        <button class="chooseGameButton" id="local">Local</button> \
                    </div> \
                    <div class= "divToCenter"> \
                        <button class="chooseGameButton" id="online">Online</button> \
                    </div>';

    document.getElementById('local').addEventListener("click", function() {
        chooseEnnemy();
    });
    document.getElementById('online').addEventListener("click", function() {
        chooseRoom();
    });

}

function roomLobby(room_id) {
    app.innerHTML = `<div class="divToCenter">
                        <p>Your Room ID is: <span id="roomIDText">${room_id}</span></p>
                    </div>
                    <div class="divToCenter">
                        <button id="copyButton" class="chooseGameButton" >Copy Room ID</button>
                        <br>
                        <p id="copyMessage" style="display: none;">Copied to clipboard!</p>
                    </div>
                        <br> <br> <br> <br> <br>\
                    <div class= "divToCenter"> \
                        <p>Waiting for an opponent</p> \
                    </div> \
                    <div class="loader"> \
                    <div class="duo duo1"> \
                        <div class="dot dot-a"></div> \
                        <div class="dot dot-b"></div> \
                    </div> \
                    <div class="duo duo2"> \
                        <div class="dot dot-a"></div> \
                        <div class="dot dot-b"></div> \
                    </div> \
                    </div>`;
    document.getElementById('copyButton').addEventListener('click', function() {
        copyRoomID(room_id);
    });

    let checkRoomInterval = setInterval(function() {
        fetch(player.checkRoom)
            .then(response => response.json())
            .then(data => {
                console.log(data.room_status)
                if (data.room_status === "OK") {
                    clearInterval(checkRoomInterval);
                    launchGameHTML();
                }
            })
            .catch(error => console.error("Error on retrieving data :", error));
    }, 1000);

}

function joinRoomFetch(playerID, room_id) {
    playerID.setGameID(room_id);
        return fetch(playerID.joinRoom, {
            method: "POST",
            "room_id": room_id,
        })
        .then(response => {
            if (response.status === 200)
            {
                return true;
            }
            else
            {
                return false;
            }
        })
        .catch(error => {
            console.error("Error on joinRoom : ", error);
            return false;
        })
}

function joinRoomPage() {
    app.innerHTML = '<div class= "divToCenter"> \
                        <h1>Join a Room</h1> \
                    </div> \
                    <div class= "divToCenter"> \
                        <input type="text" id="roomIdInput" placeholder="Enter Room ID" /> \
                    </div> \
                    <div class= "divToCenter"> \
                        <button id="joinRoomButton" class="chooseGameButton">Join Room</button> \
                    </div> \
                    <div class= "divToCenter"> \
                        <p id="errorMessage"> </p>\
                    </div>';

    document.getElementById('joinRoomButton').addEventListener('click', function() {
        const roomId = document.getElementById('roomIdInput').value;
        if (roomId) {
            joinRoomFetch(player, roomId).then(isJoined => {
                if (isJoined == true) {
                    roomLobby(roomId);
                }
                else {
                    document.getElementById('errorMessage').innerText = "Please enter a valid Room ID.";
                }
            })
        } 
    });
}

function chooseRoom() {
    app.innerHTML = '<p class="center"> PONG </p> \
                    <div class= "divToCenter"> \
                        <button class="chooseGameButton" id="create-room">Create a room</button> \
                    </div> \
                    <div class= "divToCenter"> \
                        <button class="chooseGameButton" id="join-room">Join a room</button> \
                    </div>';

    document.getElementById("create-room").addEventListener("click", function() {
        fetch(player.createRoom,{
            method: "POST",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.room_id) {
                joinRoomFetch(player, data.room_id).then(isJoined => {
                    if (isJoined === true) {
                        roomLobby(data.room_id);
                    }
                    else {
                        console.log("Error while trying to join room");
                    }
                })
            }
        });
        });
    document.getElementById('join-room').addEventListener("click", function() {
        joinRoomPage();
    });

}

async function fetchDataBot(playerID) {
    try {
        const response = await fetch(player.createRoom, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Can't create room : ${response.status}`);
        }
        const data = await response.json();
        player.setGameID(data.room_id);
        playerID.setGameID(data.room_id);
        await fetch(player.joinRoom, {
            method: "POST",
        })
        await fetch(playerID.joinRoom, {
            method: "POST",
        })
        await fetch(player.createGameAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Bot: true
            })
        })
    }
    catch (error) {
        console.log(error);
    }
}

async function fetchDataSolo(playerID) {
    try {
        const response = await fetch(player.createRoom, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Can't create room : ${response.status}`);
        }
        const data = await response.json();
        player.setGameID(data.room_id);
        playerID.setGameID(data.room_id);
        await fetch(player.joinRoom, {
            method: "POST",
        })
        await fetch(playerID.joinRoom, {
            method: "POST",
        })
        await fetch(player.createGameAPI, {
            method: "POST",
        })
    }
    catch (error) {
        console.log(error);
    }
}


async function createBotRoom() {
    const player2 = new Player();
    try {
        await fetchDataBot(player2);
        console.log("Game Created !");
    } catch (error) {
        console.log("Erreur creation game bot:", error);
    }
    return player2;
}

async function createSoloRoom() {
    const player2 = new Player();
    try {
        await fetchDataSolo(player2);
        console.log("Game Created !");
    } catch (error) {
        console.log("Erreur creation game bot:", error);
    }
    return player2;
}

function launchGameVSBot() {
    
    createBotRoom();

    displayGame();

    handleGameInput();
}

async function launchGameVSFriend() {
    
    const player2 = await createSoloRoom();
    
    handleGameInput(player2);

    displayGame();
}

function chooseEnnemy() {
    app.innerHTML = '<p class="center"> PONG </p> \
    <div class= "divToCenter"> \
        <button class="chooseGameButton" id="friend">Friend</button> \
    </div> \
    <div class= "divToCenter"> \
        <button class="chooseGameButton" id="bot">Bot</button> \
    </div>';

    document.getElementById('friend').addEventListener("click", function() {
        launchGameVSFriend();
    });
    document.getElementById('bot').addEventListener("click", function() {
        launchGameVSBot();
    });
}

function displayGame() {
    app.innerHTML = '<p class="center"> PONG </p1> \
    <br> \
    <div class= "divToCenter"> \
        <p id="score">Score P1 : 0           Score P2 : 0</p>\
    </div> \
    <br> \
    <div class= "divToCenter"> \
        <p id="errorMessage"> </p>\
    </div> \
    <canvas id="game-field" width = "1280" height = "720"></canvas>';

    let gameState = setInterval(function() {
    fetch(player.getGameAPI)
    .then(response => response.json())
    .then(data => {
        document.getElementById('score').innerText = 'Score P1 : ' + data.score_p1 + '          Score P2 : ' + data.score_p2;
        const canvas = document.getElementById('game-field');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const scaleX = canvas.width / data.width;
            const scaleY = canvas.height / data.height;
            ctx.canvas.width =  window.innerWidth / 2 ;
            ctx.canvas.height = window.innerHeight / 2;
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.p1_pos_x * scaleX, data.p1_pos_y * scaleY, data.width / 128 * scaleX, data.height / 7 * scaleY);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.p2_pos_x * scaleX, data.p2_pos_y * scaleY, data.width / 128 * scaleX, data.height / 7 * scaleY);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.ball_pos_x * scaleX, data.ball_pos_y *scaleY, data.width / 128 * scaleX, data.width /128 * scaleX);
            // ctx.fillStyle = 'red';
            // ctx.fillRect(data.p2_pos_x * scaleX, data.impact_pos_y * scaleY + (data.height / 7 * scaleX), -1000, data.width /128 * scaleX);
        }
    })
    .catch(error =>  {
        console.error("Error on retrieving Game Data", error);
        document.getElementById('errorMessage').innerText = `Error on retrieving Game Data`;
    });
    }, 33);
}

function launchGameHTML() {
    fetch(player.createGameAPI,{
        method: "POST",
        body: JSON.stringify({
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
    })

    displayGame();

    handleGameInput();
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", displayHome);
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

window.addEventListener("load", renderPage);