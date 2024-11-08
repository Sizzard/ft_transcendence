import { displayHome } from './dynamicContent.js';
import { stopHandlingGameInputs } from './input.js';

let football;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

function loadFootballNet(loader) {
    return new Promise((resolve) => {
        loader.load(
            '/static/javascript/Models/football_net/scene.gltf',
            (gltf) => {
                const footballNet = gltf.scene;
                footballNet.position.x = 720 / 20;
                footballNet.position.y = 10;
                footballNet.position.z = 1280 / 10;
                footballNet.rotation.y = Math.PI / 180 * 90;
                footballNet.scale.set(10,10,13);
                scene.add(footballNet);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(camera.position.x,camera.position.y,camera.position.z);
                directionalLight.target = footballNet;
                scene.add(directionalLight);
            },
            undefined,
            function(error) {
                console.log(error);
            }
        );

        loader.load(
            '/static/javascript/Models/football_net/scene.gltf',
            (gltf) => {
                const footballNet = gltf.scene;
                footballNet.position.x = 720 / 20;
                footballNet.position.y = 10;
                footballNet.position.z = 0;
                footballNet.rotation.y = Math.PI / 180 * -90;
                footballNet.scale.set(10,10,13);
                scene.add(footballNet);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(camera.position.x,camera.position.y,camera.position.z);
                directionalLight.target = footballNet;
                scene.add(directionalLight);
            },
            undefined,
            function(error) {
                console.log(error);
            }
        );

        resolve();
    });

}

function loadFootball(loader) {
    return new Promise((resolve, reject) => {
        loader.load(
            '/static/javascript/Models/football/scene.gltf',
            (gltf) => {
                football = gltf.scene;
                football.position.set(0, 0, 0);
                scene.add(football);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(camera.position.x, camera.position.y, camera.position.z);
                directionalLight.target = football;
                scene.add(directionalLight);

                resolve(football);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

function setCameraPosition(player) {

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
}

function loadTerrain() {
    return new Promise((resolve) => {
        const textureLoader = new THREE.TextureLoader();
    const terrainTexture = textureLoader.load('/static/javascript/Models/terrain.png');

    const material = new THREE.MeshBasicMaterial({ map: terrainTexture});
    const geometry = new THREE.PlaneGeometry(720 / 10, 1280 / 10);
    const terrain = new THREE.Mesh(geometry, material);

    terrain.rotation.x = Math.PI / 180 * -90

    terrain.position.x = 720/20 - 1;
    terrain.position.y = -1;
    terrain.position.z = 1280/20;

    scene.add(terrain);

    resolve();
    });

}

function animate() {

    window.renderer.render(scene, camera);
}

async function display3DGame(player) {

    app.innerHTML =`<div class="divToCenter"> \
                        <p id="game-title"> Pong !</p> \
                    </div>`;

    window.renderer = new THREE.WebGLRenderer();
    
    document.body.appendChild(window.renderer.domElement);
    
    const black_material = new THREE.MeshBasicMaterial( {color: 'black'});

    const pad_geometry = new THREE.BoxGeometry(720/7/10, 1280/128/10, 1280/128/10);
    
    const p1_cube = new THREE.Mesh(pad_geometry, black_material);
    const p2_cube = new THREE.Mesh(pad_geometry, black_material);

    setCameraPosition(player);
    
    const loader = new THREE.GLTFLoader();
    
    await loadFootballNet(loader);
    await loadFootball(loader);
    await loadTerrain();
    
    scene.add(p1_cube);
    scene.add(p2_cube);
    
    window.renderer.setAnimationLoop( animate );
    
    window.renderer.setClearColor(0x95F4FA, 1);

    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        window.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.renderer.setSize(window.innerWidth , window.innerHeight);

    player.gameStateInterval = setInterval(function() {
        fetch(player.getGameAPI)
            .then(response => response.json())
            .then(data => {
                p1_cube.position.z =  data.p1_pos_x / 10;
                p1_cube.position.x = data.p1_pos_y / 10 + 3.3;
                p2_cube.position.z =  data.p2_pos_x / 10;
                p2_cube.position.x = data.p2_pos_y / 10 + 3.3;

                football.position.set(data.ball_pos_y / 10, 0 ,data.ball_pos_x / 10)

                if (player.pSlot == "0") {
                    camera.lookAt( football.position.x, football.position.y, football.position.z);
                }
                else if (player.pSlot == "1") {
                    camera.position.x = p1_cube.position.x;
                    camera.position.z = p1_cube.position.z - 10;
                    camera.position.y = 4;
                }
                else if (player.pSlot == "2") {
                    camera.position.x = p2_cube.position.x;
                    camera.position.z = p2_cube.position.z + 10;
                    camera.position.y = 4;
                }

                if (data.finished == true) {
                    clearInterval(player.gameStateInterval);

                    setTimeout(() => {
                        stop3DRendering(player);
                        stopHandlingGameInputs();
                        displayHome();
                    }, 3000);
                }
            })
            .catch(error => {

                clearInterval(player.gameStateInterval);
                stop3DRendering(player);
                stopHandlingGameInputs();
                displayHome();
            });
    }, 33);    

}

function stop3DRendering(player) {

    clearInterval(player.gameStateInterval);
    // console.log("stop3drendering called")
    if (window.renderer && window.renderer.domElement) {
        window.renderer.setAnimationLoop(null);
        // console.log("setAnim = NULL")
        if (document.body.contains(window.renderer.domElement)) {
            // console.log("removechild window.renderer.domElement");
            document.body.removeChild(window.renderer.domElement);
        }
    }
}

export { display3DGame, stop3DRendering };

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
//     fetch(player1.getGameAPI)
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
