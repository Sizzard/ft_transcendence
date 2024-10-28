let keyDownP1 = false;
let keyDownP2 = false;

const player2 = new Player('2');

function send_key_event(player, key) {
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
    event.preventDefault();
    console.log(player2.getGameAPI)
    console.log(player2.pInput)
    if (event.key == 'ArrowUp') {
        if (keyDownP1 == false){
            send_key_event(player, 'up');
            keyDownP1 = true;
        }
    }
    else if (event.key == 'ArrowDown') {
        if (keyDownP1 == false){
            send_key_event(player, 'down');
            keyDownP1 = true;
        }
    }
    if (event.key == 'w' || event.key == 'W') {
        if (keyDownP2 == false){
            send_key_event(player2, 'up');
            keyDownP2 = true;
        }
    }
    else if (event.key == 's' || event.key == 'S') {
        if (keyDownP2 == false){
            send_key_event(player2, 'down');
            keyDownP2 = true;
        }
    }
})

window.addEventListener('keyup', (event) => {
    if (keyDownP1 == true && event.key == 'ArrowUp' || event.key == 'ArrowDown' ){
        send_key_event(player, 'idle');
        keyDownP1 = false;
    }
    if (keyDownP2 == true && event.key == 'w' || event.key == 'W' || event.key == 's' || event.key == 'S'){
        send_key_event(player2, 'idle');
        keyDownP2 = false;
    }
})
