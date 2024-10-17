let keyDown = false;

function send_key_event(key) {
    fetch("http://localhost:8000/api/player1/",{
        method: "POST",
        body: JSON.stringify({
            input: key
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((json) => console.log(json));                
}

window.addEventListener('keydown', (event) => {
    if (event.key == 'w') {
        if (keyDown == false){
            // console.log('sending up');
            send_key_event('up');
            keyDown = true;
        }
    }
    else if (event.key == 's') {
        if (keyDown == false){
            // console.log('sending down');
            send_key_event('down');
            keyDown = true;
        }
    }
})

window.addEventListener('keyup', (event) => {
    if (keyDown == true){
        // console.log('sending idle');
        send_key_event('idle');
        keyDown = false;
    }
})

setInterval(function() {
    fetch("http://localhost:8000/api/get_game_state/1")
        .then(response => response.json())
        .then(data => {
            // document.getElementById("score-p1").innerText = `Player 1 Score: ${data.score_p1}`;
            // document.getElementById("score-p2").innerText = `Player 2 Score: ${data.score_p2}`;
            // document.getElementById("p1-position").innerText = `Player 1 Position: (${data.p1_pos_x}, ${data.p1_pos_y})`;
            // document.getElementById("p2-position").innerText = `Player 2 Position: (${data.p2_pos_x}, ${data.p2_pos_y})`;
            // document.getElementById("ball-position").innerText = `Ball Position: (${data.ball_pos_x}, ${data.ball_pos_y})`;
            // document.getElementById("dimensions").innerText = `Dimensions: (${data.width}, ${data.height})`;

            const canvas = document.getElementById('game-field');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const scaleX = canvas.width / data.width;
                const scaleY = canvas.height / data.height;
                ctx.canvas.width =  window.innerWidth / 2 ;
                ctx.canvas.height = window.innerHeight / 2;
                ctx.clearRect(0,0,canvas.width, canvas.height);
                ctx.fillStyle = 'yellowgreen';
                ctx.fillRect(data.p1_pos_x * scaleX, data.p1_pos_y * scaleY, data.width / 128 * scaleX, data.height /7 * scaleY);
                ctx.fillStyle = 'yellowgreen';
                ctx.fillRect(data.p2_pos_x * scaleX, data.p2_pos_y * scaleY, data.width / 128 * scaleX, data.height /7 *scaleY);
                ctx.fillStyle = 'yellowgreen';
                ctx.fillRect(data.ball_pos_x * scaleX, data.ball_pos_y *scaleY, data.width / 128 * scaleX, data.width /128 * scaleX);
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
}, 33);