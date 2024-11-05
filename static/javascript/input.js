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
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
            event.preventDefault();
        if (event.key === 'ArrowLeft') {
            if (keyDownP1 === false){
                send_key_event(player, 'up');
                keyDownP1 = true;
            }
        }
        else if (event.key === 'ArrowRight') {
            if (keyDownP1 === false){
                send_key_event(player, 'down');
                keyDownP1 = true;
            }
        }
        if (event.key === 'a' || event.key === 'A') {
            if (keyDownP2 === false){
                send_key_event(playerID, 'up');
                keyDownP2 = true;
            }
        }
        else if (event.key === 'd' || event.key === 'D') {
            if (keyDownP2 === false){
                send_key_event(playerID, 'down');
                keyDownP2 = true;
            }
        }
    })
    
    window.addEventListener('keyup', (event) => {
        if (keyDownP1 === true && event.key === 'ArrowLeft' || event.key === 'ArrowRight' ){
            send_key_event(player, 'idle');
            keyDownP1 = false;
        }
        if (keyDownP2 === true && event.key === 'a' || event.key === 'A' || event.key === 'd' || event.key === 'D'){
            send_key_event(playerID, 'idle');
            keyDownP2 = false;
        }
    })    

}

