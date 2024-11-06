const app = document.getElementById("app");

const ADRESS = "10.31.1.5"

let renderer = null;

class Player {
    constructor() {
        this.APIRoot = "http://" + ADRESS + ":8000/api/"
        this.pID = this.requestPID();
        this.pSlot = "0";
        this.gID = "1";
        this.createGameAPI = this.APIRoot + "create_game/"
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.createRoom = this.APIRoot + "create_room/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
        this.gameStateInterval = 0;
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

let player = new Player();

function stop3DRendering() {

    clearInterval(player.gameStateInterval);

    if (renderer && renderer.domElement) {
        renderer.setAnimationLoop(null);

        if (document.body.contains(renderer.domElement)) {
            document.body.removeChild(renderer.domElement);
        }
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
                            <img class="imgToCenter" id="playLogo" src="img/playLogo.png" /> \
                        </button> \
                    </div>' ;
    window.history.pushState(null, '', '/static/index.html');
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

function roomLobby(room_id) {
    app.innerHTML = `<div class="divToCenter">
                        <p>Your Room ID is: <span id="roomIDText">${room_id}</span></p>
                    </div>
                    <div class="divToCenter">
                        <button id="copyButton" class="chooseGameButton" >Copy Room ID</button>
                    </div>
                    <div class="divToCenter">
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
                    fetch(player.createGameAPI,{
                        method: "POST",
                        body: JSON.stringify({
                        })
                    })
                    .then((response) => response.json())
                    .then((json) => {
                        console.log(json);
                    })
                    launchGameOnline();
                }
            })
            .catch(error => console.error("Error on retrieving data :", error));
    }, 1000);

}

async function joinRoomFetch(playerID, room_id) {
    playerID.setGameID(room_id);
    try {
        const response = await fetch(playerID.joinRoom, {
            method: "POST",
            "room_id": room_id,
        })
        if (response.status === 200 || response.status === 206) {
            const data = await response.json();
            if (data) {
                console.log(data.playerSlot);
                playerID.pSlot = data.playerSlot;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
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

    document.getElementById('joinRoomButton').addEventListener('click', async function() {
        const roomId = document.getElementById('roomIdInput').value;
        if (roomId) {
            isJoined = await joinRoomFetch(player, roomId).then(isJoined => {
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

    handleGameInput();

    display3DGame();
}

async function launchGameVSFriend() {
    
    const player2 = await createSoloRoom();
    
    handleGameInput(player2);

    display3DGame();
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

// function display2DGame() {
//     app.innerHTML = '<p class="center"> PONG </p1> \
//     <br> \
//     <div class= "divToCenter"> \
//         <p id="score">Score P1 : 0           Score P2 : 0</p>\
//     </div> \
//     <br> \
//     <div class= "divToCenter"> \
//         <p id="errorMessage"> </p>\
//     </div> \
//     <canvas id="game-field" width = "1280" height = "720"></canvas>';

//     let gameStateInterval = setInterval(function() {
//     fetch(player.getGameAPI)
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('score').innerText = 'Score P1 : ' + data.score_p1 + '          Score P2 : ' + data.score_p2;
//         const canvas = document.getElementById('game-field');
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             const scaleX = canvas.width / data.width;
//             const scaleY = canvas.height / data.height;
//             ctx.canvas.width =  window.innerWidth / 2 ;
//             ctx.canvas.height = window.innerHeight / 2;
//             ctx.fillStyle = 'black';
//             ctx.fillRect(0,0,canvas.width,canvas.height);
//             ctx.fillStyle = 'white';
//             ctx.fillRect(data.p1_pos_x * scaleX, data.p1_pos_y * scaleY, data.width / 128 * scaleX, data.height / 7 * scaleY);
//             ctx.fillStyle = 'white';
//             ctx.fillRect(data.p2_pos_x * scaleX, data.p2_pos_y * scaleY, data.width / 128 * scaleX, data.height / 7 * scaleY);
//             ctx.fillStyle = 'white';
//             ctx.fillRect(data.ball_pos_x * scaleX, data.ball_pos_y *scaleY, data.width / 128 * scaleX, data.width /128 * scaleX);
//             // ctx.fillStyle = 'red';
//             // ctx.fillRect(data.p2_pos_x * scaleX, data.impact_pos_y * scaleY + (data.height / 7 * scaleX), -1000, data.width /128 * scaleX);
//             if (data.finished === true) {
//                 clearInterval(gameStateInterval);
//                 ctx.font = "30px serif";
//                 ctx.direction = "ltr";
//                 ctx.fillStyle = 'white';
//                 ctx.textAlign = "center";
//                 ctx.fillText("Score :", ctx.canvas.width / 2, ctx.canvas.height / 4)
//                 ctx.fillText(`Player 1 : ${data.score_p1}  |  Player 2 : ${data.score_p2}`, ctx.canvas.width / 2, ctx.canvas.height / 3);
//                 setTimeout(() => {
//                     displayHome();
//                 }, 3000);
//             }
//         }
//     })
//     .catch(error =>  {
//         document.getElementById('errorMessage').innerText = `Error on retrieving Game Data`;
//     });
//     }, 33);

// }


function display3DGame() {

    app.innerHTML =`<div class="divToCenter"> \
                        <p id="game-title"> Pong !</p> \
                    </div>`;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    
    document.body.appendChild( renderer.domElement);
    
    const orange_material = new THREE.MeshBasicMaterial( {color: 'orange'});
    const purple_material = new THREE.MeshBasicMaterial( {color: 'purple'});

    const pad_geometry = new THREE.BoxGeometry(720/7/10, 1280/128/10, 1280/128/10);
    const ball_geometry = new THREE.SphereGeometry(1280/128/10);
    const terrain_geometry = new THREE.BoxGeometry(720/10, 0, 1280/10);
    
    const p1_cube = new THREE.Mesh(pad_geometry, purple_material);
    const p2_cube = new THREE.Mesh(pad_geometry, purple_material);

    const ball_cube = new THREE.Mesh(ball_geometry,purple_material);
    const terrain = new THREE.Mesh(terrain_geometry, orange_material);
    
    if (player.pSlot == "1") {
        camera.position.x = 720 / 20;
        camera.position.y = 20;
        camera.position.z = -10;
    }
    else if (player.pSlot == "2") {
        camera.position.x = 720 / 20;
        camera.position.y = 20;
        camera.position.z = 138;
    }
    else {
        camera.position.x = 720 / 7;
        camera.position.y = 20;
        camera.position.z = 128/2;
    }
    
    camera.lookAt(720/20, 0, 1280/20);
    
    
    terrain.position.x = 720/20 - 1;
    terrain.position.y = -1;
    terrain.position.z = 1280/20;
    
    const loader = new THREE.GLTFLoader();
    loader.load(
        '/static/javascript/Models/palm_tree/scene.gltf',
        (gltf) => {
            const model = gltf.scene;
            model.position.x = 0;
            model.position.y = 10;
            model.position.z = 1280/20;
            model.scale.set(10,10,10);
            scene.add(gltf.scene);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Intensité de 2 pour tester
            directionalLight.position.set(camera.position.x,camera.position.y,camera.position.z);
            directionalLight.target = model;
            scene.add(directionalLight);
        },
        undefined,
        function(error) {
            console.log(error);
        }
    );


    

    
    scene.add(p1_cube);
    scene.add(p2_cube);
    scene.add(ball_cube);
    scene.add(terrain);
    
    function animate() {renderer.render(scene, camera );}
    
    renderer.setAnimationLoop( animate );
    
    renderer.setClearColor(0x95F4FA, 1);

    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log("Player Slot : " ,player.pSlot);

    renderer.setSize(window.innerWidth , window.innerHeight);

    player.gameStateInterval = setInterval(function() {
        fetch(player.getGameAPI)
            .then(response => response.json())
            .then(data => {
                p1_cube.position.z =  data.p1_pos_x / 10;
                p1_cube.position.x = data.p1_pos_y / 10 + 3.3;
                p2_cube.position.z =  data.p2_pos_x / 10;
                p2_cube.position.x = data.p2_pos_y / 10 + 3.3;
                ball_cube.position.z = data.ball_pos_x / 10;
                ball_cube.position.x = data.ball_pos_y / 10;

                if (player.pSlot == "0") {
                    camera.lookAt( ball_cube.position.x, ball_cube.position.y, ball_cube.position.z);
                }

                if (data.finished == true) {
                    clearInterval(player.gameStateInterval);

                    setTimeout(() => {
                        stop3DRendering();
                        displayHome();
                    }, 3000);
                }
            })
            .catch(error => {

                clearInterval(player.gameStateInterval);
                stop3DRendering();
                displayHome();
            });
    }, 33);    

}

function launchGameOnline() {
    
    handleGameInput();

    display3DGame();
}

async function renderPage() {
    document.getElementById('home').addEventListener("click", () => {

        stop3DRendering();

        displayHome();
    });
    document.getElementById('playLogo').addEventListener("click", chooseNetwork);
}

window.addEventListener("load", renderPage);