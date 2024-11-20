import { displayHome,handleHomeButton } from './dynamicContent.js';
import { stopHandlingGameInputs } from './input.js';
import { GameModels } from './GameModels.js';

let handleResizeFnc;

function loadFootball(loader, GM) {
    return new Promise((resolve, reject) => {
        loader.load(
            '/static/javascript/Models/football/scene.gltf',
            (gltf) => {
                GM.football = gltf.scene;
                GM.football.position.set(0, 0, 0);
                GM.scene.add(GM.football);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(720 / 7, 25, 128 / 2);
                directionalLight.target = GM.football;
                GM.scene.add(directionalLight);

                const light = new THREE.AmbientLight( 0x404040 );
                GM.scene.add(light);

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

function loadFootballCourt(loader, GM) {
    return new Promise((resolve, reject) => {
        loader.load(
            '/static/javascript/Models/true_football_court/scene.gltf',
            (gltf) => {
                GM.footballCourt = gltf.scene;
                GM.footballCourt.position.set(0, 0, 0);
                GM.footballCourt.scale.set(6, 10, 6);
                GM.scene.add(GM.footballCourt);

                GM.footballCourt.rotation.y = Math.PI / 180 * -90
                GM.footballCourt.position.x = 720/20 - 1;
                GM.footballCourt.position.y = -1;
                GM.footballCourt.position.z = 1280/20;

                const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
                directionalLight.position.set(GM.camera.position.x, GM.camera.position.y, GM.camera.position.z);
                directionalLight.target = GM.footballCourt;
                GM.scene.add(directionalLight);

                resolve(GM.footballCourt);
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
        GM.camera.position.y = 25;
        GM.camera.position.z = 128/2;
    }
}

function resizeScreenGame(GM) {
    // console.log("resizing event listener called");
    // console.log(GM);
    GM.camera.aspect = window.innerWidth / window.innerHeight;
    GM.camera.updateProjectionMatrix();

    window.renderer.setSize(window.innerWidth, window.innerHeight);
}


function handleResizeGame(GM) {

    handleResizeFnc = resizeScreenGame.bind(null, GM);

    window.addEventListener('resize', handleResizeFnc);
}

function stopHandlingResizeGame(GM) {

    if (handleResizeFnc) {
        window.removeEventListener('resize', handleResizeFnc);
    }

}

async function display3DGame(player) {

    app.innerHTML =`<div class="divToCenter"> \
                        <p id="game-title"> Pong !</p> \
                    </div> \
                    <div class="divToCenter"> \
                        <p id="score"></p> \
                    </div>`;

    window.renderer = new THREE.WebGLRenderer();

    let GM = new GameModels();

    document.getElementById('home').removeEventListener("click", handleHomeButton);
    
    console.log("display3DGame called");

    document.body.appendChild(window.renderer.domElement);
    
    const black_material = new THREE.MeshBasicMaterial( {color: 'black'});
    const red_material = new THREE.MeshBasicMaterial( {color: 'red'});

    const pad_geometry = new THREE.BoxGeometry(720/7/10, 1280/128/10, 1280/128/10);
    const impact_geometry = new THREE.BoxGeometry(1280/128/10, 1280/128/10, 128);
    
    GM.player_1 = new THREE.Mesh(pad_geometry, black_material);
    GM.player_2 = new THREE.Mesh(pad_geometry, black_material);
    // GM.impact = new THREE.Mesh(impact_geometry, red_material);

    setCameraPosition(player, GM);
    
    const loader = new THREE.GLTFLoader();
    
    await loadFootballCourt(loader, GM);
    await loadFootball(loader, GM);
    
    GM.scene.add(GM.player_1);
    GM.scene.add(GM.player_2);
    // GM.scene.add(GM.impact);
    
    // console.log("RENDERING !");

    window.renderer.setAnimationLoop(() => {
        window.renderer.render(GM.scene, GM.camera);
    });
    
    window.renderer.setClearColor(0x008080, 1);

    handleResizeGame(GM);

    window.renderer.setSize(window.innerWidth , window.innerHeight);

    const ws = new WebSocket(player.ws);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(`Game State : `, data);

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

        // GM.impact.position.z = data.p1_pos_x;
        // GM.impact.position.x = data.impact_pos_y / 10 + 5;

        GM.player_1.position.z =  data.p1_pos_x / 10 - 1;
        GM.player_1.position.x = data.p1_pos_y / 10 + 5;
        GM.player_2.position.z =  data.p2_pos_x / 10 + 1;
        GM.player_2.position.x = data.p2_pos_y / 10 + 5;
        GM.football.position.set(data.ball_pos_y / 10, 0 ,data.ball_pos_x / 10)
        GM.camera.lookAt( GM.football.position.x, GM.football.position.y, GM.football.position.z);
        
        if (player.pSlot == "1") {
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
            stop3DRendering(GM);

            if (data.score_p1 > data.score_p2) {
                document.getElementById('score').innerText = "Player 1 Wins";
            }
            else {
                document.getElementById('score').innerText = "Player 2 Wins";
            }
            ws.close();
        }
    }

    ws.onopen = () => {
        console.log("Websocket connection OK");
    }

    ws.onclose = () => {
        console.log("Websocket connection KO");
        setTimeout(() => {
            stopHandlingGameInputs();
            displayHome();
        }, 3000);
    }
}

function stop3DRendering(GM) {

    stopHandlingResizeGame(GM);

    console.log("stop3drendering called")
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