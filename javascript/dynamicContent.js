const app = document.getElementById("app");

const OGhtml = app.innerHTML;

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
    document.getElementById('playLogo').addEventListener("click", displayGame);
}

function displayGame() {
    app.innerHTML = '<p class="center"> PONG </p> \
                    <div class= "divToCenter"> \
                        <button id="launchGameButton" >Launch Game !</button> \
                    </div> \
                    <p class="center">Ceci est le chat </p> \
                    <div class="divToCenter"> \
                        <img src="img/chat.gif" /> \
                    </div>' ;
    document.getElementById('launchGameButton').addEventListener("click", launchGame);
}

function launchGame() {
    fetch("http://localhost:8000/api/create_game/",{
        method: "POST",
    })
    .then((response) => response.json())
    .then((json) => console.log(json)); 
    app.innerHTML = '<p class="center"> PONG </p1> \
                    <canvas id="game-field" width = "1280" height = "720"></canvas> \
                    <p class="center">Ceci est le chat </p> \
                    <div class="divToCenter"> \
                        <img src="img/chat.gif" /> \
                    </div>' ;
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", displayHome);
    document.getElementById('playLogo').addEventListener("click", displayGame);
}

window.addEventListener("load", renderPage);