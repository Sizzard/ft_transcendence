import { ADRESS } from './adress.js'

export class Player {
    constructor() {
        this.APIRoot = "http://" + ADRESS + ":8000/api/"
        this.requestPID();
        this.pSlot = "0";
        this.gID = "1";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.ws = "ws://" + ADRESS + `:8000/ws/game/${this.gID}/`;
    }

    requestPID() {
        fetch(this.APIRoot + "request_pid/", {
            method: 'POST',
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            this.pID = data.player_id;
            this.pInput = this.APIRoot + "control/" + this.pID + "/";
            this.joinRoom =  this.APIRoot + "join_public_room/" + this.pID + "/";
            return data.player_id;
        })
    }

    setGameID(gameID) {
        this.gID = gameID;
        this.pInput = this.APIRoot + "control/" + this.pID + "/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_public_room/" + this.pID + "/";
        this.ws = "ws://" + ADRESS + `:8000/ws/game/${this.gID}/`;
    }

}