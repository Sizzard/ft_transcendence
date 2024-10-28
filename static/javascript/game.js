let keyDown = false;

function send_key_event(key) {
    fetch(player.pInput,{
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
    if (event.key == 'w' || event.key == 'W') {
        if (keyDown == false){
            // console.log('sending up');
            send_key_event('up');
            keyDown = true;
        }
    }
    else if (event.key == 's' || event.key == 'S') {
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
    let FetchUrl = "http://localhost:8000/api/get_game_state/1/";
    fetch(FetchUrl)
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