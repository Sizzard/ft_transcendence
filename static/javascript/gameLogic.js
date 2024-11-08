import { displayHome } from './dynamicContent.js';
import { stopHandlingGameInputs } from './input.js';
import { GameModels } from './GameModels.js';

function loadFootballNet(loader, GM) {
    return new Promise((resolve) => {
        loader.load(
            '/static/javascript/Models/football_net/scene.gltf',
            (gltf) => {
                GM.footNet_1 = gltf.scene;
                GM.footNet_1.position.x = 720 / 20;
                GM.footNet_1.position.y = 10;
                GM.footNet_1.position.z = 1280 / 10;
                GM.footNet_1.rotation.y = Math.PI / 180 * 90;
                GM.footNet_1.scale.set(10,10,13);
                GM.scene.add(GM.footNet_1);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(GM.camera.position.x,GM.camera.position.y,GM.camera.position.z);
                directionalLight.target = GM.footNet_1;
                GM.scene.add(directionalLight);
            },
            undefined,
            function(error) {
                console.log(error);
            }
        );

        loader.load(
            '/static/javascript/Models/football_net/scene.gltf',
            (gltf) => {
                GM.footNet_2 = gltf.scene;
                GM.footNet_2.position.x = 720 / 20;
                GM.footNet_2.position.y = 10;
                GM.footNet_2.position.z = 0;
                GM.footNet_2.rotation.y = Math.PI / 180 * -90;
                GM.footNet_2.scale.set(10,10,13);
                GM.scene.add(GM.footNet_2);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(GM.camera.position.x,GM.camera.position.y,GM.camera.position.z);
                directionalLight.target = GM.footNet_2;
                GM.scene.add(directionalLight);
            },
            undefined,
            function(error) {
                console.log(error);
            }
        );

        resolve();
    });

}

function loadFootball(loader, GM) {
    return new Promise((resolve, reject) => {
        loader.load(
            '/static/javascript/Models/football/scene.gltf',
            (gltf) => {
                GM.football = gltf.scene;
                GM.football.position.set(0, 0, 0);
                GM.scene.add(GM.football);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(GM.camera.position.x, GM.camera.position.y, GM.camera.position.z);
                directionalLight.target = GM.football;
                GM.scene.add(directionalLight);

                resolve(GM.football);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

function setCameraPosition(player, GM) {

    if (player.pSlot == "1") {
        GM.camera.position.x = 720 / 20;
        GM.camera.position.y = 20;
        GM.camera.position.z = -10;
    }
    else if (player.pSlot == "2") {
        GM.camera.position.x = 720 / 20;
        GM.camera.position.y = 20;
        GM.camera.position.z = 138;
    }
    else {
        GM.camera.position.x = 720 / 7;
        GM.camera.position.y = 20;
        GM.camera.position.z = 128/2;
    }
    
    GM.camera.lookAt(720/20, 0, 1280/20);
}

function loadTerrain(GM) {
    return new Promise((resolve) => {
        const textureLoader = new THREE.TextureLoader();
    const terrainTexture = textureLoader.load('/static/javascript/Models/terrain.png');

    const material = new THREE.MeshBasicMaterial({ map: terrainTexture});
    const geometry = new THREE.PlaneGeometry(720 / 10, 1280 / 10);
    GM.terrain = new THREE.Mesh(geometry, material);

    GM.terrain.rotation.x = Math.PI / 180 * -90

    GM.terrain.position.x = 720/20 - 1;
    GM.terrain.position.y = -1;
    GM.terrain.position.z = 1280/20;

    GM.scene.add(GM.terrain);

    resolve();
    });

}

async function display3DGame(player) {

    app.innerHTML =`<div class="divToCenter"> \
                        <p id="game-title"> Pong !</p> \
                    </div>`;

    window.renderer = new THREE.WebGLRenderer();

    let GM = new GameModels();
    
    document.body.appendChild(window.renderer.domElement);
    
    const black_material = new THREE.MeshBasicMaterial( {color: 'black'});

    const pad_geometry = new THREE.BoxGeometry(720/7/10, 1280/128/10, 1280/128/10);
    
    GM.player_1 = new THREE.Mesh(pad_geometry, black_material);
    GM.player_2 = new THREE.Mesh(pad_geometry, black_material);

    setCameraPosition(player, GM);
    
    const loader = new THREE.GLTFLoader();
    
    await loadFootballNet(loader, GM);
    await loadFootball(loader, GM);
    await loadTerrain(GM);
    
    GM.scene.add(GM.player_1);
    GM.scene.add(GM.player_2);
    
    window.renderer.setAnimationLoop(() => {
        window.renderer.render(GM.scene, GM.camera);
    });
    
    window.renderer.setClearColor(0x008080, 1);

    window.addEventListener( 'resize', () => {
        GM.camera.aspect = window.innerWidth / window.innerHeight;
        GM.camera.updateProjectionMatrix();

        window.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.renderer.setSize(window.innerWidth , window.innerHeight);

    player.gameStateInterval = setInterval(function() {
        fetch(player.getGameAPI)
            .then(response => response.json())
            .then(data => {
                if (data.ball_speed_x  > 0) {
                    GM.football.rotation.x += 0.1;
                }
                else {
                    GM.football.rotation.x -= 0.1;
                }
                if (data.ball_speed_y  > 0) {
                    GM.football.rotation.y = 0.1;
                }
                else {
                    GM.football.rotation.y = 0.1;
                }

                GM.player_1.position.z =  data.p1_pos_x / 10;
                GM.player_1.position.x = data.p1_pos_y / 10 + 3.3;
                GM.player_2.position.z =  data.p2_pos_x / 10;
                GM.player_2.position.x = data.p2_pos_y / 10 + 3.3;

                GM.football.position.set(data.ball_pos_y / 10, 0 ,data.ball_pos_x / 10)

                if (player.pSlot == "0") {
                    GM.camera.lookAt( GM.football.position.x, GM.football.position.y, GM.football.position.z);
                }
                else if (player.pSlot == "1") {
                    GM.camera.position.x = GM.player_1.position.x;
                    GM.camera.position.z = GM.player_1.position.z - 10;
                    GM.camera.position.y = 4;
                }
                else if (player.pSlot == "2") {
                    GM.camera.position.x = GM.player_2.position.x;
                    GM.camera.position.z = GM.player_2.position.z + 10;
                    GM.camera.position.y = 4;
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

function stop3DRendering(player, GM) {

    clearInterval(player.gameStateInterval);
    // console.log("stop3drendering called")
    if (window.renderer && window.renderer.domElement) {
        window.renderer.setAnimationLoop(null);
        // console.log("setAnim = NULL")
        if (document.body.contains(window.renderer.domElement)) {
            // console.log("removechild window.renderer.domElement");
            document.body.removeChild(window.renderer.domElement);
            GM.destructor();
        }
    }
}

export { display3DGame, stop3DRendering };