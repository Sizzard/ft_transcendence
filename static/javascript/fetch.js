import { Player } from './Player.js';
import { display3DGame } from './gameLogic.js'
import { handleGameInput } from './input.js'

async function joinRoomFetch(player) {
    try {
        const response = await fetch(player.joinRoom, {
            method: "POST",
        })
        if (response.status === 200 || response.status === 206) {
            const data = await response.json();
            if (data) {
                player.setGameID(data.room_id);
                player.pSlot = data.playerSlot;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}
async function joinRoomFetchBot(player) {
    try {
        console.log(player)
        const response = await fetch(player.joinRoom, {
            method: "POST",
            body: JSON.stringify({ Bot: true }),
        })
        if (response.status === 200 || response.status === 206) {
            const data = await response.json();
            if (data) {
                player.setGameID(data.room_id);
                player.pSlot = data.playerSlot;
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function fetchDataSolo(player1, player2) {
    try {
        const response = await fetch(player1.createRoom, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Can't create room : ${response.status}`);
        }
        const data = await response.json();
        await fetch(player1.joinRoom, {
            method: "POST",
        })
        await fetch(player2.joinRoom, {
            method: "POST",
        })
    }
    catch (error) {
        console.log(error);
    }
}

async function fetchDataBot(player1, player2) {

    await joinRoomFetch(player1);
    await joinRoomFetchBot(player2);
    checkRoom(player1);
}

async function checkRoom(player) {
    console.log(player);
    let checkRoomInterval = setInterval(function() {
        fetch(player.checkRoom)
            .then(response => response.json())
            .then(data => {
                console.log(data.room_status)
                if (data.room_status === "OK") {
                    clearInterval(checkRoomInterval);
                    launchGameOnline(player);
                }
            })
            .catch(error => console.error("Error on retrieving data :", error));
    }, 1000);
}

async function createBotRoom(player1) {
    const player2 = new Player();

    await fetchDataBot(player1, player2);
}

async function createSoloRoom(player1) {
    const player2 = new Player();
    try {
        await fetchDataSolo(player1, player2);
        console.log("Game Created !");
    } catch (error) {
        console.log("Erreur creation game bot:", error);
    }
    return player2;
}

function launchGameVSBot(player) {
    
    createBotRoom(player);
}

async function launchGameVSFriend(player1) {
    
    const player2 = await createSoloRoom(player1);
    
    handleGameInput(player1, player2);

    display3DGame(player1);
}


function launchGameOnline(player) {
    
    handleGameInput(player);

    display3DGame(player);
}

export { joinRoomFetch, checkRoom, launchGameVSBot, launchGameVSFriend };