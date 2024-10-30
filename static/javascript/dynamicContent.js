const app = document.getElementById("app");

const OGhtml = app.innerHTML;

const ADRESS = "made-f0Ar1s4.clusters.42paris.fr"

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
const player2 = null;

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
    app.innerHTML = `<div class= "divToCenter"> \
                        <p>Your Room ID is : ${room_id} </p> \
                    </div> \
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
            .catch(error => console.error("Erreur lors de la récupération des données :", error));
    }, 1000);

}

function joinRoomFetch(room_id) {
    player.setGameID(room_id);
        return fetch(player.joinRoom, {
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
            console.error("Erreur on joinRoom : ", error);
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
            joinRoomFetch(roomId).then(isJoined => {
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
                joinRoomFetch(data.room_id).then(isJoined => {
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

function launchGameVSBot() {
    fetch(player.createRoom,{
        method: "POST",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.room_id) {
            joinRoomFetch(data.room_id).then(isJoined => {
                if (isJoined === true) {
                    roomLobby(data.room_id);
                }
                else {
                    console.log("Error while trying to join room");
                }
            })
        }
    });
    fetch(player.createGameAPI,{
        method: "POST",
        body: JSON.stringify({
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
    })

    app.innerHTML = '<p class="center"> PONG </p1> \
    <br> \
    <div class= "divToCenter"> \
    <p id= "score">Score P1 : 0           Score P2 : 0</p>\
    </div> \
    <br> \
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
            ctx.fillRect(data.p1_pos_x * scaleX, data.p1_pos_y * scaleY, data.width / 128 * scaleX, data.height /7 * scaleY);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.p2_pos_x * scaleX, data.p2_pos_y * scaleY, data.width / 128 * scaleX, data.height /7 * scaleY);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.ball_pos_x * scaleX, data.ball_pos_y *scaleY, data.width / 128 * scaleX, data.width /128 * scaleX);
        }
    })
    .catch(error => console.error("Erreur lors de la récupération des données :", error));
    }, 33);

    game();
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
        // launchGameVSFriend();
    });
    document.getElementById('bot').addEventListener("click", function() {
        launchGameVSBot();
    });
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

    app.innerHTML = '<p class="center"> PONG </p1> \
    <br> \
    <div class= "divToCenter"> \
    <p id= "score">Score P1 : 0           Score P2 : 0</p>\
    </div> \
    <br> \
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
            ctx.fillRect(data.p1_pos_x * scaleX, data.p1_pos_y * scaleY, data.width / 128 * scaleX, data.height /7 * scaleY);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.p2_pos_x * scaleX, data.p2_pos_y * scaleY, data.width / 128 * scaleX, data.height /7 * scaleY);
            ctx.fillStyle = 'white';
            ctx.fillRect(data.ball_pos_x * scaleX, data.ball_pos_y *scaleY, data.width / 128 * scaleX, data.width /128 * scaleX);
        }
    })
    .catch(error => console.error("Erreur lors de la récupération des données :", error));
    }, 33);

    game();
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", displayHome);
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

window.addEventListener("load", renderPage);