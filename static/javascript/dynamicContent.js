const app = document.getElementById("app");

const OGhtml = app.innerHTML;

class Player {
    constructor() {
        this.APIRoot = "http://localhost:8000/api/"
        this.GetGameAPI =  this.APIRoot.concat("get_game_state/1/");
        this.pInput = "http://localhost:8000/api/player1/";
        this.pID = "1";
        this.gID = "1";
    }
    setPlayerID(player) {
        this.pID = player;
        this.pInput = this.APIRoot.concat("player").concat(player).concat("/")
    }
}

const player = new Player(); 

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
    document.getElementById('playLogo').addEventListener("click", choosePlayer);
}

function choosePlayer() {
    app.innerHTML = '<p class="center"> PONG </p> \
                    <div class= "divToCenter"> \
                        <button class="choosePlayerButton" id="player1">Player 1</button> \
                    </div> \
                    <div class= "divToCenter"> \
                        <button class="choosePlayerButton" id="player2">Player 2</button> \
                    </div> \
                    <p class="center">Ceci est le chat </p> \
                    <div class="divToCenter"> \
                        <img src="img/chat.gif" /> \
                    </div>' ;
    document.getElementById('player1').addEventListener("click", function() {
        player.setPlayerID("1");
        console.log(player.pInput);
        launchGame();
    });
    document.getElementById('player2').addEventListener("click", function() {
        player.setPlayerID("2");
        console.log(player.pInput);
        launchGame();
    });

}

function launchGame() {
    fetch("http://localhost:8000/api/create_game/",{
        method: "POST",
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
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
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", displayHome);
    document.getElementById('playLogo').addEventListener("click", choosePlayer);
}

window.addEventListener("load", renderPage);