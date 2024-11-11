let handleKeyDownFnc;
let handleKeyUpFnc;

let keyDownP1 = false;
let keyDownP2 = false;

function handleGameInput(player1, player2 = null) {

    handleKeyDownFnc = handleGameInputPress.bind(null, player1, player2);
    handleKeyUpFnc = handleGameInputRelease.bind(null, player1, player2);

    window.addEventListener('keydown', handleKeyDownFnc);
    window.addEventListener('keyup', handleKeyUpFnc);
}

function stopHandlingGameInputs() {

    if (handleKeyDownFnc && handleKeyUpFnc) {
        // console.log("Removed listener ");
        window.removeEventListener('keydown', handleKeyDownFnc);
        window.removeEventListener('keyup', handleKeyUpFnc);
    }

}

function send_key_event(player, key) {
    if (player == null)
        return;
    fetch(player.pInput,{
        method: "POST",
        body: JSON.stringify({
            input: key
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
}

function handleGameInputPress(player1, player2, event) {
        // console.log("HANDLE GAME INPUT");
        // console.log("EVENT : " , event);
        // console.log("Player1 : " , player1);
        // console.log("Player2 : " , player2);
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            // console.log("Prevent Default called");
        }
        if (event.key === 'ArrowLeft') {
            if (keyDownP1 === false) {
                send_key_event(player1, (player1.pSlot == "1" ? 'up' : "down"));
                keyDownP1 = true;
            }
        }
        else if (event.key === 'ArrowRight') {
            if (keyDownP1 === false) {
                send_key_event(player1, (player1.pSlot == "1" ? 'down' : "up"));
                keyDownP1 = true;
            }
        }
        if ((event.key === 'a' || event.key === 'A') && player2) {
            if (keyDownP2 === false) {
                send_key_event(player2, 'up');
                keyDownP2 = true;
            }
        }
        else if ((event.key === 'd' || event.key === 'D') && player2) {
            if (keyDownP2 === false) {
                send_key_event(player2, 'down');
                keyDownP2 = true;
            }
        }
}

function handleGameInputRelease(player1, player2, event)  {
   
    if (keyDownP1 === true && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        send_key_event(player1, 'idle');
        keyDownP1 = false;
    }
    if (keyDownP2 === true && (event.key === 'a' || event.key === 'A' || event.key === 'd' || event.key === 'D') && player2) {
        send_key_event(player2, 'idle');
        keyDownP2 = false;
    }

}

export { handleGameInput, stopHandlingGameInputs};