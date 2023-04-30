import GameScene from "scenes/GameScene";
import {Depths} from "enums/Depths";

export default class Field extends Phaser.GameObjects.Image {

    constructor(
        public scene: GameScene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, 'assets', 'crops/tomato1');
        this.scene.add.existing(this);

        this.setOrigin(1, 1)

        this.setDepth(Depths.FIELD);

    }

}
