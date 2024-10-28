const app = document.getElementById("app");

const OGhtml = app.innerHTML;

const ADRESS = "localhost"

class Player {
    constructor(pID) {
        this.APIRoot = "http://" + ADRESS + ":8000/api/"
        this.createGameAPI = "http://" + ADRESS + ":8000/api/create_game/"
        this.pID = pID;
        this.gID = "1";
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "player" + pID + "/" + this.gID + "/";
    }

    setGameID(gameID) {
        this.gID = gameID;
        this.getGameAPI =  this.APIRoot + "get_game_state/" + gameID + "/";
        this.pInput = this.APIRoot + "player" + this.pID + "/" + this.gID + "/";
    }

    setPlayerID(playerID) {
        this.pID = playerID;
        this.pInput = this.APIRoot + "player" + playerID + "/" + this.gID + "/";
    }
}

const player = new Player('1'); 

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
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

function chooseNetwork() {
    app.innerHTML = '<p class="center"> PONG </p> \
                    <div class= "divToCenter"> \
                        <button class="chooseGameButton" id="local">Local</button> \
                    </div> \
                    <div class= "divToCenter"> \
                        <button class="chooseGameButton" id="online">Online</button> \
                    </div> \
                    <p class="center">Ceci est le chat </p> \
                    <div class="divToCenter"> \
                        <img src="img/chat.gif" /> \
                    </div>' ;
    document.getElementById('local').addEventListener("click", function() {
        chooseEnnemy();
    });
    document.getElementById('online').addEventListener("click", function() {
        launchGameHTML();
    });

}

function chooseEnnemy() {
    app.innerHTML = '<p class="center"> PONG </p> \
    <div class= "divToCenter"> \
        <button class="chooseGameButton" id="friend">Friend</button> \
    </div> \
    <div class= "divToCenter"> \
        <button class="chooseGameButton" id="bot">Bot</button> \
    </div> \
    <p class="center">Ceci est le chat </p> \
    <div class="divToCenter"> \
        <img src="img/chat.gif" /> \
    </div>' ;

    document.getElementById('friend').addEventListener("click", function() {
        launchGameHTML(false);
    });
    document.getElementById('bot').addEventListener("click", function() {
        launchGameHTML(true);
    });
}

function launchGameHTML(bot_bool) {
    fetch(player.createGameAPI,{
        method: "POST",
        body: JSON.stringify({
            Bot: bot_bool
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log("game_id = " ,json.game_id);
        player.setGameID(json.game_id);
        player2.setGameID(player.gID);
    })
    app.innerHTML = '<p class="center"> PONG </p1> \
                    <br> \
                    <div class= "divToCenter"> \
                    <p id= "score">Score P1 : 0           Score P2 : 0</p>\
                    </div> \
                    <br> \
                    <canvas id="game-field" width = "1280" height = "720"></canvas> \
                    <p class="center">Ceci est le chat </p> \
                    <div class="divToCenter"> \
                        <img src="img/chat.gif" /> \
                    </div>' ;
    
    setInterval(function() {
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
                    // ctx.clearRect(0,0,canvas.width, canvas.height);
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
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", displayHome);
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

window.addEventListener("load", renderPage);