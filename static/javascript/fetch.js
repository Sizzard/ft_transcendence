import { Player } from './Player.js';
import { display3DGame } from './gameLogic.js'
import { handleGameInput } from './input.js'
import { displayGameHTML } from './dynamicContent.js'

async function joinRoomFetch(player, room_id) {
    player.setGameID(room_id);
    try {
        const response = await fetch(player.joinRoom, {
            method: "POST",
            "room_id": room_id,
        })
        if (response.status === 200 || response.status === 206) {
            const data = await response.json();
            if (data) {
                // console.log(data.playerSlot);
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
        player1.setGameID(data.room_id);
        player2.setGameID(data.room_id);
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
    try {
        const response = await fetch(player1.createRoom, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Can't create room : ${response.status}`);
        }
        const data = await response.json();
        player1.setGameID(data.room_id);
        player1.pSlot = "1";
        player2.setGameID(data.room_id);
        await fetch(player1.joinRoom, {
            method: "POST",
        })
        await fetch(player2.joinRoom, {
            method: "POST",
            body: JSON.stringify({ Bot: true }),
        })
        const roomState = await fetch(player1.checkRoom);
        console.log("Room State BOT : ", roomState.statusText);
    }
    catch (error) {
        console.log(error);
    }
}

async function checkRoomAndCreateGame(player) {
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
    try {
        await fetchDataBot(player1, player2);
        console.log("Game Created !");
    } catch (error) {
        console.error("Erreur creation game bot:", error);
    }
    return player2;
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

    handleGameInput(player);

    display3DGame(player);
}

async function launchGameVSFriend(player1) {
    
    const player2 = await createSoloRoom(player1);
    
    handleGameInput(player1, player2);

    display3DGame(player1);
}


async function launchGameOnline(player) {

    await displayGameHTML(); 
    
    handleGameInput(player);

    display3DGame(player);
}

export { joinRoomFetch, checkRoomAndCreateGame, launchGameVSBot, launchGameVSFriend };