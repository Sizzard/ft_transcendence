import { ADRESS } from './adress.js'

export class Player {
    constructor() {
        this.APIRoot = "http://" + ADRESS + ":8000/api/"
        this.requestPID();
        this.pSlot = "0";
        this.gID = "1";
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.ws = "ws://" + ADRESS + `:8000/ws/game/${this.gID}/`;
    }

    requestPID() {
        fetch(this.APIRoot + "request_pid/", {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
        this.pID = data.player_id;
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
        this.createRoom = this.APIRoot + "create_room/" + this.pID + "/";
    });
    }

    setGameID(gameID) {
        this.gID = gameID;
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
        this.ws = "ws://" + ADRESS + `:8000/ws/game/${this.gID}/`;
    }

}