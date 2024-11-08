export class GameModels {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.player_1 = null;
        this.player_2 = null;
        this.terrain = null;
        this.footNet_1 = null;
        this.footNet_2 = null;
        this.football = null;
    }

    destructor() {
        this.scene.remove(this.player_1);
        this.scene.remove(this.player_2);
        this.scene.remove(this.terrain);
        this.scene.remove(this.footNet_1);
        this.scene.remove(this.footNet_2);
        this.scene.remove(this.football);
        this.camera = null;
        this.scene = null;
        

    }

}