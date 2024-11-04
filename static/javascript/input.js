let keyDownP1 = false;
let keyDownP2 = false;

function send_key_event(playerID, key) {
    if (playerID == null)
        return;
    fetch(playerID.pInput,{
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

function handleGameInput(playerID = null) {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown')
            event.preventDefault();
        if (event.key === 'ArrowUp') {
            if (keyDownP1 === false){
                send_key_event(player, 'up');
                keyDownP1 = true;
            }
        }
        else if (event.key === 'ArrowDown') {
            if (keyDownP1 === false){
                send_key_event(player, 'down');
                keyDownP1 = true;
            }
        }
        if (event.key === 'w' || event.key === 'W') {
            if (keyDownP2 === false){
                send_key_event(playerID, 'up');
                keyDownP2 = true;
            }
        }
        else if (event.key === 's' || event.key === 'S') {
            if (keyDownP2 === false){
                send_key_event(playerID, 'down');
                keyDownP2 = true;
            }
        }
    })
    
    window.addEventListener('keyup', (event) => {
        if (keyDownP1 === true && event.key === 'ArrowUp' || event.key === 'ArrowDown' ){
            send_key_event(player, 'idle');
            keyDownP1 = false;
        }
        if (keyDownP2 === true && event.key === 'w' || event.key === 'W' || event.key === 's' || event.key === 'S'){
            send_key_event(playerID, 'idle');
            keyDownP2 = false;
        }
    })    

}

