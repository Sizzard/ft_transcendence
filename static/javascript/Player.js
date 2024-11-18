const ADRESS = "localhost"

export class Player {
    constructor() {
        this.APIRoot = "http://" + ADRESS + ":8000/api/"
        this.pID = this.requestPID();
        this.pSlot = "0";
        this.gID = "1";
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.createRoom = this.APIRoot + "create_room/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
        this.gameStateInterval = 0;
    }

    requestPID() {
        fetch(this.APIRoot + "request_pid/", {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            this.pID = data.player_id
        });
    }

    setGameID(gameID) {
        this.gID = gameID;
        this.getGameAPI =  this.APIRoot + "get_game_state/" + this.gID + "/";
        this.pInput = this.APIRoot + "control/" + this.gID + "/" + this.pID + "/";
        this.checkRoom = this.APIRoot + "check_room/" + this.gID + "/";
        this.joinRoom =  this.APIRoot + "join_room/" + this.gID + "/" + this.pID + "/";
    }

}