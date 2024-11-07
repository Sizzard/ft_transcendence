function display3DGame(player) {

    app.innerHTML =`<div class="divToCenter"> \
                        <p id="game-title"> Pong !</p> \
                    </div>`;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    window.renderer = new THREE.WebGLRenderer();
    
    document.body.appendChild(window.renderer.domElement);
    
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
            scene.add(model);

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
    // loader.load(
    //     '/static/javascript/Models/sand_landscape/scene.gltf',
    //     (gltf) => {
    //         const sand_model = gltf.scene;
    //         sand_model.position.x = 0;
    //         sand_model.position.y = -10;
    //         sand_model.position.z = 1280/20;
    //         sand_model.scale.set(10,10,10);
    //         scene.add(sand_model);

    //         const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Intensité de 2 pour tester
    //         directionalLight.position.set(camera.position.x,camera.position.y,camera.position.z);
    //         directionalLight.target = sand_model;
    //         scene.add(directionalLight);
    //     },
    //     undefined,
    //     function(error) {
    //         console.log(error);
    //     }
    // );
    
    scene.add(p1_cube);
    scene.add(p2_cube);
    scene.add(ball_cube);
    scene.add(terrain);
    
    function animate() {window.renderer.render(scene, camera );}
    
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
                ball_cube.position.z = data.ball_pos_x / 10;
                ball_cube.position.x = data.ball_pos_y / 10;

                if (player.pSlot == "0") {
                    camera.lookAt( ball_cube.position.x, ball_cube.position.y, ball_cube.position.z);
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
